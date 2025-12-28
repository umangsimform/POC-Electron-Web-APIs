# Electron Web APIs POC

This project is a Proof of Concept (POC) Electron application that demonstrates the use of various OS-level APIs and Electron features. It serves as a reference for developers looking to integrate native system capabilities into their Electron apps.

## Features

- **Clipboard Access**: Read and write to the system clipboard.
- **Dialogs**: Show native dialog boxes (open, save, message boxes).
- **Dock Integration**: Interact with the OS dock/taskbar.
- **Global Shortcuts**: Register and handle global keyboard shortcuts.
- **In-App Purchases**: Example integration for in-app purchases.
- **Net Logging**: Capture and display network logs.
- **Notifications**: Show native system notifications.
- **Power Monitor**: Monitor system power events (suspend, resume, etc.).
- **Power Save Blocker**: Prevent the system from entering sleep mode.
- **Printing**: Print documents from the app.
- **Screen Information**: Access and display screen details.
- **Session Management**: Manage browser sessions and cookies.
- **System Info**: Display system information (CPU, memory, etc.).
- **System Preferences**: Access and modify system preferences.
- **Tray Integration**: Add and manage a system tray icon.
- **Window Controls**: Custom window controls (minimize, maximize, close).
- **Window Management**: Manage multiple windows.
- **Auto Update**: Demonstrates Electron's auto-update capabilities.

## Project Structure

```
├── electron/           # Electron main and preload scripts
│   ├── main/           # Main process code
│   └── preload/        # Preload scripts
├── src/                # Renderer process (React UI)
│   ├── components/     # UI components for each feature
│   ├── api/            # API helpers
│   ├── helpers/        # Utility helpers
│   ├── samples/        # Sample code
│   └── store/          # State management
├── public/             # Static assets
├── build/              # Build output
├── dist-electron/      # Electron build output
├── release/            # Release artifacts
├── package.json        # Project metadata and scripts
├── vite.config.ts      # Vite configuration
├── electron-builder.json5 # Electron builder config
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
npm install
```

### Development

To start the app in development mode:

```bash
npm run dev
```

### Build

To build the app for production:

```bash
npm run build
```

### Package Electron App

To package the Electron app:

```bash
npm run electron:build
```

## Folder Details

- **electron/**: Contains Electron main and preload scripts.
- **src/components/sections/**: Each file demonstrates a specific Electron or OS-level API.
- **src/update/**: Handles auto-update UI and logic.
- **src/store/**: State management (Redux or similar).
- **public/**: Static files served by the app.

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.

## References

- [Electron Documentation](https://www.electronjs.org/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

For more details, see the code comments and individual component documentation in the `src/components/sections/` folder.
