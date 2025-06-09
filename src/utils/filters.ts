import { bannedKeywords } from "./bannedKeywords";

export function isRelevantJob(job: {
  title: string;
  location: string;
  remote: boolean;
  description?: string;
}): boolean {
  const title = job.title.toLowerCase();
  const description = (job.description || '').toLowerCase();

  const viennaMatch = job.location.toLowerCase().includes('wien');
  const remoteMatch = job.remote && !viennaMatch;

  const locationOk = viennaMatch || remoteMatch;

  const isBlocked =
    bannedKeywords.some(keyword =>
      title.includes(keyword) || description.includes(keyword)
    );

  return locationOk && !isBlocked;
}
