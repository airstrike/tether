export const themes = {
  dark: {
    name: 'dark',
    bg: '#1a1a1a',
    text: '#e8e8e8',
    textDim: 'rgba(232, 232, 232, 0.5)',
    accent: '#00aaff',
    border: 'rgba(255, 255, 255, 0.1)',
    navBg: 'rgba(0, 0, 0, 0.6)',
    navBorder: 'rgba(255, 255, 255, 0.15)',
    navHoverBg: 'rgba(0, 170, 255, 0.2)',
  },
  light: {
    name: 'light',
    bg: '#f5f5f0',
    text: '#1a1a1a',
    textDim: 'rgba(26, 26, 26, 0.5)',
    accent: '#0077cc',
    border: 'rgba(0, 0, 0, 0.1)',
    navBg: 'rgba(255, 255, 255, 0.8)',
    navBorder: 'rgba(0, 0, 0, 0.15)',
    navHoverBg: 'rgba(0, 119, 204, 0.1)',
  },
} as const;

export type Theme = typeof themes.dark;
export type ThemeName = keyof typeof themes;

export function generateThemeCSS(theme: Theme): string {
  return `
    --bg: ${theme.bg};
    --text: ${theme.text};
    --text-dim: ${theme.textDim};
    --accent: ${theme.accent};
    --border: ${theme.border};
    --nav-bg: ${theme.navBg};
    --nav-border: ${theme.navBorder};
    --nav-hover-bg: ${theme.navHoverBg};
  `;
}

export function generateAllThemesCSS(): string {
  return `
    :root, [data-theme="dark"] {
      ${generateThemeCSS(themes.dark)}
    }

    [data-theme="light"] {
      ${generateThemeCSS(themes.light)}
    }
  `;
}
