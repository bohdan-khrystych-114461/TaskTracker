# 🖥️ Create Desktop Shortcut

Follow these steps to create a desktop shortcut for easy access:

## Method 1: Manual Shortcut Creation

1. **Right-click on your Desktop**
2. Select **New → Shortcut**
3. **Enter this location:**
   ```
   powershell.exe -ExecutionPolicy Bypass -File "C:\neldevsrc\personal\START-TASK-TRACKER.ps1"
   ```
4. **Click Next**
5. **Name it:** `Task Tracker`
6. **Click Finish**

### Optional: Add an Icon
1. Right-click the shortcut → **Properties**
2. Click **Change Icon**
3. Browse to: `C:\Windows\System32\shell32.dll`
4. Choose an icon (calendar or clock icon recommended)
5. Click **OK**

## Method 2: Copy Existing File

1. Navigate to `C:\neldevsrc\personal`
2. Right-click `START-TASK-TRACKER.ps1`
3. Select **Send to → Desktop (create shortcut)**
4. Rename the shortcut to `Task Tracker`

## 🚀 Using the Shortcut

**Double-click the shortcut** to start the application!

The script will:
- ✅ Check if Docker is running
- ✅ Start the backend (database + API)
- ✅ Start the frontend (Angular)
- ✅ Open your browser automatically

## 📌 Pin to Taskbar

1. Create the desktop shortcut (above)
2. Right-click the shortcut
3. Select **Pin to taskbar**

Now you can start Task Tracker with one click from your taskbar!

## 🔒 PowerShell Execution Policy

If you get an error about execution policy:

1. Open PowerShell **as Administrator**
2. Run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Type `Y` and press Enter

This allows you to run local PowerShell scripts.

## ⚡ Auto-Start on System Boot (Optional)

To start Task Tracker automatically when Windows starts:

1. Press `Win + R`
2. Type: `shell:startup`
3. Press Enter
4. Copy your `Task Tracker` shortcut into this folder

**Note:** Make sure Docker Desktop is also set to start on boot:
- Open Docker Desktop settings
- Enable "Start Docker Desktop when you log in"

---

**You're all set! 🎉**
