# Multi-stage Dockerfile for Auth Server
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm ci --only=production
RUN npm ci --only=production --prefix frontend

# Copy source code
COPY . .

# Build frontend
RUN npm run build --prefix frontend

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S authuser -u 1001

# Copy built application
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend/dist ./frontend/dist

# Change ownership
RUN chown -R authuser:nodejs /app

# Switch to non-root user
USER authuser

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/auth/check-auth', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]