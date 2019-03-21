Add-Type -AssemblyName System.Device #Required to access System.Device.Location namespace
$Geo = New-Object System.Device.Location.GeoCoordinateWatcher #Create the required object
$Geo.Start() #Begin resolving current locaton

while (($Geo.Status -ne 'Ready') -and ($Geo.Permission -ne 'Denied')) {
   Start-Sleep -Milliseconds 100 #Wait for discovery.
}  

if ($Geo.Permission -eq 'Denied') {
   Write-Output('{}')
}
else {
   $Geo.Position.Location | ConvertTo-Json
}