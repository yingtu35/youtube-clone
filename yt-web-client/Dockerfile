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

COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built app from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Make port 3000 available to the world outside this container
EXPOSE 3000

CMD [ "npm", "start"]