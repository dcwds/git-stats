const colors = require("tailwindcss/colors")

const gitHubGray = {
  50: "#f0f6fc",
  100: "#c9d1d9",
  200: "#b1bac4",
  300: "#8b949e",
  400: "#6e7681",
  500: "#484f58",
  600: "#30363d",
  700: "#21262d",
  800: "#161b22",
  900: "#0d1117",
}

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      white: "#f0f6fc",
      gray: gitHubGray,
      blue: colors.blue,
      black: colors.black,
    },
    fontFamily: {
      primary: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        '"Noto Sans"',
        "sans-serif",
      ],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
