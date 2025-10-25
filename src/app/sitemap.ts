import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://your-domain.vercel.app'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: {
          es: `${baseUrl}?lang=es`,
          en: `${baseUrl}?lang=en`,
          pt: `${baseUrl}?lang=pt`,
        },
      },
    },
  ]
}
