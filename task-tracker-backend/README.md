# Task Tracker API - Backend

ASP.NET Core Web API for the Task Tracker application.

## Tech Stack

- **.NET 9** (ASP.NET Core Web API)
- **C#** with SOLID principles
- **Entity Framework Core** (to be added in Phase 2)
- **SQL Server / PostgreSQL** (to be configured in Phase 2)

## Current Status

**Phase 1**: Frontend-only implementation with localStorage
**Phase 2**: Will include full backend API integration

## Planned API Endpoints (Phase 2)

### Time Blocks
- `GET /api/timeblocks` - Get all time blocks for a user
- `GET /api/timeblocks/{id}` - Get specific time block
- `POST /api/timeblocks` - Create new time block
- `PUT /api/timeblocks/{id}` - Update time block
- `DELETE /api/timeblocks/{id}` - Delete time block
- `GET /api/timeblocks/week/{date}` - Get time blocks for specific week

### To-Do Items
- `GET /api/todos` - Get all to-do items
- `GET /api/todos/{id}` - Get specific to-do
- `POST /api/todos` - Create new to-do
- `PUT /api/todos/{id}` - Update to-do
- `DELETE /api/todos/{id}` - Delete to-do
- `PATCH /api/todos/{id}/toggle` - Toggle completion status

### Timer Sessions
- `POST /api/timer/start` - Start timer session
- `POST /api/timer/stop` - Stop timer and create time block
- `GET /api/timer/current` - Get current running timer

### Reports (Future)
- `GET /api/reports/weekly` - Weekly time summary
- `GET /api/reports/monthly` - Monthly time summary
- `GET /api/reports/export` - Export data (CSV/PDF)

## Database Schema (Planned)

### TimeBlocks Table
```sql
CREATE TABLE TimeBlocks (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    TaskName NVARCHAR(255) NOT NULL,
    StartTime DATETIME2 NOT NULL,
    EndTime DATETIME2 NOT NULL,
    Duration INT NOT NULL, -- in minutes
    Date DATE NOT NULL,
    ProjectId UNIQUEIDENTIFIER NULL,
    CreatedAt DATETIME2 NOT NULL,
    UpdatedAt DATETIME2 NOT NULL
);
```

### TodoItems Table
```sql
CREATE TABLE TodoItems (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(500) NOT NULL,
    Completed BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL,
    CompletedAt DATETIME2 NULL
);
```

### Users Table
```sql
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    CreatedAt DATETIME2 NOT NULL
);
```

## Running the API

```bash
# Restore dependencies
dotnet restore

# Run the application
dotnet run

# Run with watch (auto-reload)
dotnet watch run

# Build for production
dotnet build --configuration Release
```

## Configuration

Update `appsettings.json` for database connection:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TaskTracker;Trusted_Connection=True;"
  },
  "Jwt": {
    "Key": "your-secret-key-here",
    "Issuer": "TaskTrackerAPI",
    "Audience": "TaskTrackerClient"
  }
}
```

## CORS Configuration

The API will be configured to allow requests from the Angular frontend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy => policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});
```

## Authentication (Phase 2)

- JWT-based authentication
- Secure password hashing with BCrypt
- Token refresh mechanism
- Role-based authorization

## Project Structure (Phase 2)

```
task-tracker-backend/
├── Controllers/
│   ├── TimeBlocksController.cs
│   ├── TodosController.cs
│   ├── TimerController.cs
│   └── AuthController.cs
├── Models/
│   ├── TimeBlock.cs
│   ├── TodoItem.cs
│   └── User.cs
├── DTOs/
│   ├── TimeBlockDto.cs
│   ├── TodoItemDto.cs
│   └── UserDto.cs
├── Services/
│   ├── ITimeBlockService.cs
│   ├── TimeBlockService.cs
│   ├── ITodoService.cs
│   └── TodoService.cs
├── Data/
│   └── ApplicationDbContext.cs
├── Repositories/
│   ├── IRepository.cs
│   └── Repository.cs
├── Program.cs
└── appsettings.json
```

## Development Roadmap

### Phase 2: Backend Integration
- [ ] Set up Entity Framework Core
- [ ] Create database models
- [ ] Implement repositories
- [ ] Create API controllers
- [ ] Add JWT authentication
- [ ] Configure CORS
- [ ] Add input validation
- [ ] Implement error handling

### Phase 3: Advanced Features
- [ ] Add project categorization
- [ ] Implement reporting endpoints
- [ ] Add data export functionality
- [ ] Create admin dashboard APIs
- [ ] Add team collaboration features

## Testing

```bash
# Run unit tests (to be added)
dotnet test

# Run with coverage
dotnet test /p:CollectCoverage=true
```

## Deployment

Instructions for deployment will be added in Phase 2, including:
- Azure App Service deployment
- Docker containerization
- CI/CD pipeline setup
- Environment configuration

## License

Private project - All rights reserved
