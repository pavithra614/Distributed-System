# Use official Node.js image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy all source files
COPY . .

# Expose port
EXPOSE 5000

# Start the service
CMD ["node", "server.js"]
