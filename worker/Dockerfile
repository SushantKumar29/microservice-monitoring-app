# FROM node:18-alpine

# RUN apk add --no-cache curl

# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install dependencies
# RUN npm install 

# # Copy source code
# COPY . .

# # Build TypeScript
# RUN npm run build

# # Expose port
# EXPOSE 3001

# # Start in development mode
# CMD ["npm", "run", "dev"]

FROM node:18-alpine

WORKDIR /app

COPY shared ./shared
COPY worker ./worker

WORKDIR /app/worker
RUN npm install
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "dev"]