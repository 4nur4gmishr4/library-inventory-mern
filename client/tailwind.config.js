import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "primary-fixed-dim": "#b1c5ff",
        "inverse-primary": "#b1c5ff",
        "tertiary-fixed-dim": "#ffb59a",
        "secondary-fixed": "#dae2ff",
        "on-primary": "#ffffff",
        "surface-tint": "#2559bd",
        "secondary-container": "#c1d1ff",
        "secondary-fixed-dim": "#b6c6f3",
        "surface-variant": "#e2e2eb",
        "on-secondary-fixed": "#081a3e",
        "outline-variant": "#c3c6d5",
        "error-container": "#ffdad6",
        "on-primary-fixed-variant": "#00419e",
        "on-tertiary-container": "#ffaa8a",
        "surface-container-lowest": "#ffffff",
        "inverse-on-surface": "#f0f0f9",
        "surface-dim": "#d9d9e2",
        "on-error-container": "#93000a",
        "primary-fixed": "#dae2ff",
        "surface-container-low": "#f3f3fc",
        "on-error": "#ffffff",
        "surface-container-high": "#e7e7f0",
        "on-tertiary-fixed-variant": "#802900",
        "tertiary-container": "#8b2e01",
        "error": "#ba1a1a",
        "surface": "#faf8ff",
        "outline": "#737784",
        "surface-container-highest": "#e2e2eb",
        "on-surface": "#191b22",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#4a5980",
        "on-tertiary-fixed": "#380d00",
        "on-background": "#191b22",
        "on-surface-variant": "#434653",
        "primary-container": "#0047ab",
        "primary": "#00327d",
        "on-tertiary": "#ffffff",
        "on-secondary-fixed-variant": "#37466c",
        "tertiary-fixed": "#ffdbcf",
        "surface-container": "#ededf6",
        "on-primary-fixed": "#001946",
        "inverse-surface": "#2e3037",
        "background": "#faf8ff",
        "surface-bright": "#faf8ff",
        "secondary": "#4e5e85",
        "on-primary-container": "#a5bdff",
        "tertiary": "#651f00"
      },
      "borderRadius": {
        "DEFAULT": "0px",
        "sm": "0px",
        "md": "0px",
        "lg": "0px",
        "xl": "0px",
        "2xl": "0px",
        "3xl": "0px",
        "full": "0px"
      },
      "spacing": {
        "lg": "24px",
        "margin-desktop": "32px",
        "margin-mobile": "16px",
        "unit": "4px",
        "gutter": "16px",
        "xs": "4px",
        "md": "16px",
        "sm": "8px",
        "xl": "48px"
      },
      "fontFamily": {
        "headline-lg-mobile": ["IBM Plex Sans"],
        "headline-lg": ["IBM Plex Sans"],
        "label-sm": ["IBM Plex Sans"],
        "body-md": ["IBM Plex Sans"]
      },
      "fontSize": {
        "headline-lg-mobile": ["20px", { "lineHeight": "28px", "fontWeight": "600" }],
        "headline-lg": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "label-sm": ["13px", { "lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }]
      }
    },
  },
  plugins: [
    forms,
    containerQueries
  ],
}
