import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Producto } from "./Producto";
import { Voucher } from "./Comprobante";


@Entity('detalle_comprobantes')
export class VoucherDetail {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: number;

    // Relación ManyToOne con Comprobante
    @Column({ type: "bigint", nullable: false })
    comprobante_id!: number;
    @ManyToOne(() => Voucher, (voucher) => voucher.details)
    @JoinColumn({ name: "comprobante_id" })
    voucher!: Voucher;

    // Relación ManyToOne con Producto
    @Column({ type: 'bigint', nullable: false })
    producto_id!: number;
    @ManyToOne(() => Producto, (product) => product.voucherDetails)
    @JoinColumn({ name: "producto_id" })
    product!: Producto;

    @Column({ nullable: true })
    cantidad!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    precio_unitario!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    total!: number;
}