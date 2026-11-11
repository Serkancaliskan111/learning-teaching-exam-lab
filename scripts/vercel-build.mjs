import { cpSync, mkdirSync, rmSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const pub = join(root, 'public');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// Copy static public assets as-is (HTML/CSS/JS/data)
cpSync(pub, dist, { recursive: true });

// Ensure chapters.json exists (fallback from data/)
const chaptersPublic = join(dist, 'data', 'chapters.json');
if (!existsSync(chaptersPublic)) {
  const fromRoot = join(root, 'data', 'chapters.json');
  if (existsSync(fromRoot)) {
    mkdirSync(join(dist, 'data'), { recursive: true });
    cpSync(fromRoot, chaptersPublic);
  }
}

// Sync freshest JSON from /data if present
const syncDirs = ['content', 'flashcards', 'quizzes'];
for (const dir of syncDirs) {
  const src = join(root, 'data', dir);
  const dest = join(dist, 'data', dir);
  if (existsSync(src)) {
    mkdirSync(dest, { recursive: true });
    cpSync(src, dest, { recursive: true });
  }
}
const methodsSrc = join(root, 'data', 'methods.json');
if (existsSync(methodsSrc)) {
  mkdirSync(join(dist, 'data'), { recursive: true });
  cpSync(methodsSrc, join(dist, 'data', 'methods.json'));
}

writeFileSync(
  join(dist, '_build.json'),
  JSON.stringify({ builtAt: new Date().toISOString(), ok: true }, null, 2)
);

console.log('Vercel static build ready in dist/');
console.log(readFileSync(join(dist, 'index.html'), 'utf8').slice(0, 80));
