import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const SCREENPLAYS_DIR = join(dirname(import.meta.dir), 'screenplays');
const SRC_DIR = join(import.meta.dir, 'src');
const DIST_DIR = join(import.meta.dir, 'dist');

// Read the worker template
const workerTemplate = readFileSync(join(SRC_DIR, 'worker.ts'), 'utf-8');

// Read the episode fountain file
const episode01 = readFileSync(
  join(SCREENPLAYS_DIR, 'episode-01-the-return.fountain'),
  'utf-8'
);

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

console.log('Build complete! Worker written to dist/worker.ts');
