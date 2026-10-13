<#
.SYNOPSIS
    Script hỗ trợ chạy hoặc cài đặt Alibaba Open Code Review (ocr) CLI trên Windows.
.DESCRIPTION
    Kiểm tra công cụ `ocr`, hướng dẫn cài đặt nếu chưa có, và hỗ trợ chạy review/scan nhanh.
.EXAMPLE
    .\run-ocr.ps1 -Mode review
    .\run-ocr.ps1 -Mode scan -Path "backend"
#>

param(
    [ValidateSet("review", "scan", "viewer", "install", "test")]
    [string]$Mode = "review",
    [string]$Path = ".",
    [string]$FromBranch = "main",
    [string]$ToBranch = "develop"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Alibaba Open Code Review (ocr) Helper Script" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$ocrCmd = Get-Command ocr -ErrorAction SilentlyContinue

if (-not $ocrCmd) {
    Write-Host "[!] Công cụ dòng lệnh 'ocr' chưa được cài đặt trong PATH." -ForegroundColor Yellow
    Write-Host "Để cài đặt CLI chính thức từ Alibaba Open Code Review:" -ForegroundColor Cyan
    Write-Host "  1. Xem hướng dẫn phát hành: https://github.com/alibaba/open-code-review/releases" -ForegroundColor White
    Write-Host "  2. Hoặc nếu bạn đã có Go: go install github.com/alibaba/open-code-review/cmd/ocr@latest" -ForegroundColor White
    Write-Host "  3. Hoặc sử dụng trực tiếp Skill Agent-Native trong Antigravity (/open-code-review)" -ForegroundColor Green
    Write-Host "----------------------------------------------------------"
    exit 0
}

switch ($Mode) {
    "review" {
        Write-Host "[*] Đang thực hiện review các thay đổi trong workspace..." -ForegroundColor Green
        ocr review
    }
    "scan" {
        Write-Host "[*] Đang quét mã nguồn tại thư mục: $Path..." -ForegroundColor Green
        ocr scan --path $Path
    }
    "viewer" {
        Write-Host "[*] Đang khởi động Web Viewer xem báo cáo..." -ForegroundColor Green
        ocr viewer
    }
    "test" {
        Write-Host "[*] Kiểm tra kết nối LLM provider..." -ForegroundColor Green
        ocr llm test
    }
}
