import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm'

import { Role } from './Role';
import { Sede } from './Sede';
import { UserStatus } from '../enums/UserStatus.enum';
import { CashOpening } from './AperturaCaja';
import { CashBox } from './Caja';
import { Order } from './Pedido';
import { Sale } from './Venta';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id!: string;

    @Column({ length: 100, nullable: false })
    nombre!: string;

    @Column({ length: 100, nullable: true })
    apellido!: string;

    @Column({ length: 100, unique: true, nullable: false })
    email!: string;

    @Column({ length: 255, nullable: false })
    password!: string;
    
    // Relación ManyToOne con Role
    @Column({ type: 'bigint', nullable: true })
    rol_id!: number | null;
    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'rol_id' })
    role!: Role | null;

    // Relación ManyToOne con Sede
    @Column({ type: 'bigint', nullable: true })
    sede_id!: number | null;
    @ManyToOne(() => Sede, (sede) => sede.users)
    @JoinColumn({ name: 'sede_id' })
    sede!: Sede | null;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default:UserStatus.ACTIVO,
    })
    estado!: UserStatus;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    fecha_registro!: Date;

    // Relaciones:
    @OneToMany(() => CashBox, (cashBox) => cashBox.user)
    cashBoxes?: CashBox[];

    @OneToMany(() => CashOpening, (opening) => opening.openingUser)
    cashOpenings?: CashOpening[];

    @OneToMany(() => CashOpening, (opening) => opening.closingUser)
    cashClosings?: CashOpening[];

    @OneToMany(() => Order, (order) => order.user)
    orders?: Order[];

    @OneToMany(() => Sale, (sale) => sale.user)
    sales?: Sale[];
}