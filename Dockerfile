# TableBite - Production Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy application code
COPY . .

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Seed database on first build if needed
RUN node seed.js

EXPOSE 3000

CMD ["node", "server.js"]
