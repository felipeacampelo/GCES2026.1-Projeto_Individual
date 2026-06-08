FROM node:22-bookworm-slim

WORKDIR /app/server

COPY server/package*.json ./
RUN npm install

COPY server ./server
COPY game ../game

EXPOSE 55555

CMD ["npm", "run", "dev"]
