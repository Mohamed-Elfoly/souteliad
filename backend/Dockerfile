FROM node:20-alpine

WORKDIR /app

# Copy package files first (better cache layer)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy app source
COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
