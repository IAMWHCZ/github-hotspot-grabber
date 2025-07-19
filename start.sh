#!/bin/bash

echo "🔥 GitHub Hotspot Grabber - 启动脚本"
echo "=================================="

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 检查 .env 文件是否存在
if [ ! -f .env ]; then
    echo "📝 创建环境配置文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件，添加你的 GitHub Token"
    echo "   获取 Token: https://github.com/settings/tokens"
    echo "   需要 'public_repo' 权限"
    echo ""
    read -p "按 Enter 键继续..."
fi

echo "🚀 启动应用..."
docker-compose up --build -d

echo ""
echo "✅ 应用启动成功！"
echo ""
echo "📱 访问地址:"
echo "   前端: http://localhost:3000"
echo "   后端 API: http://localhost:5000"
echo "   API 文档: http://localhost:5000/swagger"
echo ""
echo "📊 查看日志:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 停止应用:"
echo "   docker-compose down"