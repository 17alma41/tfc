FROM node:20
WORKDIR /app
COPY package*.json ./
# Instala solo dependencias de producción
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
