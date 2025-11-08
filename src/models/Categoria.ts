import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Producto } from "./Producto";

@Entity('categorias')
export class Category {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: number;

    @Column({ type: "text" })
    nombre!: string;

    @Column({ type: "text", nullable: true })
    descripcion!: string | null;

    // Relaciones: Una categoría puede tener muchos productos
    @OneToMany(() => Producto, (product) => product.category)
    products?: Producto[];

}