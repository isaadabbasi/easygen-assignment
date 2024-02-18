# Variables
FRONTEND_DIR := frontend
BACKEND_DIR := backend

# Phony targets
.PHONY: build up-frontend up-backend down

# Default target
build: build-services build-frontend build-backend

	
# Build targets
build-services:
	docker-compose build

build-frontend:
	cd $(FRONTEND_DIR) && npm install && npm run clean && npm run build

build-backend:
	cd $(BACKEND_DIR) && npm install && npm run clean && npm run build

# Up targets

up-frontend:
	cd $(FRONTEND_DIR) && echo "y" | npx serve -s build

up-backend:
	docker-compose up -d;
	cd $(BACKEND_DIR) && npm run start:prod

test-backend:
	cd $(BACKEND_DIR) && npm run test

# Down target
down:
	docker-compose down