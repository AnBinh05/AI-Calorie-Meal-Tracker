<#
.SYNOPSIS
    Converts a Codex Subagent (.toml) into an Antigravity Skill (SKILL.md).

.DESCRIPTION
    This script parses a Codex subagent TOML file (or URL) from repositories like
    VoltAgent/awesome-codex-subagents, extracts instructions, removes Codex-specific
    fields (e.g. gpt-5.6 model routing, sandbox_mode), and formats it into a native
    Antigravity Skill with YAML frontmatter.

.PARAMETER Source
    Path to a local .toml file or a raw GitHub URL.

.PARAMETER TargetDir
    Target directory inside .agents/skills/ (defaults to .agents/skills/<name>).

.EXAMPLE
    .\scripts\convert-codex-subagent.ps1 -Source "categories/01-core-development/backend-developer.toml"
    .\scripts\convert-codex-subagent.ps1 -Source "https://raw.githubusercontent.com/VoltAgent/awesome-codex-subagents/main/categories/01-core-development/api-designer.toml"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Source,

    [Parameter(Mandatory = $false)]
    [string]$TargetDir
)

# 1. Fetch content
$content = ""
if ($Source -match '^https?://') {
    Write-Host "[+] Fetching remote TOML from $Source..." -ForegroundColor Cyan
    $response = Invoke-WebRequest -Uri $Source -UseBasicParsing
    $content = $response.Content
} elseif (Test-Path $Source) {
    Write-Host "[+] Reading local file $Source..." -ForegroundColor Cyan
    $content = Get-Content -Path $Source -Raw
} else {
    Write-Error "Source file or URL not found: $Source"
    exit 1
}

# 2. Extract name
$name = ""
if ($content -match 'name\s*=\s*"([^"]+)"') {
    $name = $matches[1].Trim().ToLower()
} else {
    $name = (Split-Path $Source -LeafBase).ToLower()
}

# 3. Extract description
$description = ""
if ($content -match 'description\s*=\s*"([^"]+)"') {
    $description = $matches[1].Trim()
}

# 4. Extract instructions
$instructions = ""
if ($content -match '(?ms)(?:developer_instructions|instructions(?:\.text)?)\s*=\s*"""(.*?)"""') {
    $instructions = $matches[1].Trim()
} elseif ($content -match '(?ms)instructions\s*=\s*"(.*?)"') {
    $instructions = $matches[1].Trim()
}

if (-not $instructions) {
    Write-Warning "Could not extract multiline instructions block. Using raw content as fallback."
    $instructions = $content
}

# 5. Format Antigravity Skill
if (-not $TargetDir) {
    $repoRoot = (Get-Item $PSScriptRoot).Parent.FullName
    $TargetDir = Join-Path $repoRoot ".agents\skills\$name"
}

if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

$skillFilePath = Join-Path $TargetDir "SKILL.md"

$title = (Get-Culture).TextInfo.ToTitleCase($name.Replace('-', ' '))
$skillContent = @(
    "---",
    "name: $name",
    "description: >-",
    "  $description",
    "---",
    "",
    "# $title",
    "",
    $instructions
) -join [System.Environment]::NewLine

Set-Content -Path $skillFilePath -Value $skillContent -Encoding UTF8
Write-Host "[OK] Successfully converted Codex subagent to Antigravity Skill:" -ForegroundColor Green
Write-Host "    $skillFilePath" -ForegroundColor Yellow
