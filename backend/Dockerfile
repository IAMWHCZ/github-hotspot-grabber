# 使用 .NET 8 SDK 作为构建镜像
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 复制项目文件并还原依赖
COPY *.csproj .
RUN dotnet restore

# 复制所有源代码并构建应用
COPY . .
RUN dotnet build -c Release -o /app/build

# 发布应用
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# 使用 .NET 8 运行时作为最终镜像
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# 创建日志目录
RUN mkdir -p /app/logs

# 复制发布的应用
COPY --from=publish /app/publish .

# 暴露端口
EXPOSE 80

# 设置入口点
ENTRYPOINT ["dotnet", "GitHubHotspotGrabber.dll"]