import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  nombre!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  descripcion!: string | null;

  @OneToMany(() => User, (user) => user.role)
  users?: User[];
}
