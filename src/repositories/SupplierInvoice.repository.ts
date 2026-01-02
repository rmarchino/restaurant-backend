import { AppDataSource } from "../config/data-source";
import { SupplierInvoice } from "@/models/SupplierInvoice";

export class SupplierInvoiceRepository {
  private repo = AppDataSource.getRepository(SupplierInvoice);

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ["details"],
    });
  }

  save(invoice: SupplierInvoice) {
    return this.repo.save(invoice);
  }
}
