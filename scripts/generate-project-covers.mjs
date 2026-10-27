#!/usr/bin/env node
/**
 * Project Cover & Thumbnail Generator for Sunnyside Portfolio
 *
 * Captures live project screenshots via Brave Browser headless CDP
 * and formats them into high-DPI 16:10 WebP cards matching the Sunnyside design system.
 *
 * Usage:
 *   pnpm generate-covers              # Captures and updates all project covers
 *   pnpm generate-covers switchyard   # Captures only Switchyard
 *   pnpm generate-covers habit        # Captures only Habit Tracker
 *   pnpm generate-covers primarindo   # Captures only Primarindo
 */

import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'public/work');

// 1. Helper to launch headless Brave with CDP
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

// 2. Helper to get Switchyard session cookie from local Brave profile or fallback
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
    # strip hash prefix
    print(raw[32:])
`;
    const res = execSync(`python3 -c "${pyScript}"`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
    const cookie = res.trim();
    if (cookie && cookie.length > 20) return cookie;
  } catch {}
  // Default fallback known session
  return '30efbf8b90f63df4fdac3be5f3ec1a90e1d676c7b453d2ea06e39056422f8515';
}

// 3. Switchyard Capture (Light Mode, Sidebar open, Blocked/Review/Done)
async function captureSwitchyard() {
  console.log('→ Capturing Switchyard (Light Mode, Sidebar open, Blocked → Review → Done)...');
  const browser = await launchBrave();
  const cookie = getSwitchyardCookie();

  await browser.send('Network.enable');
  await browser.send('Network.setCookie', {
    name: 'kanban_session',
    value: cookie,
    domain: 'kanban.adityahimaone.space',
    path: '/',
    secure: true,
    httpOnly: true
  });

  await browser.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });

  await browser.send('Page.enable');
  await browser.send('Page.navigate', { url: 'https://kanban.adityahimaone.space/board/default' });
  await new Promise((r) => setTimeout(r, 4500));

  await browser.send('Runtime.evaluate', {
    expression: `(() => {
      // 1. Force Light Mode
      localStorage.setItem('kb-theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.dataset.theme = 'light';

      // 2. Ensure sidebar is visible and open
      const aside = document.querySelector('aside') || document.querySelector('nav');
      if (aside) aside.style.display = '';

      // 3. Keep exactly Blocked, Review, Done visible
      const keepTitles = ['Blocked', 'Review', 'Done'];
      const allH2 = Array.from(document.querySelectorAll('h2'));
      allH2.forEach(h => {
        let col = h;
        while (col && col.parentElement && !col.parentElement.className.includes('overflow-x')) {
          col = col.parentElement;
        }
        if (!keepTitles.includes(h.innerText.trim())) {
          if (col) col.style.display = 'none';
        } else {
          if (col) col.style.display = 'flex';
        }
      });

      // 4. Ensure board container has scrollLeft = 0 and clean spacing
      const main = document.querySelector('main');
      const container = document.querySelector('.overflow-x-auto') || main;
      if (container) {
        container.scrollLeft = 0;
        container.style.paddingLeft = '20px';
        container.style.paddingRight = '48px';
        container.style.gap = '16px';
      }

      // 5. Slight zoom out (0.90) so everything has generous breathing room
      document.body.style.zoom = '0.90';
    })()`
  });

  await new Promise((r) => setTimeout(r, 1000));
  const shot = await browser.send('Page.captureScreenshot', { format: 'png' });
  await browser.close();

  const tmpPng = '/tmp/switchyard_raw.png';
  fs.writeFileSync(tmpPng, Buffer.from(shot.data, 'base64'));

  const targetPath = path.join(OUTPUT_DIR, 'switchyard-cover.webp');
  execSync(`python3 -c "
from PIL import Image
im = Image.open('${tmpPng}')
im_resized = im.resize((1440, 900), Image.Resampling.LANCZOS)
im_resized.save('${targetPath}', 'WEBP', quality=88, method=6)
"`);
  console.log(`✓ Switchyard updated: ${targetPath}`);
}

// 4. Habit Tracker Capture (Native Retina Mobile in Floating Device Canvas)
async function captureHabitTracker() {
  console.log('→ Capturing Habit Tracker (Native Retina Mobile Device Canvas)...');
  const browser = await launchBrave();
  await browser.send('Page.enable');

  // Native iPhone resolution
  await browser.send('Emulation.setDeviceMetricsOverride', {
    width: 412,
    height: 892,
    deviceScaleFactor: 2,
    mobile: true
  });

  await browser.send('Page.navigate', { url: 'https://habit.adityahimaone.space/today/' });
  await new Promise((r) => setTimeout(r, 4000));

  const shot = await browser.send('Page.captureScreenshot', { format: 'png' });
  await browser.close();

  const tmpMobile = '/tmp/habit_native_mobile.png';
  fs.writeFileSync(tmpMobile, Buffer.from(shot.data, 'base64'));

  const targetPath = path.join(OUTPUT_DIR, 'habit-tracker-cover.webp');
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

screen = Image.open('${tmpMobile}').convert('RGBA')
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

bg.save('${targetPath}', 'WEBP', quality=88, method=6)
`;
  execSync(`python3 -c "${pyMockup}"`);
  console.log(`✓ Habit Tracker updated: ${targetPath}`);
}

// 5. Primarindo Capture (16:10 Desktop with full hero)
async function capturePrimarindo() {
  console.log('→ Capturing Primarindo (16:10 Desktop)...');
  const browser = await launchBrave();
  await browser.send('Page.enable');
  await browser.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });

  await browser.send('Page.navigate', { url: 'https://www.primarindo.co.id/' });
  await new Promise((r) => setTimeout(r, 4000));

  await browser.send('Runtime.evaluate', {
    expression: `(() => {
      document.body.style.zoom = '0.85';
    })()`
  });

  await new Promise((r) => setTimeout(r, 800));
  const shot = await browser.send('Page.captureScreenshot', { format: 'png' });
  await browser.close();

  const tmpPng = '/tmp/primarindo_raw.png';
  fs.writeFileSync(tmpPng, Buffer.from(shot.data, 'base64'));

  const targetPath = path.join(OUTPUT_DIR, 'primarindo-asia-cover.webp');
  execSync(`python3 -c "
from PIL import Image
im = Image.open('${tmpPng}')
im_resized = im.resize((1440, 900), Image.Resampling.LANCZOS)
im_resized.save('${targetPath}', 'WEBP', quality=88, method=6)
"`);
  console.log(`✓ Primarindo updated: ${targetPath}`);
}

// 6. Update manifest.json with actual file sizes
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

async function main() {
  const target = (process.argv[2] || '').toLowerCase();
  console.log('=== Sunnyside Project Cover Generator ===');

  if (target === 'switchyard') {
    await captureSwitchyard();
  } else if (target === 'habit' || target === 'habit-tracker') {
    await captureHabitTracker();
  } else if (target === 'primarindo' || target === 'primarindo-asia') {
    await capturePrimarindo();
  } else {
    // Capture all
    await captureSwitchyard();
    await captureHabitTracker();
    await capturePrimarindo();
  }

  updateManifest();
  console.log('=== All requested covers generated successfully! ===');
}

main().catch((err) => {
  console.error('Fatal error during cover generation:', err);
  process.exit(1);
});
