#!/usr/bin/env node
/**
 * Universal Project Cover & Thumbnail Generator for Sunnyside Portfolio
 *
 * Captures live web applications or ANY URL using Brave Browser headless CDP
 * and formats them into high-DPI 16:10 WebP cards matching the Sunnyside design system.
 *
 * Usage:
 *   # 1. Capture ANY arbitrary website or app:
 *   pnpm generate-covers https://stripe.com
 *   pnpm generate-covers https://my-app.com --out public/work/my-app.webp --mode mobile-mockup
 *   pnpm generate-covers --url https://github.com --width 1440 --height 900
 *
 *   # 2. Portfolio presets:
 *   pnpm generate-covers              # Captures and updates all portfolio project presets
 *   pnpm generate-covers switchyard   # Captures Switchyard (Light Mode, sidebar open, Blocked->Done)
 *   pnpm generate-covers habit        # Captures Habit Tracker (Mobile device mockup)
 *   pnpm generate-covers primarindo   # Captures Primarindo (16:10 Desktop)
 */

import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'public/work');

// 1. Launch Brave Headless with CDP
async function launchBrave(options = {}) {
  const port = options.port || (9500 + Math.floor(Math.random() * 400));
  const tmpDir = `/tmp/brave_cdp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  fs.mkdirSync(tmpDir, { recursive: true });

  const bravePath = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
  if (!fs.existsSync(bravePath)) {
    throw new Error(`Brave Browser not found at ${bravePath}`);
  }

  const args = [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tmpDir}`,
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--use-gl=angle',
    '--use-angle=metal',
    '--enable-unsafe-swiftshader',
    'about:blank'
  ];

  const proc = spawn(bravePath, args, { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) {
        const data = await res.json();
        wsUrl = data.webSocketDebuggerUrl;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 150));
  }

  if (!wsUrl) {
    proc.kill();
    fs.rmSync(tmpDir, { recursive: true, force: true });
    throw new Error('Failed to connect to Brave CDP');
  }

  const pagesRes = await fetch(`http://127.0.0.1:${port}/json/list`);
  const pages = await pagesRes.json();
  const pageWsUrl = pages[0]?.webSocketDebuggerUrl;

  const ws = new WebSocket(pageWsUrl);
  let id = 1;
  const callbacks = new Map();

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) cb.reject(msg.error);
      else cb.resolve(msg.result);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  };

  return {
    send,
    close: async () => {
      try { ws.close(); } catch {}
      proc.kill();
      await new Promise((r) => setTimeout(r, 400));
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }
  };
}

