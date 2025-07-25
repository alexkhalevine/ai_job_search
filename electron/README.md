# AI Job Search - Electron App

A modern Electron application built with React, TypeScript, and Vite, featuring hot module reloading for efficient development.

## Features

- ⚡️ **Vite** - Lightning fast build tool and dev server
- ⚛️ **React 18** - Latest version with concurrent features
- 🔷 **TypeScript** - Full type safety
- 🖥️ **Electron** - Cross-platform desktop app framework
- 🔥 **Hot Reloading** - Instant updates during development
- 📦 **Electron Builder** - Easy packaging and distribution

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**

## Installation

1. Navigate to the electron directory:
   ```bash
   cd electron
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development environment with hot reloading:

```bash
npm run dev
```

This command will:
1. Start the Vite dev server for React (http://localhost:5173)
2. Launch Electron and load the app
3. Enable hot module reloading for React components

### Individual Commands

You can also run the components separately:

- **Start React dev server only:**
  ```bash
  npm run dev:react
  ```

- **Start Electron only (requires React dev server to be running):**
  ```bash
  npm run dev:electron
  ```

## Building

### Development Build
```bash
npm run build
```

### Production Package
```bash
npm run package
```

This will create platform-specific distributables in the `release/` directory.

## Project Structure

```
electron/
├── src/
│   ├── main.ts          # Electron main process
│   ├── preload.ts       # Preload script for security
│   ├── main.tsx         # React entry point
│   ├── App.tsx          # Main React component
│   ├── App.css          # Component styles
│   ├── index.css        # Global styles
│   └── vite-env.d.ts    # TypeScript declarations
├── dist/                # Compiled Electron files
├── build/               # Compiled React files
├── package.json
├── tsconfig.json        # TypeScript config for Electron
├── tsconfig.app.json    # TypeScript config for React
├── tsconfig.node.json   # TypeScript config for Vite
├── vite.config.ts       # Vite configuration
└── index.html           # HTML template
```

## Scripts

- `npm run dev` - Start development environment
- `npm run dev:react` - Start only React dev server
- `npm run dev:electron` - Start only Electron (requires React server)
- `npm run build` - Build both React and Electron
- `npm run build:react` - Build only React
- `npm run build:electron` - Build only Electron
- `npm run start` - Start built application
- `npm run package` - Package app for distribution
- `npm run clean` - Clean build directories

## Development Tips

1. **Hot Reloading**: Changes to React components will be reflected instantly without restarting Electron.

2. **DevTools**: In development mode, Chrome DevTools will open automatically. You can also open them manually with `Cmd+Option+I` (Mac) or `Ctrl+Shift+I` (Windows/Linux).

3. **Debugging Electron**: You can debug the main Electron process by adding `--inspect` to the electron command or using VS Code's built-in debugger.

4. **Security**: The app uses context isolation and disables node integration for security. Use the preload script to expose specific APIs to the renderer process.

## Customization

- **Window Settings**: Modify `src/main.ts` to change window size, title bar style, etc.
- **Build Settings**: Update `package.json` build configuration for different packaging options
- **Vite Config**: Modify `vite.config.ts` for custom build behavior
- **TypeScript**: Adjust `tsconfig.*.json` files for different compilation settings

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, you can change it in `vite.config.ts`:
```typescript
server: {
  port: 3000, // Change to your preferred port
  strictPort: true,
}
```

### Build Issues
If you encounter build issues, try:
```bash
npm run clean
npm install
npm run build
```

### Electron Won't Start
Make sure the React dev server is running on the correct port before starting Electron in development mode.

## License

MIT
