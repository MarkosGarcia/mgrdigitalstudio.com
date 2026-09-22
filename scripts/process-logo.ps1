param(
    [Parameter(Mandatory=$true)][string]$InPath,
    [Parameter(Mandatory=$true)][string]$OutPath,
    [int]$Tolerance = 24,
    [int]$Padding = 8
)

Add-Type -AssemblyName System.Drawing

# The source is a JPEG — it decodes with no alpha channel at all (every
# pixel reads A=255 regardless of what we SetPixel later). Draw it onto an
# explicit Format32bppArgb canvas first so alpha actually exists to edit.
$rawSrc = [System.Drawing.Bitmap]::new($InPath)
$w = $rawSrc.Width
$h = $rawSrc.Height
$src = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($src)
$g.DrawImage($rawSrc, 0, 0, $w, $h)
$g.Dispose()
$rawSrc.Dispose()

# --- Step 1: flood-fill the background to transparent ---
$bgColor = $src.GetPixel(0, 0)
$bgR = [int]$bgColor.R
$bgG = [int]$bgColor.G
$bgB = [int]$bgColor.B

$visited = New-Object bool[] ($w * $h)
$queue = New-Object System.Collections.Generic.Queue[int]

function Test-Bg([System.Drawing.Color]$p) {
    return ([Math]::Abs([int]$p.R - $bgR) -le $Tolerance) -and
           ([Math]::Abs([int]$p.G - $bgG) -le $Tolerance) -and
           ([Math]::Abs([int]$p.B - $bgB) -le $Tolerance)
}

function Try-Enqueue([int]$x, [int]$y) {
    if ($x -lt 0 -or $x -ge $w -or $y -lt 0 -or $y -ge $h) { return }
    $idx = $y * $w + $x
    if ($visited[$idx]) { return }
    $px = $src.GetPixel($x, $y)
    if (Test-Bg $px) {
        $visited[$idx] = $true
        $queue.Enqueue($idx)
    }
}

for ($x = 0; $x -lt $w; $x++) { Try-Enqueue $x 0; Try-Enqueue $x ($h - 1) }
for ($y = 0; $y -lt $h; $y++) { Try-Enqueue 0 $y; Try-Enqueue ($w - 1) $y }

$cleared = 0
while ($queue.Count -gt 0) {
    $idx = $queue.Dequeue()
    $x = $idx % $w
    $y = [int][Math]::Floor($idx / $w)
    $src.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    $cleared++
    Try-Enqueue ($x + 1) $y
    Try-Enqueue ($x - 1) $y
    Try-Enqueue $x ($y + 1)
    Try-Enqueue $x ($y - 1)
}

# --- Step 2: verify alpha actually exists now, then autocrop ---
$sampleCorner = $src.GetPixel(0, 0)

$minX = $w; $minY = $h; $maxX = -1; $maxY = -1
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $a = $src.GetPixel($x, $y).A
        if ($a -gt 40) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

$minX = [Math]::Max(0, $minX - $Padding)
$minY = [Math]::Max(0, $minY - $Padding)
$maxX = [Math]::Min($w - 1, $maxX + $Padding)
$maxY = [Math]::Min($h - 1, $maxY + $Padding)
$cw = $maxX - $minX + 1
$ch = $maxY - $minY + 1

$rect = New-Object System.Drawing.Rectangle($minX, $minY, $cw, $ch)
$cropped = $src.Clone($rect, $src.PixelFormat)
$cropped.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
$src.Dispose(); $cropped.Dispose()
Write-Output "Saved $OutPath -> ${cw}x${ch} (bg RGB($bgR,$bgG,$bgB), cleared $cleared px, corner alpha after fill = $($sampleCorner.A), box [$minX,$minY]-[$maxX,$maxY] of ${w}x${h})"
