import * as THREE from 'three';
import { fatal, report } from './engine/diagnostics.js';
import { Player } from './engine/player.js';
import { Hands } from './engine/hands.js';
import { Holder } from './engine/holder.js';
import { tick as tweenTick } from './engine/tween.js';
import { sfx, startAudio } from './engine/audio.js';
import { buildWorld } from './world/index.js';
import { LIGHT } from './config.js';
import { ui } from './ui/hud.js';
import { Dialogue } from './ui/dialogue.js';
import { OldPC } from './os/oldpc.js';

const $ = s => document.querySelector(s), touch = matchMedia('(pointer:coarse)').matches;
const canvas = $('#app');
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
catch (e) { fatal('WebGL could not start in this browser: ' + e.message); throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.5 : 2)); renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = LIGHT.exposure;
const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, .03, 100); scene.add(camera);

const ctx = buildWorld(scene), found = new Set(), TOTAL = 6;
const hooks = {
  say: t => ui.toast(t),
  found: (id, msg) => { ui.toast(msg, 6500); if (!found.has(id)) { found.add(id); ui.finds(found.size, TOTAL); sfx.pop(); } },
  talk: () => talk(), computer: () => computer(),
};
Object.assign(ctx.hooks, hooks);
const player = new Player(camera, ctx.colliders, () => sfx.step()), hands = new Hands(camera), holder = new Holder(scene, camera, hands, hooks), dlg = new Dialogue();
const pc = new OldPC(() => { mode = 'menu'; showStart(touch ? 'Back in the shop.' : 'Back in the shop. Click to put the glasses on again.'); if (touch) begin(); });
let mode = 'menu', target = null;

function showStart(msg) { $('#startmsg').textContent = msg; $('#go').textContent = 'Click to continue'; $('#start').style.display = 'flex'; player.enabled = false; }
function begin() {
  startAudio(); mode = 'play'; player.enabled = true; $('#start').style.display = 'none';
  if (!touch) { try { const r = canvas.requestPointerLock(); if (r && r.catch) r.catch(() => {}); } catch (e) { /* drag-look fallback */ } }
  refreshBar(); ui.toast('Walk in through the open door.', 4000);
}
$('#go').onclick = begin;
document.addEventListener('pointerlockchange', () => { if (!document.pointerLockElement && mode === 'play' && !touch) { mode = 'menu'; showStart('Paused.'); } });

function talk() { if (mode !== 'play') return; mode = 'talk'; player.enabled = false; dlg.open(() => computer()); }
function computer() {
  if (!dlg.perm) { ui.toast('Ask Uncle first — he’s at the counter.', 3500); if (mode === 'play') talk(); return; }
  const disc = holder.item && holder.item.obj.isDVD ? holder.item.def : null;
  mode = 'pc'; player.enabled = false; if (document.pointerLockElement) document.exitPointerLock(); pc.open({ disc });
  if (!disc) ui.toast('Tip: hold a DVD from the shelf, then use the computer to play it.', 6000);
}
function primary() {
  if (mode !== 'play' || !target) return;
  if (target.userData.item) holder.pick(target.userData.item); else target.userData.act();
}
function refreshBar() { ui.bar(!!holder.item, holder.inspecting, holder.item ? holder.item.obj.actions : []); }
ui.handlers = {
  use: primary, inspect: () => { if (holder.item) { holder.toggleInspect(); refreshBar(); } },
  back: () => { holder.putBack(); refreshBar(); }, action: i => holder.action(i),
};

