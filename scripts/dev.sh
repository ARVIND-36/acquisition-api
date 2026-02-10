#!/bin/bash

echo "🚀 Starting Acquisitions API in Development Mode..."
echo "=================================================="
echo ""
echo "Using Neon Local for ephemeral database"
echo "Application will be available at: http://localhost:3000"
echo "Drizzle Studio will be available at: http://localhost:4983"
echo ""

docker-compose -f docker-compose.dev.yml --env-file .env.development up --build

echo ""
echo "👋 Development environment stopped"
