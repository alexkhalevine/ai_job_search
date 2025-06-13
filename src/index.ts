export interface JobPost {
  title: string;
  company: string;
  location: string;
  remote: boolean;
  description: string;
  url: string;
}

import { scrapeKarriere } from './scrapers/karriere';
import { scrapeStepstone } from './scrapers/stepstone';
import { isRelevantJob } from './utils/filters';
import { analyzeJob } from './utils/aiAgent';
import { scrapeGoogleJobs } from './scrapers/serpScrapper';

async function main() {
  const karriereJobs = await scrapeKarriere();
  const stepstoneJobs = await scrapeStepstone();
  const googleJobs = await scrapeGoogleJobs()

  const allJobs = [...karriereJobs, ...stepstoneJobs, ...googleJobs];

    const relevantJobs = allJobs.filter(isRelevantJob);

    console.log(`Found ${relevantJobs.length} relevant jobs.`);

    console.log(relevantJobs)

    for (const job of relevantJobs) {
        console.log(".. ", job.title);
        console.log(".. ", job.url);
        console.log('\n');
    } 

/*   for (const job of relevantJobs) {
    const summary = await analyzeJob(`Job title: ${job.title}, job dscription: ${job.description}`);
    console.log(`🔍 ${job.title} @ ${job.company} (${job.location})`);
    console.log('\n');
    console.log("AI summary:");
    console.log(summary);
    console.log('➡️', job.url);
    console.log('\n---\n');
  } */
}

main();