// 2. Cookie extraction from local Brave profile
function getSwitchyardCookie() {
  try {
    const pyScript = `
import sqlite3, os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
import subprocess

cookie_db = os.path.expanduser('~/Library/Application Support/BraveSoftware/Brave-Browser/Default/Cookies')
if not os.path.exists(cookie_db):
    exit(1)

conn = sqlite3.connect(cookie_db)
c = conn.cursor()
c.execute("SELECT encrypted_value FROM cookies WHERE host_key LIKE '%kanban%' AND name='kanban_session'")
row = c.fetchone()
if not row:
    exit(1)

enc_val = row[0]
pw_res = subprocess.run(['security', 'find-generic-password', '-w', '-s', 'Brave Safe Storage'], capture_output=True, text=True)
pw = pw_res.stdout.strip().encode('utf-8')
if not pw:
    exit(1)

salt = b'saltysalt'
kdf = PBKDF2HMAC(algorithm=hashes.SHA1(), length=16, salt=salt, iterations=1003)
key = kdf.derive(pw)

if enc_val[:3] == b'v10':
    cipher = Cipher(algorithms.AES(key), modes.CBC(b' ' * 16))
    dec = cipher.decryptor()
    val = dec.update(enc_val[3:]) + dec.finalize()
    pad = val[-1]
    raw = val[:-pad].decode('utf-8', errors='ignore')
    print(raw[32:])
`;
    const res = execSync(`python3 -c "${pyScript}"`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
    const cookie = res.trim();
    if (cookie && cookie.length > 20) return cookie;
  } catch {}
  return '30efbf8b90f63df4fdac3be5f3ec1a90e1d676c7b453d2ea06e39056422f8515';
}

// 3. Composite Mobile Screenshot into Floating Device Mockup Canvas (16:10)
function compositeMobileMockup(srcMobilePng, dstWebpPath) {
  const pyMockup = `
from PIL import Image, ImageDraw, ImageFilter

canvas_w, canvas_h = 1440, 900
bg = Image.new('RGB', (canvas_w, canvas_h), '#06100d')
glow = Image.new('RGB', (canvas_w, canvas_h), '#06100d')
draw_glow = ImageDraw.Draw(glow)

cx, cy = canvas_w // 2, canvas_h // 2
for r in range(450, 0, -10):
    alpha = int(24 * (1 - r / 450))
    draw_glow.ellipse([cx - r, cy - int(r * 0.7), cx + r, cy + int(r * 0.7)], fill=(15, 45, 35))

glow = glow.filter(ImageFilter.GaussianBlur(70))
bg = Image.blend(bg, glow, 0.6)

screen = Image.open('${srcMobilePng}').convert('RGBA')
sw, sh = screen.size

dev_h = 770
dev_w = int(dev_h * (sw / sh))
dev_r = 38

screen_resized = screen.resize((dev_w, dev_h), Image.Resampling.LANCZOS)

mask = Image.new('L', (dev_w, dev_h), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle([0, 0, dev_w, dev_h], radius=dev_r, fill=255)

shadow_pad = 50
shadow = Image.new('RGBA', (dev_w + shadow_pad * 2, dev_h + shadow_pad * 2), (0, 0, 0, 0))
shadow_draw = ImageDraw.Draw(shadow)
shadow_draw.rounded_rectangle(
    [shadow_pad, shadow_pad + 12, shadow_pad + dev_w, shadow_pad + dev_h + 12],
    radius=dev_r,
    fill=(0, 0, 0, 160)
)
shadow = shadow.filter(ImageFilter.GaussianBlur(25))

pos_x = (canvas_w - dev_w) // 2
pos_y = (canvas_h - dev_h) // 2

bg.paste(shadow, (pos_x - shadow_pad, pos_y - shadow_pad), shadow)
bg.paste(screen_resized, (pos_x, pos_y), mask)

bezel = Image.new('RGBA', (dev_w, dev_h), (0, 0, 0, 0))
bezel_draw = ImageDraw.Draw(bezel)
bezel_draw.rounded_rectangle([0, 0, dev_w - 1, dev_h - 1], radius=dev_r, outline=(255, 255, 255, 38), width=2)
bg.paste(bezel, (pos_x, pos_y), bezel)

bg.save('${dstWebpPath}', 'WEBP', quality=88, method=6)
`;
  execSync(`python3 -c "${pyMockup}"`);
}

// 4. General-purpose Capture Function for ANY URL
export async function captureUrl(options) {
  const url = options.url;
  const outputPath = options.out || path.join(OUTPUT_DIR, `${new URL(url).hostname.replace(/[^a-z0-9]/gi, '_')}.webp`);
  const mode = options.mode || 'desktop'; // 'desktop' | 'mobile' | 'mobile-mockup'
  const width = options.width || (mode.startsWith('mobile') ? 412 : 1440);
  const height = options.height || (mode.startsWith('mobile') ? 892 : 900);
  const scale = options.scale || 2;
  const waitMs = options.wait || 4000;
  const zoom = options.zoom || null;
  const theme = options.theme || null; // 'light' | 'dark'

  console.log(`→ Capturing URL: ${url}`);
  console.log(`  Mode: ${mode} (${width}x${height} @ ${scale}x) -> ${outputPath}`);

  const browser = await launchBrave();
  await browser.send('Page.enable');

  if (options.cookie) {
    await browser.send('Network.enable');
    const [cName, cVal] = options.cookie.split('=');
    await browser.send('Network.setCookie', {
      name: cName,
      value: cVal,
      domain: new URL(url).hostname,
      path: '/',
      secure: true
    });
  }

  await browser.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: scale,
    mobile: mode.startsWith('mobile')
  });

  await browser.send('Page.navigate', { url });
  await new Promise((r) => setTimeout(r, waitMs));

  if (theme || zoom || options.js) {
    await browser.send('Runtime.evaluate', {
      expression: `(() => {
        ${theme ? `
          if ('${theme}' === 'light') {
            localStorage.setItem('kb-theme', 'light');
            document.documentElement.classList.remove('dark');
            document.documentElement.dataset.theme = 'light';
          } else if ('${theme}' === 'dark') {
            localStorage.setItem('kb-theme', 'dark');
            document.documentElement.classList.add('dark');
            document.documentElement.dataset.theme = 'dark';
          }
        ` : ''}
        ${zoom ? `document.body.style.zoom = '${zoom}';` : ''}
        ${options.js ? options.js : ''}
      })()`
    });
    await new Promise((r) => setTimeout(r, 600));
  }

  const shot = await browser.send('Page.captureScreenshot', { format: 'png' });
  await browser.close();

  const tmpPng = `/tmp/capture_${Date.now()}.png`;
  fs.writeFileSync(tmpPng, Buffer.from(shot.data, 'base64'));

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  if (mode === 'mobile-mockup') {
    compositeMobileMockup(tmpPng, outputPath);
  } else {
    // 16:10 high-DPI output
    const targetW = options.targetWidth || 1440;
    const targetH = Math.round(targetW * (height / width));
    execSync(`python3 -c "
from PIL import Image
im = Image.open('${tmpPng}')
im_resized = im.resize((${targetW}, ${targetH}), Image.Resampling.LANCZOS)
im_resized.save('${outputPath}', 'WEBP', quality=88, method=6)
"`);
  }

  try { fs.unlinkSync(tmpPng); } catch {}
  console.log(`✓ Saved: ${outputPath}`);
  return outputPath;
}

