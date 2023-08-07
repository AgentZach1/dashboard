#!/bin/bash

# Define the absolute path to your Apache server's dashboard directory
APACHE_DASHBOARD_DIR="/var/www/html/dashboard"

# Stop and remove any currently running Docker containers
#docker-compose down

# Build the Docker image
docker build -f Dockerfile.react -t react-app .

# Run a Docker container to create the build files
docker run --name react-temp react-app

# Copy the build directory from the Docker container to your Apache server's dashboard directory
docker cp react-temp:/app/build/. $APACHE_DASHBOARD_DIR

# Remove the temporary Docker container
docker rm react-temp

# Use Docker Compose to start the other services
# docker-compose up -d --remove-orphans

echo "React app built and copied to Apache server successfully."
