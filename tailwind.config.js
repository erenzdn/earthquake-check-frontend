/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["Outfit", "Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        ec: {
          bg: {
            base: "#F4F7FB",
            surface: "#FFFFFF",
          },
          hero: {
            start: "#0B1725",
            mid: "#102336",
            end: "#163149",
          },
          text: {
            primary: "#0F172A",
            secondary: "#475569",
            onDark: "#F8FAFC",
          },
          border: {
            soft: "#D8E2F0",
          },
          brand: {
            primary: "#1D4ED8",
            secondary: "#22D3EE",
          },
          cta: {
            primary: "#FFFFFF",
            primaryText: "#0F2E46",
            secondaryBorder: "#BFDBFE",
          },
        },
      },
      borderRadius: {
        ecSm: "12px",
        ecMd: "18px",
        ecLg: "24px",
      },
      spacing: {
        ecSection: "72px",
      },
      boxShadow: {
        ecCard: "0 10px 28px rgba(15, 23, 42, 0.08)",
        ecHeroImage: "0 24px 50px rgba(6, 14, 24, 0.48)",
        ecButton: "0 14px 35px rgba(0, 0, 0, 0.28)",
      },
      maxWidth: {
        ecHero: "1240px",
      },
    },
  },
  plugins: [],
}

