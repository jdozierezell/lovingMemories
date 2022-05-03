// tailwind.config.js
module.exports = {
    future: {},
    purge: {
        // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
        enabled: process.env.NODE_ENV === 'production',
        content: [
            'src/components/**/*.js',
            'src/components/*.js',
            'src/pages/*.js',
        ]
    },
    theme: {
        extend: {
            colors: {
                'afsp-blue': '#3D72FB',
                'afsp-blue-dark': '#3928BD',
                'bg-blue-900': '#3928BD',
                'hover:bg-blue-900': '#3928BD',
                'afsp-cancel': '#DF3191',
                'afsp-cancel-hover': '#BD289B',
                'afsp-gray': '#707070',
                'afsp-black': '#262626',
                'text-gray-700': '#000000'
            },
            inset: {
                '90vh': '90vh',
                '78vw': '78vw'
            }
        },
    },
    variants: {
        extend: {
            opacity: [
                "disabled"
            ],
            backgroundColor: [
                "disabled"
            ],
            cursor: [
                "disabled"
            ]
        }
    },
    plugins: [],
}