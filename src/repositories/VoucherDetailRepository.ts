import { AppDataSource } from "../config/data-source";
import { VoucherDetail } from "../models/DetalleComprobante";

export const VoucherDetailRepository = AppDataSource.getRepository(
  VoucherDetail
).extend({
  async findByVoucher(voucherId: number) {
    return this.find({
      where: { voucher: { id: voucherId } },
      relations: ["product", "voucher"],
    });
  },
});
