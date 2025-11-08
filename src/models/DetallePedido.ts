import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Order } from "./Pedido";
import { Producto } from "./Producto";

@Entity('detalle_pedidos')
export class OrderDetail {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: number;

    // Relación ManyToOne con Pedido
    @Column({ type: "bigint", nullable: false })
    pedido_id!: number | null;
    @ManyToOne(() => Order, (order) => order.details)
    @JoinColumn({ name: "pedido_id" })
    order!: Order;

    // Relación ManyToOne con Producto
    @Column({ type: 'bigint', nullable: false })
    producto_id!: number;
    @ManyToOne(() => Producto, (product) => product.orderDetails)
    @JoinColumn({ name: "producto_id" })
    product!: Producto;

    @Column()
    cantidad!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio_unitario!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal!: number;

    @Column({ type: 'timestamp', nullable: true })
    tiempo_inicio_prep!: Date | null;


    @Column({ type: 'timestamp', nullable: true })
    tiempo_fin_prep!: Date | null;
}
