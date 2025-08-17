#!/bin/sh
echo ""
echo "miniciv ready at http://localhost"
echo ""
docker-compose \
  --file $HOME/github.com/loicbourgois/miniciv/docker-compose.yml \
  up --build
