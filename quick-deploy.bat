@echo off
REM ⚡ QUICK DEPLOY SCRIPT - СУПЕР БЫСТРЫЙ ДЕПЛОЙ
REM Использование: double-click this file or: quick-deploy.bat "Your message"

setlocal enabledelayedexpansion

echo.
echo ⏱️   QUICK DEPLOY на Railway...
echo.

REM SECURITY CHECK: Проверяем что не отправляем секреты
echo 🔐 Проверяю безопасность...

REM Проверяем .env файлы
if exist ".env" (
    echo ❌ ОПАСНО! Найден .env файл - это секреты!
    echo    Не добавляю в коммит
    git reset HEAD .env >nul 2>&1
    goto skip_env
)

:skip_env

REM Указанные файлы не должны быть в паспортном доступе
for %%f in (.env .env.local *.key *.secret auth.json credentials.json) do (
    git diff --cached --name-only | findstr /i "%%f" >nul
    if not errorlevel 1 (
        echo ❌ ОПАСНО! %%f не должен быть в гите!
        git reset HEAD %%f >nul 2>&1
    )
)

echo ✅ Безопасность OK

REM Если передан параметр - используем его, иначе используем время
if "%1"=="" (
    for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set message=Update %%a:%%b)
) else (
    set message=%*
)

echo.
echo 📦 Adding files...
git add -A

echo 💾 Committing: %message%
git commit -m "%message%"

if errorlevel 1 (
    echo ✅ No changes to commit!
    goto end
)

echo ⬆️  Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo ❌ Push failed!
    pause
    exit /b 1
)

echo.
echo ✅ SUCCESS! Railway is deploying...
echo 🌐 Site will update in ~1-2 minutes
echo 🔗 https://evrocontayner.kz
echo.

:end
