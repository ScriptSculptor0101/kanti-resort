Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\acer\.gemini\antigravity\brain\98afa5a1-41cf-4427-a0e1-3dad49e9437b\.user_uploaded\media_1793862119549_5a4a10b1.jpg"
$img = [System.Drawing.Bitmap]::FromFile($srcPath)
$width = $img.Width
$height = $img.Height

$cx = 320.0
$cy = 316.5
$radius = 290.5

# -------------------------------------------------------------
# 1. Circular transparent badge: keeps original colors inside the circle,
# makes everything outside the circular ring 100% transparent with anti-aliasing.
# -------------------------------------------------------------
$outCircle = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $dx = $x - $cx
        $dy = $y - $cy
        $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)
        
        $c = $img.GetPixel($x, $y)
        
        if ($dist -gt $radius + 2.0) {
            # Completely outside circle -> transparent
            $outCircle.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
        elseif ($dist -ge $radius - 1.0) {
            # Anti-aliased boundary
            $edgeAlpha = [Math]::Max(0.0, [Math]::Min(1.0, ($radius + 2.0 - $dist) / 3.0))
            $a = [int]($edgeAlpha * 255)
            $outCircle.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $c.R, $c.G, $c.B))
        }
        else {
            # Inside circle -> keep original
            $outCircle.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B))
        }
    }
}

$dest1 = "e:\kanti resort website\public\kanti-logo-circle.png"
$outCircle.Save($dest1, [System.Drawing.Imaging.ImageFormat]::Png)
$outCircle.Dispose()
"Saved $dest1"

# -------------------------------------------------------------
# 2. Dark-mode inclusive emblem:
# For the dark theme (#1A0C05), we invert the brightness of the dark green elements
# so they become glowing gold / warm metallic ivory on a transparent / espresso canvas!
# Specifically:
# - White/off-white background (> 230) -> becomes transparent (or deep dark tint)
# - Dark pine green elements (R < 50, G < 70, B < 50) -> become elegant warm gold / ivory (#F3E5AB / #D53A04 / #D4FF24)
# - Golden sun (warm yellows/oranges) -> remains radiant glowing sun!
# - Snow on mountains -> stays crisp white snow!
# - Cottage illuminated windows -> glowing warm light!
# -------------------------------------------------------------
$outDark = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $dx = $x - $cx
        $dy = $y - $cy
        $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)
        
        if ($dist -gt $radius + 2.0) {
            $outDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            continue
        }
        
        $c = $img.GetPixel($x, $y)
        $r = $c.R; $g = $c.G; $b = $c.B
        $brightness = 0.299 * $r + 0.587 * $g + 0.114 * $b
        
        # Check if golden sun / warm colors (high R, medium G, lower B)
        $isGolden = ($r -gt 180 -and $g -gt 130 -and $b -lt 140) -or ($r -gt 210 -and $g -gt 160 -and $b -lt 160)
        
        # Check if dark pine / line art (very dark)
        $isDarkLine = ($brightness -lt 95)
        
        # Check if white background
        $isWhiteBg = ($r -gt 240 -and $g -gt 240 -and $b -gt 240)
        
        # Boundary anti-aliasing factor
        $edgeFactor = 1.0
        if ($dist -gt $radius - 1.0) {
            $edgeFactor = [Math]::Max(0.0, [Math]::Min(1.0, ($radius + 2.0 - $dist) / 3.0))
        }

        if ($isGolden) {
            # Keep radiant gold sun / window light
            $a = [int](255 * $edgeFactor)
            $outDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $r, $g, $b))
        }
        elseif ($isDarkLine) {
            # Dark pine line / text -> transform into luminous champagne gold / ivory (#F2DEC4)
            # which pops magnificently on dark backgrounds!
            $factor = 1.0 - ($brightness / 95.0)
            $nr = [int](245 * $factor + 212 * (1 - $factor))
            $ng = [int](225 * $factor + 200 * (1 - $factor))
            $nb = [int](190 * $factor + 160 * (1 - $factor))
            $a = [int](255 * $edgeFactor)
            $outDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $nr, $ng, $nb))
        }
        elseif ($isWhiteBg) {
            # White background inside circle: make it semi-transparent subtle dark espresso
            # so the crest has presence like a sleek glass medallion on dark websites
            $outDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
        else {
            # Midtones / snow / gradients
            $a = [int](255 * $edgeFactor)
            $outDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $r, $g, $b))
        }
    }
}

$dest2 = "e:\kanti resort website\public\kanti-logo-dark.png"
$outDark.Save($dest2, [System.Drawing.Imaging.ImageFormat]::Png)
$outDark.Dispose()
"Saved $dest2"

# -------------------------------------------------------------
# 3. Also create a luxury dark crest with rich circular glass backdrop:
# Combines the crisp dark logo elements on a rich Espresso/Gold bordered glass medallion (#1A0C05 with a thin gold ring)
# -------------------------------------------------------------
$outMedallion = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $dx = $x - $cx
        $dy = $y - $cy
        $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)
        
        if ($dist -gt $radius + 3.0) {
            $outMedallion.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            continue
        }
        
        # Outer gold ring border at radius ~ 288-292
        if ($dist -ge $radius - 3.0 -and $dist -le $radius + 1.0) {
            $outMedallion.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 213, 58, 4)) # Blaze Orange / Gold border
            continue
        }
        
        $c = $img.GetPixel($x, $y)
        $r = $c.R; $g = $c.G; $b = $c.B
        $brightness = 0.299 * $r + 0.587 * $g + 0.114 * $b
        
        $isGolden = ($r -gt 180 -and $g -gt 130 -and $b -lt 140) -or ($r -gt 210 -and $g -gt 160 -and $b -lt 160)
        $isDarkLine = ($brightness -lt 95)
        $isWhiteBg = ($r -gt 240 -and $g -gt 240 -and $b -gt 240)
        
        if ($isGolden) {
            $outMedallion.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
        }
        elseif ($isDarkLine) {
            # Luminous ivory gold
            $outMedallion.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 245, 230, 205))
        }
        elseif ($isWhiteBg) {
            # Deep rich espresso backing (#1A0C05 with subtle warmth)
            $outMedallion.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(220, 26, 12, 5))
        }
        else {
            $outMedallion.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
        }
    }
}

$dest3 = "e:\kanti resort website\public\kanti-logo-medallion.png"
$outMedallion.Save($dest3, [System.Drawing.Imaging.ImageFormat]::Png)
$outMedallion.Dispose()
"Saved $dest3"

$img.Dispose()
"Processing finished!"
