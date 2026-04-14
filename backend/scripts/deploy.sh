#!/bin/bash
# Deploy the Farmers Marketplace API to Google Cloud Functions (Gen 2)
#
# Prerequisites:
#   1. Install gcloud CLI: https://cloud.google.com/sdk/docs/install
#   2. Authenticate: gcloud auth login
#   3. Set project: gcloud config set project YOUR_PROJECT_ID
#
# Usage: bash scripts/deploy.sh

set -e

PROJECT_ID="${GCP_PROJECT_ID:-mysore-farmer-market}"
REGION="${GCP_REGION:-asia-south1}"
FUNCTION_NAME="farmers-marketplace-api"

echo "🚀 Deploying $FUNCTION_NAME to GCP Cloud Functions..."
echo "   Project:  $PROJECT_ID"
echo "   Region:   $REGION"

gcloud functions deploy "$FUNCTION_NAME" \
  --gen2 \
  --runtime=go121 \
  --region="$REGION" \
  --source=. \
  --entry-point=APIHandler \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars="GCP_PROJECT_ID=$PROJECT_ID,AUTH_MODE=mock" \
  --project="$PROJECT_ID"

echo ""
echo "✅ Deployment complete!"
echo "   URL: https://$REGION-$PROJECT_ID.cloudfunctions.net/$FUNCTION_NAME"
