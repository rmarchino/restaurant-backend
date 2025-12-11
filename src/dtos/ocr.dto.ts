import { z } from "zod";

// Validación para el ID al procesar (Body)
export const ProcessOcrDto = z.object({
  id: z.coerce.number({
    required_error: "El ID de la factura es requerido",
    invalid_type_error: "El ID debe ser un número",
  }).positive(),
});

// Validación para corrección manual
export const UpdateInvoiceDto = z.object({
  proveedor: z.string().min(1, "El nombre del proveedor es obligatorio"),
  numeroFactura: z.string().min(1, "El número de factura es obligatorio"),
  fechaEmision: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
  // Usamos coerce también aquí para seguridad
  total: z.coerce.number().nonnegative("El total no puede ser negativo"),
  
  details: z.array(z.object({
    productoDetectado: z.string(),
    cantidad: z.coerce.number().int().positive(),
    precioUnitario: z.coerce.number().nonnegative(),
    productoId: z.number().optional().nullable()
  })).optional()
});

// --- OUTPUT DTOs ---

export const InvoiceResponseDto = z.object({
  id: z.number(),
  proveedor: z.string(),
  numeroFactura: z.string(),
  fechaEmision: z.date().nullable(),
  total: z.number().nullable(),
  estado: z.string(),
  items: z.array(z.object({
    descripcion: z.string().nullable(),
    cantidad: z.number(),
    precio: z.number(),
    subtotal: z.number(),
    confianza: z.number().nullable()
  }))
});

export type ProcessOcrInput = z.infer<typeof ProcessOcrDto>;
export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceDto>;