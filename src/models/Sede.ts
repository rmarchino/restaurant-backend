import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SedeStatus } from "../enums/SedeStatus.enum";
import { Table } from "./Mesa";
import { User } from "./User";
import { CashBox } from "./Caja";

@Entity("sedes")
export class Sede {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ type: "varchar", length: 150, unique: true, nullable: false })
  nombre!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  direccion!: string | null;

  @Column({ type: "varchar", length: 20, nullable: true })
  telefono!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  ciudad!: string | null;

  @Column({
    type: "enum",
    enum: SedeStatus,
    default: SedeStatus.ACTIVE,
  })
  estado!: SedeStatus;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  fecha_registro!: Date;

  //Relaciones
  @OneToMany(() => User, (user) => user.sede)
  users?: User[];

  @OneToMany(() => CashBox, (cashBox) => cashBox.sede)
  cashBoxes?: CashBox[];

  @OneToMany(() => Table, (table) => table.sede)
  tables?: Table[];
}
