#Requires -Version 5.1
<#
.SYNOPSIS
    DEEPHARNESS 卸载:删除桌面快捷方式(数据保留在 %USERPROFILE%\.dsh)
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\uninstall.ps1
#>
$ErrorActionPreference = 'Continue'
$desktop = [Environment]::GetFolderPath('Desktop')
foreach ($name in 'DEEPHARNESS.lnk', 'DEEPHARNESS App.lnk') {
    $p = Join-Path $desktop $name
    if (Test-Path $p) {
        Remove-Item $p -Force
        Write-Host "已删除: $name" -ForegroundColor Green
    }
}
Write-Host ''
Write-Host '桌面快捷方式已删除。' -ForegroundColor Yellow
Write-Host '删除本仓库目录即可完全卸载应用(不影响 %USERPROFILE%\.dsh 中的数据)。' -ForegroundColor Yellow
