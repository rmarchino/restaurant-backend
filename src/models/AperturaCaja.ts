import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { CashBox } from "./Caja";
import { User } from "./User";

@Entity('aperturas_caja')
export class CashOpening {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: number;

    // Relación ManyToOne con Caja
    @Column({ type: "bigint", nullable: true })
    caja_id!: number;
    @ManyToOne(() => CashBox, (cashBox) => cashBox.openings)
    @JoinColumn({ name: "caja_id" })
    cashBox!: CashBox;
    

    // Relación ManyToOne con Usuario de Apertura
    @Column({ type: "bigint", nullable: false })
    usuario_apertura_id!: number;
    @ManyToOne(() => User, (user) => user.cashOpenings)
    @JoinColumn({ name: "usuario_apertura_id" })
    openingUser!: User;

    // Relación ManyToOne con Usuario de Cierre
    @Column({ type: "bigint", nullable: true })
    usuario_cierre_id!: number;
    @ManyToOne(() => User, (user) => user.cashClosings)
    @JoinColumn({ name: "usuario_cierre_id" })
    closingUser!: User | null;

    @Column({ type: 'timestamp', nullable: true })
    fecha_apertura!: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    fecha_cierre!: Date | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    monto_apertura!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    monto_cierre!: number | null;

    @Column({ type: 'text', nullable: true })
    observaciones!: string | null;
}