// 5. Preset: Switchyard (Light Mode, sidebar open, Blocked->Done, natural framing)
async function captureSwitchyard() {
  const cookie = getSwitchyardCookie();
  const outputPath = path.join(OUTPUT_DIR, 'switchyard-cover.webp');

  await captureUrl({
    url: 'https://kanban.adityahimaone.space/board/default',
    out: outputPath,
    mode: 'desktop',
    width: 1180,
    height: 738, // 16:10, slightly zoomed out from 1024x528 to fit naturally without clipping
    scale: 2,
    cookie: `kanban_session=${cookie}`,
    theme: 'light',
    js: `
      const aside = document.querySelector('aside') || document.querySelector('nav');
      if (aside) aside.style.display = '';

      const allH2 = Array.from(document.querySelectorAll('h2'));
      const blocked = allH2.find(el => el.innerText.trim() === 'Blocked');
      if (blocked) {
        let col = blocked;
        while (col && col.parentElement && !col.parentElement.className.includes('overflow-x')) {
          col = col.parentElement;
        }
        const scrollContainer = col.parentElement;
        scrollContainer.scrollLeft = col.offsetLeft - 12;
      }
    `,
    targetWidth: 1440
  });
}

// 6. Preset: Habit Tracker (Native Retina Mobile in Floating Device Canvas)
async function captureHabitTracker() {
  const outputPath = path.join(OUTPUT_DIR, 'habit-tracker-cover.webp');
  await captureUrl({
    url: 'https://habit.adityahimaone.space/today/',
    out: outputPath,
    mode: 'mobile-mockup',
    width: 412,
    height: 892,
    scale: 2,
    wait: 4000
  });
}

