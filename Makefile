# Variables
FRONTEND_DIR := frontend
BACKEND_DIR := backend

# Phony targets
.PHONY: build up up-frontend up-backend down

# Default target
build: frontend-build backend-build

# Build targets
frontend-build:
	cd $(FRONTEND_DIR) && npm install && npm run clean && npm run build

backend-build:
	cd $(BACKEND_DIR) && npm install && npm run clean && npm run build

# Up targets
up:
	docker-compose up -d

up-frontend: up
	cd $(FRONTEND_DIR) && echo "y" | npx serve -s build

up-backend: up
	cd $(BACKEND_DIR) && npm run start:prod

# Down target
down:
	docker-compose down