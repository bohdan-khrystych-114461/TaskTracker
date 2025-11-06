# Task Tracker - Quick Start Guide

## 🚀 Project Overview

A modern task tracking web application with calendar-based time tracking, similar to Toggl Track.

**Status**: Phase 1 Complete ✅

## 📁 Project Structure

```
personal/
├── task-tracker-frontend/    # Angular 19 application
└── task-tracker-backend/      # .NET 9 Web API (Phase 2)
```

## ✨ Features Implemented

### ✅ Calendar View
- Weekly calendar grid with 24-hour time slots
- Drag and drop to create time blocks
- Single-click to create 15-minute blocks
- Visual time blocks with task names and durations
- Week navigation (previous/next/today)
- Current day highlighting

### ✅ Timer Component
- Task input field in top bar
- Start/pause/resume/stop controls
- Real-time elapsed time display (HH:MM:SS)
- Auto-save to calendar when stopped
- Color-coded control buttons

### ✅ To-Do List
- Add new tasks
- Check off completed tasks
- Delete tasks
- Organized active/completed sections
- Persistent storage

### ✅ Dark Theme UI
- Modern dark interface
- Purple accent color (#e040fb)
- Smooth animations and transitions
- Responsive layout

## 🎯 How to Run

### Frontend (Angular)

```bash
cd task-tracker-frontend
npm install          # First time only
ng serve            # Start dev server
```

Open browser to: **http://localhost:4200**

### Backend (Phase 2)

```bash
cd task-tracker-backend
dotnet restore      # First time only
dotnet run         # Start API server
```

## 📖 Usage Instructions

### Creating Time Blocks

**Method 1: Drag to Create**
1. Click and hold on any time slot
2. Drag down to select multiple hours
3. Release mouse
4. Enter task name in prompt
5. Block appears on calendar

**Method 2: Quick 15-min Block**
1. Single-click any time slot
2. Enter task name
3. 15-minute block created instantly

### Using the Timer

1. Type task name: "What are you working on?"
2. Press Enter or click ▶️ (purple play button)
3. Timer starts counting
4. Click ⏸️ (orange) to pause
5. Click ⏹️ (red) to stop and save to calendar

### Managing To-Dos

1. Type in "Add a new task..." field
2. Press Enter or click ➕
3. Check ☑️ to mark complete
4. Click ✖️ to delete

## 🎨 Design System

### Colors
- **Primary**: #e040fb (Purple)
- **Background**: #1e1e1e (Dark)
- **Surface**: #2a2a2a
- **Text**: #e0e0e0
- **Border**: #3a3a3a

### Components
- Timer: Top header bar
- Calendar: Main center area
- To-Do List: Right sidebar (320px)

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Angular 19
- **Language**: TypeScript
- **Styling**: SCSS
- **Drag & Drop**: Angular CDK
- **State**: RxJS BehaviorSubjects
- **Storage**: LocalStorage (Phase 1)

### Backend Stack (Phase 2)
- **Framework**: ASP.NET Core 9
- **Language**: C#
- **Database**: TBD (SQL Server / PostgreSQL)
- **Auth**: JWT tokens

## 📋 Development Principles

Following **SOLID**, **KISS**, and **DRY**:

- ✅ Single Responsibility: Each component has one purpose
- ✅ Service-based architecture
- ✅ Reusable components
- ✅ Clean, readable code
- ✅ Type-safe TypeScript

## 🔄 Data Flow

```
User Action → Component → Service → BehaviorSubject → LocalStorage
                ↓
            Observable → Component → UI Update
```

## 📦 Key Files

### Frontend
```
src/app/
├── components/
│   ├── timer/              # Timer component
│   ├── calendar/           # Calendar grid
│   └── todo-list/          # To-do sidebar
├── services/
│   └── time-tracker.service.ts  # Business logic
├── models/
│   └── time-block.model.ts      # Data models
└── app.component.*         # Main layout
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4200
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### Angular CLI Not Found
```bash
npm install -g @angular/cli
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📈 Next Steps (Phase 2)

- [ ] Backend API implementation
- [ ] Database integration
- [ ] User authentication
- [ ] List view and Timesheet view
- [ ] Weekly/monthly reports
- [ ] Project categorization
- [ ] Time block editing (resize/move)
- [ ] Export functionality

## 🎓 Learning Resources

- Angular Docs: https://angular.dev
- Angular CDK: https://material.angular.io/cdk
- RxJS: https://rxjs.dev
- .NET Core: https://learn.microsoft.com/aspnet/core

## 📝 Notes

- **Phase 1**: Frontend-only with localStorage
- **Phase 2**: Full-stack with backend API
- **Phase 3**: Advanced features (reports, teams, etc.)

## 🎉 Success Criteria

Phase 1 is complete when:
- ✅ Calendar displays weekly view
- ✅ Drag and drop creates time blocks
- ✅ Timer works and saves to calendar
- ✅ To-do list is functional
- ✅ Dark theme matches design
- ✅ Data persists in localStorage

**Status: ALL CRITERIA MET! ✅**

---

**Project Started**: November 5, 2025
**Phase 1 Completed**: November 5, 2025
**Next Phase**: Backend API Integration
