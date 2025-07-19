
🔥 使用 React + TypeScript + .NET 构建的 GitHub 热门仓库发现工具

一个现代化的全栈应用，用于发现和分析 GitHub 上的热门仓库，具有智能排名算法和美观的用户界面。

## ✨ 特性

- **智能排名算法**: 基于 star 增长速度、fork 增长速度和提交活跃度的多维度评分
- **现代化界面**: 使用 React + TypeScript 构建的响应式 Web 界面
- **高性能后端**: .NET 8 Web API，支持异步处理和缓存
- **实时数据**: 实时获取和分析 GitHub 仓库数据
- **多语言支持**: 按编程语言筛选和分析
- **灵活的时间段**: 支持日、周、月趋势分析
- **容器化部署**: 使用 Docker 和 Docker Compose 一键部署

## 🚀 快速开始

### 前置要求

- Node.js 18+
- .NET 8 SDK
- Docker 和 Docker Compose
- GitHub Personal Access Token

### 使用 Docker Compose 启动（推荐）

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/github-hotspot-grabber.git
   cd github-hotspot-grabber
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，添加你的 GitHub token
   ```

3. **启动应用**
   ```bash
   docker-compose up --build -d
   ```

4. **访问应用**
   - 前端: http://localhost:3000
   - 后端 API: http://localhost:5000
   - API 文档: http://localhost:5000/swagger

### 获取 GitHub Token

1. 访问 GitHub Settings → Developer settings → Personal access tokens
2. 点击 "Generate new token (classic)"
3. 选择 `public_repo` 权限
4. 复制生成的 token 到 `.env` 文件中的 `GITHUB_TOKEN` 字段

### 本地开发

#### 后端开发
```bash
cd backend
dotnet restore
dotnet run
```

#### 前端开发
```bash
cd frontend
npm install
npm start
```

## 🏗️ 技术栈

### 前端
- **React 18** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **React Router** - 客户端路由
- **Axios** - HTTP 客户端
- **CSS Modules** - 样式管理（不使用 Tailwind）
- **React Query** - 数据获取和缓存

### 后端
- **.NET 8** - Web API 框架
- **Entity Framework Core** - ORM
- **PostgreSQL** - 数据库
- **Redis** - 缓存
- **Swagger** - API 文档
- **Serilog** - 日志记录

## 📊 功能模块

### 1. 仓库发现
- 获取 GitHub 热门仓库
- 按语言、时间段筛选
- 实时数据更新

### 2. 智能排名
- 多维度评分算法
- 可配置的权重参数
- 历史趋势分析

### 3. 数据可视化
- 交互式图表
- 趋势分析
- 排行榜展示

### 4. 用户界面
- 响应式设计
- 深色/浅色主题
- 搜索和筛选功能

## 🔧 开发指南

### 项目结构

```
├── backend/
│   ├── Controllers/         # API 控制器
│   ├── Models/             # 数据模型
│   ├── Services/           # 业务逻辑服务
│   ├── Data/               # 数据访问层
│   └── Program.cs          # 应用入口
├── frontend/
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── pages/          # 页面组件
│   │   ├── services/       # API 服务
│   │   ├── types/          # TypeScript 类型定义
│   │   └── styles/         # CSS 样式
│   └── public/             # 静态资源
```

### API 端点

- `GET /api/repositories/trending` - 获取热门仓库
- `GET /api/repositories/search` - 搜索仓库
- `GET /api/languages` - 获取支持的编程语言
- `GET /api/statistics` - 获取统计数据

## 🚀 部署

### Docker 部署

```bash
# 构建和启动所有服务
docker-compose up --build -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 生产环境配置

1. 配置环境变量
2. 设置 HTTPS
3. 配置数据库连接
4. 设置 Redis 缓存
5. 配置日志记录

## 🤝 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**用 ❤️ 为开发者社区打造**