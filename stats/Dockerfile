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
# EXPOSE 3002

# # Start in development mode
# CMD ["npm", "run", "dev"]


FROM node:18-alpine

WORKDIR /app

COPY shared ./shared
COPY stats ./stats

WORKDIR /app/stats
RUN npm install
RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "dev"]