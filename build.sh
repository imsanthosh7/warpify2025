#!/bin/bash
set -e

# Install root dependencies (for API functions)
npm install

# Install and build client
cd client
npm install
npm run build
cd ..

