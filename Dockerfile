# Stage 1: Build the React client
FROM node:20-alpine AS client-builder

WORKDIR /app/client

# Install frontend dependencies
COPY client/package*.json ./
RUN npm install

# Build the frontend
COPY client/ ./
RUN npm run build

# Stage 2: Build the Node backend
FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend source code
COPY . .

# Copy built frontend from stage 1
COPY --from=client-builder /app/client/dist ./client/dist

# Expose port (8000 is used by backend)
EXPOSE 8000

# Start server
CMD ["node", "index.js"]
