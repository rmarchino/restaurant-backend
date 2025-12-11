import "module-alias/register";
import "dotenv/config";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { AppDataSource } from "./config/data-source";
import logger from "./utils/logger";
import { authRoutes } from "./routes/AuthRoutes";
import { userRoutes } from "./routes/UserRoutes";
import { ocrRoutes } from "./routes/ocr.routes";
import { redisClient } from "./config/redisClient";
require('dotenv').config();


// Inicialización de la app
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "4000", 10);

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting (para evitar ataques por fuerza bruta)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de requests
  message: "Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.",
});
app.use(limiter);

// ✅ Ruta base de prueba
app.get("/", async (req: Request, res: Response) => {
  const redisStatus = redisClient.isOpen ? "✅ Conectado" : "❌ No conectado";
  res.send({
    message: "¡Backend del Restaurante Operando! 🚀",
    redis: redisStatus,
    env: process.env.NODE_ENV,
  });
});

// Rutas de la aplicación
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", ocrRoutes);

// Función principal de arranque
const startServer = async () => {
  try {
    // Conexión a Redis
    logger.info("🔄 Conectando a Redis...");
    await redisClient.connect();
    logger.info("Conectado a Redis correctamente.");

    // Conexión a la base de datos
    logger.info("🔄 Conectando a la base de datos...");
    await AppDataSource.initialize();
    logger.info("Conexión a la base de datos establecida.");

    // Iniciar servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
      logger.info(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    logger.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

// Ejecutar arranque
startServer();

// Manejo de señales para cerrar Redis y BD limpiamente
process.on("SIGINT", async () => {
  logger.info("🛑 Cerrando servidor...");
  await redisClient.disconnect();
  await AppDataSource.destroy();
  process.exit(0);
});
