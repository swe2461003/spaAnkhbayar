@echo off
cd /d "%~dp0"
echo Open http://127.0.0.1:4175
node tools/serve.mjs
pause
