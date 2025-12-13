/**@type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'deep-dark': '#030612',
                'neon-blue': '#00f2ff',
                'alert-red': 'ff2a2a',
                'success-green': '#00ff41',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}