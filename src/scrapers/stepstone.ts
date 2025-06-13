import 'dotenv/config';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { JobPost } from '../utils/types'; // assuming you already defined this

const BASE_URL = 'https://www.stepstone.at';
const SEARCH_URL = `${BASE_URL}/jobs`;

const QUERY = process.env.SEARCH_QUERY;
const LOCATION = process.env.LOCATION

export async function scrapeStepstone(): Promise<JobPost[]> {
  const url = `${SEARCH_URL}/${QUERY}/in-${LOCATION}`;

  console.log('... scrapping stepstone.at ', url)
  
  const { data: html } = await axios.get(url);
  
  const $ = cheerio.load(html);
  const jobPosts: JobPost[] = [];
  
  $('article[role="button"]').each((_, el) => {
    const title = $(el).find('a[data-testid="job-item-title"] > div > div > div').text().trim();
    
    const company =  $(el).find('[data-at="job-item-company-name"] > span > [data-genesis-element="TEXT"]').text().trim();

    const location = $(el).find('[data-at="job-item-location"] > [data-genesis-element="TEXT"]').text().trim();

    const url = BASE_URL + $(el).find('a[data-testid="job-item-title"]').attr('href');
    
    // No full description here – so we use a placeholder
    const isRemote = $(el).find('[data-at="job-item-work-from-home"] > [data-genesis-element="TEXT"]').text().trim();
    const description = $(el).find('[data-at="jobcard-content"] span').text().trim() + ". Work from home: " +isRemote;

    jobPosts.push({
      title,
      company,
      location,
      remote: true, // todo: implement remote detection
      description,
      url,
      source: "stepstone.at"
    });
  });

  console.log(`Found ${jobPosts.length} jobs from stepstone.at.`);

  return jobPosts;
}