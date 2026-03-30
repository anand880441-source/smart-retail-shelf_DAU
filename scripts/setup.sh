#!/bin/bash

echo "========================================="
echo "Smart Retail Shelf Intelligence - Setup"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend setup
echo -e "${YELLOW}Setting up backend...${NC}"
cd backend || exit

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}Created .env file. Please update with your credentials.${NC}"
fi

cd ..

# Frontend setup
echo -e "${YELLOW}Setting up frontend...${NC}"
cd frontend || exit

# Install npm dependencies
npm install

# Create .env file if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}Created frontend .env file.${NC}"
fi

cd ..

echo -e "${GREEN}========================================="
echo "Setup complete!"
echo "=========================================${NC}"
echo ""
echo "To start the application:"
echo "  Backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "  Frontend: cd frontend && npm start"
echo ""
echo "Or use Docker: docker-compose up -d"