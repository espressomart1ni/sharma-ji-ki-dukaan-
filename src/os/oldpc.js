import { tone, sfx } from '../engine/audio.js';
import { assetUrl } from '../engine/assets.js';
const $ = s => document.querySelector(s);
const APPS = {
  comp: ['My Computer', '<b>Sharma Computers</b><br>Pentium II · 64 MB RAM<br>C: 4.3 GB (2.1 GB free)<br>A: 3½ Floppy — <i>please insert disk</i><br>D: DVD-ROM'],
  note: ['udhaar.txt - Notepad', '<pre>Verma ji ......... 40  (Diwali ke baad)\nChintu ki mummy .. 15\nMeena aunty ...... 120  [ ]\nPappu ............ 5  (Poppins x2) ✓\n\nNOTE: Poppins aur Melody mangwao\nNOTE: PCO ka bill\nNOTE: TV ke remote ki battery\nNOTE: bachchon ko “ek aur” nahi dena\n\n— last edited 03:12 PM</pre>'],
  web: ['Internet — My Homepage', `<div class="mq"><span>★ WELCOME TO SHARMA JI KI DUKAAN ONLINE ★ BEST VIEWED IN 800x600 ★</span></div><h2 style="font-family:'Times New Roman'">Under construction 🚧</h2><p>You are visitor number <b style="background:#000;color:#0f0;padding:2px 6px;font-family:monospace">000123</b></p><p><u style="color:#00e">Sign my guestbook</u> · <u style="color:#00e">Hindi film songs</u> · <u style="color:#00e">Cricket scores</u></p><hr><small>Dial-up connection: 28.8 kbps. Please do not pick up the landline.</small>`],
  bin: ['Recycle Bin', '<b>1 item</b><br>🗑️ Hide &amp; Seek wrapper.jpg<br><small>(Not sure why this was kept.)</small>'],
};
// Windows-98-ish desktop shown in a DOM overlay. open({disc}) starts the DVD player with that disc.
export class OldPC {
  constructor(onClose) {
    this.onClose = onClose; this.on = false; this.idle = 0; this.disc = null; this.snI = 0; this.raf = 0; this.ssT = 0; this.turn = null;
    $('#wx').onclick = () => this.stop(); $('#st').onclick = () => { const m = $('#menu'); m.style.display = m.style.display === 'block' ? 'none' : 'block'; };
    $('#sd').onclick = () => { $('#menu').style.display = 'none'; this.close(); };
    ['mousemove', 'keydown', 'pointerdown'].forEach(e => $('#pc').addEventListener(e, () => this.wake()));
    addEventListener('keydown', e => { if (!this.on || !this.turn) return; const m = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] }[e.key.toLowerCase()]; if (m) { this.turn(...m); e.preventDefault(); } });
    setInterval(() => { $('#clk').textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); if (this.on && $('#boot').style.display === 'none' && ++this.idle > 25) this.saver(); }, 1000);
  }
  open({ disc } = {}) {
    this.disc = disc || null; this.on = true; $('#pc').style.display = 'flex'; $('#scr').style.backgroundImage = `url(${assetUrl('textures/wallpaper.png')})`;
    $('#win').style.display = 'none'; $('#dsk').innerHTML = ''; const b = $('#boot'); b.style.display = 'block'; b.textContent = '';
    ['Sharma Computers BIOS v2.1', 'Memory test: 65536K OK', 'Detecting DVD-ROM… OK', 'Starting up…'].forEach((l, i) => setTimeout(() => { if (this.on) { b.textContent += l + '\n'; tone(1200, .03, 'square', .02); } }, i * 380));
    setTimeout(() => { if (!this.on) return; b.style.display = 'none'; sfx.chime(); this.desk(); if (this.disc) this.app('media'); }, 1800);
  }
  close() { this.stop(); this.wake(); this.on = false; $('#pc').style.display = 'none'; this.onClose(); }
  stop() { clearInterval(this.snI); cancelAnimationFrame(this.raf); this.turn = null; $('#win').style.display = 'none'; }
  desk() {
    $('#dsk').innerHTML = [['🖥️', 'My Computer', 'comp'], ['💿', 'DVD Player', 'media'], ['📝', 'udhaar.txt', 'note'], ['🌐', 'Internet', 'web'], ['🐍', 'Snake', 'snake'], ['🗑️', 'Recycle Bin', 'bin']].map(a => `<div class="ic" data-a="${a[2]}"><span>${a[0]}</span>${a[1]}</div>`).join('');
    document.querySelectorAll('.ic').forEach(e => { e.onclick = () => this.app(e.dataset.a); });
  }
  app(k) {
    this.stop(); tone(700, .05, 'square', .03); const w = $('#win'); w.style.display = 'block';
    if (k === 'snake') { $('#wt').textContent = 'Snake'; return this.snake(); }
    if (k === 'media') { $('#wt').textContent = 'DVD Player'; return this.media(); }
    $('#wt').textContent = APPS[k][0]; $('#wb').innerHTML = APPS[k][1];
  }
  snake() {
    $('#wb').innerHTML = '<canvas id="sn" width="240" height="240"></canvas><p style="text-align:center;margin:6px 0 0">Arrow keys / WASD · or tap a side of the screen</p>';
    const c = $('#sn'), g = c.getContext('2d'); let s = [[7, 7], [6, 7], [5, 7]], d = [1, 0], f = [11, 7], sc = 0;
    this.turn = (x, y) => { if (x !== -d[0] || y !== -d[1]) d = [x, y]; };
    c.onpointerdown = e => { const r = c.getBoundingClientRect(), x = e.clientX - r.left - 120, y = e.clientY - r.top - 120; Math.abs(x) > Math.abs(y) ? this.turn(Math.sign(x), 0) : this.turn(0, Math.sign(y)); };
    this.snI = setInterval(() => {
      const h = [s[0][0] + d[0], s[0][1] + d[1]];
      if (h[0] < 0 || h[1] < 0 || h[0] > 14 || h[1] > 14 || s.some(p => p[0] === h[0] && p[1] === h[1])) { tone(150, .4, 'square', .06, 60); s = [[7, 7], [6, 7], [5, 7]]; d = [1, 0]; sc = 0; return; }
      s.unshift(h); if (h[0] === f[0] && h[1] === f[1]) { sc++; tone(900, .06, 'square', .05); f = [Math.random() * 15 | 0, Math.random() * 15 | 0]; } else s.pop();
      g.fillStyle = '#9bb400'; g.fillRect(0, 0, 240, 240); g.fillStyle = '#1c2400'; s.forEach(p => g.fillRect(p[0] * 16 + 1, p[1] * 16 + 1, 14, 14)); g.fillRect(f[0] * 16 + 4, f[1] * 16 + 4, 8, 8); g.font = 'bold 12px monospace'; g.fillText('Score ' + sc, 6, 12);
    }, 120);
  }
  media() {
    const wb = $('#wb'), d = this.disc;
    if (!d) { wb.innerHTML = '<b>DVD Player</b><p>No disc in the drive.</p><small>Pick a DVD off the shelf, hold it, and walk up to the computer.</small>'; return; }
    wb.innerHTML = `<canvas id="mv" width="320" height="200"></canvas><div style="text-align:center;margin-top:6px"><button id="mp">⏯ Play / Pause</button> <b>${d.name}</b></div>`;
    const c = $('#mv'), g = c.getContext('2d'), img = new Image(); img.src = assetUrl(`dvd/${d.id}.png`); let playing = true, t = 0, last = performance.now();
    $('#mp').onclick = () => { playing = !playing; };
    const lines = ['Chapter 1 — Opening', 'Chapter 2 — The Song', 'Interval', 'Chapter 3 — Climax', 'The End'];
    const loop = now => {
      const dt = (now - last) / 1000; last = now; if (playing) t += dt;
      const q = g.createLinearGradient(0, 0, 0, 200); q.addColorStop(0, `hsl(${(t * 12) % 360},60%,35%)`); q.addColorStop(1, `hsl(${(t * 12 + 80) % 360},70%,55%)`); g.fillStyle = q; g.fillRect(0, 0, 320, 200);
      g.fillStyle = '#0006'; for (let i = 0; i < 6; i++) { const x = ((i * 70 - t * 30) % 400 + 400) % 400 - 40; g.beginPath(); g.moveTo(x, 200); g.lineTo(x + 25, 110 + (i % 3) * 14); g.lineTo(x + 50, 200); g.fill(); }
      if (img.complete && img.naturalWidth) { g.globalAlpha = Math.max(0, 1 - t / 4); g.drawImage(img, 90, 0, 140, 196); g.globalAlpha = 1; }
      g.fillStyle = '#000b'; g.fillRect(0, 168, 320, 32); g.fillStyle = '#fff'; g.font = '13px Tahoma'; g.fillText(lines[Math.min(4, t / 8 | 0)], 10, 188);
      const m = Math.floor(t / 60), s = Math.floor(t % 60); g.textAlign = 'right'; g.fillText(`${m}:${String(s).padStart(2, '0')} ${playing ? '▶' : '❚❚'}`, 312, 188); g.textAlign = 'left';
      this.raf = requestAnimationFrame(loop);
    }; this.raf = requestAnimationFrame(loop);
  }
  saver() {
    const c = $('#ss'), b = c.parentElement.getBoundingClientRect(); if (c.style.display === 'block') return;
    c.width = b.width; c.height = b.height; c.style.display = 'block'; const g = c.getContext('2d'); let x = 20, y = 40, vx = 2.4, vy = 1.8;
    this.ssT = setInterval(() => { g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(0, 0, c.width, c.height); g.font = 'bold 28px Arial'; g.fillStyle = `hsl(${(x * 2) % 360},90%,60%)`; g.fillText('SHARMA COMPUTERS', x, y); x += vx; y += vy; if (x < 0 || x > c.width - 270) vx *= -1; if (y < 30 || y > c.height - 10) vy *= -1; }, 30);
  }
  wake() { this.idle = 0; const c = $('#ss'); if (c.style.display === 'block') { c.style.display = 'none'; clearInterval(this.ssT); } }
}
