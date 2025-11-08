import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Category } from "./Categoria";
import { ProductStatus } from "../enums/ProductStatus.enum";
import { ProductOrigin } from "../enums/ProductOrigin.enum";
import { OrderDetail } from "./DetallePedido";
import { VoucherDetail } from "./DetalleComprobante";
import { DemandPrediction } from "./DemandPrediction";
import { SupplierInvoiceDetail } from "./SupplierInvoiceDetail";

@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn({ type: "bigint" })
    id!: number;

    // Relación ManyToOne con Categoría
    @Column({ type: "bigint", nullable: true })
    categoria_id!: number | null;
    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: "categoria_id" })
    category!: Category | null;

    @Column({ type: 'varchar', length: 100 })
    nombre!: string;

    @Column({ type: 'text', nullable: true })
    descripcion!: string | null;

    @Column({ type: "decimal", precision: 10, scale: 2})
    precio!: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    codigo_barras!: string | null;


    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    costo_produccion!: number | null;

    @Column({ type: 'int', default: 0 })
    stock!: number;

    @Column({
        type: 'enum',
        enum: ProductStatus,
        default: ProductStatus.ACTIVO,
    })
    estado!: ProductStatus;

    @Column({
        type: 'enum',
        enum: ProductOrigin,
        default: ProductOrigin.MANUAL,
    })
    origen!: ProductOrigin;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    fecha_actualizacion!: Date;

    // Relaciones
    @OneToMany(() => OrderDetail, (detail) => detail.product)
    orderDetails?: OrderDetail[];

    @OneToMany(() => VoucherDetail, (detail) => detail.product)
    voucherDetails?: VoucherDetail[];

    @OneToMany(() => DemandPrediction, (prediction) => prediction.product)
    demandPredictions?: DemandPrediction[];

    @OneToMany(() => SupplierInvoiceDetail, (detail) => detail.product)
    supplierInvoiceDetails?: SupplierInvoiceDetail[];
}