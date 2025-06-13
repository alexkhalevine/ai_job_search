import 'dotenv/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { JobPost } from '../utils/types'; // define this type separately

const BASE_URL = 'https://www.karriere.at/jobs';
const LOCATION = process.env.LOCATION || "wien";
const QUERY = `keywords=${process.env.SEARCH_QUERY}&locations=${LOCATION}`; // sustainability-related

export async function scrapeKarriere(): Promise<JobPost[]> {
  const url = `${BASE_URL}?${QUERY}`;
  console.log('... scrapping karriere.at ', url)

  const { data: html } = await axios.get(url);

  const $ = cheerio.load(html);
  const jobPosts: JobPost[] = [];

  $('.m-jobsList__item').each((_, el) => {
    const linkEl = $(el).find('.m-jobsListItem__title > a');
    const title = linkEl.text().trim();

    if (title.length < 1) {
      return
    }

    const url = linkEl.attr('href') ?? '';

    const company = $(el).find('.m-jobsListItem__company > a').text().trim();

    const location = $(el).find('.m-jobsListItem__locations a')
      .map((_, el) => $(el).text().trim())
      .get()
      .join(', ');
    

    const description = $(el).find('.m-jobsListItem__pills span')
    .map((_, el) => $(el).text().trim())
    .get()
    .join(', ');

    // simple heuristic for remote
    const isRemote = /remote|home\s*office/i.test(description);

    jobPosts.push({
      title,
      company,
      location,
      remote: isRemote,
      description,
      url,
      source: "karriere.at"
    });
  });

  console.log(`Found ${jobPosts.length} jobs from karriere.at.`);

  return jobPosts;
}