@echo off
chcp 65001 >nul
echo.
echo ====================================
echo   Git 代理配置工具
echo ====================================
echo.

REM 检查常见代理端口
echo [1] 检测系统代理设置...
echo.

REM 尝试获取系统代理
for /f "tokens=3" %%i in ('reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer 2^>nul ^| find "ProxyServer"') do set SYSTEM_PROXY=%%i

if defined SYSTEM_PROXY (
    echo ✓ 检测到系统代理: %SYSTEM_PROXY%
    echo.
) else (
    echo ✗ 未检测到系统代理配置
    echo.
)

echo [2] 常见代理配置:
echo.
echo   [1] Clash/ClashX 默认      - 127.0.0.1:7890
echo   [2] V2RayN 默认            - 127.0.0.1:10808
echo   [3] Shadowsocks 默认       - 127.0.0.1:1080
echo   [4] 自定义代理地址
echo   [5] 清除 Git 代理设置
echo   [0] 退出
echo.

set /p choice="请选择 [0-5]: "

if "%choice%"=="1" (
    set PROXY_URL=http://127.0.0.1:7890
    goto :set_proxy
)
if "%choice%"=="2" (
    set PROXY_URL=http://127.0.0.1:10808
    goto :set_proxy
)
if "%choice%"=="3" (
    set PROXY_URL=http://127.0.0.1:1080
    goto :set_proxy
)
if "%choice%"=="4" (
    goto :custom_proxy
)
if "%choice%"=="5" (
    goto :unset_proxy
)
if "%choice%"=="0" (
    exit /b 0
)
goto :end

:custom_proxy
echo.
set /p CUSTOM_PROXY="请输入代理地址 (格式: 127.0.0.1:7890): "
set PROXY_URL=http://%CUSTOM_PROXY%
goto :set_proxy

:set_proxy
echo.
echo [3] 配置 Git 代理...
echo.
git config --global http.proxy %PROXY_URL%
git config --global https.proxy %PROXY_URL%
echo ✓ Git HTTP 代理已设置为: %PROXY_URL%
echo ✓ Git HTTPS 代理已设置为: %PROXY_URL%
echo.
echo [4] 验证配置...
git config --global --get http.proxy
git config --global --get https.proxy
echo.
echo ✓ Git 代理配置完成！
echo.
echo 提示: 如需取消代理，请再次运行此脚本并选择选项 [5]
goto :end

:unset_proxy
echo.
echo [3] 清除 Git 代理配置...
echo.
git config --global --unset http.proxy
git config --global --unset https.proxy
echo ✓ Git 代理已清除
echo.
goto :end

:end
echo.
echo ====================================
echo   操作完成
echo ====================================
echo.
pause
