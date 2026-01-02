import { z } from "zod";

export const ProcessOcrDto = z.object({
  id: z.coerce
    .number({
      required_error: "El ID de la factura es requerido",
      invalid_type_error: "El ID debe ser un número",
    })
    .int("El ID debe ser un entero")
    .positive("El ID debe ser mayor a cero"),
});

// Validación para corrección manual
export const UpdateInvoiceDto = z.object({
  id: z.coerce.number().positive(),

  proveedor: z.string().min(1, "El nombre del proveedor es obligatorio"),
  numeroFactura: z.string().min(1, "El número de factura es obligatorio"),

  fechaEmision: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)")
    .nullable(),

  details: z.array(
    z.object({
      productoDetectado: z.string().min(1),
      cantidadDetectada: z.coerce.number().int().positive(),
      precioUnitario: z.coerce.number().nonnegative(),
      productoId: z.number().optional().nullable(),
    })
  ),
});

export const InvoiceResponseDto = z.object({
  id: z.number(),
  proveedor: z.string(),
  numeroFactura: z.string(),
  fechaEmision: z.date().nullable(),
  total: z.number().nullable(),
  estado: z.string(),
  items: z.array(
    z.object({
      descripcion: z.string().nullable(),
      cantidad: z.number(),
      precio: z.number(),
      subtotal: z.number(),
      confianza: z.number().nullable(),
    })
  ),
});

export type ProcessOcrInput = z.infer<typeof ProcessOcrDto>;
export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceDto>;
