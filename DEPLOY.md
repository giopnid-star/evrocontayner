# FAST DEPLOYMENT GUIDE

## QUICKEST WAY - Double-click deploy.bat

Simply double-click **deploy.bat** in your project folder. It will:
1. Open PowerShell
2. Run the deploy script
3. Show you the progress with [OK], [!] status indicators
4. Keep the window open so you can see results

## Using PowerShell Terminal

Open PowerShell in project folder and run:

```powershell
.\deploy.ps1 "Your message"
```

Or just run with timestamp:
```powershell
.\deploy.ps1
```

Examples:
```powershell
.\deploy.ps1 "Add remember me feature"
.\deploy.ps1 "Fix mobile responsive bug"
.\deploy.ps1 "Update database schema"
```

---

## What the Script Does (Automatically)

1. **Security Check** - Looks for `.env`, auth files, etc. and excludes them (protects secrets)
2. **Stage Files** - Adds all your changes to Git
3. **Create Commit** - Creates a commit with your message (or timestamp)
4. **Push to GitHub** - Sends to GitHub
5. **Railway Deploys** - Automatically detected and deployed (1-2 minutes)

The entire process takes about 30-60 seconds.

---

## Security Built-In

These sensitive files are automatically protected:
- `.env` files (database passwords, API keys)
- `*.key` files (encryption keys)
- `auth.json` and similar (credentials)

If any are found, the script will show:
```
[!] Found .env - excluding from commit
```

They WON'T be pushed to GitHub.

---

## Examples

Deploy finishing your work:
```powershell
.\deploy.ps1 "Finished remember me feature"
```

Quick fix during the day:
```powershell
.\deploy.ps1 "Quick bug fix"
```

Or just use generated timestamp:
```powershell
.\deploy.ps1
```

---

## Troubleshooting

**deploy.bat doesn't open:**
- Make sure PowerShell is installed (Windows 7+ has it)
- Try right-clicking → "Run with PowerShell"

**"Cannot load because scripts disabled":**
- Open PowerShell as Admin
- Run: `Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser`
- Try again

**"Repository not found":**
- Check Git is installed: `git --version`
- Check remote: `git remote -v`
- Should show: `origin https://github.com/giopnid-star/evrocontayner.git`
