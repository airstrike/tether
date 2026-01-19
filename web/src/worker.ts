import { Fountain } from 'fountain-js';

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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${script.title || currentEpisode.title} - TETHER</title>
  <style>
    :root {
      --page-width: 8.5in;
      --bg: #1a1a1a;
      --text: #e8e8e8;
      --text-dim: rgba(232, 232, 232, 0.5);
      --accent: #00aaff;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12pt;
      line-height: 1.5;
      background-color: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 0;
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
    }

    .header-title {
      font-weight: bold;
      color: var(--text-dim);
      font-size: 14px;
      letter-spacing: 2px;
    }

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
      border-bottom: 1px solid rgba(255,255,255,0.1);
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
      background: rgba(255, 255, 255, 0.05);
      padding: 0.5em 1em;
      border-left: 2px solid var(--accent);
      margin: 1em 0;
      color: var(--text-dim);
    }

    .page-break {
      border-top: 1px dashed rgba(255,255,255,0.2);
      margin: 3em 0;
      text-align: center;
      position: relative;
    }

    /* Navigation */
    .nav-button {
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(0, 0, 0, 0.6);
      color: var(--text-dim);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 4px;
      padding: 20px 12px;
      cursor: pointer;
      font-family: monospace;
      font-size: 24px;
      transition: all 0.2s;
      text-decoration: none;
      z-index: 100;
    }

    .nav-button:hover {
      background-color: rgba(0, 170, 255, 0.2);
      color: white;
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
    }

    /* Print styles */
    @media print {
      body {
        background: white;
        color: black;
      }

      .header, .nav-button {
        display: none;
      }

      .screenplay-container {
        padding: 0;
        max-width: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="header-title">TETHER</span>
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

  ${prevEpisode ? `<a href="/episode/${prevEpisode.slug}" class="nav-button nav-prev">&lt;</a>` : ''}
  ${nextEpisode ? `<a href="/episode/${nextEpisode.slug}" class="nav-button nav-next">&gt;</a>` : ''}

  <script>
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
