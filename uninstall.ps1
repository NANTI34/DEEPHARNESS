#Requires -Version 5.1
<#
.SYNOPSIS
    DEEPHARNESS 卸载:删除桌面快捷方式(数据保留在 %USERPROFILE%\.dsh)
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\uninstall.ps1
    powershell -ExecutionPolicy Bypass -File .\uninstall.ps1 -RemovePlugin   # 同时移除常驻插件
#>
param(
    [switch]$RemovePlugin
)

$ErrorActionPreference = 'Continue'
$desktop = [Environment]::GetFolderPath('Desktop')
foreach ($name in 'DEEPHARNESS.lnk', 'DEEPHARNESS(浏览器).lnk', 'DEEPHARNESS (浏览器).lnk', 'DEEPHARNESS App.lnk') {
    $p = Join-Path $desktop $name
    if (Test-Path $p) {
        Remove-Item $p -Force
        Write-Host "已删除: $name" -ForegroundColor Green
    }
}

if ($RemovePlugin) {
    $root = $PSScriptRoot
    $node = Get-Command node -ErrorAction SilentlyContinue
    if ($node) {
        Push-Location $root
        try {
            & node (Join-Path $root 'app\lib\bin.js') plugin --profile web remove deep-harness-appearance 2>$null
            if ($LASTEXITCODE -ne 0) {
                Write-Host '常驻插件移除失败(如未安装过 pnpm 可忽略;插件文件位于 %USERPROFILE%\.dsh\profiles\node_modules\deep-harness-appearance)' -ForegroundColor Yellow
            } else {
                Write-Host '已从 web profile 移除常驻插件(外观/费用设置保留在浏览器本地存储中)' -ForegroundColor Green
            }
        } finally { Pop-Location }
    } else {
        Write-Host '未找到 Node.js,跳过插件移除' -ForegroundColor Yellow
    }
}

Write-Host ''
Write-Host '桌面快捷方式已删除。' -ForegroundColor Yellow
Write-Host '删除本仓库目录即可完全卸载应用(不影响 %USERPROFILE%\.dsh 中的会话与数据)。' -ForegroundColor Yellow
