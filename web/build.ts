import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';

const SCREENPLAYS_DIR = join(dirname(import.meta.dir), 'screenplays');
const SRC_DIR = join(import.meta.dir, 'src');
const DIST_DIR = join(import.meta.dir, 'dist');
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

console.log('Build complete! Worker written to dist/worker.ts');
