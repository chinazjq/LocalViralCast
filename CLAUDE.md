# LocalViralCast — 本地爆款口播视频智能体

## 项目概述
面向中文口播短视频场景的本地桌面端 AI 生产工具。
前端：Tauri + React + TypeScript + Ant Design
后端：Python + FastAPI + SQLite + FFmpeg
本地 LLM：Ollama (qwen2.5:7b-instruct / qwen3:8b)

## 当前阶段：V0 技术骨架版
V0 目标：验证 Tauri + React + Python FastAPI + Ollama + FFmpeg 全链路可行。
V0 不面向用户，仅内部验证工程链路。

## 项目结构
```
app/                    # Tauri + React 前端
  src/
    pages/              # Dashboard, Settings, Lab
    components/         # 通用组件
    services/           # API 调用层
  src-tauri/            # Rust/Tauri 原生层
server/                 # Python FastAPI 后端
  routers/              # API 路由
  providers/            # 模型/服务 Provider
  services/             # 业务逻辑
  models/               # SQLAlchemy 模型
  data/                 # SQLite 数据库 + 项目文件
```

## V0 后端 API 端点
- `GET /api/health` — 健康检查
- `POST /api/llm/generate` — 调用 Ollama 生成文案
- `POST /api/llm/test` — 测试 Ollama 连接
- `POST /api/media/simple-render` — FFmpeg 图片+音频→MP4 合成
- `GET /api/tasks` — 任务列表
- `POST /api/tasks` — 创建任务

## V0 SQLite 表
- `projects` (id, name, category, status, video_ratio, created_at, updated_at)
- `tasks` (id, project_id, type, status, input_data, output_data, created_at, updated_at)
- `assets` (id, project_id, type, file_path, metadata, created_at)
- `settings` (key, value, updated_at)

## 技术约定
- Python 3.10+，使用 type hints
- REST API 返回统一格式：`{"success": true, "data": ..., "error": ...}`
- 前端用 axios 调后端，baseURL 从配置读取
- 所有路径使用 pathlib.Path
- 日志用 logging 模块
