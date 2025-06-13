## Small experimental job seeker that uses custom web scrappers.

Currently scrapping: `karriere.at`, `stepstone.at` and `google jobs` via serpAPI

--

- Install with `npm i` in root folder
- Rename `.env.example` to `.env` and add correct env vars
- Run in your terminal `npm run start` in root folder
- Important: serptAPI that fetches google jobs is limited to 100 requests per month on free plan, check limit on https://serpapi.com/dashboard
- There is openAPi integration, prompt can be changed in `aiAgent.ts`. By default openAI is disabled, uncomment:

```
/*   for (const job of relevantJobs) {
    const summary = await analyzeJob(`Job title: ${job.title}, job dscription: ${job.description}`);
    console.log(`🔍 ${job.title} @ ${job.company} (${job.location})`);
    console.log('\n');
    console.log("AI summary:");
    console.log(summary);
    console.log('➡️', job.url);
    console.log('\n---\n');
  } */
```

and 

```
import { analyzeJob } from './utils/aiAgent';
```

to enable AI job summary