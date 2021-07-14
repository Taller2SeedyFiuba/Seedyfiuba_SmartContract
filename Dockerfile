
# PROD CONFIG
FROM node:12-buster-slim

WORKDIR /app

COPY / ./

RUN npm install --production


CMD npx hardhat node --port $PORT --hostname "0.0.0.0"