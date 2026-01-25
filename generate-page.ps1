# Page Generator Script
# Tạo trang HTML độc lập từ template

param(
    [Parameter(Mandatory=$true)]
    [string]$PageName,
    
    [Parameter(Mandatory=$true)]
    [string]$PageTitle,
    
    [string]$PageHeader = $PageTitle,
    [string]$ContentId = "$PageName-content-placeholder",
    [string]$InitFunction = "load${PageName}Content"
)

$templatePath = "pages\_template.html"
$outputPath = "pages\$PageName.html"

if (-not (Test-Path $templatePath)) {
    Write-Error "Template file not found: $templatePath"
    exit 1
}

# Read template
$template = Get-Content $templatePath -Raw

# Replace placeholders
$content = $template `
    -replace '{{PAGE_TITLE}}', $PageTitle `
    -replace '{{PAGE_STYLE}}', "$PageName-style" `
    -replace '{{PAGE_HEADER}}', $PageHeader `
    -replace '{{CONTENT_ID}}', $ContentId `
    -replace '{{PAGE_LOADER}}', "$PageName-loader" `
    -replace '{{INIT_FUNCTION}}', $InitFunction

# Write output
Set-Content -Path $outputPath -Value $content -Encoding UTF8

Write-Host "✅ Created: $outputPath" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create css/$PageName-style.css"
Write-Host "2. Create js/$PageName-loader.js with function $InitFunction()"
Write-Host "3. Update vercel.json if needed"
Write-Host ""
Write-Host "Example usage:" -ForegroundColor Cyan
Write-Host "  .\generate-page.ps1 -PageName 'orders' -PageTitle 'Đơn hàng của tôi'"