// 7. Preset: Primarindo (16:10 Desktop)
async function capturePrimarindo() {
  const outputPath = path.join(OUTPUT_DIR, 'primarindo-asia-cover.webp');
  await captureUrl({
    url: 'https://www.primarindo.co.id/',
    out: outputPath,
    mode: 'desktop',
    width: 1440,
    height: 900,
    scale: 2,
    zoom: '0.85',
    targetWidth: 1440
  });
}

// 8. Update manifest.json with actual file sizes
function updateManifest() {
  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  const getKb = (name) => {
    try {
      const bytes = fs.statSync(path.join(OUTPUT_DIR, name)).size;
      return `${Math.round(bytes / 1024)}kb`;
    } catch {
      return 'unknown';
    }
  };

  const manifest = [
    {
      slug: 'switchyard',
      cover: '/work/switchyard-cover.webp',
      mode: `live 16:10 light mode with sidebar from Blocked (${getKb('switchyard-cover.webp')})`
    },
    {
      slug: 'primarindo-asia',
      cover: '/work/primarindo-asia-cover.webp',
      mode: `live 16:10 zoomed (${getKb('primarindo-asia-cover.webp')})`
    },
    {
      slug: 'habit-tracker',
      cover: '/work/habit-tracker-cover.webp',
      mode: `live 16:10 device canvas mockup (${getKb('habit-tracker-cover.webp')})`
    },
    {
      slug: 'seaphantom',
      cover: 'https://res.cloudinary.com/deselamak/image/upload/v1699777135/portofolio/y2l1g36bjudgsf6yr0eg.webp',
      mode: 'remote (next/image)'
    }
  ];

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`✓ Manifest updated: ${manifestPath}`);
}

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--url' && args[i + 1]) {
      options.url = args[++i];
    } else if (arg === '--out' && args[i + 1]) {
      options.out = args[++i];
    } else if (arg === '--mode' && args[i + 1]) {
      options.mode = args[++i];
    } else if (arg === '--width' && args[i + 1]) {
      options.width = parseInt(args[++i], 10);
    } else if (arg === '--height' && args[i + 1]) {
      options.height = parseInt(args[++i], 10);
    } else if (arg === '--scale' && args[i + 1]) {
      options.scale = parseFloat(args[++i]);
    } else if (arg === '--zoom' && args[i + 1]) {
      options.zoom = args[++i];
    } else if (arg === '--theme' && args[i + 1]) {
      options.theme = args[++i];
    } else if (arg === '--cookie' && args[i + 1]) {
      options.cookie = args[++i];
    } else if (arg.startsWith('http://') || arg.startsWith('https://')) {
      options.url = arg;
    } else if (!options.preset && !arg.startsWith('-')) {
      options.preset = arg.toLowerCase();
    }
  }

  return options;
}

async function main() {
  const opts = parseArgs();
  console.log('=== Sunnyside Universal Thumbnail Generator ===');

  // If a URL was given directly, capture that arbitrary URL
  if (opts.url) {
    await captureUrl(opts);
    return;
  }

  // Preset dispatching
  const preset = opts.preset || 'all';
  if (preset === 'switchyard') {
    await captureSwitchyard();
  } else if (preset === 'habit' || preset === 'habit-tracker') {
    await captureHabitTracker();
  } else if (preset === 'primarindo' || preset === 'primarindo-asia') {
    await capturePrimarindo();
  } else if (preset === 'all') {
    await captureSwitchyard();
    await captureHabitTracker();
    await capturePrimarindo();
  } else {
    console.error(`Unknown preset or command: "${preset}".`);
    console.log('Provide a valid URL (e.g. "pnpm generate-covers https://example.com") or preset name.');
    process.exit(1);
  }

  updateManifest();
  console.log('=== Done! ===');
}

main().catch((err) => {
  console.error('Fatal error during thumbnail generation:', err);
  process.exit(1);
});
