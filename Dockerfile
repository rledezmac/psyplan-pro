FROM node:20-alpine
WORKDIR /app
COPY apps/api/package*.json ./
RUN npm install
COPY apps/api .
RUN npm run build || echo \"Build skipped - no build script\"
EXPOSE 3001
CMD [\"node\", \"dist/main.js\"]
