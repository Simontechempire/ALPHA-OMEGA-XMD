FROM node:20-bullseye
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm install -g pm2
EXPOSE 3000
CMD ["node", "index.js"]
