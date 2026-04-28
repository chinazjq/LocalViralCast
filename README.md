# LocalViralCast 🎬

> 本地爆款口播视频智能体 — 面向中文口播短视频场景的 AI 生产工具

## 项目简介

LocalViralCast 是一款本地桌面端 AI 工具，帮助内容创作者快速生产抖音/视频号/小红书/B站口播短视频。

**核心链路**：LLM 生成口播文案 → TTS 语音合成 → FFmpeg 图片+音频合成视频

**技术栈**：
- 🖥️ **桌面端**：Tauri 2 + React 18 + TypeScript + Ant Design 5
- ⚙️ **后端**：Python + FastAPI + SQLite + SQLAlchemy
- 🤖 **本地 LLM**：Ollama（qwen2.5:7b-instruct / qwen3:8b）
- 🎬 **视频合成**：FFmpeg

## 当前版本：V0 技术骨架

V0 是最小可用版本，验证核心链路：
- ✅ FastAPI 后端启动，提供 REST API
- ✅ React 前端启动，三个页面（Dashboard / Settings / Lab）
- ✅ Ollama Provider 调用本地 LLM 生成文案
- ✅ FFmpeg 图片+音频合成 9:16 竖版视频
- ✅ SQLite 数据持久化

## 快速开始

### 前置依赖

| 依赖 | 版本要求 | 安装方式 |
|------|----------|----------|
| Python | 3.10+ | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Ollama | 最新 | [ollama.com](https://ollama.com) |
| FFmpeg | 最新 | `apt install ffmpeg` / `brew install ffmpeg` |

### 1. 拉取代码

```bash
git clone https://github.com/chinazjq/LocalViralCast.git
cd LocalViralCast
```

### 2. 启动后端

```bash
# 安装 Python 依赖
cd server
pip install -r requirements.txt

# 确保 Ollama 运行中且已拉取模型
ollama pull qwen2.5:7b-instruct

# 启动后端（默认端口 8000）
cd ..
python -m server.main
```

后端启动后访问 http://localhost:8000/docs 查看 API 文档。

### 3. 启动前端

```bash
# 新终端窗口
cd app
npm install
npm run dev
```

前端启动后访问 http://localhost:1420。

### 4. 开始使用

1. **Dashboard**：查看后端和 Ollama 连接状态
2. **Settings**：配置 Ollama 地址和模型，测试连接
3. **Lab**：
   - 输入 prompt，点击生成 → LLM 生成口播文案
   - 上传图片 + 音频 → FFmpeg 合成竖版视频

## 项目结构

```
LocalViralCast/
├── app/                    # 前端 (React + TypeScript)
│   ├── src/
│   │   ├── main.tsx        # React 入口
│   │   ├── App.tsx         # 路由配置
│   │   ├── components/
│   │   │   └── Layout.tsx  # 全局布局（深色侧边栏）
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx  # 首页仪表盘
│   │   │   ├── Settings.tsx   # 设置页
│   │   │   └── Lab.tsx        # 实验室（LLM + 视频合成）
│   │   └── services/
│   │       └── api.ts      # API 调用封装
│   ├── package.json
│   └── vite.config.ts
├── server/                 # 后端 (Python + FastAPI)
│   ├── main.py             # FastAPI 入口
│   ├── config.py           # 配置管理
│   ├── database.py         # 数据库引擎
│   ├── models/             # SQLAlchemy 模型
│   │   ├── project.py      # 项目
│   │   ├── task.py         # 任务
│   │   ├── asset.py        # 资源
│   │   └── setting.py      # 配置
│   ├── routers/            # API 路由
│   │   ├── health.py       # 健康检查
│   │   ├── llm.py          # LLM 生成 + 测试
│   │   ├── media.py        # 视频合成
│   │   └── tasks.py        # 任务管理
│   ├── providers/
│   │   └── ollama.py       # Ollama Provider
│   ├── services/
│   │   └── ffmpeg_service.py  # FFmpeg 合成服务
│   └── requirements.txt
├── app/src-tauri/          # Tauri 桌面壳（V1+）
└── README.md
```

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| POST | `/api/llm/test` | 测试 Ollama 连接 |
| POST | `/api/llm/generate` | LLM 文案生成 |
| POST | `/api/media/simple-render` | 图片+音频合成视频 |
| GET | `/api/tasks` | 获取任务列表 |
| POST | `/api/tasks` | 创建任务 |

## 模型下载

V0 使用 Ollama 运行本地 LLM，推荐模型：

| 模型 | 大小 | 适用场景 |
|------|------|----------|
| qwen2.5:7b-instruct | ~4.7GB | 中文口播文案（推荐） |
| qwen3:8b | ~5.2GB | 更强中文理解 |

```bash
# 下载推荐模型
ollama pull qwen2.5:7b-instruct
```

## 后续规划

- **V1**：TTS 语音合成 + 字幕生成 + 完整项目管理
- **V2**：数字人合成 + 混合云工作流
- **V3**：多平台一键分发

## License

MIT
