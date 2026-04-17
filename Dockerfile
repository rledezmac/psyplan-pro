FROM node:20-alpine AS builder
WORKDIR /app
COPY apps/api/package*.json ./
COPY apps/api/prisma ./prisma/
RUN npm install
COPY apps/api .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma/
RUN npm install --only=production
EXPOSE 3001
CMD ["node", "dist/main.js"]