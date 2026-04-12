# Script to create the DynamoDB table in local DynamoDB
# Run this AFTER docker-compose up

aws dynamodb create-table `
  --table-name farmers-marketplace-dev `
  --attribute-definitions `
    AttributeName=PK,AttributeType=S `
    AttributeName=SK,AttributeType=S `
  --key-schema `
    AttributeName=PK,KeyType=HASH `
    AttributeName=SK,KeyType=RANGE `
  --billing-mode PAY_PER_REQUEST `
  --endpoint-url http://localhost:8000 `
  --region us-east-1

Write-Host "Table created successfully!"

# Verify
aws dynamodb list-tables --endpoint-url http://localhost:8000 --region us-east-1
