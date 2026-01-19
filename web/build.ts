import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { Fountain } from 'fountain-js';

const SCREENPLAYS_DIR = join(dirname(import.meta.dir), 'screenplays');
const SRC_DIR = join(import.meta.dir, 'src');
const DIST_DIR = join(import.meta.dir, 'dist');
const PAGES_DIR = join(import.meta.dir, 'pages');
const FONTS_DIR = join(SRC_DIR, 'fonts');

// Read the worker template
const workerTemplate = readFileSync(join(SRC_DIR, 'worker.ts'), 'utf-8');

// Read the episode fountain file
const episode01 = readFileSync(
  join(SCREENPLAYS_DIR, 'episode-01-the-return.fountain'),
  'utf-8'
);

// Read font base64 files
const fontRegular = readFileSync(join(FONTS_DIR, 'GT-Pressura-Mono-Regular.b64'), 'utf-8');
const fontBold = readFileSync(join(FONTS_DIR, 'GT-Pressura-Mono-Bold.b64'), 'utf-8');
const fontLight = readFileSync(join(FONTS_DIR, 'GT-Pressura-Mono-Light.b64'), 'utf-8');

// Generate @font-face CSS
const fontCSS = `
@font-face {
  font-family: 'GT Pressura Mono';
  src: url(data:font/truetype;base64,${fontLight}) format('truetype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'GT Pressura Mono';
  src: url(data:font/truetype;base64,${fontRegular}) format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'GT Pressura Mono';
  src: url(data:font/truetype;base64,${fontBold}) format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
`;

