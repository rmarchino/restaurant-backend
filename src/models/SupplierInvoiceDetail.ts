import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { SupplierInvoice } from "./SupplierInvoice";
import { Producto } from "./Producto";

@Entity("detalle_facturas_proveedores")
export class SupplierInvoiceDetail {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  // Relación ManyToOne con SupplierInvoice
  @Column({ type: "bigint", nullable: false })
  factura_id!: number;
  @ManyToOne(() => SupplierInvoice, (invoice) => invoice.details)
  @JoinColumn({ name: "factura_id" })
  invoice!: SupplierInvoice;

  @Column({ type: 'varchar', length: 150, nullable: true }) 
  producto_detectado!: string | null;

  @Column({ type: 'int', default: 0 })
  cantidad_detectada!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  precio_unitario!: number;

  total!: number;

  // Relación ManyToOne con Producto
  @Column({ type: 'bigint', nullable: true })
  producto_id!: number | null;
  @ManyToOne(() => Producto, (product) => product.supplierInvoiceDetails)
  @JoinColumn({ name: 'producto_id' })
  product!: Producto;

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  confianza_ia!: number | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_registro!: Date;
}
