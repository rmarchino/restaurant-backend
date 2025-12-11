import { Request, Response } from "express";
import { OcrService } from "../services/ocr.service";
import { ProcessOcrDto, UpdateInvoiceDto } from "../dtos/ocr.dto";

const ocrService = new OcrService();

export class OcrController {
  // 1. Subir archivo
  async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "No se ha subido ningún archivo" });
      }

      const factura = await ocrService.uploadInvoice(req.file);

      return res.status(201).json({
        message: "Archivo subido correctamente. Listo para procesar.",
        facturaId: factura.id,
        path: factura.rutaArchivo,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error interno",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // 2. Procesar con Google Vision
  async process(req: Request, res: Response) {
    try {
      const validation = ProcessOcrDto.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Datos de entrada inválidos",
          errors: validation.error.format(),
        });
      }

      const { id } = validation.data;

      const resultado = await ocrService.processInvoice(id);

      return res.status(200).json({
        success: true,
        message: "Procesamiento OCR completado correctamente",
        data: resultado,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error al procesar OCR",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // 3. Obtener resultados
  async getResults(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "ID inválido" });
      }

      const factura = await ocrService.getFacturaById(id);

      if (!factura) {
        return res.status(404).json({ message: "Factura no encontrada" });
      }

      return res.status(200).json({
        success: true,
        data: factura,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener resultados",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // 4. Actualizar factura manualmente
  async updateInvoice(req: Request, res: Response) {
    try {
      const validation = UpdateInvoiceDto.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Datos inválidos para actualización",
          errors: validation.error.format(),
        });
      }

      // Aquí iría la lógica para actualizar la factura usando ocrService

      return res.status(200).json({
        success: true,
        message: "Factura actualizada correctamente",
        data: validation.data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error al actualizar factura",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}
