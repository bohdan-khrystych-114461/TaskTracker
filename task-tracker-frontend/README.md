# Task Tracker Web App - Phase 1

A modern task tracking application built with Angular and .NET Core, featuring a calendar-based time tracker, timer, and to-do list.

## Tech Stack

- **Frontend**: Angular 19 with TypeScript
- **Backend**: .NET 9 (ASP.NET Core Web API)
- **Styling**: SCSS with dark theme
- **Drag & Drop**: Angular CDK
- **State Management**: RxJS
- **Storage**: LocalStorage (Phase 1)

## Features (Phase 1)

### 1. Calendar View
- **Weekly calendar grid** displaying 7 days with hourly time slots (00:00 - 23:59)
- **Drag to create time blocks**: Click and drag across time slots to create work sessions
- **Single-click creation**: Click any time slot to create a 15-minute block
- **Visual time blocks**: Each block shows task name and duration
- **Delete blocks**: Hover over blocks to reveal delete button
- **Week navigation**: Navigate between weeks with previous/next buttons
- **Today button**: Quickly jump to current week
- **Today highlighting**: Current day is highlighted with purple accent

### 2. Timer (Top Bar)
- **Task input**: "What are you working on?" input field
- **Start timer**: Press Enter or click play button to start tracking
- **Live elapsed time**: Real-time display in HH:MM:SS format
- **Pause/Resume**: Pause and resume timer as needed
- **Stop and save**: Stopping the timer automatically creates a time block on the calendar
- **Visual controls**: Color-coded buttons (purple=start, orange=pause, red=stop)

### 3. To-Do List (Right Sidebar)
- **Add tasks**: Quick input field to add new to-do items
- **Check off tasks**: Mark tasks as complete with checkboxes
- **Active/Completed sections**: Organized view of pending and completed tasks
- **Delete tasks**: Remove tasks with delete button
- **Persistent storage**: Tasks saved to localStorage

### 4. UI/UX
- **Dark theme**: Modern dark interface matching Toggl Track style
- **Responsive layout**: Works on desktop and tablet devices
- **Smooth animations**: Transitions and hover effects
- **Color scheme**: Purple (#e040fb) as primary accent color
- **Clean typography**: Modern sans-serif fonts

## Project Structure

```
task-tracker-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── calendar/          # Weekly calendar component
│   │   │   ├── timer/             # Timer component
│   │   │   └── todo-list/         # To-do list component
│   │   ├── models/
│   │   │   └── time-block.model.ts # Data models
│   │   ├── services/
│   │   │   └── time-tracker.service.ts # Business logic
│   │   ├── app.component.*        # Main app component
│   │   └── app.config.ts          # App configuration
│   ├── styles.scss                # Global styles
│   └── index.html
└── package.json

task-tracker-backend/
├── Program.cs                     # API entry point
├── TaskTrackerAPI.csproj
└── (Controllers and models to be added in Phase 2)
```

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher
- .NET 9 SDK
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. **Clone or navigate to the project directory**

2. **Install frontend dependencies**
```bash
cd task-tracker-frontend
npm install
```

3. **Run the Angular development server**
```bash
ng serve
```

4. **Open your browser**
Navigate to `http://localhost:4200`

### Backend Setup (For Phase 2)
```bash
cd task-tracker-backend
dotnet restore
dotnet run
```

## Usage Guide

### Creating Time Blocks

**Method 1: Drag and Drop**
1. Click and hold on a time slot in the calendar
2. Drag down to select multiple hours
3. Release the mouse
4. Enter a task name in the prompt
5. The time block appears on the calendar

**Method 2: Single Click**
1. Click any time slot
2. Enter a task name
3. A 15-minute block is created

### Using the Timer

1. Type your task name in the "What are you working on?" field
2. Press Enter or click the play button (purple)
3. Timer starts counting
4. Click pause (orange) to pause, or stop (red) to finish
5. When stopped, the time is automatically added to today's calendar

### Managing To-Do Items

1. Type a task in the "Add a new task..." field
2. Press Enter or click the + button
3. Check the checkbox to mark complete
4. Click the X button to delete

## Design Principles

This project follows **SOLID**, **KISS**, and **DRY** principles:

- **Single Responsibility**: Each component has one clear purpose
- **Open/Closed**: Services are extensible without modification
- **Liskov Substitution**: Components can be replaced with implementations
- **Interface Segregation**: Clean, focused interfaces
- **Dependency Inversion**: Components depend on abstractions (services)
- **Keep It Simple**: Straightforward, readable code
- **Don't Repeat Yourself**: Reusable services and components

## Data Storage (Phase 1)

Currently using **localStorage** for client-side persistence:
- Time blocks stored as JSON array
- To-do items stored as JSON array
- Timer state maintained in memory
- Data persists across browser sessions

## Upcoming Features (Phase 2+)

- [ ] Backend API integration with .NET Core
- [ ] Database persistence (SQL Server / PostgreSQL)
- [ ] User authentication and authorization
- [ ] List view and Timesheet view
- [ ] Weekly/monthly time reports
- [ ] Project categorization and tagging
- [ ] Time block editing (resize, move, edit details)
- [ ] Export functionality (CSV, PDF)
- [ ] Multi-user support
- [ ] Team collaboration features

## Development Commands

```bash
# Start development server
ng serve

# Build for production
ng build --configuration production

# Run linting
ng lint

# Generate new component
ng generate component components/component-name

# Run tests (when added)
ng test
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Color Palette

- **Background**: #1e1e1e
- **Surface**: #2a2a2a
- **Border**: #3a3a3a
- **Text Primary**: #e0e0e0
- **Text Secondary**: #888
- **Primary Accent**: #e040fb (Purple)
- **Success**: #4caf50
- **Warning**: #ff9800
- **Error**: #f44336

## Contributing

This is a personal project. For Phase 2, we'll add:
- API endpoints documentation
- Database schema
- Authentication flow
- Deployment instructions

## License

Private project - All rights reserved

## Author

Built following modern web development best practices with Angular and .NET Core.
