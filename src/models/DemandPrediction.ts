import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { AIModel } from "./AIModel";
import { DemandTimeRange } from "../enums/DemandTimeRange.enum";
import { Producto } from "./Producto";

@Entity("predicciones_demanda")
@Unique("uk_prediccion_unica", [
  "fecha_prediccion",
  "hora_rango",
  "producto_id",
])
export class DemandPrediction {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  // Relación ManyToOne con AIModel
  @Column({ type: "bigint" })
  modelo_id!: number;
  @ManyToOne(() => AIModel, (model) => model.demandPredictions)
  @JoinColumn({ name: "modelo_id" })
  model!: AIModel;

  @Column({ type: "date" })
  fecha_prediccion!: Date;

  @Column({
    type: "enum",
    enum: DemandTimeRange,
  })
  hora_rango!: DemandTimeRange;

  // Relación ManyToOne con Producto
  @Column({ type: "bigint", nullable: true })
  producto_id!: number | null;
  @ManyToOne(() => Producto, (product) => product.demandPredictions)
  @JoinColumn({ name: "producto_id" })
  product!: Producto;

  @Column({ type: 'int' })
  cantidad_predicha!: number;

  @Column({ type: 'int', nullable: true })
  cantidad_real!: number | null;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  fecha_registro!: Date;
}
