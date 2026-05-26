# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist
# Para produção usando vite-node ou build final (conforme ADR)
# Aqui copiamos o src apenas se o start script precisar dele (vite-node)
COPY --from=builder /app/src ./src
COPY --from=builder /app/vite.config.ts ./vite.config.ts

EXPOSE 3000

CMD ["npm", "run", "start"]
