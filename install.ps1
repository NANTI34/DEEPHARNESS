#Requires -Version 5.1
<#
.SYNOPSIS
    DEEPHARNESS 一键安装:依赖 + 常驻插件 + 桌面快捷方式
.DESCRIPTION
    1. 检查 Node.js
    2. 在 app/ 目录执行 npm install 安装 DeepSeek Harness 依赖
    3. 在 desktop/ 目录执行 npm install 安装 Electron 桌面壳依赖
    4. 把「外观与费用」插件安装进 web profile(常驻自动加载,不再跟随进程)
    5. 在桌面创建快捷方式:
       DEEPHARNESS          -> Electron 原生应用窗口(真正的桌面 APP)
       DEEPHARNESS(浏览器)  -> 默认浏览器回退入口
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\install.ps1
    powershell -ExecutionPolicy Bypass -File .\install.ps1 -SkipNpmInstall
    powershell -ExecutionPolicy Bypass -File .\install.ps1 -Force
#>
param(
    [switch]$SkipNpmInstall,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot

Write-Host '============================================' -ForegroundColor Cyan
Write-Host '  DEEPHARNESS 安装 (DeepSeek Harness 桌面版)' -ForegroundColor Cyan
Write-Host '============================================' -ForegroundColor Cyan

# 1. Node.js 检查
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host '[错误] 未找到 Node.js,请先安装 Node.js 20+ : https://nodejs.org' -ForegroundColor Red
    Start-Process 'https://nodejs.org'
    exit 1
}
$nodeVer = (& node --version) 2>$null
Write-Host "[1/5] Node.js: $nodeVer @ $($node.Source)" -ForegroundColor Green

# 2. 安装应用依赖
$appDir = Join-Path $Root 'app'
$desktopDir = Join-Path $Root 'desktop'
$appNm = Join-Path $appDir 'node_modules'
if ($SkipNpmInstall -or ((Test-Path $appNm) -and -not $Force)) {
    Write-Host '[2/5] 跳过 app/ npm install(node_modules 已存在;-Force 可强制重装)' -ForegroundColor Yellow
} else {
    Write-Host '[2/5] 安装应用依赖 app/(npm install,首次约 1-3 分钟)...' -ForegroundColor Yellow
    Push-Location $appDir
    try {
        npm install --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { throw "npm install 失败(app,退出码 $LASTEXITCODE)" }
    } finally { Pop-Location }
    Write-Host '      app/ 依赖安装完成' -ForegroundColor Green
}

# 3. 安装桌面壳依赖(Electron;下载失败时自动切换国内镜像重试)
$desktopNm = Join-Path $desktopDir 'node_modules'
if ($SkipNpmInstall -or ((Test-Path (Join-Path $desktopDir 'node_modules\electron\dist\electron.exe')) -and -not $Force)) {
    Write-Host '[3/5] 跳过 desktop/ npm install(Electron 已就绪;-Force 可强制重装)' -ForegroundColor Yellow
} else {
    Write-Host '[3/5] 安装桌面壳依赖 desktop/(npm install electron,首次需下载约 120MB)...' -ForegroundColor Yellow
    Push-Location $desktopDir
    try {
        npm install --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) {
            Write-Host '      下载失败,切换国内镜像重试...' -ForegroundColor Yellow
            $env:ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/'
            npm install --no-audit --no-fund
            if ($LASTEXITCODE -ne 0) { throw "npm install 失败(desktop,退出码 $LASTEXITCODE)" }
        }
    } finally { Pop-Location }
    Write-Host '      desktop/ 依赖安装完成' -ForegroundColor Green
}

