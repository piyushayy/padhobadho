import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'PadhoBadho - Free Exam Preparation',
        short_name: 'PadhoBadho',
        description: '100% Free Practice Drills, Mock Tests, and Study Vault for Class 12 Boards, JEE, NEET, CUET, SSC & DSSSB.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0c0c0c',
        theme_color: '#10b981',
        orientation: 'portrait',
        categories: ['education', 'productivity'],
        icons: [
            {
                src: '/icon',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                src: '/apple-icon',
                sizes: '180x180',
                type: 'image/png',
            }
        ],
    }
}
