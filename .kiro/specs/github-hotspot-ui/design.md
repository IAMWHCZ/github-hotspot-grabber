# GitHub Hotspot Grabber UI 设计文档

## 概述

本设计文档描述了GitHub Hotspot Grabber Web用户界面的技术架构和实现方案。该界面将基于现有的FastAPI后端，提供现代化、响应式的单页应用(SPA)体验，使用户能够直观地管理GitHub热点仓库抓取任务。

## 架构

### 整体架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端 (SPA)    │    │  FastAPI 后端   │    │   数据存储      │
│                 │    │                 │    │                 │
│ - HTML/CSS/JS   │◄──►│ - REST API      │◄──►│ - SQLite DB     │
│ - 响应式设计    │    │ - 后台任务      │    │ - 输出文件      │
│ - 实时更新      │    │ - WebSocket     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技术栈

**前端:**
- 纯HTML5/CSS3/JavaScript (无框架依赖)
- CSS Grid/Flexbox 响应式布局
- Fetch API 进行HTTP请求
- WebSocket 实现实时更新
- Chart.js 数据可视化

**后端 (现有):**
- FastAPI Python框架
- SQLAlchemy ORM
- 后台任务处理
- Jinja2模板引擎

## 组件和接口

### 1. 主仪表板组件 (Dashboard)

**功能:**
- 系统状态概览
- 快速操作入口
- 最近任务状态
- 配置信息摘要

**API接口:**
- `GET /api/config` - 获取系统配置
- `GET /api/task/{task_id}` - 获取任务状态
- `GET /health` - 健康检查

**UI组件:**
```html
<div class="dashboard">
  <div class="status-cards">
    <div class="card system-status">...</div>
    <div class="card quick-actions">...</div>
  </div>
  <div class="recent-tasks">...</div>
  <div class="config-summary">...</div>
</div>
```

### 2. 数据收集组件 (DataCollection)

**功能:**
- 配置收集参数
- 启动收集任务
- 监控收集进度

**API接口:**
- `POST /api/collect` - 启动数据收集
- `GET /api/task/{task_id}` - 监控任务进度

**表单字段:**
- 编程语言多选 (languages[])
- 时间周期选择 (time_period)
- 最大仓库数 (max_repos)

### 3. 排名计算组件 (RankingCalculation)

**功能:**
- 配置排名参数
- 启动排名计算
- 预览排名结果

**API接口:**
- `POST /api/rank` - 启动排名计算
- `GET /api/rankings` - 获取排名结果

**配置选项:**
- 类别选择 (categories[])
- 时间周期 (time_periods[])
- 权重调整 (通过配置接口)

### 4. 输出管理组件 (OutputManagement)

**功能:**
- 生成多格式输出
- 文件列表管理
- 文件预览和下载

**API接口:**
- `POST /api/generate` - 生成输出文件
- `GET /api/outputs` - 获取文件列表
- `GET /api/download/{filename}` - 下载文件

**支持格式:**
- Markdown (.md)
- JSON (.json)
- RSS (.xml)
- Slack格式 (.json)

### 5. 完整流水线组件 (FullPipeline)

**功能:**
- 一键执行完整流程
- 多阶段进度显示
- 邮件通知配置

**API接口:**
- `POST /api/run` - 启动完整流水线
- `POST /api/test-email` - 测试邮件配置

**流程阶段:**
1. 数据收集
2. 排名计算
3. 输出生成
4. 邮件通知 (可选)

### 6. 任务监控组件 (TaskMonitor)

**功能:**
- 实时任务状态显示
- 任务历史记录
- 错误信息展示

**实现方式:**
- 轮询机制 (每2秒查询一次)
- 任务状态缓存
- 自动刷新界面

### 7. 排名展示组件 (RankingDisplay)

**功能:**
- 表格形式展示排名
- 图表可视化
- 交互式筛选

**数据展示:**
- 排名位置
- 仓库信息 (名称、描述、语言)
- 统计数据 (星标、分叉、热点分数)
- GitHub链接

## 数据模型

### 前端数据结构

```javascript
// 任务状态
const TaskStatus = {
  task_id: string,
  status: 'running' | 'completed' | 'failed',
  progress: string,
  completed_at?: string,
  error?: string
}

// 排名数据
const RankingItem = {
  rank: number,
  repository_name: string,
  full_name: string,
  description: string,
  language: string,
  stars: number,
  forks: number,
  hotspot_score: number,
  github_url: string
}

// 配置信息
const SystemConfig = {
  github_tokens_count: number,
  database_url: string,
  output_dir: string,
  max_results: number,
  weights: {
    star_weight: number,
    fork_weight: number,
    commit_weight: number
  }
}

// 输出文件
const OutputFile = {
  filename: string,
  size: number,
  modified: string,
  url: string
}
```

