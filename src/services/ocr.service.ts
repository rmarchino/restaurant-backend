import { ImageAnnotatorClient } from "@google-cloud/vision";
import { Repository, In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { SupplierInvoice } from "../models/SupplierInvoice";
import { SupplierInvoiceDetail } from "../models/SupplierInvoiceDetail";
import { Producto } from "../models/Producto";
import { InvoiceProcessingStatus } from "../enums/InvoiceProcessingStatus.enum";
import { AIProcessed } from "../enums/AIProcessed.enum";
import * as fs from "fs";
import { UpdateInvoiceInput } from "@/dtos/ocr.dto";

// Cliente Google Vision
const visionClient = new ImageAnnotatorClient();

export class OcrService {
  private facturaRepository: Repository<SupplierInvoice>;
  private detalleRepository: Repository<SupplierInvoiceDetail>;
  private todayAsString(): string {
    return new Date().toISOString().split("T")[0];
  }

  constructor() {
    this.facturaRepository = AppDataSource.getRepository(SupplierInvoice);
    this.detalleRepository = AppDataSource.getRepository(SupplierInvoiceDetail);
    this.todayAsString();
  }

  /* ======================================================
   * 1. SUBIR FACTURA (estado PENDIENTE)
   * ====================================================== */
  async uploadInvoice(file: Express.Multer.File): Promise<SupplierInvoice> {
    const nuevaFactura = this.facturaRepository.create({
      proveedor: "Desconocido (Pendiente OCR)",
      numeroFactura: `PEND-${Date.now()}`,
      rutaArchivo: file.path,
      estado: InvoiceProcessingStatus.PENDIENTE,
      procesadoPorIA: AIProcessed.NO,
    });

    return await this.facturaRepository.save(nuevaFactura);
  }

  /* ======================================================
   * 2. PROCESAR FACTURA CON OCR
   * ====================================================== */
  async processInvoice(facturaId: number): Promise<SupplierInvoice> {
    const factura = await this.facturaRepository.findOneBy({ id: facturaId });

    if (!factura) throw new Error("Factura no encontrada");
    if (!factura.rutaArchivo)
      throw new Error("La factura no tiene un archivo asociado");

    try {
      /* ---------- 1. GOOGLE VISION (BUFFER) ---------- */
      const imageBuffer = fs.readFileSync(factura.rutaArchivo);

      const [result] = await visionClient.textDetection({
        image: { content: imageBuffer },
      });

      const detections = result.textAnnotations;
      if (!detections || detections.length === 0) {
        throw new Error("No se detectó texto en la imagen");
      }

      const fullText = detections[0].description || "";

      /* ---------- 2. PARSE OCR ---------- */
      const extractedData = this.parseInvoiceText(fullText);

      /* ---------- 3. ACTUALIZAR CABECERA ---------- */
      factura.proveedor = extractedData.proveedor;
      factura.numeroFactura = extractedData.numeroFactura;
      factura.total = extractedData.total;
      factura.fechaEmision = extractedData.fecha ?? this.todayAsString();
      factura.procesadoPorIA = AIProcessed.SI;
      factura.fechaProcesamiento = new Date();
      factura.estado = InvoiceProcessingStatus.PROCESADO;
      factura.observaciones = "Procesado automáticamente por Google Vision";

      await this.facturaRepository.save(factura);

      /* ---------- 4. LIMPIAR DETALLES PREVIOS ---------- */
      await this.detalleRepository.delete({
        invoice: { id: factura.id },
      });

      /* ---------- 5. GUARDAR NUEVOS DETALLES ---------- */
      const detalles = extractedData.items.map((item) =>
        this.detalleRepository.create({
          invoice: factura,
          productoDetectado: item.descripcion,
          cantidadDetectada: item.cantidad,
          precioUnitario: item.precio,
          confianzaIa: 0.95,
        })
      );

      await this.detalleRepository.save(detalles);

      /* ---------- 6. RETORNAR FACTURA COMPLETA ---------- */
      return await this.facturaRepository.findOneOrFail({
        where: { id: factura.id },
        relations: ["details"],
      });
    } catch (error) {
      console.error("❌ Error en OCR Service:", error);

      factura.estado = InvoiceProcessingStatus.ERROR;
      factura.observaciones = `Error OCR: ${
        error instanceof Error ? error.message : error
      }`;

      await this.facturaRepository.save(factura);
      throw error;
    }
  }

  /* ======================================================
   * 3. ACTUALIZACIÓN MANUAL DE FACTURA
   * ====================================================== */
  async updateInvoiceManual(
    data: UpdateInvoiceInput
  ): Promise<SupplierInvoice> {
    return await AppDataSource.transaction(async (manager) => {
      const facturaRepo = manager.getRepository(SupplierInvoice);
      const detalleRepo = manager.getRepository(SupplierInvoiceDetail);
      const productoRepo = manager.getRepository(Producto);

      /* ---------- 1. FACTURA ---------- */
      const factura = await facturaRepo.findOne({
        where: { id: data.id },
        relations: ["details"],
      });

      if (!factura) throw new Error("Factura no encontrada");

      /* ---------- 2. VALIDAR PRODUCTOS (1 QUERY) ---------- */
      const productoIds = data.details
        .map((d) => d.productoId)
        .filter((id): id is number => !!id && id > 0);

      const productosValidos = productoIds.length
        ? await productoRepo.findBy({ id: In(productoIds) })
        : [];

      const productosMap = new Map(productosValidos.map((p) => [p.id, p]));

      /* ---------- 3. ACTUALIZAR CABECERA ---------- */
      factura.proveedor = data.proveedor;
      factura.numeroFactura = data.numeroFactura;
      factura.fechaEmision = data.fechaEmision || this.todayAsString();
      factura.estado = InvoiceProcessingStatus.PROCESADO;
      factura.procesadoPorIA = AIProcessed.NO;
      factura.fechaProcesamiento = new Date();
      factura.observaciones = "Factura actualizada manualmente por el usuario";

      /* ---------- 4. BORRAR DETALLES ---------- */
      await detalleRepo.delete({
        invoice: { id: factura.id },
      });

      /* ---------- 5. CREAR DETALLES ---------- */
      let totalFactura = 0;

      const nuevosDetalles = data.details.map((d) => {
        const subtotal = d.cantidadDetectada * d.precioUnitario;
        totalFactura += subtotal;

        return detalleRepo.create({
          invoice: factura,
          productoDetectado: d.productoDetectado,
          cantidadDetectada: d.cantidadDetectada,
          precioUnitario: d.precioUnitario,
          productoId: productosMap.has(d.productoId!) ? d.productoId : null,
          confianzaIa: null,
        });
      });

      await detalleRepo.save(nuevosDetalles);

      /* ---------- 6. TOTAL ---------- */
      factura.total = totalFactura;
      await facturaRepo.save(factura);

      /* ---------- 7. RETORNAR ---------- */
      return await facturaRepo.findOneOrFail({
        where: { id: factura.id },
        relations: ["details"],
      });
    });
  }

  /* ======================================================
   * 4. CONSULTAS
   * ====================================================== */
  async getAllInvoices(): Promise<SupplierInvoice[]> {
    return await this.facturaRepository.find({
      relations: ["details"],
    });
  }

  async getFacturaById(id: number): Promise<SupplierInvoice | null> {
    return await this.facturaRepository.findOne({
      where: { id },
      relations: ["details"],
    });
  }

  /* ======================================================
   * 5. PARSER OCR (HEURÍSTICO)
   * ====================================================== */
  private parseInvoiceText(text: string) {
    const totalRegex =
      /(?:TOTAL|Total|PAGAR|IMPORTE)[\s:]*([S\/\$]?)\s*([\d,]+\.?\d*)/i;
    const fechaRegex = /(\d{2}[\/-]\d{2}[\/-]\d{4})/;
    const rucRegex = /(?:RUC|R\.U\.C\.)[\s:]*(\d{11})/;

    const totalMatch = text.match(totalRegex);
    const fechaMatch = text.match(fechaRegex);
    const rucMatch = text.match(rucRegex);

    const lines = text.split("\n");
    const items: { descripcion: string; cantidad: number; precio: number }[] =
      [];

    for (const rawLine of lines) {
      const line = rawLine.replace(/\s+/g, " ").trim();
      if (!line || /total|subtotal|igv|ruc|factura/i.test(line)) continue;

      const priceMatch = line.match(/(\d+\.\d{2})$/);
      if (!priceMatch) continue;

      const precio = parseFloat(priceMatch[1]);
      const descripcion = line.replace(priceMatch[1], "").trim();
      if (descripcion.length < 3) continue;

      items.push({ descripcion, cantidad: 1, precio });
    }

    return {
      proveedor: rucMatch
        ? `Proveedor RUC ${rucMatch[1]}`
        : "Proveedor No Identificado",
      numeroFactura: `OCR-${Date.now()}`,
      total: totalMatch
        ? parseFloat(totalMatch[2].replace(",", ""))
        : items.reduce((s, i) => s + i.precio * i.cantidad, 0),
      fecha: fechaMatch ? this.formatDate(fechaMatch[1]) : null,
      items:
        items.length > 0
          ? items
          : [{ descripcion: "Item OCR", cantidad: 1, precio: 0 }],
    };
  }

  private formatDate(dateStr: string): string {
    const [d, m, y] = dateStr.split(/[-\/]/);
    return `${y}-${m}-${d}`;
  }
}
