#!/bin/bash

ROOTDIR=$(git rev-parse --show-toplevel)
COMPOSE_FILE=$ROOTDIR/prod.docker-compose.yaml

echo "Shutting down containers...";
docker-compose -f $COMPOSE_FILE down
echo "";

echo "Pulling latest commits...";
git pull
echo "";

echo "Install new dependencies...";
docker-compose -f $COMPOSE_FILE run backend npm i
docker-compose -f $COMPOSE_FILE run frontend npm i
echo "";

bash $ROOTDIR/scripts/build.sh
