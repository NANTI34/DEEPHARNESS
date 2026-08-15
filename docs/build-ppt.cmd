@echo off
REM DEEPHARNESS PPT 一键重建脚本
REM 用法: 双击运行,或 cmd /c build-ppt.cmd
REM 产物: ..\DEEPHARNESS-介绍.pptx(首次运行会自动安装 pptxgenjs)
cd /d "%~dp0ppt-tools"
if not exist node_modules\pptxgenjs (
  echo [1/3] Installing pptxgenjs ...
  call npm install pptxgenjs --no-audit --no-fund
  if errorlevel 1 exit /b 1
)
echo [2/3] Generating deck ...
node make-ppt.js
if errorlevel 1 exit /b 1
echo [3/3] Fixing pptxgenjs ghost slideMaster overrides ...
python fix-ghost.py ..\DEEPHARNESS-介绍.pptx ..\DEEPHARNESS-介绍.pptx.tmp
move /y ..\DEEPHARNESS-介绍.pptx.tmp ..\DEEPHARNESS-介绍.pptx >nul
echo Done: ..\DEEPHARNESS-介绍.pptx
