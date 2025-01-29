/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
          colors: {
            "blurple": "#5865F2",
            "github-black": "#181717",
            "slurple": "#4A154B"
          }
        },
    },
    plugins: [require('@tailwindcss/typography'), require("daisyui")],
    daisyui: {
      themes: ["retro"],
    },
};
