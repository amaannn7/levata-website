# Sitewide section-rhythm standardization:
# - section padding -> py-14 sm:py-16 md:py-20
# - beam->heading gap -> gap-3
# - heading->content margin -> mb-10 / md:mb-12
# - content containers capped at navbar width (1120px)
$files = @(
  "app\components\HeroSection.tsx",
  "app\components\TestimonialsSection.tsx",
  "app\components\ClientsMarquee.tsx",
  "app\components\ServicesSection.tsx",
  "app\components\Footer.tsx",
  "app\components\ContactCTASection.tsx",
  "app\components\BookCallSection.tsx",
  "app\about\page.tsx",
  "app\products\ai-intelligence\AIIntelligencePage.tsx",
  "app\products\automation-systems\AutomationSystemsPage.tsx",
  "app\products\digital-infrastructure\DigitalServicesPage.tsx",
  "app\products\product-engineering\DigitalProductsPage.tsx",
  "app\products\sales-intelligence-platform\SalesIntelligencePage.tsx"
)

$common = [ordered]@{
  'py-14 sm:py-20 md:py-28'  = 'py-14 sm:py-16 md:py-20'
  'py-20 md:py-28'           = 'py-14 md:py-20'
  'sm:py-20 md:py-24'        = 'sm:py-16 md:py-20'
  'gap-5 text-center'        = 'gap-3 text-center'
  'text-center gap-5'        = 'text-center gap-3'
  'md:mb-16'                 = 'md:mb-12'
  'md:mb-14'                 = 'md:mb-12'
  'mb-12 flex flex-col items-center' = 'mb-10 flex flex-col items-center'
  'mx-auto max-w-6xl'        = 'mx-auto max-w-[1120px]'
  'max-w-7xl'                = 'max-w-[1120px]'
}

$heroExtras = [ordered]@{
  'mb-20 flex flex-col items-center text-center gap-3' = 'mb-10 flex flex-col items-center text-center gap-3 md:mb-12'
  'pt-10 pb-24 md:pt-14 md:pb-28' = 'pt-10 pb-14 md:pt-14 md:pb-20'
  'mx-auto mb-16 flex max-w-4xl'  = 'mx-auto mb-10 flex max-w-4xl'
  'px-5 py-16 sm:px-6 sm:py-20'   = 'px-5 py-14 sm:px-6 sm:py-16'
  'pt-20 pb-10 md:pt-24 md:pb-14' = 'pt-14 pb-14 md:pt-20 md:pb-20'
  'mb-12 flex max-w-3xl'          = 'mb-10 flex max-w-3xl'
  'pt-10 pb-20 md:pt-14 md:pb-24' = 'pt-10 pb-14 md:pt-14 md:pb-20'
  'items-center gap-4 text-center' = 'items-center gap-3 text-center'
  'mb-10 flex flex-col gap-5'     = 'mb-10 flex flex-col gap-3'
}

$enc = New-Object System.Text.UTF8Encoding $false
foreach ($f in $files) {
  $p = Join-Path (Get-Location) $f
  $t = [System.IO.File]::ReadAllText($p)
  $orig = $t
  foreach ($k in $common.Keys) { $t = $t.Replace($k, $common[$k]) }
  if ($f -like "*HeroSection*") {
    foreach ($k in $heroExtras.Keys) { $t = $t.Replace($k, $heroExtras[$k]) }
  }
  if ($t -ne $orig) {
    [System.IO.File]::WriteAllText($p, $t, $enc)
    Write-Output "updated: $f"
  } else {
    Write-Output "no change: $f"
  }
}
