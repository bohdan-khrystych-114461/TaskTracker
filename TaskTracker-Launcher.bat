@echo off
REM Task Tracker Launcher
REM This batch file launches the PowerShell script with proper execution policy

powershell.exe -ExecutionPolicy Bypass -File "%~dp0START-TASK-TRACKER.ps1"
