FROM node:20-alpine AS builder
WORKDIR /app

# Copiar solo lo necesario para la API
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/

# Instalar dependencias
WORKDIR /app/apps/api
RUN npm install

# Copiar el resto del código
WORKDIR /app
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# Construir la API
WORKDIR /app/apps/api
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/packages/shared ./packages/shared
RUN npm install --only=production
EXPOSE 3001
CMD ["node", "dist/main.js"]