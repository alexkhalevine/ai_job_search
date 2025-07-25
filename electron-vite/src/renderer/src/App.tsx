import { useState } from 'react'
import './App.css'

interface JobPost {
  title: string
  company: string
  location: string
  remote: boolean
  description: string
  url: string
  source: string
}

function App() {
  const [searchQuery, setSearchQuery] = useState('nachhaltigkeit')
  const [location, setLocation] = useState('wien')
  const [jobs, setJobs] = useState<JobPost[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    console.log('Window object:', window)
    console.log('ElectronAPI available:', !!window.electronAPI)
    console.log('ElectronAPI object:', window.electronAPI)

    if (!window.electronAPI) {
      setError('Electron API not available. Make sure the preload script is loaded.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await window.electronAPI.searchJobs({
        searchQuery,
        location
      })

      if (result.success && result.data) {
        setJobs(result.data)
      } else {
        setError(result.error || 'Unknown error occurred')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const openJobUrl = (url: string) => {
    // In a real Electron app, you might want to open this in the default browser
    console.log('Opening job URL:', url)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Job Search</h1>
        <p>Search for jobs using our intelligent scraper</p>

        <div className="search-form">
          <div className="form-group">
            <label htmlFor="searchQuery">Search Keywords:</label>
            <input
              id="searchQuery"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., nachhaltigkeit, sustainability"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., wien, vienna"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="search-button"
          >
            {isLoading ? 'Searching...' : 'Search Jobs'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {jobs.length > 0 && (
          <div className="results">
            <h2>Found {jobs.length} jobs</h2>
            <div className="jobs-list">
              {jobs.map((job, index) => (
                <div key={index} className="job-card">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">🏢 {job.company}</p>
                  <p className="job-location">
                    📍 {job.location} {job.remote && '🏠 Remote'}
                  </p>
                  <p className="job-description">{job.description}</p>
                  <div className="job-footer">
                    <span className="job-source">Source: {job.source}</span>
                    <button onClick={() => openJobUrl(job.url)} className="view-job-button">
                      View Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  )
}

export default App
