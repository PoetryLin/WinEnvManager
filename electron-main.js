const { app, BrowserWindow } = require('electron');
const path = require('path');

// 引入 Express 后端
// 确保 server.js 不会阻塞，这里直接 require 即可启动服务
// 注意：如果 server.js 逻辑是直接运行的，它会在此处启动
require('./server.js');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'resources/icon.png')
    });

    const isDev = !app.isPackaged;

    if (isDev) {
        // 开发模式：等待 Vite 启动
        // 这里假设 Vite 运行在 5173
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {
        // 生产模式：加载打包后的文件
        // 这里假设 frontend 构建输出到了 frontend/dist
        win.loadFile(path.join(__dirname, 'frontend/dist/index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
