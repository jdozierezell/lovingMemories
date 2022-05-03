module.exports = () => ({
	purge: ["./src/**/*.{js,jsx,ts,tsx}"],
	plugins: [require("tailwindcss"), require("autoprefixer")],
})