#Requires -Version 5.1
<#
.SYNOPSIS
    DEEPHARNESS 一键安装:安装依赖 + 创建桌面快捷方式
.DESCRIPTION
    1. 检查 Node.js
    2. 在 app/ 目录执行 npm install 安装 DeepSeek Harness 依赖
    3. 在桌面创建快捷方式: DEEPHARNESS(默认浏览器) / DEEPHARNESS App(Edge 应用模式)
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\install.ps1
    powershell -ExecutionPolicy Bypass -File .\install.ps1 -SkipNpmInstall
#>
param(
    [switch]$SkipNpmInstall
)

$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot

Write-Host '============================================' -ForegroundColor Cyan
Write-Host '  DEEPHARNESS 安装 (DeepSeek Harness)' -ForegroundColor Cyan
Write-Host '============================================' -ForegroundColor Cyan

# 1. Node.js 检查
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host '[错误] 未找到 Node.js,请先安装 Node.js 20+ : https://nodejs.org' -ForegroundColor Red
    Start-Process 'https://nodejs.org'
    exit 1
}
$nodeVer = (& node --version) 2>$null
Write-Host "[1/3] Node.js: $nodeVer @ $($node.Source)" -ForegroundColor Green

# 2. 安装依赖
$appDir = Join-Path $Root 'app'
$nm = Join-Path $appDir 'node_modules'
if ($SkipNpmInstall -or (Test-Path $nm)) {
    Write-Host '[2/3] 跳过 npm install(node_modules 已存在)' -ForegroundColor Yellow
} else {
    Write-Host '[2/3] 安装应用依赖(npm install,首次约 1-3 分钟)...' -ForegroundColor Yellow
    Push-Location $appDir
    try {
        npm install --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { throw "npm install 失败(退出码 $LASTEXITCODE)" }
    } finally { Pop-Location }
    Write-Host '      依赖安装完成' -ForegroundColor Green
}

# 3. 创建桌面快捷方式
Write-Host '[3/3] 创建桌面快捷方式...' -ForegroundColor Yellow
$desktop = [Environment]::GetFolderPath('Desktop')
$icon = Join-Path $Root 'launcher\assets\dsh.ico'
$vbs  = Join-Path $Root 'launcher\start-hidden.vbs'
$ws = New-Object -ComObject WScript.Shell

# 3a. 主快捷方式:默认浏览器
$lnk = $ws.CreateShortcut((Join-Path $desktop 'DEEPHARNESS.lnk'))
$lnk.TargetPath       = "$env:WINDIR\System32\wscript.exe"
$lnk.Arguments        = '"' + $vbs + '"'
$lnk.WorkingDirectory = $Root
$lnk.IconLocation     = $icon + ',0'
$lnk.Description      = 'DeepSeek Harness - 一键打开 AI 工作台'
$lnk.Save()
Write-Host '      已创建: DEEPHARNESS.lnk(默认浏览器打开)' -ForegroundColor Green

# 3b. Edge 应用模式快捷方式(独立窗口,更像原生应用)
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
if (Test-Path $edge) {
    $elnk = $ws.CreateShortcut((Join-Path $desktop 'DEEPHARNESS App.lnk'))
    $elnk.TargetPath       = $edge
    $elnk.Arguments        = '--app=http://127.0.0.1:3080'
    $elnk.WorkingDirectory = $Root
    $elnk.IconLocation     = $icon + ',0'
    $elnk.Description      = 'DEEPHARNESS 应用模式窗口 (Edge)'
    $elnk.Save()
    Write-Host '      已创建: DEEPHARNESS App.lnk(Edge 应用模式窗口)' -ForegroundColor Green
} else {
    Write-Host '      (未检测到 Edge,跳过应用模式快捷方式)' -ForegroundColor DarkGray
}

Write-Host '============================================' -ForegroundColor Cyan
Write-Host '  安装完成!双击桌面 "DEEPHARNESS" 即可打开。' -ForegroundColor Green
Write-Host '============================================' -ForegroundColor Cyan
