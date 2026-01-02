import { Router } from "express";
import { OcrController } from "../controllers/ocr.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload.middleware";

const router = Router();
const controller = new OcrController();

// Rutas
router.post("/ocr/upload", upload.single("factura"), (req, res, next) => {
  controller.upload(req, res).catch(next);
});

router.post("/ocr/process", (req, res, next) => {
  controller.process(req, res).catch(next);
});

router.get("/ocr/results/:id", (req, res, next) => {
  controller.getResults(req, res).catch(next);
});

router.get("/ocr/results", (req, res, next) => {
  controller.getAllResults(req, res).catch(next);
});

router.put("/ocr/update", (req, res, next) => {
  controller.updateInvoice(req, res).catch(next);
});

export const ocrRoutes = router;
