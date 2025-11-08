import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { DocumentoType } from "../enums/DocumentType.enum";
import { Order } from "./Pedido";
import { Voucher } from "./Comprobante";

@Entity('clientes')
export class Cliente {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: number;

    @Column({
        type: 'enum',
        enum: DocumentoType,
        default: DocumentoType.DNI,
    })
    tipo_documento!: DocumentoType;

    @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
    numero_documento!: string;

    @Column({ type: 'varchar', length: 150, nullable: false })
    razon_social!: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    direccion!: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    email!: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    telefono!: string | null;

    // Relaciones:
    @OneToMany(() => Order, (order) => order.client)
    orders?: Order[];

    @OneToMany(() => Voucher, (voucher) => voucher.client)
    vouchers?: Voucher[];
}