## 错误处理

### 前端错误处理策略

1. **API请求错误:**
   - 网络错误提示
   - 超时重试机制
   - 用户友好的错误消息

2. **表单验证:**
   - 客户端实时验证
   - 服务端验证反馈
   - 错误状态高亮显示

3. **任务失败处理:**
   - 错误信息展示
   - 重试建议
   - 日志查看链接

### 错误消息设计

```javascript
const ErrorMessages = {
  NETWORK_ERROR: "网络连接失败，请检查网络设置",
  TASK_FAILED: "任务执行失败，请查看详细错误信息",
  VALIDATION_ERROR: "输入参数有误，请检查表单内容",
  FILE_NOT_FOUND: "文件不存在或已被删除",
  CONFIG_ERROR: "系统配置有误，请联系管理员"
}
```

## 测试策略

### 单元测试

1. **JavaScript函数测试:**
   - API调用函数
   - 数据处理函数
   - 表单验证函数

2. **组件测试:**
   - 组件渲染测试
   - 用户交互测试
   - 状态管理测试

### 集成测试

1. **API集成测试:**
   - 端到端API调用
   - 错误场景测试
   - 数据流验证

2. **用户界面测试:**
   - 页面导航测试
   - 表单提交测试
   - 实时更新测试

### 性能测试

1. **前端性能:**
   - 页面加载时间
   - JavaScript执行效率
   - 内存使用监控

2. **用户体验测试:**
   - 响应式设计验证
   - 跨浏览器兼容性
   - 移动设备适配

## 用户界面设计

### 设计原则

1. **简洁直观:** 清晰的信息层次和操作流程
2. **响应式设计:** 适配桌面、平板、手机设备
3. **实时反馈:** 及时的状态更新和进度提示
4. **一致性:** 统一的视觉风格和交互模式

### 色彩方案

```css
:root {
  --primary-color: #2563eb;      /* 主色调 - 蓝色 */
  --secondary-color: #64748b;    /* 次要色 - 灰蓝 */
  --success-color: #059669;      /* 成功状态 - 绿色 */
  --warning-color: #d97706;      /* 警告状态 - 橙色 */
  --error-color: #dc2626;        /* 错误状态 - 红色 */
  --background-color: #f8fafc;   /* 背景色 - 浅灰 */
  --card-background: #ffffff;    /* 卡片背景 - 白色 */
  --text-primary: #1e293b;       /* 主要文本 - 深灰 */
  --text-secondary: #64748b;     /* 次要文本 - 中灰 */
  --border-color: #e2e8f0;       /* 边框色 - 浅灰 */
}
```

### 布局结构

```html
<div class="app-layout">
  <header class="app-header">
    <nav class="main-navigation">...</nav>
  </header>
  
  <main class="app-main">
    <aside class="sidebar">...</aside>
    <section class="content-area">...</section>
  </main>
  
  <footer class="app-footer">...</footer>
</div>
```

### 响应式断点

```css
/* 移动设备 */
@media (max-width: 768px) { ... }

/* 平板设备 */
@media (min-width: 769px) and (max-width: 1024px) { ... }

/* 桌面设备 */
@media (min-width: 1025px) { ... }
```

## 实时更新机制

### 轮询策略

```javascript
class TaskMonitor {
  constructor() {
    this.pollingInterval = 2000; // 2秒
    this.activeTasks = new Set();
  }
  
  startMonitoring(taskId) {
    this.activeTasks.add(taskId);
    this.poll();
  }
  
  async poll() {
    for (const taskId of this.activeTasks) {
      try {
        const status = await this.fetchTaskStatus(taskId);
        this.updateUI(taskId, status);
        
        if (status.status === 'completed' || status.status === 'failed') {
          this.activeTasks.delete(taskId);
        }
      } catch (error) {
        console.error(`Failed to fetch status for task ${taskId}:`, error);
      }
    }
    
    if (this.activeTasks.size > 0) {
      setTimeout(() => this.poll(), this.pollingInterval);
    }
  }
}
```

## 安全考虑

### 前端安全

1. **输入验证:** 所有用户输入进行客户端验证
2. **XSS防护:** 对动态内容进行HTML转义
3. **CSRF防护:** 使用CSRF令牌保护表单提交

### API安全

1. **请求验证:** 验证API请求参数
2. **错误处理:** 不暴露敏感系统信息
3. **访问控制:** 适当的API访问限制

## 部署和维护

### 静态资源

- CSS/JS文件压缩
- 图片优化
- 缓存策略配置

### 监控和日志

- 前端错误监控
- 用户行为分析
- 性能指标收集

### 版本管理

- 语义化版本控制
- 渐进式更新策略
- 回滚机制