FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy project files
COPY . .

# Build the frontend React app
RUN npm run build

# Expose port
ENV PORT=5000
EXPOSE 5000

# Start the Express server
CMD ["npm", "run", "server"]
