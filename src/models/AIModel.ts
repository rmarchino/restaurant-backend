import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from "typeorm";
import { AIModelState } from "../enums/AIModelState.enum";
import { AIModelType } from "../enums/AIModelType.enum";
import { DemandPrediction } from "./DemandPrediction";
import { SupplierInvoice } from "./SupplierInvoice";

@Entity("modelo_ia")
export class AIModel {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: number;

  @Column({ length: 150 })
  nombre!: string;

  @Column({
    type: "enum",
    enum: AIModelType,
  })
  tipo!: AIModelType;

  @Column({ length: 20 })
  version!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha_entrenamiento!: Date;

  @Column({ type: "decimal", precision: 5, scale: 4, nullable: true })
  precision_metrica!: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ruta_artefacto!: string | null;

  @Column({
    type: "enum",
    enum: AIModelState,
    default: AIModelState.ACTIVO,
  })
  estado!: AIModelState;

  // Relaciones:
  @OneToMany(() => DemandPrediction, (prediction) => prediction.model)
  demandPredictions!: DemandPrediction[];

  @OneToMany(() => SupplierInvoice, (invoice) => invoice.aiModel)
  supplierInvoices!: SupplierInvoice[];

}
