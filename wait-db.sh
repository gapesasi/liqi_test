#!/bin/sh
# wait-db.sh

# Wait for the database to be ready
while ! nc -z database 8000; do
  echo 'Waiting for the Database server to start...';
  sleep 2;
done;

exec npm run start;