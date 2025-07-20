#!/bin/bash

echo "🛑 GitHub Hotspot Grabber - 停止脚本"
echo "=================================="

echo "🔄 停止所有容器..."
docker-compose down

echo ""
echo "✅ 应用已停止！"
echo ""
echo "💡 其他有用的命令:"
echo "   重新启动: ./start.sh"
echo "   查看状态: docker-compose ps"
echo "   清理数据: docker-compose down -v"
echo "   查看日志: docker-compose logs"