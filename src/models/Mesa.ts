import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Sede } from "./Sede";
import { TableStatus } from "../enums/TableStatus.enum";
import { Order } from "./Pedido";

@Entity('mesas')
export class Table {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: number;

    // Relación ManyToOne con Sede
    @Column({ type: "bigint", nullable: true })
    sede_id!: number | null;
    @ManyToOne(() => Sede, (sede) => sede.tables)
    @JoinColumn({ name: "sede_id" })
    sede!: Sede;

    @Column()
    numero_mesa!: number;

    @Column({default: 4})
    capacidad!: number;

    @Column({
        type: 'enum',
        enum: TableStatus,
        default: TableStatus.DISPONIBLE,
    })
    estado!: TableStatus;

    // Relación: Una Mesa puede tener muchos Pedidos
    @OneToMany(() => Order, (order) => order.table)
    orders?: Order[];

}


