# Security check script for Windows — поиск чувствительных данных в репозитории

Write-Host "🔍 Checking for sensitive data in repository..." -ForegroundColor Cyan
Write-Host ""

$ISSUES_FOUND = 0

# Check 1: .env files
Write-Host "Checking for .env files..." -ForegroundColor Yellow
$envFiles = & git ls-files | Select-String -Pattern '\.env($|\.local)' -ErrorAction SilentlyContinue
if ($envFiles) {
  Write-Host "❌ ERROR: .env files found in git index!" -ForegroundColor Red
  Write-Host $envFiles
  $ISSUES_FOUND++
} else {
  Write-Host "✅ No .env files in git" -ForegroundColor Green
}
Write-Host ""

# Check 2: .gitignore validation
Write-Host "Checking .gitignore for .env protection..." -ForegroundColor Yellow
$gitignoreContent = Get-Content .gitignore -Raw
if ($gitignoreContent -match '\.env') {
  Write-Host "✅ .env protected in .gitignore" -ForegroundColor Green
} else {
  Write-Host "❌ ERROR: .env NOT in .gitignore" -ForegroundColor Red
  $ISSUES_FOUND++
}
Write-Host ""

# Check 3: Search for common secret patterns in recent commits
Write-Host "Checking for common secret patterns in recent files..." -ForegroundColor Yellow
$recentFiles = & git diff HEAD~5...HEAD --name-only 2>$null | Select-Object -First 20
$patternFound = $false
$recentFiles | ForEach-Object {
  $fileContent = & git show "HEAD:$_" 2>$null
  if ($fileContent -match '(password|token|secret|api.key|aws_secret)' -and $_ -notmatch '\.example') {
    Write-Host "⚠️  Pattern found in $_" -ForegroundColor Yellow
    $patternFound = $true
  }
}
if (-not $patternFound) {
  Write-Host "✅ No obvious secret patterns in recent commits" -ForegroundColor Green
}
Write-Host ""

# Summary
Write-Host "======================================" -ForegroundColor Cyan
if ($ISSUES_FOUND -eq 0) {
  Write-Host "✅ Security check passed!" -ForegroundColor Green
  exit 0
} else {
  Write-Host "❌ Security issues found: $ISSUES_FOUND" -ForegroundColor Red
  Write-Host "Please review and fix before pushing" -ForegroundColor Yellow
  exit 1
}
