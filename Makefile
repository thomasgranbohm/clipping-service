setup:
	cp config/backend.example.env config/backend.env
	cp config/backend.example.env config/production.backend.env
	ln -s config/backend.env backend/.env
	
	cp config/frontend.example.env config/frontend.env
	cp config/frontend.example.env config/production.frontend.env
	ln -s config/frontend.env frontend/.env

build: GIT_COMMIT=$(shell git rev-parse --short HEAD)
build:
	export GIT_COMMIT
	docker compose -f prod.docker-compose.yaml build backend
	docker compose -f prod.docker-compose.yaml up -d backend
	
	docker compose -f prod.docker-compose.yaml build frontend
	docker compose -f prod.docker-compose.yaml up -d frontend