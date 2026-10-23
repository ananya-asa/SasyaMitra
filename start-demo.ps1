# Starts backend+MQTT, twin UI, and Flutter dashboard.
# MQTT uses HiveMQ via the backend — no extra broker process.
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Ensure-Npm($dir) {
  if (-not (Test-Path (Join-Path $dir "node_modules"))) {
    Write-Host "Installing npm packages in $dir ..."
    Push-Location $dir
    npm install
    Pop-Location
  }
}

Ensure-Npm (Join-Path $Root "DigitalTwin\backend")
Ensure-Npm (Join-Path $Root "DigitalTwin\frontend")

Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "Set-Location '$Root\DigitalTwin\backend'; Write-Host 'Backend + MQTT  http://localhost:3001' -ForegroundColor Green; npm start"
)

Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "Set-Location '$Root\DigitalTwin\frontend'; Write-Host 'Digital twin  http://localhost:3000' -ForegroundColor Green; npm run dev"
)

Start-Process powershell -ArgumentList @(
  "-NoExit", "-Command",
  "Set-Location '$Root\farmedge_monitor'; Write-Host 'Flutter dashboard' -ForegroundColor Green; flutter run -d chrome"
)

Write-Host ""
Write-Host "Launched 3 windows:"
Write-Host "  Backend + MQTT   http://localhost:3001"
Write-Host "  Digital twin     http://localhost:3000"
Write-Host "  Flutter          Chrome (farmedge_monitor)"
Write-Host "Close those windows to stop."
