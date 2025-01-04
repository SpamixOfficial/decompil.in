/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
          colors: {
            "blurple": "#5865F2",
            "github-black": "#181717"
          }
        },
    },
    plugins: [require('@tailwindcss/typography'), require("daisyui")],
    daisyui: {
      themes: ["retro"],
    },
};
