import axios from 'axios'
import * as cheerio from 'cheerio'

export interface JobPost {
  title: string
  company: string
  location: string
  remote: boolean
  description: string
  url: string
  source: string
}

export interface SearchConfig {
  searchQuery: string
  location: string
}

export interface SearchResult {
  jobs: JobPost[]
  totalCount: number
  source: string
  timestamp: Date
}

const BASE_URL = 'https://www.karriere.at/jobs'

export class JobScraperService {
  private static instance: JobScraperService

  public static getInstance(): JobScraperService {
    if (!JobScraperService.instance) {
      JobScraperService.instance = new JobScraperService()
    }
    return JobScraperService.instance
  }

  public async scrapeKarriere(config: SearchConfig): Promise<JobPost[]> {
    const query = `keywords=${config.searchQuery}&locations=${config.location}`
    const url = `${BASE_URL}?${query}`

    console.log('... scraping karriere.at ', url)

    try {
      const { data: html } = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      })

      const $ = cheerio.load(html)
      const jobPosts: JobPost[] = []

      $('.m-jobsList__item').each((_, el) => {
        const linkEl = $(el).find('.m-jobsListItem__title > a')
        const title = linkEl.text().trim()

        if (title.length < 1) {
          return
        }

        const url = linkEl.attr('href') ?? ''
        const company = $(el).find('.m-jobsListItem__company > a').text().trim()

        const location = $(el)
          .find('.m-jobsListItem__locations a')
          .map((_, el) => $(el).text().trim())
          .get()
          .join(', ')

        const description = $(el)
          .find('.m-jobsListItem__pills span')
          .map((_, el) => $(el).text().trim())
          .get()
          .join(', ')

        // simple heuristic for remote
        const isRemote = /remote|home\s*office/i.test(description)

        jobPosts.push({
          title,
          company,
          location,
          remote: isRemote,
          description,
          url: url.startsWith('http') ? url : `https://www.karriere.at${url}`,
          source: 'karriere.at'
        })
      })

      console.log(`Found ${jobPosts.length} jobs from karriere.at.`)
      return jobPosts
    } catch (error) {
      console.error('Error scraping karriere.at:', error)
      throw new Error(`Failed to scrape karriere.at: ${error}`)
    }
  }

  public async searchJobs(config: SearchConfig): Promise<JobPost[]> {
    // For now, only karriere.at, but can be extended to other sources
    const karriereJobs = await this.scrapeKarriere(config)
    return karriereJobs
  }
}
