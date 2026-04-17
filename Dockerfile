FROM node:20-alpine
WORKDIR /app

# Instalar NestJS CLI y TypeScript globalmente
RUN npm install -g @nestjs/cli typescript

# Copiar archivos de configuración
COPY apps/api/package.json ./
COPY apps/api/tsconfig.json ./
COPY apps/api/nest-cli.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY apps/api/src ./src

# Compilar manualmente con tsc
RUN npx tsc -p tsconfig.json

# Verificar que dist/main.js existe
RUN ls -la dist/

EXPOSE 3001
CMD ["node", "dist/main.js"]
