# Windows Environment Manager

<p align="center">
  <img src="resources/icon.png" alt="Windows Environment Manager Logo" width="128" height="128" />
</p>

<p align="center">
  A modern, secure, and user-friendly application to manage Windows Environment Variables. Built with Electron, React, and TailwindCSS.
</p>

---

## 🚀 Features

- **Scope Management**: Separately view and manage **User** and **System** environment variables.
- **Modern UI**: Clean interface built with **React 19** and **TailwindCSS v4**, featuring glassmorphism effects and smooth animations.
- **Dark Mode**: Fully supported dark theme that respects system settings or manual toggle.
- **Search & Filter**: Real-time searching by variable name or value.
- **Safety First**: Custom confirmation dialogs and "Admin Only" indicators for system variables.
- **Internationalization**: Native support for **English** and **Simplified Chinese**.
- **Edit Modes**: Switch between simple text editing and list-based editing (for PATH variables).

## 🛠️ Tech Stack

- **Core**: [Electron](https://www.electronjs.org/)
- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/)
- **Backend / API**: Node.js + Express (Localhost server for system operations)

## 📦 Installation

To run this project locally, ensure you have **Node.js** (v16+) installed.

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/win-env-manager.git
   cd win-env-manager
   ```

2. **Install Dependencies**
   Run the convenience script to install dependencies for both root (backend) and frontend:
   ```bash
   npm run install-all
   ```

## 💻 Usage

### Development Mode
To start the application in development mode (with hot-reload):
```bash
npm run electron:dev
```
> **Note**: To modify **System Variables**, you must run your terminal/IDE as **Administrator**.

### Build for Production
To create a Windows installer/executable (`.exe`):
```bash
npm run electron:build
```
The output files will be generated in the `dist-electron` directory.

## 📂 Project Structure

```
win-env-manager/
├── electron-main.js      # Electron Main Process
├── server.js             # Local Backend API (Express)
├── resources/            # Static assets (Icon)
├── frontend/             # React Application
│   ├── src/
│   │   ├── components/   # UI Components (Modals, Toast, Table)
│   │   ├── contexts/     # State & Logic (Language, etc)
│   │   └── locales/      # Translation files
│   └── ...
└── ...
```

## 📄 License

This project is licensed under the ISC License.
