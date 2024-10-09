#!/bin/bash

# Start the server
cd server
node ./bin/www &

cd..

# Wait for a moment to ensure the server starts
sleep 5

# Start the client
cd ../client
npm start
