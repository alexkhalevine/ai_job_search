import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron'
import { JobPost, SearchConfig } from '../main'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,

  // Job search functionality
  searchJobs: async (
    config: SearchConfig
  ): Promise<{
    success: boolean
    data?: JobPost[]
    error?: string
    meta: { discardedCount: number }
  }> => {
    return await ipcRenderer.invoke('search-jobs', config)
  },

  getJobSources: async (): Promise<string[]> => {
    return await ipcRenderer.invoke('get-job-sources')
  }
})