// ---------- input ----------
addEventListener('keydown', e => {
  if (mode === 'talk') { if (e.code === 'Escape') { dlg.close(); mode = 'play'; player.enabled = true; } else if (/^Digit[1-4]$/.test(e.code)) { dlg.choose(+e.code.slice(5) - 1); if (!dlg.active && mode === 'talk') { mode = 'play'; player.enabled = true; } } return; }
  if (mode === 'pc') { if (e.code === 'Escape') pc.close(); return; }
  if (mode !== 'play') return;
  if (e.code === 'KeyE') primary(); else if (e.code === 'KeyF') ui.handlers.inspect(); else if (e.code === 'KeyQ') ui.handlers.back();
  else if (/^Digit[1-3]$/.test(e.code)) holder.action(+e.code.slice(5) - 1);
  else if (e.code === 'Minus' || e.code === 'Equal') { renderer.toneMappingExposure = Math.max(.3, Math.min(2.5, renderer.toneMappingExposure + (e.code === 'Equal' ? .1 : -.1))); ui.toast('Exposure ' + renderer.toneMappingExposure.toFixed(1), 1200); }
  if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
});
addEventListener('mousemove', e => {
  if (mode !== 'play' || !document.pointerLockElement) return;
  if (holder.inspecting) holder.rotate(e.movementX, e.movementY); else player.look(e.movementX, e.movementY);
});
let drag = null;
canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, moved: 0 }; if (e.pointerType === 'mouse' && mode === 'play' && document.pointerLockElement) primary(); });
canvas.addEventListener('pointermove', e => {
  if (!drag || mode !== 'play' || document.pointerLockElement) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; drag.moved += Math.abs(dx) + Math.abs(dy);
  if (holder.inspecting) holder.rotate(dx, dy); else player.look(dx * 1.4, dy * 1.4);
});
addEventListener('pointerup', () => { drag = null; });
const jy = $('#joy'); let jp = null;
jy.addEventListener('pointerdown', e => { jy.setPointerCapture(e.pointerId); jp = e.pointerId; });
jy.addEventListener('pointermove', e => { if (jp !== e.pointerId) return; const r = jy.getBoundingClientRect(), x = (e.clientX - r.left - 55) / 45, y = (e.clientY - r.top - 55) / 45, m = Math.hypot(x, y) || 1, k = Math.min(1, m); player.joy.x = x / m * k; player.joy.y = y / m * k; jy.firstElementChild.style.transform = `translate(${player.joy.x * 30}px,${player.joy.y * 30}px)`; });
const jend = () => { jp = null; player.joy.x = player.joy.y = 0; jy.firstElementChild.style.transform = ''; };
jy.addEventListener('pointerup', jend); jy.addEventListener('pointercancel', jend);
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });

// ---------- loop ----------
const rc = new THREE.Raycaster(), center = new THREE.Vector2(0, 0), clock = new THREE.Clock(), bgOut = new THREE.Color(0xcfdad6), bgIn = new THREE.Color(0x2a1c12), tmp = new THREE.Color();
let frame = 0, lastHeld = null, lastInsp = false, idleAt = performance.now();
function findTarget() {
  rc.setFromCamera(center, camera); rc.far = 2.4;
  const hits = rc.intersectObjects(ctx.targets, true);
  for (const h of hits) {
    let o = h.object; while (o && !(o.userData && (o.userData.item || o.userData.act))) o = o.parent;
    if (!o) continue; if (holder.item && o === holder.item.g) continue; return o;
  }
  return null;
}
let errCount = 0;
function loop() {
  requestAnimationFrame(loop);
  try { tickFrame(); window.__shopBooted = true; } catch (e) { if (errCount++ < 3) report(e); }
}
function tickFrame() {
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  player.update(dt); hands.update(dt, player.moving); holder.update(dt); tweenTick(dt); ctx.tick.forEach(f => f(dt, t));
  if (mode === 'play' && ++frame % 3 === 0) {
    target = holder.inspecting ? null : findTarget();
    const u = target && target.userData;
    ui.target(u ? (u.item ? `Pick up — ${u.item.def.name}` : `${u.prompt} — ${u.name}`) : '');
  } else if (mode !== 'play') ui.target('');
  if (holder.item !== lastHeld || holder.inspecting !== lastInsp) { lastHeld = holder.item; lastInsp = holder.inspecting; refreshBar(); }
  const k = Math.max(0, Math.min(1, -player.pos.z / 2.5));
  tmp.copy(bgOut).lerp(bgIn, k * .8); scene.background.copy(tmp); scene.fog.color.copy(tmp);
  ctx.sun.intensity = LIGHT.sun * (1 - k * .88); ctx.hemi.intensity = 1.0 - k * .62;
  if (mode === 'play' && player.pos.z < -1 && performance.now() - idleAt > 32000) { idleAt = performance.now(); if (Math.random() < .6) ui.toast(dlg.idleLine(), 3800); }
  renderer.render(scene, camera);
}
refreshBar(); loop();
