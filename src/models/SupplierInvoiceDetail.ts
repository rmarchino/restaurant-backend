import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { SupplierInvoice } from "./SupplierInvoice";
import { Producto } from "./Producto";

@Entity("detalle_facturas_proveedores")
export class SupplierInvoiceDetail {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  // Relación Factura
  @Column({ name: "factura_id", type: "bigint", nullable: false })
  facturaId!: number;

  @ManyToOne(() => SupplierInvoice, (invoice) => invoice.details, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "factura_id" })
  invoice!: SupplierInvoice;

  @Column({
    name: "producto_detectado",
    type: "varchar",
    length: 150,
    nullable: true,
  })
  productoDetectado!: string | null;

  @Column({ name: "cantidad_detectada", type: "int", default: 0 })
  cantidadDetectada!: number;

  @Column({
    name: "precio_unitario",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  precioUnitario!: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0.0,
    insert: false,
    update: false,
  })
  total!: number;

  // Relación con Producto (Inventario)
  @Column({ name: "producto_id", type: "bigint", nullable: true })
  productoId!: number | null;

  @ManyToOne(() => Producto, (product) => product.supplierInvoiceDetails)
  @JoinColumn({ name: "producto_id" })
  product!: Producto | null;

  @Column({
    name: "confianza_ia",
    type: "decimal",
    precision: 5,
    scale: 4,
    nullable: true,
  })
  confianzaIa!: number | null;

  @CreateDateColumn({ name: "fecha_registro", type: "timestamp" })
  fechaRegistro!: Date;
}
