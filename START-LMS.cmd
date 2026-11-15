@echo off
cd /d "%~dp0"
echo CON354 LMS
echo Open http://127.0.0.1:4173 in your browser.
echo Keep this window open while using the application.
node tools/serve.mjs
pause
