# 🐳 Docker Setup Guide

## Quick Start

### 1. Install Docker Desktop
- Download from: https://www.docker.com/products/docker-desktop/
- Make sure Docker is running

### 2. Create Database Migration
```bash
cd task-tracker-backend
dotnet ef migrations add InitialCreate
```

### 3. Start Everything with Docker Compose
```bash
cd c:/neldevsrc/personal
docker-compose up -d
```

This will:
- ✅ Start PostgreSQL database (port 5432)
- ✅ Start .NET API (port 5000)
- ✅ Create persistent volume for data
- ✅ Run database migrations automatically

### 4. Verify It's Running
```bash
# Check containers
docker ps

# Check API health
curl http://localhost:5000/api/timeblocks

# Check database
docker exec -it task-tracker-db psql -U taskuser -d tasktracker
```

### 5. Start Angular Frontend
```bash
cd task-tracker-frontend
npm start
```

## 📊 Data Persistence

**Your data is stored in a Docker volume named `postgres-data`**

This means:
- ✅ Data survives container restarts
- ✅ Data survives computer restarts
- ✅ Data persists even if you stop/remove containers
- ✅ You can backup the volume

### Backup Your Data
```bash
# Backup
docker exec task-tracker-db pg_dump -U taskuser tasktracker > backup.sql

# Restore
docker exec -i task-tracker-db psql -U taskuser tasktracker < backup.sql
```

### View Your Data
```bash
# Connect to database
docker exec -it task-tracker-db psql -U taskuser -d tasktracker

# List tables
\dt

# View time blocks
SELECT * FROM "TimeBlocks";

# View todos
SELECT * FROM "TodoItems";

# Exit
\q
```

## 🔧 Useful Commands

### Stop Everything
```bash
docker-compose down
```

### Stop and Remove Data (⚠️ Deletes everything!)
```bash
docker-compose down -v
```

### Restart Just the API
```bash
docker-compose restart api
```

### View Logs
```bash
# All logs
docker-compose logs -f

# Just API logs
docker-compose logs -f api

# Just database logs
docker-compose logs -f postgres
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

## 🌐 API Endpoints

Base URL: `http://localhost:5000/api`

### Time Blocks
- `GET /timeblocks` - Get all time blocks
- `GET /timeblocks?startDate=2025-11-01&endDate=2025-11-30` - Filter by date range
- `GET /timeblocks/{id}` - Get single block
- `POST /timeblocks` - Create new block
- `PUT /timeblocks/{id}` - Update block
- `DELETE /timeblocks/{id}` - Delete block

### Todo Items
- `GET /todoitems` - Get all todos
- `GET /todoitems/{id}` - Get single todo
- `POST /todoitems` - Create new todo
- `PUT /todoitems/{id}` - Update todo
- `DELETE /todoitems/{id}` - Delete todo

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find what's using port 5432
netstat -ano | findstr :5432

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Database Connection Failed
```bash
# Check if postgres is healthy
docker ps

# Restart database
docker-compose restart postgres
```

### API Not Starting
```bash
# Check logs
docker-compose logs api

# Rebuild
docker-compose up -d --build api
```

## 📦 What Gets Stored

### PostgreSQL Volume Location
- Windows: `\\wsl$\docker-desktop-data\data\docker\volumes\personal_postgres-data`
- The volume persists even after `docker-compose down`

### To Completely Reset
```bash
# Stop and remove everything including volumes
docker-compose down -v

# Remove the volume manually
docker volume rm personal_postgres-data

# Start fresh
docker-compose up -d
```

## ✅ Next Steps

1. Update Angular service to use API instead of localStorage
2. Test creating/reading/updating/deleting data
3. Restart Docker to verify data persists
4. Set up automatic backups (optional)
