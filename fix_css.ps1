$css = Get-Content 'styles.css' -Raw -Encoding utf8

$oldSection = @"
/* ==================== Parallax Window (hero"@
# Find start index
$startIdx = $css.IndexOf('/* ==================== Parallax Window')
$endIdx   = $css.IndexOf('.parallax-window {')
# Find closing } of .parallax-window
$closeIdx = $css.IndexOf('}', $css.IndexOf('.parallax-window {')) + 1

$newSection = @"
/* ==================== Expanding Reveal (hero -> Proceso transition) ==================== */
.expand-reveal {
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 5;
    overflow: hidden;
}

.expand-reveal-inner {
    width: 80%;
    height: 480px;
    border-radius: 36px;
    overflow: hidden;
    background-image: url('assets/hero-bg-1.png');
    background-size: cover;
    background-position: center 40%;
    background-repeat: no-repeat;
    will-change: width, border-radius, background-position;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
}
"@

$before = $css.Substring(0, $startIdx)
$after  = $css.Substring($closeIdx)

$css = $before + $newSection + $after
Set-Content 'styles.css' -Value $css -Encoding utf8 -NoNewline
Write-Host "Done. Replaced section."
