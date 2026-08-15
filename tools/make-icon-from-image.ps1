#Requires -Version 5.1
<#
.SYNOPSIS
    DEEPHARNESS 图标生成器(图片版):从一张图片生成多尺寸 launcher\assets\dsh.ico 与 tools\logo.png
.DESCRIPTION
    用法:powershell -ExecutionPolicy Bypass -File .\tools\make-icon-from-image.ps1 [图片路径]
    默认使用 assets\icons\默认图标.jpg。居中裁剪为正方形,缩放输出 16~256px ICO(PNG 条目)
    与 512px 横幅 PNG。可复现,输入图片保留在 assets\icons\。
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\tools\make-icon-from-image.ps1
    powershell -ExecutionPolicy Bypass -File .\tools\make-icon-from-image.ps1 D:\my\icon.png
#>
param([string]$ImagePath = '')

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$Root = Split-Path -Parent $PSScriptRoot
$icoDir = Join-Path $Root 'launcher\assets'
$icoPath = Join-Path $icoDir 'dsh.ico'
$pngPath = Join-Path $Root 'tools\logo.png'
$iconsDir = Join-Path $Root 'assets\icons'
New-Item -ItemType Directory -Force -Path $icoDir | Out-Null
New-Item -ItemType Directory -Force -Path $iconsDir | Out-Null

if (-not $ImagePath) { $ImagePath = Join-Path $iconsDir '默认图标.jpg' }
if (-not (Test-Path $ImagePath)) { throw "找不到输入图片: $ImagePath" }
Write-Host "输入图片: $ImagePath" -ForegroundColor Cyan

$src = [System.Drawing.Image]::FromFile($ImagePath)
# 居中裁剪为正方形
$side = [Math]::Min($src.Width, $src.Height)
$sx = [int](($src.Width - $side) / 2)
$sy = [int](($src.Height - $side) / 2)
$square = New-Object System.Drawing.Bitmap($side, $side)
$g0 = [System.Drawing.Graphics]::FromImage($square)
$g0.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, $side, $side)),
    (New-Object System.Drawing.Rectangle($sx, $sy, $side, $side)), [System.Drawing.GraphicsUnit]::Pixel)
$g0.Dispose()

function New-Resized([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($square, 0, 0, $size, $size)
    $g.Dispose()
    return $bmp
}

function Save-PngBytes($bmp) {
    $ms = [System.IO.MemoryStream]::new()
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $bytes = $ms.ToArray()
    $ms.Dispose()
    Write-Output -NoEnumerate $bytes
}

# ---- 生成 ICO ----
$sizes = @(16, 20, 24, 32, 40, 48, 64, 128, 256)
$images = @()
foreach ($s in $sizes) {
    $bmp = New-Resized $s
    $images += , @{ size = $s; bytes = (Save-PngBytes $bmp) }
    $bmp.Dispose()
}
$fs = [System.IO.FileStream]::new($icoPath, [System.IO.FileMode]::Create)
$bw = [System.IO.BinaryWriter]::new($fs)
$bw.Write([uint16]0); $bw.Write([uint16]1); $bw.Write([uint16]$images.Count)
$offset = 6 + 16 * $images.Count
foreach ($img in $images) {
    $b = $img.bytes
    $w = $h = 0
    if ($img.size -lt 256) { $w = $img.size; $h = $img.size }
    $bw.Write([byte]$w); $bw.Write([byte]$h)
    $bw.Write([byte]0); $bw.Write([byte]0)
    $bw.Write([uint16]1); $bw.Write([uint16]32)
    $bw.Write([uint32]$b.Length); $bw.Write([uint32]$offset)
    $offset += $b.Length
}
foreach ($img in $images) { $bw.Write($img.bytes) }
$bw.Close(); $fs.Close()
Write-Host "ICO 已生成: $icoPath ($($images.Count) 个尺寸)" -ForegroundColor Green

# ---- 生成 README 横幅(512px)----
$logo = New-Resized 512
$logo.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
$logo.Dispose()
Write-Host "PNG 已生成: $pngPath" -ForegroundColor Green

$square.Dispose(); $src.Dispose()
