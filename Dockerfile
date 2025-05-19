# 官方Docker Hub镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 将当前目录下的文件复制到工作目录
COPY . .

# 暴露5696端口
EXPOSE 5696

# 启动Python HTTP服务器
CMD ["python", "-m", "http.server", "5696"]