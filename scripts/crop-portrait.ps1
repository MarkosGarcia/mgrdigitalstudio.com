param(
    [Parameter(Mandatory=$true)][string]$InPath,
    [Parameter(Mandatory=$true)][string]$OutPath,
    [int]$CropX = 79,
    [int]$CropY = 620,
    [int]$CropSize = 1100,
    [int]$OutSize = 640,
    [int]$Quality = 88
)

Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::new($InPath)

$rect = New-Object System.Drawing.Rectangle($CropX, $CropY, $CropSize, $CropSize)
$cropped = $src.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)

# Downscale to a sane delivery size — the About page renders it at most
# 288 CSS px, so 640 covers 2x displays with room to spare.
$canvas = New-Object System.Drawing.Bitmap($OutSize, $OutSize, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($cropped, 0, 0, $OutSize, $OutSize)
$g.Dispose()

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
$canvas.Save($OutPath, $codec, $params)

$canvas.Dispose(); $cropped.Dispose(); $src.Dispose()
$size = (Get-Item $OutPath).Length
Write-Output "Saved $OutPath -> ${OutSize}x${OutSize}, $([math]::Round($size/1KB,1)) KB (from ${CropSize}px square at $CropX,$CropY)"
