# Architecture Documentation

## System Overview

Smart Retail Shelf Intelligence is a full-stack application for real-time retail shelf monitoring.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Material UI, Recharts |
| Backend | FastAPI, Python 3.11 |
| Database | MongoDB Atlas |
| Authentication | JWT, OAuth2 (Google, GitHub) |
| Real-time | WebSockets |
| Deployment | Docker, Render, Vercel |

## Data Flow

1. Camera feeds → Backend API → YOLO detection
2. Detection results → MongoDB → Alerts
3. Alerts → WebSocket → Frontend real-time display

## API Endpoints (41 total)

- Authentication: 7 endpoints
- Alerts: 5 endpoints
- Analytics: 2 endpoints
- Planogram: 5 endpoints
- Products: 4 endpoints
- Inventory: 4 endpoints
- Forecasting: 2 endpoints
- Cameras: 5 endpoints
- Dashboard: 2 endpoints
- Detection: 2 endpoints
- Stores: 3 endpoints