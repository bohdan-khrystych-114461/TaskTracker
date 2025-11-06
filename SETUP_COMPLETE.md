# ✅ Docker + PostgreSQL Setup Complete!

## 🎯 What You Have Now

### 1. **PostgreSQL Database in Docker**
- ✅ Persistent storage (data survives restarts)
- ✅ Automatic migrations on startup
- ✅ Accessible at `localhost:5432`
- ✅ Database: `tasktracker`
- ✅ User: `taskuser` / Password: `taskpass123`

### 2. **.NET Core API**
- ✅ RESTful endpoints for TimeBlocks and TodoItems
- ✅ Entity Framework Core with PostgreSQL
- ✅ CORS enabled for Angular
- ✅ Runs on `http://localhost:5000`

### 3. **Docker Compose Configuration**
- ✅ One command to start everything
- ✅ Health checks for database
- ✅ Automatic dependency management
- ✅ Volume mounting for data persistence

## 🚀 How to Start

### Option 1: PowerShell Script (Easiest)
```powershell
cd c:\neldevsrc\personal
.\start-docker.ps1
```

### Option 2: Manual
```bash
cd c:\neldevsrc\personal
docker-compose up -d
```

## 📊 Your Data is Safe!

**Data Location:** Docker volume `personal_postgres-data`

This means:
- ✅ Data persists after `docker-compose down`
- ✅ Data persists after computer restart
- ✅ Data persists after Docker restart
- ✅ Only deleted with `docker-compose down -v`

### Test Data Persistence
```bash
# 1. Start containers
docker-compose up -d

# 2. Create some data (via Angular app or API)

# 3. Stop containers
docker-compose down

# 4. Start again
docker-compose up -d

# 5. Your data is still there! ✅
```

## 🔧 API Endpoints

Base URL: `http://localhost:5000/api`

### Time Blocks
```
GET    /timeblocks              # Get all
GET    /timeblocks?startDate=&endDate=  # Filter by date
GET    /timeblocks/{id}         # Get one
POST   /timeblocks              # Create
PUT    /timeblocks/{id}         # Update
DELETE /timeblocks/{id}         # Delete
```

### Todo Items
```
GET    /todoitems               # Get all
GET    /todoitems/{id}          # Get one
POST   /todoitems               # Create
PUT    /todoitems/{id}          # Update
DELETE /todoitems/{id}          # Delete
```

## 📝 Example API Calls

### Create Time Block
```bash
curl -X POST http://localhost:5000/api/timeblocks \
  -H "Content-Type: application/json" \
  -d '{
    "taskName": "Morning Meeting",
    "startTime": "2025-11-06T09:00:00Z",
    "endTime": "2025-11-06T10:00:00Z",
    "duration": 60,
    "date": "2025-11-06T00:00:00Z"
  }'
```

### Get All Time Blocks
```bash
curl http://localhost:5000/api/timeblocks
```

### Create Todo
```bash
curl -X POST http://localhost:5000/api/todoitems \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Review code",
    "description": "Check PR #123",
    "isCompleted": false
  }'
```

## 🔍 Verify Everything Works

### 1. Check Containers
```bash
docker ps
```
You should see:
- `task-tracker-db` (healthy)
- `task-tracker-api` (running)

### 2. Check Database
```bash
docker exec -it task-tracker-db psql -U taskuser -d tasktracker

# Inside psql:
\dt                    # List tables
SELECT * FROM "TimeBlocks";
SELECT * FROM "TodoItems";
\q                     # Exit
```

### 3. Check API
```bash
curl http://localhost:5000/api/timeblocks
curl http://localhost:5000/api/todoitems
```

## 🛠️ Common Commands

### View Logs
```bash
# All logs
docker-compose logs -f

# Just API
docker-compose logs -f api

# Just database
docker-compose logs -f postgres
```

### Restart Services
```bash
# Restart everything
docker-compose restart

# Restart just API
docker-compose restart api
```

### Stop Everything
```bash
# Stop (keeps data)
docker-compose down

# Stop and remove data (⚠️ deletes everything!)
docker-compose down -v
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

## 💾 Backup & Restore

### Backup Database
```bash
docker exec task-tracker-db pg_dump -U taskuser tasktracker > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
docker exec -i task-tracker-db psql -U taskuser tasktracker < backup_20251106.sql
```

## 🐛 Troubleshooting

### Port 5432 Already in Use
```powershell
# Find process using port 5432
netstat -ano | findstr :5432

# Kill it (replace PID)
taskkill /PID <PID> /F
```

### Port 5000 Already in Use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill it
taskkill /PID <PID> /F
```

### Database Won't Start
```bash
# Check logs
docker-compose logs postgres

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

### API Won't Start
```bash
# Check logs
docker-compose logs api

# Rebuild
docker-compose up -d --build api
```

## 📦 What's Next?

### Phase 1: Update Angular Service (Next Step)
- Replace localStorage with HTTP calls
- Add API service
- Handle loading states
- Error handling

### Phase 2: Data Migration
- Export existing localStorage data
- Import into database via API
- Verify data integrity

### Phase 3: Enhancements
- Add offline support
- Implement sync strategy
- Add data export/import
- Backup automation

## 🎉 You're All Set!

Your data is now:
- ✅ Persistent across restarts
- ✅ Stored in PostgreSQL
- ✅ Accessible via REST API
- ✅ Ready for production

**Next:** Update Angular to use the API instead of localStorage!
