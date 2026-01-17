# Windows 环境变量管理器 (Windows Env Manager)

这是一个基于 Web 技术的本地应用程序，用于简便地管理 Windows 系统的环境变量（用户变量和系统变量）。

## 🚀 功能特点

- **查看变量**：清晰展示当前用户 (User) 和系统 (System/Machine) 的所有环境变量。
- **搜索过滤**：实时搜索变量名或变量值。
- **新增/编辑**：轻松创建新的环境变量或修改现有变量。
- **删除变量**：安全删除不再需要的变量。
- **现代化 UI**：基于 React 和 TailwindCSS 构建，支持暗黑模式 (Dark Mode)。

## 📂 项目结构

```
huan-jing-bian-liang/
├── server.js               # 后端入口 (Node.js/Express) - 处理系统调用
├── package.json            # 后端依赖配置
├── implementation_plan.md  # 项目开发计划文档
├── README.md               # 项目说明文档
└── frontend/               # 前端项目 (React + Vite)
    ├── index.html          # 前端入口 HTML
    ├── package.json        # 前端依赖配置
    ├── postcss.config.js   # CSS 处理配置
    ├── tailwind.config.js  # TailwindCSS 配置
    ├── vite.config.js      # Vite 构建工具配置
    └── src/
        ├── App.jsx         # 主应用组件
        ├── api.js          # 后端 API 接口封装
        ├── index.css       # 全局样式 (Tailwind)
        └── components/     # UI 组件
            ├── EditModal.jsx     # 编辑/新增弹窗
            └── VariableTable.jsx # 变量列表表格
```

## 🛠️ 技术栈

- **Frontend**: React 19, Vite, TailwindCSS v4, Lucide React (图标)
- **Backend**: Node.js, Express
- **System Interaction**: PowerShell (通过 Node.js `child_process`)

## 🏃 如何运行

本项目包含前端和后端两个部分，需要同时启动。

### 1. 安装依赖

在项目根目录和 frontend 目录下分别安装依赖：

```bash
# 根目录 (后端)
npm install

# 前端目录
cd frontend
npm install
```

### 2. 启动后端服务

后端服务运行在 port 3000。

```bash
# 在根目录下
node server.js
```

> **注意**：如果要修改**系统变量 (System/Machine Scope)**，请以**管理员身份 (Administrator)** 运行此命令（打开 CMD/PowerShell 时选择“以管理员身份运行”）。修改用户变量无需特殊权限。

### 3. 启动前端界面

前端开发服务器运行在 port 5173。

```bash
# 在 frontend 目录下
npm run dev
```

启动后，打开浏览器访问 [http://localhost:5173](http://localhost:5173) 即可使用。

## ⚠️ 注意事项

- **权限**：Node.js 后端通过 PowerShell 执行 `[Environment]::SetEnvironmentVariable`。若遇到权限错误，请确保终端具有管理员权限。
- **生效时间**：修改环境变量后，通常立即在该应用中生效。但对于其他正在运行的应用程序（如 CMD、IDEA 等），可能需要重启这些应用才能获取到最新的环境变量。
