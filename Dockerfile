# Dockerfile
# Defines container environment for our TCP socket application.
# Installs Node.js dependencies and runs the server on port 5500.

FROM node:20-slim AS server
WORKDIR /app

COPY . /app
RUN npm install 

EXPOSE 5500
CMD ["node", "server.js"]
