#!/bin/bash

ROOTDIR=$(git rev-parse --show-toplevel)
COMPOSE_FILE=$ROOTDIR/prod.docker-compose.yaml

echo "Starting new containers...";
GIT_COMMIT="$(git rev-parse --short HEAD)" docker-compose -f $COMPOSE_FILE up --build -d
echo "";

echo "Attaching logs...";
docker-compose -f $COMPOSE_FILE logs -f