// Escape backticks and ${} for template literal embedding
function escapeForTemplateLiteral(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

// Replace placeholder with actual content
let workerCode = workerTemplate.replace(
  '`{{EPISODE_01}}`',
  '`' + escapeForTemplateLiteral(episode01) + '`'
);

// Ensure dist directory exists
mkdirSync(DIST_DIR, { recursive: true });

// Write the built worker
writeFileSync(join(DIST_DIR, 'worker.ts'), workerCode);

// Generate fonts.ts with embedded CSS
const fontsTemplate = readFileSync(join(SRC_DIR, 'fonts.ts'), 'utf-8');
const fontsCode = fontsTemplate.replace('`{{FONT_CSS}}`', '`' + escapeForTemplateLiteral(fontCSS) + '`');
writeFileSync(join(DIST_DIR, 'fonts.ts'), fontsCode);

// Copy supporting modules
copyFileSync(join(SRC_DIR, 'theme.ts'), join(DIST_DIR, 'theme.ts'));
copyFileSync(join(SRC_DIR, 'icons.ts'), join(DIST_DIR, 'icons.ts'));

console.log('Worker built to dist/worker.ts');

// ============================================
// Static Pages Build (for Cloudflare Pages)
// ============================================

import { generateAllThemesCSS } from './src/theme';
import { icons } from './src/icons';

const EPISODES = [
  { slug: '01', file: 'episode-01-the-return.fountain', title: 'Episode 1: The Return' },
];

function renderScreenplay(
  fountainText: string,
  currentEpisode: { slug: string; title: string },
  allEpisodes: { slug: string; title: string }[]
): string {
  const fountain = new Fountain();
  const script = fountain.parse(fountainText);

  const currentIndex = allEpisodes.findIndex(e => e.slug === currentEpisode.slug);
  const prevEpisode = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null;

  const themeCSS = generateAllThemesCSS();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${script.title || currentEpisode.title} - TETHER</title>
  <style>
    ${fontCSS}
    ${themeCSS}

    :root {
      --page-width: 8.5in;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'GT Pressura Mono', 'Courier New', Courier, monospace;
      font-size: 12pt;
      font-weight: 300;
      line-height: 1.5;
      background-color: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 0;
      transition: background-color 0.2s, color 0.2s;
    }

    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      padding: 15px 20px;
      background: linear-gradient(to bottom, var(--bg) 0%, var(--bg) 70%, transparent 100%);
      z-index: 100;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.2s;
    }

    .header-title {
      font-weight: bold;
      color: var(--text-dim);
      font-size: 14px;
      letter-spacing: 2px;
      flex: 1;
    }

    .header-title:last-child {
      text-align: right;
    }

    .theme-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: var(--text-dim);
      transition: color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .theme-toggle:hover {
      color: var(--text);
    }

    .theme-toggle svg {
      display: block;
    }

    .icon-sun { display: none; }
    .icon-moon { display: block; }
    [data-theme="light"] .icon-sun { display: block; }
    [data-theme="light"] .icon-moon { display: none; }

    .screenplay-container {
      max-width: var(--page-width);
      margin: 0 auto;
      padding: 80px 1in 120px 1in;
    }

    .title-page {
      text-align: center;
      padding: 2in 0;
      margin-bottom: 2em;
      border-bottom: 1px solid var(--border);
    }

    .title-page h1 {
      font-size: 24pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin: 0 0 1em 0;
    }

    .title-page p {
      margin: 0.5em 0;
      color: var(--text-dim);
    }

    .script {
      white-space: pre-wrap;
    }

    .scene-heading {
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 2em;
      margin-bottom: 1em;
    }

    .action {
      margin: 1em 0;
    }

    .character {
      margin-top: 1em;
      margin-left: 2in;
      text-transform: uppercase;
      font-weight: bold;
    }

    .dialogue {
      margin-left: 1in;
      margin-right: 1.5in;
      margin-bottom: 1em;
    }

    .parenthetical {
      margin-left: 1.5in;
      margin-right: 2in;
      color: var(--text-dim);
    }

    .transition {
      text-align: right;
      text-transform: uppercase;
      font-weight: bold;
      margin: 2em 0;
    }

    .centered {
      text-align: center;
      margin: 2em 0;
    }

    .section-heading {
      font-weight: bold;
      margin-top: 2em;
    }

    .synopsis {
      color: var(--text-dim);
      font-style: italic;
      margin: 1em 0;
    }

    .note {
      background: var(--nav-bg);
      padding: 0.5em 1em;
      border-left: 2px solid var(--accent);
      margin: 1em 0;
      color: var(--text-dim);
    }

    .page-break {
      border-top: 1px dashed var(--border);
      margin: 3em 0;
      text-align: center;
      position: relative;
    }

    .nav-button {
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      background-color: var(--nav-bg);
      color: var(--text-dim);
      border: 1px solid var(--nav-border);
      border-radius: 4px;
      padding: 16px 10px;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-button:hover {
      background-color: var(--nav-hover-bg);
      color: var(--text);
      border-color: var(--accent);
    }

    .nav-prev {
      left: 20px;
    }

    .nav-next {
      right: 20px;
    }

    @media (max-width: 768px) {
      .screenplay-container {
        padding: 80px 20px 120px 20px;
      }

      .character {
        margin-left: 1in;
      }

      .dialogue {
        margin-left: 0.5in;
        margin-right: 0.5in;
      }

      .parenthetical {
        margin-left: 0.75in;
        margin-right: 0.75in;
      }

      .nav-button {
        padding: 12px 8px;
      }

      .nav-prev {
        left: 10px;
      }

      .nav-next {
        right: 10px;
      }
    }

    .footer {
      max-width: var(--page-width);
      margin: 0 auto;
      padding: 40px 1in 60px 1in;
      border-top: 1px solid var(--border);
      text-align: center;
      color: var(--text-dim);
      font-size: 11pt;
    }

    .footer a {
      color: var(--text-dim);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer a:hover {
      color: var(--text);
    }

    .counter-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 12px;
    }

    .counter-label {
      font-size: 10pt;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-dim);
    }

    .counter-display {
      display: flex;
      gap: 2px;
    }

    .counter-digit {
      display: inline-block;
      width: 1.2em;
      height: 1.6em;
      background: var(--nav-bg);
      border: 1px solid var(--border);
      border-radius: 2px;
      text-align: center;
      line-height: 1.6em;
      font-size: 11pt;
      font-weight: 400;
      transition: transform 0.3s ease;
    }

    .counter-digit.flip {
      transform: rotateX(360deg);
    }

    @media (max-width: 768px) {
      .footer {
        padding: 40px 20px 60px 20px;
      }
    }

    @media print {
      body {
        background: white !important;
        color: black !important;
      }

      .header, .nav-button, .footer {
        display: none !important;
      }

      .screenplay-container {
        padding: 0;
        max-width: none;
      }
    }
  </style>
  <script>
    (function() {
      const saved = localStorage.getItem('tether-theme');
      if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
      }
    })();
  </script>
