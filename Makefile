setup: copy-environment-files generate-keys

start: GIT_COMMIT=$(shell git rev-parse --short HEAD)
start:
	@GIT_COMMIT=$(GIT_COMMIT) docker compose -f prod.docker-compose.yaml build backend
	@GIT_COMMIT=$(GIT_COMMIT) docker compose -f prod.docker-compose.yaml up -d backend

	@GIT_COMMIT=$(GIT_COMMIT) docker compose -f prod.docker-compose.yaml build frontend
	@GIT_COMMIT=$(GIT_COMMIT) docker compose -f prod.docker-compose.yaml up -d nginx

copy-environment-files: 
	@cp backend/example.env backend/.env
	@cp frontend/.env frontend/.env.local
	@cp example.env .env

generate-keys: DIR=$(shell git rev-parse --show-toplevel)
generate-keys:
	@openssl genrsa -out /tmp/private.pem 2048 > /dev/null 2>&1

	@openssl rsa -in /tmp/private.pem -outform PEM -pubout -out /tmp/public.pem > /dev/null 2>&1

	@sed -i ':a;N;$$!ba;s/\n/\\\\n/g' /tmp/private.pem
	@sed -i ':a;N;$$!ba;s/\n/\\\\n/g' /tmp/public.pem

	@sed -i -zE "s/PRIVATE_KEY='-----BEGIN PRIVATE KEY-----(.|\n)*-----END PRIVATE KEY-----'\n//" backend/.env
	@echo "PRIVATE_KEY='`cat /tmp/private.pem`'" >> backend/.env

	@sed -i -zE "s/PUBLIC_KEY='-----BEGIN PUBLIC KEY-----(.|\n)*-----END PUBLIC KEY-----'\n//" backend/.env
	@echo "PUBLIC_KEY='`cat /tmp/public.pem`'" >> backend/.env

	@sed -i -zE "s/PUBLIC_KEY='-----BEGIN PUBLIC KEY-----(.|\n)*-----END PUBLIC KEY-----'\n//" frontend/.env.local
	@echo "PUBLIC_KEY='`cat /tmp/public.pem`'" >> frontend/.env.local

	@rm /tmp/private.pem /tmp/public.pem