import { createClient } from "redis";

const redisURL = process.env.REDIS_URL;

if (!redisURL) {
  console.error("❌ ERROR: REDIS_URL no está definido en el archivo .env");
  process.exit(1);
}

export const redisClient = createClient({ url: redisURL });

redisClient.on("connect", () =>
  console.log("✅ Redis conectado correctamente")
);
redisClient.on("error", (err) =>
  console.error("❌ Error de conexión a Redis:", err)
);

async () => {
  await redisClient.connect();
  console.log("✅ Redis conectado correctamente");
};
