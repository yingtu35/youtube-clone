# Stage 1: build stage
FROM node:18 as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: production stage
FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y ffmpeg

COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

COPY --from=builder  /app/dist ./dist

# Make port 3000 available to the world outside this container
EXPOSE 3000

CMD [ "npm", "run", "serve"]