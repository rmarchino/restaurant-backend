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

  @Column({ length: 50 })
  numero_factura!: string;

  @Column({ type: "date", nullable: true })
  fecha_emision!: Date | null;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  total!: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ruta_archivo!: string | null;

  @Column({
    type: "enum",
    enum: AIProcessed,
    default: AIProcessed.NO,
  })
  procesado_por_ia!: AIProcessed;

  // Relación ManyToOne con AIModel
    @Column({ type: "bigint", nullable: true })
    modelo_ia_id!: number | null;
    @ManyToOne(() => AIModel, (model) => model.supplierInvoices)
    @JoinColumn({ name: "modelo_ia_id" })
    aiModel!: AIModel | null;

    @Column({ type: 'timestamp', nullable: true })
    fecha_procesamiento!: Date | null;

    @Column({
        type: 'enum',
        enum: InvoiceProcessingStatus,
        default: InvoiceProcessingStatus.PENDIENTE,
    })
    estado!: InvoiceProcessingStatus;

    @Column({ type: 'text', nullable: true })
    observaciones!: string | null;

    // Relaciones:
    @OneToMany(() => SupplierInvoiceDetail, (detail) => detail.invoice)
    details!: SupplierInvoiceDetail[];
}
