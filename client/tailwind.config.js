export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#93C5FD", // Soft blue for hover effects or lighter elements
          DEFAULT: "#3B82F6", // Main brand color (vivid blue)
          dark: "#1D4ED8", // Darker blue for headers or key elements
        },
        secondary: {
          light: "#FBCFE8", // Soft pink for highlights or backgrounds
          DEFAULT: "#EC4899", // Secondary accent (vivid pink)
          dark: "#BE185D", // Darker pink for hover effects
        },
        neutral: {
          light: "#F3F4F6", // Light neutral background color
          DEFAULT: "#9CA3AF", // Neutral gray for text or borders
          dark: "#374151", // Dark gray for headings or emphasis
        },
        background: {
          light: "#FFFFFF", // Clean white for backgrounds
          DEFAULT: "#F9FAFB", // Subtle off-white for primary sections
          dark: "#1E293B", // Dark background for night mode or cards
        },
        accent: {
          light: "#BAE6FD", // Light cyan for hover or subtle accents
          DEFAULT: "#38BDF8", // Main accent color (cool cyan)
          dark: "#0284C7", // Dark cyan for hover or active states
        },
        success: {
          light: "#D1FAE5", // Light green for success messages
          DEFAULT: "#10B981", // Main success green
          dark: "#047857", // Dark green for emphasis
        },
        danger: {
          light: "#FECACA", // Light red for warnings or errors
          DEFAULT: "#EF4444", // Danger red
          dark: "#B91C1C", // Dark red for critical alerts
        },
        highlight: {
          light: "#FEF9C3", // Light yellow for highlights
          DEFAULT: "#FACC15", // Bright yellow for important elements
          dark: "#CA8A04", // Darker yellow for contrast
        },
      },
    },
  },
  plugins: [],
};
