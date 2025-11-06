# Task Tracker - Docker Start Script

Write-Host "🐳 Starting Task Tracker with Docker..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker is running" -ForegroundColor Green

# Stop existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>$null

# Start containers
Write-Host "🚀 Starting containers..." -ForegroundColor Cyan
docker-compose up -d

# Wait for database to be healthy
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
while ($attempt -lt $maxAttempts) {
    $health = docker inspect --format='{{.State.Health.Status}}' task-tracker-db 2>$null
    if ($health -eq "healthy") {
        Write-Host "✅ Database is ready!" -ForegroundColor Green
        break
    }
    $attempt++
    Write-Host "   Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
    Start-Sleep -Seconds 2
}

if ($attempt -eq $maxAttempts) {
    Write-Host "❌ Database failed to start" -ForegroundColor Red
    docker-compose logs postgres
    exit 1
}

# Check API
Write-Host "🔍 Checking API..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/api/timeblocks" -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ API is running!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  API might still be starting..." -ForegroundColor Yellow
    Write-Host "   Check logs with: docker-compose logs api" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Services:" -ForegroundColor Cyan
Write-Host "   Database: localhost:5432" -ForegroundColor White
Write-Host "   API:      http://localhost:5001" -ForegroundColor White
Write-Host ""
Write-Host "📝 Useful Commands:" -ForegroundColor Cyan
Write-Host "   View logs:    docker-compose logs -f" -ForegroundColor White
Write-Host "   Stop:         docker-compose down" -ForegroundColor White
Write-Host "   Restart API:  docker-compose restart api" -ForegroundColor White
Write-Host ""
Write-Host "Next: Start Angular frontend with npm start in task-tracker-frontend folder" -ForegroundColor Yellow
