# Use the official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build arguments for environment variables
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_SUPABASE_URL
ARG REACT_APP_SUPABASE_ANON_KEY
ARG REACT_APP_NAME
ARG REACT_APP_VERSION
ARG REACT_APP_ANALYTICS_ENABLED

# Set environment variables for build
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_SUPABASE_URL=$REACT_APP_SUPABASE_URL
ENV REACT_APP_SUPABASE_ANON_KEY=$REACT_APP_SUPABASE_ANON_KEY
ENV REACT_APP_NAME=$REACT_APP_NAME
ENV REACT_APP_VERSION=$REACT_APP_VERSION
ENV REACT_APP_ANALYTICS_ENABLED=$REACT_APP_ANALYTICS_ENABLED

# Build the React app for production (env vars available during build)
RUN npm run build

# Expose the port the app runs on
EXPOSE $PORT

# Define the command to run the application
CMD ["node", "server.js"]
