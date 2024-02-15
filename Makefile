build:
	docker-compose build;
	cd frontend && npm install && npm run clean && npm run build;


up:
	docker-compose up -d;
	cd frontend && npm run start;

down:
	docker-compose down