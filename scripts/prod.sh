#!/bin/bash

echo "🏭 Starting Acquisitions API in Production Mode..."
echo "=================================================="
echo ""
echo "Connecting to Neon Cloud Database"
echo "Application will be available at: http://localhost:3000"
echo ""

docker-compose -f docker-compose.prod.yml --env-file .env.production up --build -d

echo ""
echo "✅ Production environment started in detached mode"
echo "View logs with: npm run docker:logs:prod"
echo "Stop with: npm run docker:prod:down"
