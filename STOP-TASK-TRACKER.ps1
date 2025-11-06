# Task Tracker - Stop Script
# Run this script to stop the entire application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   TASK TRACKER - STOP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop Angular dev server
Write-Host "[1/2] Stopping Frontend..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend stopped" -ForegroundColor Green
} else {
    Write-Host "  Frontend was not running" -ForegroundColor Gray
}
Write-Host ""

# Stop Docker containers
Write-Host "[2/2] Stopping Backend..." -ForegroundColor Yellow
docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend stopped" -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to stop Docker containers" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "   APPLICATION STOPPED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your data is safely stored in Docker volume." -ForegroundColor Cyan
Write-Host "Run START-TASK-TRACKER.ps1 to start again." -ForegroundColor Yellow
Write-Host ""
pause
