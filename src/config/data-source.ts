import "reflect-metadata";
import { DataSource } from "typeorm";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

const dbUrl = process.env.DATABASE_URL;

import { Role } from "../models/Role";
import { Sede } from "../models/Sede";
import { User } from "../models/User";
import { CashBox } from "../models/Caja";
import { CashOpening } from "../models/AperturaCaja";
import { Cliente } from "../models/Cliente";
import { Category } from "../models/Categoria";
import { Producto } from "../models/Producto";
import { Table } from "../models/Mesa";
import { Order } from "../models/Pedido";
import { OrderDetail } from "../models/DetallePedido";
import { Voucher } from "../models/Comprobante";
import { VoucherDetail } from "../models/DetalleComprobante";
import { Sale } from "../models/Venta";

import { AIModel } from "../models/AIModel";
import { DemandPrediction } from "../models/DemandPrediction";
import { SupplierInvoice } from "../models/SupplierInvoice";
import { SupplierInvoiceDetail } from "../models/SupplierInvoiceDetail";

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "5432", 10);
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "root";
const DB_NAME = process.env.DB_NAME || "restaurant_db";

export const AppDataSource = new DataSource({
  type: "postgres",
  ...(dbUrl
    ? { url: dbUrl }
    : {
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
      }),

  synchronize: false,

  //synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development" ? ["query", "error"] : false,

  //entities: [resolve(process.cwd(), "src/models/**/*.{ts,js}")],
  //migrations: [resolve(process.cwd(), "src/migrations/**/*.{ts,js}")],

  entities: [
    resolve(
      process.cwd(),
      isProd ? "dist/models/**/*.{js}" : "src/models/**/*.{ts,js}"
    ),
  ],
  migrations: [
    resolve(
      process.cwd(),
      isProd ? "dist/migrations/**/*.{js}" : "src/migrations/**/*.{ts,js}"
    ),
  ],

  subscribers: [],
});
