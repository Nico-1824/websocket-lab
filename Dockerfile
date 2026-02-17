FROM node:20-slim AS server
WORKDIR /app

COPY . /app
RUN npm install 

EXPOSE 5500:5500
CMD ["node", "server.js"]