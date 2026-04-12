.PHONY: build clean deploy deps local-db local-db-stop create-table seed-data test

# Run tests
test:
	go test ./... -v

# Build for AWS Lambda (Linux ARM64)
build:
	set GOARCH=arm64&& set GOOS=linux&& go build -ldflags="-s -w" -o bin/bootstrap cmd/api/main.go

# Clean build artifacts
clean:
	if exist bin rmdir /s /q bin

# Install Go dependencies
deps:
	go mod tidy

# Start local DynamoDB
local-db:
	docker-compose up -d

# Stop local DynamoDB
local-db-stop:
	docker-compose down

# Create table in local DynamoDB
create-table:
	powershell -File scripts/create-table.ps1

# Seed sample data into local DynamoDB
seed-data:
	powershell -File scripts/seed-data.ps1

# Deploy to AWS
deploy: clean build
	sls deploy --verbose

