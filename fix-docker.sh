#!/bin/bash

echo "🔧 配置 Docker 镜像源"
echo "===================="

# 创建 Docker daemon 配置目录
sudo mkdir -p /etc/docker

# 配置国内镜像源
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
EOF

echo "✅ Docker 镜像源配置完成"
echo ""
echo "🔄 重启 Docker 服务..."

# 在 macOS 上，需要重启 Docker Desktop
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "请手动重启 Docker Desktop 应用"
    echo "或者运行: killall Docker && open /Applications/Docker.app"
else
    # Linux 系统
    sudo systemctl daemon-reload
    sudo systemctl restart docker
fi

echo ""
echo "✅ 配置完成！请重新运行 ./start.sh"