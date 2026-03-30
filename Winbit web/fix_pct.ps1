$css = Get-Content 'styles.css' -Raw -Encoding utf8

# Locate the bad line (line 888) and replace just that segment
$bad = "    transition: color var(--transition-base);\n    -webkit-text-fill-color: transparent;\n    text-fill-color: transparent;\n    background-image: radial-gradient(circle, currentColor 35%, transparent 40%);\n    background-size: 4px 4px;\n    -webkit-background-clip: text;\n    background-clip: text;\n}"
$good = "    transition: color var(--transition-base);
    -webkit-text-fill-color: transparent;
    text-fill-color: transparent;
    background-image: radial-gradient(circle, currentColor 35%, transparent 40%);
    background-size: 4px 4px;
    -webkit-background-clip: text;
    background-clip: text;
}"

$css = $css.Replace($bad, $good)
Set-Content 'styles.css' -Value $css -Encoding utf8
Write-Host "Done"
