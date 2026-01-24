import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/dashboard/', '/onboarding/', '/checkout/'],
        },
        sitemap: 'https://padhobadho.com/sitemap.xml',
    }
}
