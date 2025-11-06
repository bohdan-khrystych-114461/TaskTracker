# Task Tracker - Quick Start Script
# Run this script to start the entire application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   TASK TRACKER - QUICK START" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "[1/3] Checking Docker..." -ForegroundColor Yellow
$dockerRunning = $false
$maxAttempts = 10
$attempt = 0

while ($attempt -lt $maxAttempts -and -not $dockerRunning) {
    $attempt++
    Write-Host "Checking Docker status (attempt $attempt of $maxAttempts)..." -ForegroundColor Yellow
    
    try {
        $dockerTest = docker ps 2>$null
        if ($LASTEXITCODE -eq 0) {
            $dockerRunning = $true
            Write-Host "✓ Docker is running" -ForegroundColor Green
        } else {
            if ($attempt -eq 1) {
                Write-Host "ERROR: Docker is not running!" -ForegroundColor Red
                Write-Host "Please start Docker Desktop and press Enter to check again..." -ForegroundColor Yellow
                Write-Host "Or press Ctrl+C to exit" -ForegroundColor Gray
            } else {
                Write-Host "Docker is still not running. Please start Docker Desktop and press Enter to try again..." -ForegroundColor Yellow
            }
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
    } catch {
        if ($attempt -eq 1) {
            Write-Host "ERROR: Docker is not running!" -ForegroundColor Red
            Write-Host "Please start Docker Desktop and press Enter to check again..." -ForegroundColor Yellow
            Write-Host "Or press Ctrl+C to exit" -ForegroundColor Gray
        } else {
            Write-Host "Docker is still not running. Please start Docker Desktop and press Enter to try again..." -ForegroundColor Yellow
        }
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

if (-not $dockerRunning) {
    Write-Host "ERROR: Could not start Docker after $maxAttempts attempts. Please check your Docker installation." -ForegroundColor Red
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}
Write-Host ""

# Start Docker containers (database + API)
Write-Host "[2/3] Starting Backend (Database + API)..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to start Docker containers!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "✓ Backend started successfully" -ForegroundColor Green
Write-Host "  - Database: localhost:5432" -ForegroundColor Gray
Write-Host "  - API: http://localhost:5001" -ForegroundColor Gray
Write-Host ""

# Wait for API to be ready
Write-Host "Waiting for API to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start Angular frontend
Write-Host "[3/3] Starting Frontend (Angular)..." -ForegroundColor Yellow
Set-Location task-tracker-frontend

# Start Angular in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

Write-Host "✓ Frontend is starting..." -ForegroundColor Green
Write-Host ""

# Wait a moment for Angular to start
Start-Sleep -Seconds 5

Write-Host "========================================" -ForegroundColor Green
Write-Host "   APPLICATION STARTED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your application is now running:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend:  http://localhost:4200" -ForegroundColor White
Write-Host "  API:       http://localhost:5001" -ForegroundColor White
Write-Host "  Database:  localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "The browser should open automatically." -ForegroundColor Yellow
Write-Host "If not, open: http://localhost:4200" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop the application:" -ForegroundColor Cyan
Write-Host "  1. Close the Angular dev server window" -ForegroundColor White
Write-Host "  2. Run: docker-compose down" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
