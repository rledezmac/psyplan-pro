FROM node:20-alpine AS builder
WORKDIR /app

# Copiar configuración del monorepo
COPY package*.json ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

# Copiar la app API y el shared
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# Instalar dependencias y construir
RUN npm install -g pnpm
RUN pnpm install
WORKDIR /app/apps/api
RUN pnpm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/packages/shared ./packages/shared
RUN npm install --only=production
EXPOSE 3001
CMD ["node", "dist/main.js"]