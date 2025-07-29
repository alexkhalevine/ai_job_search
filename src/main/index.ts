import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { JobScraperService, SearchConfig } from './services/jobScraperService'
import { isRelevantJob } from '@utils/filters'
import { Blacklist } from '@utils/bannedKeywords'
const jobScraperService = JobScraperService.getInstance()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.setFullScreen(true)
  //mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers for job scraping
ipcMain.handle('search-jobs', async (_event, config: SearchConfig) => {
  try {
    console.log('Received search request:', config)
    const foundJobs = await jobScraperService.searchJobs(config)

    const allJobs = [...foundJobs]

    const relevantJobs = allJobs.filter(isRelevantJob)
    const discardedJobs = allJobs.length - relevantJobs.length

    console.log(
      `Total jobs found: ${allJobs.length}, Relevant jobs: ${relevantJobs.length}, Discarded jobs: ${discardedJobs}`
    )

    return { success: true, data: relevantJobs, meta: { discardedCount: discardedJobs } }
  } catch (error) {
    console.error('Error in search-jobs handler:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

ipcMain.handle('get-job-sources', async () => {
  return ['karriere.at'] // Can be extended later
})

ipcMain.handle('load-blacklist', async () => {
  const blacklist = Blacklist.load()
  return blacklist
})

ipcMain.handle('update-blacklist', async (_event, blacklistArray: string[]) => {
  const result = Blacklist.save(blacklistArray)
  return result
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
