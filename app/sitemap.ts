import { MetadataRoute } from 'next';
import stacksData from '@/lib/stacks.json';

const BASE_URL = 'https://stackadvisor-nu.vercel.app';
const STACKS: any[] = (stacksData as any).stacks;

export default function sitemap(): MetadataRoute.Sitemap {
  const stackRoutes = STACKS.map((stack) => ({
    url: `${BASE_URL}/stacks/${stack.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/stacks`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/questionnaire`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...stackRoutes,
  ];
}
