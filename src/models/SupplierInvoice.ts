import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { AIProcessed } from "../enums/AIProcessed.enum";
import { AIModel } from "./AIModel";
import { InvoiceProcessingStatus } from "../enums/InvoiceProcessingStatus.enum";
import { SupplierInvoiceDetail } from "./SupplierInvoiceDetail";

@Entity("facturas_proveedores")
export class SupplierInvoice {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ length: 150 })
  proveedor!: string;

  @Column({ name: "numero_factura", length: 50 })
  numeroFactura!: string;

  @Column({ name: "fecha_emision", type: "date", nullable: true })
  fechaEmision!: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  total!: number | null;

  @Column({
    name: "ruta_archivo",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  rutaArchivo!: string | null;

  @Column({
    name: "procesado_por_ia",
    type: "enum",
    enum: AIProcessed,
    default: AIProcessed.NO,
  })
  procesadoPorIA!: AIProcessed;

  // Relación con Modelo IA
  @Column({ name: "modelo_ia_id", type: "bigint", nullable: true })
  modeloIaId!: number | null;

  @ManyToOne(() => AIModel, (model) => model.supplierInvoices)
  @JoinColumn({ name: "modelo_ia_id" })
  aiModel!: AIModel | null;

  @Column({ name: "fecha_procesamiento", type: "timestamp", nullable: true })
  fechaProcesamiento!: Date | null;

  @Column({
    type: "enum",
    enum: InvoiceProcessingStatus,
    default: InvoiceProcessingStatus.PENDIENTE,
  })
  estado!: InvoiceProcessingStatus;

  @Column({ type: "text", nullable: true })
  observaciones!: string | null;

  // // Relación con Detalles
  @OneToMany(() => SupplierInvoiceDetail, (detail) => detail.invoice, {
    cascade: true,
  })
  details!: SupplierInvoiceDetail[];
}
