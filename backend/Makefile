.PHONY: build clean deploy deps local-db local-db-stop seed-data test run

# Run tests
test:
	go test ./... -v

# Build for local development / Cloud Functions
build:
	go build -o bin/api cmd/api/main.go

# Run locally
run: build
	set FIRESTORE_EMULATOR_HOST=localhost:8080&& set GCP_PROJECT_ID=mysore-farmer-market&& set AUTH_MODE=mock&& bin\api.exe

# Clean build artifacts
clean:
	if exist bin rmdir /s /q bin

# Install Go dependencies
deps:
	go mod tidy

# Start local Firestore emulator (requires Firebase CLI: npm install -g firebase-tools)
local-db:
	firebase emulators:start --only firestore --project mysore-farmer-market

# Seed sample data into Firestore emulator
seed-data:
	set FIRESTORE_EMULATOR_HOST=localhost:8080&& set GCP_PROJECT_ID=mysore-farmer-market&& go run scripts/seed-data.go

# Deploy to Google Cloud Functions (Gen 2)
deploy: clean
	gcloud functions deploy farmers-marketplace-api \
		--gen2 \
		--runtime=go121 \
		--region=asia-south1 \
		--source=. \
		--entry-point=APIHandler \
		--trigger-http \
		--allow-unauthenticated \
		--set-env-vars=GCP_PROJECT_ID=mysore-farmer-market,AUTH_MODE=mock

# Run go vet
vet:
	go vet ./...
