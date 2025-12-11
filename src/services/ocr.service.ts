import { ImageAnnotatorClient } from "@google-cloud/vision";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { SupplierInvoice } from "../models/SupplierInvoice";
import { SupplierInvoiceDetail } from "../models/SupplierInvoiceDetail";
import { InvoiceProcessingStatus } from "../enums/InvoiceProcessingStatus.enum";
import { AIProcessed } from "../enums/AIProcessed.enum";
import * as fs from "fs";

// Configuración del cliente de Google Vision
const visionClient = new ImageAnnotatorClient();

export class OcrService {
  private facturaRepository: Repository<SupplierInvoice>;
  private detalleRepository: Repository<SupplierInvoiceDetail>;

  constructor() {
    this.facturaRepository = AppDataSource.getRepository(SupplierInvoice);
    this.detalleRepository = AppDataSource.getRepository(SupplierInvoiceDetail);
  }

  /**
   * Sube el archivo inicialmente y crea el registro en BD en estado PENDIENTE
   */
  async uploadInvoice(file: Express.Multer.File): Promise<SupplierInvoice> {
    const nuevaFactura = this.facturaRepository.create({
      proveedor: "Desconocido (Pendiente OCR)",
      numeroFactura: "PEND-" + Date.now(),
      rutaArchivo: file.path,
      estado: InvoiceProcessingStatus.PENDIENTE,
      procesadoPorIA: AIProcessed.NO,
    });

    return await this.facturaRepository.save(nuevaFactura);
  }

  /**
   * Procesa la imagen usando Google Cloud Vision y actualiza la BD
   */
  async processInvoice(facturaId: number): Promise<SupplierInvoice> {
    const factura = await this.facturaRepository.findOneBy({ id: facturaId });

    if (!factura) throw new Error("Factura no encontrada");
    if (!factura.rutaArchivo) throw new Error("La factura no tiene un archivo asociado");

    try {
      // 1. Llamada a Google Cloud Vision API
      const [result] = await visionClient.textDetection(factura.rutaArchivo);
      const detections = result.textAnnotations;

      if (!detections || detections.length === 0) {
        throw new Error("No se detectó texto en la imagen");
      }

      const fullText = detections[0].description || "";

      // 2. Lógica de Extracción (Parsing)
      const extractedData = this.parseInvoiceText(fullText);

      // 3. Actualizar Cabecera de Factura
      factura.proveedor = extractedData.proveedor || "Proveedor Detectado";
      factura.numeroFactura = extractedData.numeroFactura || `OCR-${Date.now()}`;
      factura.total = extractedData.total || 0;
      factura.fechaEmision = extractedData.fecha || new Date().toISOString().split("T")[0];
      factura.procesadoPorIA = AIProcessed.SI;
      factura.fechaProcesamiento = new Date();
      factura.estado = InvoiceProcessingStatus.PROCESADO;
      factura.observaciones = "Procesado automáticamente por Google Vision";

      await this.facturaRepository.save(factura);

      // 4. Guardar Detalles (Items)
      // Limpiamos detalles previos si es un reproceso
      await this.detalleRepository.delete({ facturaId: factura.id });

      const detallesAGuardar = extractedData.items.map((item) => {
        const detalle = new SupplierInvoiceDetail();
        detalle.facturaId = factura.id;
        detalle.productoDetectado = item.descripcion;
        detalle.cantidadDetectada = item.cantidad;
        detalle.precioUnitario = item.precio;
        detalle.confianzaIa = 0.95;
        return detalle;
      });

      await this.detalleRepository.save(detallesAGuardar);

      // 5. Recargar y Devolver
      const facturaActualizada = await this.facturaRepository.findOne({
        where: { id: factura.id },
        relations: ["details"],
      });

      if (!facturaActualizada) {
        throw new Error("Error inesperado al recuperar la factura procesada.");
      }

      return facturaActualizada;
    } catch (error) {
      console.error("Error en OCR Service:", error);

      factura.estado = InvoiceProcessingStatus.ERROR;
      factura.observaciones = `Error en procesamiento OCR: ${error instanceof Error ? error.message : error}`;

      await this.facturaRepository.save(factura);
      throw error;
    }
  }

  /**
   * Función auxiliar para parsear texto crudo (Heurística básica)
   */
  private parseInvoiceText(text: string) {
    // Regex básicos para buscar patrones comunes en facturas peruanas/latinas
    const totalRegex = /(?:TOTAL|Total|PAGAR|IMPORTTE)[\s:]*([S\/\$]?)\s*([\d,]+\.?\d*)/i;
    const fechaRegex = /(\d{2}[-\/]\d{2}[-\/]\d{4})/;
    const rucRegex = /(?:RUC|R\.U\.C\.)[\s:]*(\d{11})/;

    // Extracción
    const totalMatch = text.match(totalRegex);
    const fechaMatch = text.match(fechaRegex);
    const rucMatch = text.match(rucRegex);

    // Simulamos items: En una implementación real, se debe analizar la posición (boundingPoly)
    const lines = text.split("\n");
    const items = [];

    for (const line of lines) {
      // Busca líneas que terminen en número (precio) y tengan texto antes
      const lineMatch = line.match(/^(.+?)\s+(\d+\.\d{2})$/);
      if (lineMatch && !line.toLowerCase().includes("total")) {
        items.push({
          descripcion: lineMatch[1].trim(),
          cantidad: 1,
          precio: parseFloat(lineMatch[2]),
        });
      }
    }

    return {
      proveedor: rucMatch
        ? `Proveedor RUC ${rucMatch[1]}`
        : "Proveedor No Identificado",
      numeroFactura: `F-${Math.floor(Math.random() * 10000)}`,
      total: totalMatch ? parseFloat(totalMatch[2].replace(",", "")) : 0.0,
      fecha: fechaMatch ? this.formatDate(fechaMatch[1]) : null,
      items:
        items.length > 0
          ? items
          : [{ descripcion: "Item Generico OCR", cantidad: 1, precio: 0 }],
    };
  }

  private formatDate(dateStr: string): string {
    // Convierte DD/MM/YYYY a YYYY-MM-DD
    const parts = dateStr.split(/[-\/]/);
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  async getFacturaById(id: number) {
    return await this.facturaRepository.findOne({
      where: { id },
      relations: ["details"],
    });
  }
}
