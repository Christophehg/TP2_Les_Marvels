FROM node:lts-bullseye-slim
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "server.js"]
