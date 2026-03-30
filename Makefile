.PHONY: help install-backend install-frontend run-backend run-frontend run-all clean docker-up docker-down

help:
	@echo "Available commands:"
	@echo "  make install-backend  - Install backend dependencies"
	@echo "  make install-frontend - Install frontend dependencies"
	@echo "  make run-backend      - Run backend server"
	@echo "  make run-frontend     - Run frontend server"
	@echo "  make run-all          - Run both servers"
	@echo "  make docker-up        - Start Docker containers"
	@echo "  make docker-down      - Stop Docker containers"
	@echo "  make clean            - Clean temporary files"

install-backend:
	cd backend && python -m venv venv && .\venv\Scripts\activate && pip install -r requirements.txt

install-frontend:
	cd frontend && npm install

run-backend:
	cd backend && .\venv\Scripts\activate && uvicorn app.main:app --reload --port 8000

run-frontend:
	cd frontend && npm start

run-all:
	start cmd /k "cd backend && .\venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"
	start cmd /k "cd frontend && npm start"

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

clean:
	cd backend && rmdir /s /q __pycache__ 2>nul
	cd frontend && rmdir /s /q node_modules 2>nul
	cd frontend && del package-lock.json 2>nul