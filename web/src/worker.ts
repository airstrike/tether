import { Fountain } from 'fountain-js';
import { generateAllThemesCSS } from './theme';
import { icons } from './icons';
import { fontCSS } from './fonts';

// Episode registry - add new episodes here
const EPISODES: { slug: string; file: string; title: string }[] = [
  { slug: '01', file: 'episode-01-the-return.fountain', title: 'Episode 1: The Return' },
];

// Fountain files are embedded at build time
const SCREENPLAYS: Record<string, string> = {
  'episode-01-the-return.fountain': `{{EPISODE_01}}`,
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Route: /episode/:id
    const episodeMatch = path.match(/^\/episode\/(\d+)$/);
    if (episodeMatch) {
      const episodeNum = episodeMatch[1].padStart(2, '0');
      const episode = EPISODES.find(e => e.slug === episodeNum);

      if (!episode) {
        return new Response('Episode not found', { status: 404 });
      }

      const fountainText = SCREENPLAYS[episode.file];
      if (!fountainText) {
        return new Response('Screenplay not found', { status: 404 });
      }

      const html = renderScreenplay(fountainText, episode, EPISODES);
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Route: / - redirect to first episode
    if (path === '/' || path === '') {
      return Response.redirect(new URL('/episode/01', request.url).toString(), 302);
    }

    return new Response('Not found', { status: 404 });
  },
};

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

    /* Show appropriate icon based on theme */
    .icon-sun { display: none; }
    .icon-moon { display: block; }
    [data-theme="light"] .icon-sun { display: block; }
    [data-theme="light"] .icon-moon { display: none; }

    .screenplay-container {
      max-width: var(--page-width);
      margin: 0 auto;
      padding: 80px 1in 120px 1in;
    }

    /* Title page */
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

    /* Script elements */
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

    /* Navigation */
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

    /* Responsive */
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

    /* Print styles */
    @media print {
      body {
        background: white !important;
        color: black !important;
      }

      .header, .nav-button {
        display: none !important;
      }

      .screenplay-container {
        padding: 0;
        max-width: none;
      }
    }
  </style>
  <script>
    // Apply theme immediately to prevent flash
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

  ${prevEpisode ? `<a href="/episode/${prevEpisode.slug}" class="nav-button nav-prev">${icons.chevronLeft}</a>` : ''}
  ${nextEpisode ? `<a href="/episode/${nextEpisode.slug}" class="nav-button nav-next">${icons.chevronRight}</a>` : ''}

  <script>
    // Theme toggle
    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('tether-theme', next);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        const prev = document.querySelector('.nav-prev');
        if (prev) window.location.href = prev.href;
      } else if (e.key === 'ArrowRight') {
        const next = document.querySelector('.nav-next');
        if (next) window.location.href = next.href;
      }
    });
  </script>
</body>
</html>`;
}
