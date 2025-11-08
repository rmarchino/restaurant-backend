import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { PaymentMethod } from "../enums/PaymentMethod.enum";
import { Order } from "./Pedido";
import { CashBox } from "./Caja";
import { User } from "./User";
import { Voucher } from "./Comprobante";

@Entity("ventas")
export class Sale {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: number;

    // Relación ManyToOne con Pedido
    @Column({ type: "bigint", nullable: false })
    pedido_id!: number;
    @ManyToOne(() => Order, (order) => order.sales)
    @JoinColumn({ name: "pedido_id" })
    order!: Order;

    // Relación ManyToOne con Comprobante
    @Column({ type: "bigint", nullable: false })
    comprobante_id!: number;
    @ManyToOne(() => Voucher, (voucher) => voucher.sale)
    @JoinColumn({ name: "comprobante_id" })
    voucher!: Voucher;

    // Relación ManyToOne con Caja
    @Column({ type: "bigint", nullable: false })
    caja_id!: number;
    @ManyToOne(() => CashBox, (cashBox) => cashBox.sales)
    @JoinColumn({ name: "caja_id" })
    cashBox!: CashBox;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.EFECTIVO,
    })
    metodo_pago!: PaymentMethod;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    monto_pagado!: number | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    vuelto!: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    fecha_pago!: Date;

    // Relación ManyToOne con Usuario
    @Column({ type: "bigint", nullable: false })
    usuario_id!: number;
    @ManyToOne(() => User, (user) => user.sales)
    @JoinColumn({ name: "usuario_id" })
    user!: User;
}