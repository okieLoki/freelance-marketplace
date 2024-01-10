FROM node:21-alpine3.18 as builder

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY tools ./tools
RUN npm ci && npm run build

FROM node:21-alpine3.18 
WORKDIR /app
RUN apk add --no-cache curl
COPY package.json ./
COPY tsconfig.json ./
RUN npm install -g pm2
RUN npm ci --production
COPY --from=builder /app/dist ./dist

EXPOSE 8001 

CMD ["npm", "run", "start"]
