import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Sede } from "./Sede";
import { CajaStatus } from "../enums/CajaStatus.enum";
import { User } from "./User";
import { CashOpening } from "./AperturaCaja";
import { Voucher } from "./Comprobante";
import { Sale } from "./Venta";

@Entity("cajas")
export class CashBox {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  // Relación ManyToOne con Sede
  @Column({ type: "bigint", nullable: true })
  sede_id!: number | null;
  @ManyToOne(() => Sede, (sede) => sede.cashBoxes)
  @JoinColumn({ name: "sede_id" })
  sede!: Sede | null;

  @Column({ type: "text", nullable: false })
  nombre!: string;

  @Column({ type: "text", nullable: true })
  ubicacion!: string | null;

  @Column({
    type: "enum",
    enum: CajaStatus,
    default: CajaStatus.INACTIVA,
  })
  estado!: CajaStatus;

  // Relación ManyToOne con User (usuario a cargo actual)
  @Column({ type: "bigint", nullable: true })
  user_id!: number | null;
  @ManyToOne(() => User, (user) => user.cashBoxes)
  @JoinColumn({ name: "usuario_id" })
  user!: User | null;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  saldo_inicial!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0.0 })
  saldo_final!: number;

  @Column({ type: "timestamp", nullable: true })
  fecha_apertura!: Date | null;

  @Column({ type: "timestamp", nullable: true })
  fecha_cierre!: Date | null;

  // Relaciones:
  @OneToMany(() => CashOpening, (opening) => opening.cashBox)
  openings!: CashOpening[];

  @OneToMany(() => Voucher, (voucher) => voucher.cashBox)
  vouchers!: Voucher[];

  @OneToMany(() => Sale, (sale) => sale.cashBox)
  sales!: Sale[];
}
