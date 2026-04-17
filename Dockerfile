FROM node:20-alpine
WORKDIR /app
COPY apps/api/package.json ./
RUN npm install
RUN npm install prisma@5.22.0 @prisma/client@5.22.0
COPY apps/api/index.js ./
COPY packages/shared/prisma ./prisma
ENV DATABASE_URL=\"\"
RUN npx prisma generate
EXPOSE 3001
CMD [\"npm\", \"start\"]
