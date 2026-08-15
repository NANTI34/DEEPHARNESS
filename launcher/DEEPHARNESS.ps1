#Requires -Version 5.1
<#
.SYNOPSIS
    DEEPHARNESS 桌面启动器(DeepSeek Harness Windows Desktop Launcher)
.DESCRIPTION
    1. 检查 127.0.0.1:PORT 上是否已有 DeepSeek Harness 服务在运行;没有则后台启动
    2. 打开浏览器访问工作台界面
    由桌面快捷方式 -> start-hidden.vbs 调用,无控制台窗口。
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\launcher\DEEPHARNESS.ps1
    powershell -ExecutionPolicy Bypass -File .\launcher\DEEPHARNESS.ps1 -Port 8080
    powershell -ExecutionPolicy Bypass -File .\launcher\DEEPHARNESS.ps1 -NoOpen
#>
param(
    [int]$Port = 3080,
    [string]$Workspace = '',
    [switch]$NoOpen
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms | Out-Null

$Root   = Split-Path -Parent $PSScriptRoot
$AppDir = Join-Path $Root 'app'
$LogDir = Join-Path $Root 'logs'
$Url    = "http://127.0.0.1:$Port"
$Bins   = Join-Path $AppDir 'lib\bin.js'
if (-not $Workspace) { $Workspace = $Root }

function Find-Node {
    if ($env:NODE -and (Test-Path $env:NODE)) { return $env:NODE }
    $cmd = Get-Command node -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    foreach ($p in @("$env:ProgramFiles\nodejs\node.exe", "$env:ProgramFiles(x86)\nodejs\node.exe", "$env:LOCALAPPDATA\Programs\nodejs\node.exe")) {
        if (Test-Path $p) { return $p }
    }
    return $null
}

function Test-PortOpen([int]$p) {
    $c = New-Object System.Net.Sockets.TcpClient
    try {
        $iar = $c.BeginConnect('127.0.0.1', $p, $null, $null)
        if ($iar.AsyncWaitHandle.WaitOne(800)) { $c.EndConnect($iar); return $true }
    } catch { }
    finally { $c.Close() }
    return $false
}

function Test-DshUp([string]$u) {
    try {
        $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 8
        return ($r.StatusCode -eq 200 -and $r.Content -match '__DSH_BOOT__')
    } catch { return $false }
}

# 0. 依赖检查
if (-not (Test-Path (Join-Path $AppDir 'node_modules'))) {
    [System.Windows.Forms.MessageBox]::Show(
        'DEEPHARNESS 尚未安装依赖。' + [Environment]::NewLine + [Environment]::NewLine +
        '请先运行项目根目录的 install.ps1(自动安装依赖并创建桌面快捷方式)。',
        'DEEPHARNESS', 'OK', 'Information') | Out-Null
    Start-Process 'powershell.exe' -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ('"' + (Join-Path $Root 'install.ps1') + '"'))
    exit 1
}

$node = Find-Node
if (-not $node) {
    [System.Windows.Forms.MessageBox]::Show(
        '未找到 Node.js,请先安装 Node.js 20 或更高版本。' + [Environment]::NewLine + 'https://nodejs.org',
        'DEEPHARNESS', 'OK', 'Error') | Out-Null
    Start-Process 'https://nodejs.org'
    exit 1
}

# 1. 服务未运行则后台启动
$up = (Test-PortOpen $Port) -and (Test-DshUp $Url)
if (-not $up) {
    New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
    $outLog = Join-Path $LogDir 'server.log'
    $errLog = Join-Path $LogDir 'server.err.log'
    # 注意:必须显式传 'web'(等价 --profile web),否则 dsh 会报
    # "error: --profile <name> is required" 并退出
    $nodeArgs = @('"' + $Bins + '"', 'web')
    if ($Port -ne 3080) { $nodeArgs += "--port $Port" }
    $proc = Start-Process -FilePath $node -ArgumentList $nodeArgs `
        -WorkingDirectory $Workspace -WindowStyle Hidden `
        -RedirectStandardOutput $outLog -RedirectStandardError $errLog -PassThru
    $ok = $false
    for ($i = 0; $i -lt 120; $i++) {
        Start-Sleep -Milliseconds 500
        if ((Test-PortOpen $Port) -and (Test-DshUp $Url)) { $ok = $true; break }
        if ($proc.HasExited) { break }
    }
    if (-not $ok) {
        $tail = ''
        if (Test-Path $errLog) { $tail = (Get-Content $errLog -Tail 8) -join [Environment]::NewLine }
        if (-not $NoOpen) {
            [System.Windows.Forms.MessageBox]::Show(
                'DEEPHARNESS 服务启动失败。' + [Environment]::NewLine + [Environment]::NewLine +
                '错误日志(logs\server.err.log)最后几行:' + [Environment]::NewLine + $tail,
                'DEEPHARNESS', 'OK', 'Error') | Out-Null
        }
        exit 1
    }
}

# 2. 打开界面(默认浏览器);-NoOpen 仅启动/检测服务(供测试与脚本调用)
if (-not $NoOpen) {
    Start-Process $Url
}
