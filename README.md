# 📅 Task Tracker Application

A modern time tracking and task management application built with Angular and .NET Core.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Node.js installed (for development)

### Starting the Application

**Option 1: Double-click the startup script**
```
START-TASK-TRACKER.ps1
```

**Option 2: Run from PowerShell**
```powershell
cd c:\neldevsrc\personal
.\START-TASK-TRACKER.ps1
```

The script will:
1. ✅ Check if Docker is running
2. ✅ Start the database and API (Docker)
3. ✅ Start the Angular frontend
4. ✅ Open your browser to http://localhost:4200

### Stopping the Application

**Option 1: Double-click the stop script**
```
STOP-TASK-TRACKER.ps1
```

**Option 2: Run from PowerShell**
```powershell
.\STOP-TASK-TRACKER.ps1
```

## 📦 What's Running

| Component | URL | Description |
|-----------|-----|-------------|
| **Frontend** | http://localhost:4200 | Angular application |
| **API** | http://localhost:5000 | .NET Core Web API |
| **Database** | localhost:5432 | PostgreSQL database |

## 💾 Data Storage

Your data is stored in a Docker volume named `personal_postgres-data`.

**This means:**
- ✅ Data persists after stopping the app
- ✅ Data persists after restarting your computer
- ✅ Data is only deleted if you run `docker-compose down -v`

## 🛠️ Development

### Manual Start (for development)

1. **Start Backend:**
   ```bash
   docker-compose up -d
   ```

2. **Start Frontend:**
   ```bash
   cd task-tracker-frontend
   npm start
   ```

### View Logs

```bash
# All logs
docker-compose logs -f

# API logs only
docker-compose logs -f api

# Database logs only
docker-compose logs -f postgres
```

### Restart After Code Changes

**Frontend:** Just save your files - auto-refresh is enabled

**Backend:**
```bash
docker-compose up -d --build api
```

## 📁 Project Structure

```
c:\neldevsrc\personal\
├── START-TASK-TRACKER.ps1      # Quick start script
├── STOP-TASK-TRACKER.ps1       # Stop script
├── docker-compose.yml           # Docker configuration
├── task-tracker-frontend/       # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # UI components
│   │   │   ├── services/       # API services
│   │   │   └── models/         # Data models
│   └── package.json
└── task-tracker-backend/        # .NET Core API
    ├── Controllers/             # API endpoints
    ├── Models/                  # Database models
    ├── Data/                    # DbContext
    └── Migrations/              # Database migrations
```

## 🎯 Features

### Calendar View
- ✅ Day, Week, and 5-day views
- ✅ 15-minute time block precision
- ✅ Drag to create time blocks
- ✅ Click to edit time blocks
- ✅ Date picker with quick navigation

### Timer
- ✅ Start/pause/stop timer
- ✅ Automatically creates time blocks
- ✅ Real-time updates

### To-Do List
- ✅ Add tasks
- ✅ Mark as complete
- ✅ Delete tasks
- ✅ Separate active and completed sections

## 🔧 Troubleshooting

### Port Already in Use

If you get a port conflict:

```powershell
# Find process using port 4200
netstat -ano | findstr :4200

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Docker Not Starting

1. Make sure Docker Desktop is running
2. Check Docker settings → Resources → ensure WSL integration is enabled
3. Restart Docker Desktop

### Database Connection Issues

```bash
# Restart database
docker-compose restart postgres

# Check database logs
docker-compose logs postgres
```

### Frontend Not Loading

1. Check if port 4200 is available
2. Clear browser cache
3. Try incognito/private mode
4. Check browser console for errors (F12)

## 📊 Database Access

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

### Backup Your Data

```bash
# Create backup
docker exec task-tracker-db pg_dump -U taskuser tasktracker > backup.sql

# Restore backup
Get-Content backup.sql | docker exec -i task-tracker-db psql -U taskuser -d tasktracker
```

## 🎨 Tech Stack

**Frontend:**
- Angular 19
- TypeScript
- SCSS
- RxJS
- Angular CDK (Drag & Drop)

**Backend:**
- .NET 9.0
- Entity Framework Core
- PostgreSQL
- Docker

## 📝 Notes

- The application uses **hot reload** - changes to code automatically refresh
- All times are stored in **UTC** in the database
- The calendar shows times from **7:00 AM to 10:00 PM**
- Time blocks have **15-minute precision**

## 🆘 Need Help?

1. Check the console logs (F12 in browser)
2. Check Docker logs: `docker-compose logs -f`
3. Verify all services are running: `docker ps`
4. Restart everything: `.\STOP-TASK-TRACKER.ps1` then `.\START-TASK-TRACKER.ps1`

---

**Happy tracking! 📊✨**
