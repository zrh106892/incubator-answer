<a href="https://answer.apache.org">
    <img alt="logo" src="docs/img/logo.svg" height="99px">
</a>

# Apache Answer - Build Q&A platform

A Q&A platform software for teams at any scales. Whether it’s a community forum, help center, or knowledge management platform, you can always count on Answer.

To learn more about the project, visit [answer.apache.org](https://answer.apache.org).

[![LICENSE](https://img.shields.io/github/license/apache/incubator-answer)](https://github.com/apache/incubator-answer/blob/main/LICENSE)
[![Language](https://img.shields.io/badge/language-go-blue.svg)](https://golang.org/)
[![Language](https://img.shields.io/badge/language-react-blue.svg)](https://reactjs.org/)
[![Go Report Card](https://goreportcard.com/badge/github.com/apache/incubator-answer)](https://goreportcard.com/report/github.com/apache/incubator-answer)
[![Discord](https://img.shields.io/badge/discord-chat-5865f2?logo=discord&logoColor=f5f5f5)](https://discord.gg/Jm7Y4cbUej)

## Screenshots

![screenshot](docs/img/screenshot.png)

## Quick start

### Running with docker

```bash
docker run -d -p 9080:80 -v answer-data:/data --name answer apache/answer:1.3.5
```

For more information, see [Installation](https://answer.apache.org/docs/installation).

### Plugins

Answer provides a plugin system for developers to create custom plugins and expand Answer’s features. You can find the [plugin documentation here](https://answer.apache.org/community/plugins).

We value your feedback and suggestions to improve our documentation. If you have any comments or questions, please feel free to contact us. We’re excited to see what you can create using our plugin system!

You can also check out the [plugins here](https://answer.apache.org/plugins).

## Building from Source

### Prerequisites

- Golang >= 1.18
- Node.js >= 16.17
- pnpm >= 8
- mockgen >= 1.6.0
- wire >= 0.5.0

### Build

```bash
# install wire and mockgen for building
$ make generate
# install frontend dependencies and build
$ make ui
# install backend dependencies and build
$ make build
```

### Dev

#### 前端
```bash
$ cd ./ui
$ pnpm install
```
##### 安装依赖
```bash
$ go mod download
```
#### 初始化配置
```bash
$ go run cmd/answer/main.go init -C ./answer-data
```
#### 运行
```bash
$ go run cmd/answer/main.go run -C ./answer-data
```


## Contributing

Contributions are always welcome!

See [CONTRIBUTING](https://answer.apache.org/community/contributing) for ways to get started.

## License

[Apache License 2.0](https://github.com/apache/incubator-answer/blob/main/LICENSE)
