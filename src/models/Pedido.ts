import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Cliente } from "./Cliente";
import { OrderStatus } from "../enums/OrderStatus.enum";
import { OrderDetail } from "./DetallePedido";
import { Voucher } from "./Comprobante";
import { Sale } from "./Venta";
import { Table } from "./Mesa";

@Entity("pedidos")
export class Order {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  // Relación ManyToOne con Mesa
  @Column({ type: "bigint", nullable: true })
  mesa_id!: number | null;
  @ManyToOne(() => Table, (table) => table.orders)
  @JoinColumn({ name: "mesa_id" })
  table!: Table;

  //Relación ManyToOne con Usuario (Mesero/quien toma el pedido)
  @Column({ type: "bigint", nullable: false })
  usuario_id!: number;
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "usuario_id" })
  user!: User;

  // Relación ManyToOne con Cliente (opcional)
    @Column({ type: "bigint", nullable: true })
    cliente_id!: number | null;
    @ManyToOne(() => Cliente, (client) => client.orders)
    @JoinColumn({ name: "cliente_id" })
    client!: Cliente;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', })
    fecha!: Date | null;

    @Column({
        type: 'enum', 
        enum: OrderStatus,
        default: OrderStatus.PENDIENTE,
    })
    estado!: OrderStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total!: number;

    // Relaciones
    @OneToMany(() => OrderDetail, (detail) => detail.order)
    details?: OrderDetail[];

    @OneToMany(() => Voucher, (voucher) => voucher.order)
    vouchers?: Voucher[];

    @OneToMany(() => Sale, (sale) => sale.order)
    sales?: Sale[];
}
