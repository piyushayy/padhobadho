import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'padhobadho',
        short_name: 'padhobadho',
        description: 'Precision Exam Preparation Ecosystem',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        orientation: 'portrait',
        categories: ['education', 'productivity'],
        // icons: [
        //    Placeholder for future PWA icons if you add them to /public
        // ],
    }
}
