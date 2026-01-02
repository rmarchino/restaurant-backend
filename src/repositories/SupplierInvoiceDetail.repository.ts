import { AppDataSource } from "../config/data-source";
import { SupplierInvoiceDetail } from "../models/SupplierInvoiceDetail";

export class SupplierInvoiceDetailRepository {
  private repo = AppDataSource.getRepository(SupplierInvoiceDetail);

  async deleteByInvoiceId(invoiceId: number) {
    await this.repo.delete({ facturaId: invoiceId });
  }
}
