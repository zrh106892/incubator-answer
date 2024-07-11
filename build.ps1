# PowerShell 脚本内容

param (
    [string]$task
)

$VERSION = "1.3.5"
$BIN = "answer.exe"
$DIR_SRC = "./cmd/answer"
$DOCKER_CMD = "docker"

$env:CGO_ENABLED = "0"
$env:GO111MODULE = "on"

$Revision = (git rev-parse --short HEAD 2>$null) -replace "`r`n",""
if (-not $Revision) { $Revision = "" }
$GO_FLAGS = "-ldflags='-X github.com/apache/incubator-answer/cmd.Version=$VERSION -X github.com/apache/incubator-answer/cmd.Revision=$Revision -X github.com/apache/incubator-answer/cmd.Time=$(Get-Date -UFormat %s) -extldflags -static'"
$GO = (Get-Command go).Source

function Run-GoCommand {
    param (
        [string]$command
    )
    Write-Host "Running: $command"
    Invoke-Expression "$command"
}

switch ($task) {
    "build" {
        .\build.ps1 generate
        Run-GoCommand "$GO build $GO_FLAGS -o $BIN $DIR_SRC"
    }
    "universal" {
        .\build.ps1 generate
        $env:GOOS = "darwin"
        $env:GOARCH = "amd64"
        Run-GoCommand "$GO build $GO_FLAGS -o ${BIN}_amd64 $DIR_SRC"
        $env:GOARCH = "arm64"
        Run-GoCommand "$GO build $GO_FLAGS -o ${BIN}_arm64 $DIR_SRC"
        # 在 Windows 上需要找到合适的 lipo 工具，这里假设你已经安装了 Windows 版的 lipo
        Run-GoCommand "lipo -create -output $BIN ${BIN}_amd64 ${BIN}_arm64"
        Remove-Item ${BIN}_amd64, ${BIN}_arm64
    }
    "generate" {
        Run-GoCommand "$GO get github.com/google/wire/cmd/wire@v0.5.0"
        Run-GoCommand "$GO get github.com/golang/mock/mockgen@v1.6.0"
        Run-GoCommand "$GO install github.com/google/wire/cmd/wire@v0.5.0"
        Run-GoCommand "$GO install github.com/golang/mock/mockgen@v1.6.0"
        Run-GoCommand "$GO generate ./..."
        Run-GoCommand "$GO mod tidy"
    }
    "test" {
        Run-GoCommand "$GO test ./internal/repo/repo_test"
    }
    "clean" {
        Run-GoCommand "$GO clean ./..."
        if (Test-Path $BIN) { Remove-Item $BIN }
    }
    "install-ui-packages" {
        Run-GoCommand "corepack enable"
        Run-GoCommand "corepack prepare pnpm@8.9.2 --activate"
    }
    "ui" {
        Push-Location ui
        Run-GoCommand "pnpm pre-install"
        Run-GoCommand "pnpm build"
        Pop-Location
    }
    "lint" {
        .\build.ps1 generate
        Run-GoCommand "bash ./script/check-asf-header.sh"
        Run-GoCommand "gofmt -w -l ."
    }
    "all" {
        .\build.ps1 clean
        .\build.ps1 build
    }
    default {
        Write-Host "未知任务: $task"
    }
}
