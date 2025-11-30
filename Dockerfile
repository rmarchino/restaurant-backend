FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .
RUN npm run build


# --- Runtime image --
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 4000

CMD ["node", "dist/index.js"]
