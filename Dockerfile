# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 4000

# Opción A: correr sin migraciones automáticas
# CMD ["node", "dist/index.js"]

# Opción B: correr con migraciones automáticas
CMD ["node", "dist/scripts/runMigrationsAndStart.js"]
