import axios from "axios";
import * as dotenv from "dotenv";
import { JobPost } from "../utils/types";

dotenv.config();

const SERPAPI_KEY = process.env.SERPAPI_KEY!;
const SERPAPI_URL = "https://serpapi.com/search.json";

async function fetchGoogleJobs(
  query: string,
  location: string
): Promise<JobPost[]> {
  const response = await axios.get(SERPAPI_URL, {
    params: {
      engine: "google_jobs",
      q: query,
      location,
      api_key: SERPAPI_KEY,
    },
  });

  const results = response.data.jobs_results;
  if (!Array.isArray(results)) return [];

  const jobs: JobPost[] = results.map(
    (job: any): JobPost => ({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      remote: /remote|home\s*office/i.test(
        (job.location ?? "") + (job.description ?? "")
      ),
      description:
        job.description +
        " More info: " +
        Object.entries(job.detected_extensions)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", "),
      url:
        job.apply_options.map((opt: any) => `${opt.title}: ${opt.link}`),
    })
  );

  return jobs;
}

export async function scrapeGoogleJobs(): Promise<JobPost[]> {
  //const queries = ['sustainability', 'life cycle assessment', 'resource management'];
  const queries = ["sustainability"];
  const locations = ["Vienna"];

  const allJobs: JobPost[] = [];

  for (const q of queries) {
    for (const loc of locations) {
      const jobs = await fetchGoogleJobs(q, loc);
      allJobs.push(...jobs);
    }
  }

  console.log(`Found ${allJobs.length} jobs from Google Jobs.`);

  return allJobs;
}