</head>
<body>
  <div class="header">
    <span class="header-title">TETHER</span>
    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
      <span class="icon-sun">${icons.sun}</span>
      <span class="icon-moon">${icons.moon}</span>
    </button>
    <span class="header-title">${currentEpisode.title.toUpperCase()}</span>
  </div>

  <div class="screenplay-container">
    <div class="title-page">
      ${script.html.title_page}
    </div>
    <div class="script">
      ${script.html.script}
    </div>
  </div>

  <footer class="footer">
    <a href="https://x.com/andxdy" target="_blank" rel="noopener">@andxdy</a>
    <div class="counter-container">
      <span class="counter-label">readers</span>
      <div class="counter-display" id="visitor-counter">
        <span class="counter-digit">-</span>
        <span class="counter-digit">-</span>
        <span class="counter-digit">-</span>
        <span class="counter-digit">-</span>
        <span class="counter-digit">-</span>
        <span class="counter-digit">-</span>
      </div>
    </div>
  </footer>

  ${prevEpisode ? `<a href="/episode/${prevEpisode.slug}/" class="nav-button nav-prev">${icons.chevronLeft}</a>` : ''}
  ${nextEpisode ? `<a href="/episode/${nextEpisode.slug}/" class="nav-button nav-next">${icons.chevronRight}</a>` : ''}

  <script>
    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('tether-theme', next);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        const prev = document.querySelector('.nav-prev');
        if (prev) window.location.href = prev.href;
      } else if (e.key === 'ArrowRight') {
        const next = document.querySelector('.nav-next');
        if (next) window.location.href = next.href;
      }
    });

    // Visitor counter
    (async function() {
      const counterEl = document.getElementById('visitor-counter');
      if (!counterEl) return;

      function updateDisplay(count) {
        const digits = count.toString().padStart(6, '0').split('');
        const spans = counterEl.querySelectorAll('.counter-digit');
        digits.forEach((digit, i) => {
          if (spans[i]) {
            const oldValue = spans[i].textContent;
            if (oldValue !== digit) {
              spans[i].classList.add('flip');
              setTimeout(() => {
                spans[i].textContent = digit;
                spans[i].classList.remove('flip');
              }, 150);
            }
          }
        });
      }

      try {
        const res = await fetch('/counter/hit');
        if (res.ok) {
          const data = await res.json();
          updateDisplay(data.value);
        }
      } catch (e) {
        try {
          const res = await fetch('/counter/get');
          if (res.ok) {
            const data = await res.json();
            updateDisplay(data.value);
          }
        } catch (e2) {
          console.warn('Counter unavailable');
        }
      }
    })();
  </script>
</body>
</html>`;
}

// Build static pages
mkdirSync(PAGES_DIR, { recursive: true });

// Generate episode pages
for (const episode of EPISODES) {
  const fountainText = readFileSync(join(SCREENPLAYS_DIR, episode.file), 'utf-8');
  const html = renderScreenplay(fountainText, episode, EPISODES);

  const episodeDir = join(PAGES_DIR, 'episode', episode.slug);
  mkdirSync(episodeDir, { recursive: true });
  writeFileSync(join(episodeDir, 'index.html'), html);
  console.log(`Built pages/episode/${episode.slug}/index.html`);
}

// Copy episode 01 as index.html (no redirect)
const episode01Html = readFileSync(join(PAGES_DIR, 'episode', '01', 'index.html'), 'utf-8');
writeFileSync(join(PAGES_DIR, 'index.html'), episode01Html);

console.log('Pages built to pages/');
