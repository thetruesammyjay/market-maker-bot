#!/bin/bash
# Production deployment script

echo "🚀 Deploying Market Maker Bot"
docker-compose -f ../docker/docker-compose.yml up -d --build

echo "✅ Deployment complete"
echo "🔍 Check logs with: docker-compose logs -f"