# Damn Vulnerable Web University - Docker Build
# EDUCATIONAL USE ONLY - Contains intentional vulnerabilities

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including dev for build
RUN npm ci

# Copy source code
COPY . .

# Build the React application
RUN npm run build

# Install production server dependencies
RUN npm install express cors --save

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Run the Express server
CMD ["node", "server.cjs"]
