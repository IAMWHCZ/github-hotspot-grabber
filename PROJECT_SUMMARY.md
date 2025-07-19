# 项目总结

## 🎯 项目概述

GitHub Hotspot Grabber 是一个使用现代技术栈构建的全栈应用，用于发现和分析 GitHub 上的热门仓库。

## 🏗️ 技术架构

### 后端 (.NET 8)
- **框架**: ASP.NET Core Web API
- **数据库**: PostgreSQL + Entity Framework Core
- **缓存**: Redis
- **日志**: Serilog
- **API 文档**: Swagger/OpenAPI

### 前端 (React + TypeScript)
- **框架**: React 18 + TypeScript
- **路由**: React Router
- **HTTP 客户端**: Axios
- **样式**: 纯 CSS（无 Tailwind）
- **构建工具**: Create React App

### 部署
- **容器化**: Docker + Docker Compose
- **Web 服务器**: Nginx (前端)
- **数据库**: PostgreSQL 15
- **缓存**: Redis 7

## 📁 项目结构

```
github-hotspot-grabber/
├── backend/                    # .NET 8 Web API
│   ├── Controllers/           # API 控制器
│   ├── Models/               # 数据模型
│   ├── Services/             # 业务逻辑服务
│   ├── Data/                 # 数据访问层
│   ├── Program.cs            # 应用入口
│   ├── Dockerfile            # 后端容器配置
│   └── *.csproj              # 项目文件
├── frontend/                  # React + TypeScript 前端
│   ├── src/
│   │   ├── components/       # React 组件
│   │   ├── pages/            # 页面组件
│   │   ├── services/         # API 服务
│   │   ├── types/            # TypeScript 类型
│   │   └── styles/           # CSS 样式
│   ├── public/               # 静态资源
│   ├── Dockerfile            # 前端容器配置
│   ├── nginx.conf            # Nginx 配置
│   └── package.json          # 依赖配置
├── docker-compose.yml         # 容器编排
├── .env.example              # 环境变量模板
├── start.sh                  # 启动脚本
└── README.md                 # 项目文档
```

## 🚀 核心功能

### 1. 数据获取
- 从 GitHub API 获取热门仓库数据
- 支持按编程语言筛选
- 支持不同时间段（日/周/月）

### 2. 智能排名
- 多维度评分算法
- 基于 star 增长速度、fork 增长速度和提交活跃度
- 可配置的权重参数

### 3. 数据缓存
- Redis 缓存热门数据
- 减少 API 调用频率
- 提高响应速度

### 4. 用户界面
- 响应式设计
- 实时数据展示
- 搜索和筛选功能
- 仓库详情页面

## 🔧 API 端点

### 仓库相关
- `GET /api/repositories/trending` - 获取热门仓库
- `GET /api/repositories/search` - 搜索仓库
- `GET /api/repositories/{owner}/{name}` - 获取仓库详情
- `POST /api/repositories/refresh` - 刷新数据

### 语言相关
- `GET /api/languages` - 获取支持的编程语言
- `GET /api/languages/stats` - 获取语言统计信息

## 🎨 前端组件

### 页面组件
- `HomePage` - 主页，显示热门仓库列表
- `RepositoryPage` - 仓库详情页

### 功能组件
- `Header` - 页面头部导航
- `FilterPanel` - 筛选面板
- `RepositoryList` - 仓库列表
- `RepositoryCard` - 仓库卡片

## 🔒 环境配置

### 必需的环境变量
- `GITHUB_TOKEN` - GitHub Personal Access Token
- `ConnectionStrings__DefaultConnection` - 数据库连接字符串
- `ConnectionStrings__Redis` - Redis 连接字符串

### 可选配置
- `RankingWeights__Stars` - Star 权重 (默认: 0.4)
- `RankingWeights__Forks` - Fork 权重 (默认: 0.3)
- `RankingWeights__Commits` - 提交权重 (默认: 0.3)

## 🚀 快速开始

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd github-hotspot-grabber
   ```

2. **配置环境**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，添加 GitHub Token
   ```

3. **启动应用**
   ```bash
   ./start.sh
   # 或者
   docker-compose up --build -d
   ```

4. **访问应用**
   - 前端: http://localhost:3000
   - 后端: http://localhost:5000
   - API 文档: http://localhost:5000/swagger

## 🔮 未来改进

### 功能扩展
- [ ] 用户认证和个人收藏
- [ ] 数据导出功能 (JSON/CSV)
- [ ] 邮件订阅热门仓库
- [ ] 移动端 App

### 技术优化
- [ ] 添加单元测试
- [ ] 实现 CI/CD 流水线
- [ ] 性能监控和日志分析
- [ ] 数据库迁移脚本

### UI/UX 改进
- [ ] 深色主题支持
- [ ] 更丰富的数据可视化
- [ ] 无限滚动加载
- [ ] 离线支持

## 📝 开发说明

### 本地开发

**后端开发**
```bash
cd backend
dotnet restore
dotnet run
```

**前端开发**
```bash
cd frontend
npm install
npm start
```

### 数据库迁移
```bash
cd backend
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 构建生产版本
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。