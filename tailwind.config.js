/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,svelte}"],
  theme: {
    extend: {
      colors: {
        primary: "#4b0082",
        accent: "#8a2be2",
        surface: "#0d0d2f",
        background: "#000",
        light: "#f0f0ff", // for text
        dark: "#2a1a4a" // for text
      },
      boxShadow: theme => ({
        glow: `0 0 20px ${theme("colors.primary")}`
      }),
      textShadow: theme => ({
        DEFAULT: `0 0 5px ${theme("colors.primary")},
        0 0 10px ${theme("colors.primary")},
        0 0 20px ${theme("colors.primary")}`
      }),
      cursor: {
        cross: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M8 8L24 24M8 24L24 8" stroke="%23f0f0ff" stroke-width="2"/></svg>') 16 16, auto;`
      },
      fontFamily: {
        fantasy: ["Luminari", "fantasy"]
      },
      aria: {
        current: "current='true'"
      }
    }
  },
  plugins: [
    plugin(function ({matchUtilities, theme}) {
      matchUtilities(
        {
          "text-shadow": value => ({
            textShadow: value
          })
        },
        {values: theme("textShadow")}
      );
    })
  ]
};
