@echo off
setlocal

REM Simple Docker Manager for Auth Server

echo ==========================================
echo        Auth Server Docker Manager
echo ==========================================

if "%1"=="build" (
    echo Building Auth Server Docker image...
    docker build -t auth-server .
    echo Build completed!
) else if "%1"=="start" (
    echo Starting Auth Server...
    docker-compose up -d
    echo.
    echo ✅ Auth Server started successfully!
    echo 📱 Application: http://localhost:5000
    echo.
    echo Use 'docker-manager.bat logs' to view logs
) else if "%1"=="stop" (
    echo Stopping Auth Server...
    docker-compose down
    echo ✅ Auth Server stopped
) else if "%1"=="logs" (
    echo Showing logs (Press Ctrl+C to exit)...
    docker-compose logs -f auth-server
) else if "%1"=="status" (
    echo Container Status:
    docker-compose ps
) else (
    echo Usage: %0 {build^|start^|stop^|logs^|status}
    echo.
    echo Commands:
    echo   build   - Build Docker image
    echo   start   - Start Auth Server
    echo   stop    - Stop Auth Server  
    echo   logs    - View logs
    echo   status  - Check status
    echo.
    echo Examples:
    echo   %0 build
    echo   %0 start
    echo   %0 logs
)