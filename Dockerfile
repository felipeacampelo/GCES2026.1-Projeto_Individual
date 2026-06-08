FROM node:22-bookworm-slim

WORKDIR /app

COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install

WORKDIR /app
COPY server ./server
COPY game ./game

EXPOSE 55555

WORKDIR /app/server
CMD ["npm", "run", "dev"]
