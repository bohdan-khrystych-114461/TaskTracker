# Create Desktop Shortcut for Task Tracker
# This script creates a desktop shortcut that launches the Task Tracker

$shell = New-Object -ComObject WScript.Shell
$desktopPath = $shell.SpecialFolders("Desktop")
$shortcutPath = Join-Path $desktopPath "Task Tracker.lnk"

# Get the current directory where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$batchFilePath = Join-Path $scriptDir "TaskTracker-Launcher.bat"

# Create the shortcut
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $batchFilePath
$shortcut.WorkingDirectory = $scriptDir
$shortcut.Description = "Launch Task Tracker Application"
$shortcut.IconLocation = "shell32.dll,25"  # Use a generic application icon
$shortcut.Save()

Write-Host "Desktop shortcut created: $shortcutPath" -ForegroundColor Green
Write-Host "You can now double-click the 'Task Tracker' icon on your desktop to start the application." -ForegroundColor Cyan
