# Tether Screenplay Reader

**Live:** https://read-tether.pages.dev

A web reader for Tether screenplays, built with Cloudflare Pages.

## Features

- Renders `.fountain` screenplay files with proper formatting
- Light/dark theme toggle (persisted via localStorage)
- Arrow key navigation between episodes
- GT Pressura Mono font
- Print-friendly styles

## Setup

```bash
bun install
```

## Development

```bash
bun run dev
```

Starts a local server at http://localhost:8788

## Build

```bash
bun run build
```

Generates:
- `dist/` - Worker build (for Cloudflare Workers)
- `pages/` - Static HTML (for Cloudflare Pages)

## Deploy

**To Cloudflare Pages (recommended):**
```bash
bun run pages
```

**To Cloudflare Workers:**
```bash
bun run deploy
```

## Adding Episodes

1. Add the `.fountain` file to `/screenplays/`
2. Update the `EPISODES` array in `build.ts`
3. Rebuild and deploy

## Project Structure

```
web/
├── build.ts          # Build script
├── src/
│   ├── worker.ts     # Worker entry (for CF Workers)
│   ├── theme.ts      # Light/dark theme definitions
│   ├── icons.ts      # SVG icons
│   ├── fonts.ts      # Font CSS template
│   └── fonts/        # GT Pressura Mono .ttf files
├── dist/             # Built worker output (gitignored)
└── pages/            # Built static pages (gitignored)
```
