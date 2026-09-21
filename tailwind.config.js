/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                display: ['"DM Serif Display"', 'Georgia', 'serif'],
                sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
            },
            colors: {
                // ---- Vences House Painters palette ----
                paper: "#F7F5F0",   // warm white page
                ink: "#1B1F24",     // primary text / dark surfaces
                slate: "#5B6470",   // secondary text
                line: "#E3DED4",    // borders
                brand: {
                    DEFAULT: "#1565C0", // Vences royal blue (crew polos)
                    dark: "#0D47A1",
                    light: "#E8F1FC",
                },
            },
        },
    },
    plugins: [],
}
