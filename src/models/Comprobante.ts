import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";
import { VoucherType } from "../enums/VoucherType.enum";
import { Cliente } from "./Cliente";
import { Order } from "./Pedido";
import { CashBox } from "./Caja";
import { VoucherStatus } from "../enums/VoucherStatus.enum";
import { VoucherDetail } from "./DetalleComprobante";
import { Sale } from "./Venta";

@Entity("comprobantes")
export class Voucher {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: number;

    @Column({
        type: 'enum',
        enum: VoucherType,
        default: VoucherType.BOLETA
    })
    tipo_comprobante!: VoucherType;

    @Column({ type: 'varchar', length: 10, })
    serie!: string;

    @Column()
    numero!: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    fecha_emision!: Date;

    // Relación ManyToOne con Cliente
    @Column({ type: "bigint", nullable: true })
    cliente_id!: number | null;
    @ManyToOne(() => Cliente, (cliente) => cliente.vouchers)
    @JoinColumn({ name: "cliente_id" })
    client!: Cliente;

    // Relación ManyToOne con Pedido
    @Column({ type: "bigint", nullable: false })
    pedido_id!: number;
    @ManyToOne(() => Order, (order) => order.vouchers)
    @JoinColumn({ name: "pedido_id" })
    order!: Order;

    // Relación ManyToOne con Caja
    @Column({ type: "bigint", nullable: false })
    caja_id!: number;
    @ManyToOne(() => CashBox, (cashBox) => cashBox.vouchers)
    @JoinColumn({ name: "caja_id" })
    cashBox!: CashBox;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    subtotal!: number | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    igv!: number | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    total!: number | null;

    @Column({
        type: 'enum',
        enum: VoucherStatus,
        default: VoucherStatus.PENDIENTE,
    })
    estado!: VoucherStatus;

    @Column({ type: 'varchar', length: 200, nullable: true })
    xml_hash!: string | null;

    @Column({ type: 'text', nullable: true })
    cdr_respuesta!: string | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    ticket_sunat!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    pdf_url!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    xml_url!: string | null;

    // Relaciones
    @OneToMany(() => VoucherDetail, (detail) => detail.voucher)
    details?: VoucherDetail[];

    @OneToMany(() => Sale, (sale) => sale.voucher)
    sale?: Sale[];
}