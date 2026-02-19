@echo off
REM Easy deploy launcher - runs PowerShell script
setlocal enabledelayedexpansion
powershell -ExecutionPolicy Bypass -File "%~dp0deploy.ps1" %*
pause
