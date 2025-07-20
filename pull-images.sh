#!/bin/bash

echo "Trying to pull Docker images..."

# Try to pull images individually
echo "Pulling node:18-alpine..."
if ! docker pull node:18-alpine; then
    echo "Failed to pull node:18-alpine, trying with timeout..."
    timeout 60 docker pull node:18-alpine || echo "Still failed, will try during build"
fi

echo "Pulling nginx:alpine..."
if ! docker pull nginx:alpine; then
    echo "Failed to pull nginx:alpine, trying with timeout..."
    timeout 60 docker pull nginx:alpine || echo "Still failed, will try during build"
fi

echo "Pulling postgres:15..."
if ! docker pull postgres:15; then
    echo "Failed to pull postgres:15, trying with timeout..."
    timeout 60 docker pull postgres:15 || echo "Still failed, will try during build"
fi

echo "Pulling redis:alpine..."
if ! docker pull redis:alpine; then
    echo "Failed to pull redis:alpine, trying with timeout..."
    timeout 60 docker pull redis:alpine || echo "Still failed, will try during build"
fi

echo "Image pulling completed (some may have failed, but Docker will retry during build)"