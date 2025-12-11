import { AppDataSource } from "../config/data-source";
import { Voucher } from "../models/Comprobante";

export const VoucherRepository = AppDataSource.getRepository(Voucher).extend({
  async findWithDetails(id: number) {
    return this.findOne({
      where: { id },
      relations: ["details", "details.product"],
    });
  },
});
