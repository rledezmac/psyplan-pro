FROM node:20-alpine
WORKDIR /app
COPY apps/api/package.json ./
RUN npm install
COPY apps/api/index.js ./
COPY packages/shared/prisma ./prisma
ENV DATABASE_URL=\"\"
RUN npx prisma generate
EXPOSE 3001
CMD [\"npm\", \"start\"]
