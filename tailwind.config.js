/** @type {import('tailwindcss').Config} */
// Type + color system matched to acquisition.com/roadmap
// (Poppins, navy #131628, #EFEFEF fields, #F6D234 pill CTA),
// with Vences royal blue standing in for their purple accent.
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Poppins"', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['"Poppins"', 'system-ui', '-apple-system', 'sans-serif'],
            },
            colors: {
                ink: "#131628",     // navy text + header
                paper: "#FFFFFF",
                slate: "#4A4F63",   // secondary text
                line: "#E6E6E6",
                field: "#EFEFEF",   // input + choice background
                fieldline: "#9A9A9A",
                cta: {
                    DEFAULT: "#F6D234",
                    dark: "#E8C31F",
                },
                brand: {
                    DEFAULT: "#1565C0", // Vences royal blue (crew shirts)
                    dark: "#0D47A1",
                    light: "#E8F1FC",
                    soft: "#7FA8E3",    // card border (their #9B6BFF equivalent)
                },
            },
        },
    },
    plugins: [],
}
