/// <reference types="vite/client" />

import { SearchConfig, JobPost } from './shared-types'

declare global {
  interface Window {
    electronAPI: {
      platform: string
      searchJobs: (
        config: SearchConfig
      ) => Promise<{ success: boolean; data?: JobPost[]; error?: string }>
      getJobSources: () => Promise<string[]>
    }
  }
}
