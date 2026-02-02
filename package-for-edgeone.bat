@echo off
echo ========================================
echo   樱花树时光机 - EdgeOne 部署打包脚本
echo ========================================
echo.

echo [1/3] 清理旧构建...
if exist frontend\dist rmdir /s /q frontend\dist

echo [2/3] 构建项目...
cd frontend
call npm install
call npm run build
cd ..

echo [3/3] 打包部署文件...
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set ZIPFILE=edgeone-deploy-%TIMESTAMP%.zip

powershell Compress-Archive -Path frontend\dist\* -DestinationPath %ZIPFILE% -Force

echo.
echo ========================================
echo   打包完成！
echo ========================================
echo.
echo 部署包: %ZIPFILE%
echo.
echo 下一步：
echo 1. 登录 EdgeOne 控制台: https://console.cloud.tencent.com/edgeone
echo 2. 创建或选择站点
echo 3. 上传 %ZIPFILE%
echo.
echo 或参考 DEPLOY_EDGEONE.md 获取详细说明
echo.
pause
