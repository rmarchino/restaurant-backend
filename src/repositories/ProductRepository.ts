import { AppDataSource } from "./../config/data-source";
import { Producto } from "../models/Producto";

export const ProductRepository = AppDataSource.getRepository(Producto).extend({
  async findByName(name: string): Promise<Producto | null> {
    return this.createQueryBuilder("producto")
      .where("producto.nombre = :name", { name })
      .getOne();
  },
});
