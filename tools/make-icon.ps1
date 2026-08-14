#Requires -Version 5.1
<#
.SYNOPSIS
    DEEPHARNESS 图标生成器:生成 launcher\assets\dsh.ico(多尺寸)与 tools\logo.png
.DESCRIPTION
    使用 System.Drawing 绘制深蓝-紫色渐变圆角方块 + 白色 "D" 字母,
    输出 ICO(PNG 条目,16~256px)与 512px PNG 横幅。可复现,无需外部素材。
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\tools\make-icon.ps1
#>
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$Root = Split-Path -Parent $PSScriptRoot
$icoDir = Join-Path $Root 'launcher\assets'
$icoPath = Join-Path $icoDir 'dsh.ico'
$pngPath = Join-Path $Root 'tools\logo.png'
New-Item -ItemType Directory -Force -Path $icoDir | Out-Null

function New-RoundedRectPath([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
    $p = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $d = $r * 2
    $p.AddArc($x, $y, $d, $d, 180, 90)
    $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $p.CloseFigure()
    return $p
}

function New-DshBitmap([int]$size) {
    $bmp = [System.Drawing.Bitmap]::new($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::Transparent)

    # 渐变圆角方块
    $m = [int]($size * 0.04)
    $rect = [System.Drawing.RectangleF]::new($m, $m, $size - 2 * $m, $size - 2 * $m)
    $r = [float]($size * 0.22)
    $path = New-RoundedRectPath $rect.X $rect.Y $rect.Width $rect.Height $r
    $c1 = [System.Drawing.Color]::FromArgb(255, 59, 130, 246)   # #3B82F6 蓝
    $c2 = [System.Drawing.Color]::FromArgb(255, 124, 58, 237)   # #7C3AED 紫
    $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect, $c1, $c2, 45.0)
    $g.FillPath($brush, $path)

    # 顶部高光
    $glowRect = [System.Drawing.RectangleF]::new(0, 0, $size, $size * 0.5)
    $glow = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        $glowRect,
        [System.Drawing.Color]::FromArgb(70, 255, 255, 255),
        [System.Drawing.Color]::FromArgb(0, 255, 255, 255),
        90.0)
    $glowPath = New-RoundedRectPath $rect.X $rect.Y $rect.Width ($rect.Height * 0.55) $r
    $g.FillPath($glow, $glowPath)

    # 白色 "D"
    $fontSize = [float]($size * 0.52)
    $font = [System.Drawing.Font]::new('Segoe UI', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fmt = [System.Drawing.StringFormat]::new()
    $fmt.Alignment = [System.Drawing.StringAlignment]::Center
    $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
    $textRect = [System.Drawing.RectangleF]::new(0, [float]($size * 0.02), $size, [float]($size * 0.92))
    $white = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.DrawString('D', $font, $white, $textRect, $fmt)

    $brush.Dispose(); $glow.Dispose(); $glowPath.Dispose()
    $font.Dispose(); $fmt.Dispose(); $white.Dispose(); $path.Dispose()
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
    $bmp = New-DshBitmap $s
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

# ---- 生成 README 横幅 ----
$logo = New-DshBitmap 512
$logo.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
$logo.Dispose()
Write-Host "PNG 已生成: $pngPath" -ForegroundColor Green
