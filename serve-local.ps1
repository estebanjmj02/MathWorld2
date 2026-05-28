$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$prefix = "http://127.0.0.1:4173/"
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "MathWorld disponible en $prefix"

$types = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg" = "image/svg+xml"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".mp3" = "audio/mpeg"
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $path = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart("/"))
  if ([string]::IsNullOrWhiteSpace($path)) { $path = "index.html" }
  $file = Join-Path $root $path
  $resolvedRoot = [IO.Path]::GetFullPath($root)
  $resolvedFile = [IO.Path]::GetFullPath($file)

  if (-not $resolvedFile.StartsWith($resolvedRoot) -or -not (Test-Path $resolvedFile -PathType Leaf)) {
    $context.Response.StatusCode = 404
    $bytes = [Text.Encoding]::UTF8.GetBytes("No encontrado")
  } else {
    $context.Response.StatusCode = 200
    $extension = [IO.Path]::GetExtension($resolvedFile).ToLowerInvariant()
    $context.Response.ContentType = $types[$extension]
    if (-not $context.Response.ContentType) { $context.Response.ContentType = "application/octet-stream" }
    $bytes = [IO.File]::ReadAllBytes($resolvedFile)
  }

  $context.Response.ContentLength64 = $bytes.Length
  $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $context.Response.OutputStream.Close()
}