# 4. 安装常驻插件(外观/费用/文件视图/终端面板 → web profile 永久加载)
$pluginDir = Join-Path $Root 'plugins\deep-harness-appearance'
Write-Host '[4/5] 安装常驻插件(外观与费用 → web profile)...' -ForegroundColor Yellow
if (-not (Test-Path (Join-Path $pluginDir 'package.json'))) {
    Write-Host '      警告:未找到 plugins\deep-harness-appearance,跳过插件安装' -ForegroundColor Yellow
} else {
    # 确保 pnpm 可用(dsh plugin 命令依赖 pnpm 管理 profile 依赖)
    $pnpm = Get-Command pnpm -ErrorAction SilentlyContinue
    if (-not $pnpm) {
        Write-Host '      未找到 pnpm,尝试通过 corepack 启用...' -ForegroundColor Yellow
        try {
            corepack enable 2>$null | Out-Null
            $pnpm = Get-Command pnpm -ErrorAction SilentlyContinue
        } catch { }
    }
    Push-Location $Root
    try {
        if ($pnpm) {
            Write-Host "      使用 pnpm: $($pnpm.Source)" -ForegroundColor Green
            & node (Join-Path $appDir 'lib\bin.js') plugin --profile web add '.\plugins\deep-harness-appearance'
            if ($LASTEXITCODE -ne 0) { throw "插件安装失败(dsh plugin,退出码 $LASTEXITCODE)" }
            Write-Host '      插件已写入 %USERPROFILE%\.dsh\profiles\web(随服务启动自动加载)' -ForegroundColor Green
        } else {
            # 无 pnpm 回退:手动复制插件到 profile 依赖目录,并把加载行写入 home 用户层
            Write-Host '      pnpm 不可用,使用手动复制回退方案...' -ForegroundColor Yellow
            $home = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }
            $profileNm = Join-Path $home 'profiles\node_modules\deep-harness-appearance'
            New-Item -ItemType Directory -Force -Path $profileNm | Out-Null
            Copy-Item (Join-Path $pluginDir '*') $profileNm -Recurse -Force
            $homePatch = Join-Path $home 'cordis.patch.yml'
            $row = @'
- insert:
    - id: deep-harness-appearance
      name: deep-harness-appearance
'@
            $content = if (Test-Path $homePatch) { Get-Content $homePatch -Raw } else { "[]" + [Environment]::NewLine }
            if ($content -notmatch 'deep-harness-appearance') {
                $content = $content.TrimEnd() + [Environment]::NewLine + $row
                Set-Content -Path $homePatch -Value $content -Encoding UTF8
            }
            Write-Host "      插件已复制到 $profileNm 并写入 $homePatch" -ForegroundColor Green
        }
    } finally { Pop-Location }
}

# 5. 创建桌面快捷方式
Write-Host '[5/5] 创建桌面快捷方式...' -ForegroundColor Yellow
$desktop = [Environment]::GetFolderPath('Desktop')
$icon = Join-Path $Root 'launcher\assets\dsh.ico'
$vbs = Join-Path $Root 'launcher\start-hidden.vbs'
$electronExe = Join-Path $desktopDir 'node_modules\electron\dist\electron.exe'
$electronMain = Join-Path $desktopDir 'main.js'
$ws = New-Object -ComObject WScript.Shell

# 5a. 主快捷方式:Electron 原生应用窗口(真正的桌面 APP)
$lnk = $ws.CreateShortcut((Join-Path $desktop 'DEEPHARNESS.lnk'))
if ((Test-Path $electronExe) -and (Test-Path $electronMain)) {
    $lnk.TargetPath       = $electronExe
    $lnk.Arguments        = '"' + $electronMain + '"'
    $lnk.WorkingDirectory = $Root
    Write-Host '      已创建: DEEPHARNESS.lnk(Electron 原生应用窗口)' -ForegroundColor Green
} else {
    # Electron 未就绪时回退:隐藏 PowerShell + 启动器(-AppMode 会再尝试 Electron/Edge)
    $lnk.TargetPath = "$env:WINDIR\System32\wscript.exe"
    $lnk.Arguments  = '"' + (Join-Path $Root 'launcher\start-hidden-app.vbs') + '"'
    $lnk.WorkingDirectory = $Root
    Write-Host '      已创建: DEEPHARNESS.lnk(Electron 未就绪,暂用启动器回退)' -ForegroundColor Yellow
}
$lnk.IconLocation = $icon + ',0'
$lnk.Description   = 'DeepSeek Harness - 原生桌面应用(AI 工作台)'
$lnk.Save()

# 5b. 备选快捷方式:默认浏览器打开
$blnk = $ws.CreateShortcut((Join-Path $desktop 'DEEPHARNESS(浏览器).lnk'))
$blnk.TargetPath       = "$env:WINDIR\System32\wscript.exe"
$blnk.Arguments        = '"' + $vbs + '"'
$blnk.WorkingDirectory = $Root
$blnk.IconLocation     = $icon + ',0'
$blnk.Description      = 'DeepSeek Harness - 用默认浏览器打开'
$blnk.Save()
Write-Host '      已创建: DEEPHARNESS(浏览器).lnk(默认浏览器回退)' -ForegroundColor Green

# 5c. 清理旧版快捷方式
foreach ($old in 'DEEPHARNESS App.lnk', 'DEEPHARNESS (浏览器).lnk') {
    $p = Join-Path $desktop $old
    if (Test-Path $p) { Remove-Item $p -Force; Write-Host "      已清理旧快捷方式: $old" -ForegroundColor Yellow }
}

Write-Host '============================================' -ForegroundColor Cyan
Write-Host '  安装完成!双击桌面 "DEEPHARNESS" 即可打开。' -ForegroundColor Green
Write-Host '============================================' -ForegroundColor Cyan
