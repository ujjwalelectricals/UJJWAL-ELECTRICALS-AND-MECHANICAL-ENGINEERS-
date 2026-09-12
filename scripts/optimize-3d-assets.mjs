import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const INPUT_ROOT = path.resolve(ROOT, getArg('--input') ?? 'public');
const OUTPUT_ROOT = path.resolve(ROOT, getArg('--output') ?? 'public/models-optimized');
const IN_PLACE = process.argv.includes('--in-place');
const MAX_MB = Number(getArg('--max-mb') ?? 3);
const CLI_PACKAGE = '@gltf-transform/cli@4.5.0';

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function fail(message) {
  console.error(`3D OPTIMIZER FAILED: ${message}`);
  process.exitCode = 1;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full === OUTPUT_ROOT || full.includes(`${path.sep}node_modules${path.sep}`)) continue;
      files.push(...await walk(full));
    } else if (/\.(glb|gltf)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function runGltfTransform(args) {
  const result = spawnSync(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['--yes', `--package=${CLI_PACKAGE}`, 'gltf-transform', ...args],
    { cwd: ROOT, stdio: 'inherit', shell: false }
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`gltf-transform exited with code ${result.status}`);
}

async function optimizeOne(inputFile) {
  const relative = path.relative(INPUT_ROOT, inputFile);
  const sourceExt = path.extname(inputFile).toLowerCase();
  const targetRelative = relative.replace(/\.(glb|gltf)$/i, '.glb');
  const targetFile = IN_PLACE && sourceExt === '.glb'
    ? inputFile
    : path.join(OUTPUT_ROOT, targetRelative);

  await fs.mkdir(path.dirname(targetFile), { recursive: true });

  const sourceStat = await fs.stat(inputFile);
  const tempBase = path.join(path.dirname(targetFile), `.${path.basename(targetFile)}.tmp`);
  const tempOptimized = `${tempBase}.optimized.glb`;
  const tempCompressed = `${tempBase}.compressed.glb`;

  try {
    runGltfTransform([
      'optimize', inputFile, tempOptimized,
      '--texture-compress', 'webp',
    ]);

    runGltfTransform([
      'draco', tempOptimized, tempCompressed,
      '--method', 'edgebreaker',
    ]);

    if (IN_PLACE && sourceExt === '.glb') {
      const backup = `${inputFile}.backup`;
      try {
        await fs.copyFile(inputFile, backup, fs.constants.COPYFILE_EXCL);
      } catch (error) {
        if (error.code !== 'EEXIST') throw error;
      }
    }

    await fs.copyFile(tempCompressed, targetFile);
    const outputStat = await fs.stat(targetFile);
    const before = sourceStat.size;
    const after = outputStat.size;
    const reduction = before > 0 ? (1 - after / before) * 100 : 0;
    const maxBytes = MAX_MB * 1024 * 1024;

    console.log(`\n${relative}`);
    console.log(`  ${formatBytes(before)} → ${formatBytes(after)} (${reduction.toFixed(1)}% smaller)`);
    console.log(`  output: ${path.relative(ROOT, targetFile)}`);
    if (after > maxBytes) {
      console.warn(`  WARNING: output exceeds ${MAX_MB} MB target.`);
    }
  } finally {
    for (const file of [tempOptimized, tempCompressed]) {
      await fs.rm(file, { force: true });
    }
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}

async function main() {
  try {
    if (!(await exists(INPUT_ROOT))) {
      console.log(`No 3D asset directory found at ${path.relative(ROOT, INPUT_ROOT) || '.'}. Nothing to optimize.`);
      return;
    }

    const files = await walk(INPUT_ROOT);
    if (!files.length) {
      console.log(`No .glb/.gltf assets found under ${path.relative(ROOT, INPUT_ROOT) || '.'}. Nothing to optimize.`);
      return;
    }

    console.log(`Optimizing ${files.length} 3D asset(s) with glTF Transform ${CLI_PACKAGE}.`);
    if (IN_PLACE) {
      console.log('In-place mode: GLB originals receive a .backup copy before replacement.');
    }

    for (const file of files) {
      await optimizeOne(file);
    }

    console.log('\n3D OPTIMIZER PASSED');
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

await main();
