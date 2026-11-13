import * as THREE from 'three';
// Shows runtime errors and failed asset requests on screen (tap/click to dismiss) instead of leaving a blank page.
function show(title, detail) {
  let d = document.getElementById('diag');
  if (!d) { d = document.createElement('div'); d.id = 'diag'; d.onclick = () => d.remove();
    d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:300;max-height:40vh;overflow:auto;background:#300d;color:#fff;font:12px/1.5 monospace;padding:10px 12px;border-radius:8px;white-space:pre-wrap'; document.body.appendChild(d); }
  d.textContent += `${title}\n${detail || ''}\n`;
}
addEventListener('error', e => show('Error: ' + e.message, (e.filename || '') + ':' + (e.lineno || '')));
addEventListener('unhandledrejection', e => show('Promise error: ' + ((e.reason && e.reason.message) || e.reason)));
THREE.DefaultLoadingManager.onError = url => { console.error('Asset failed to load:', url); show('Failed to load asset', url); };
export function fatal(msg) { show('Cannot start', msg); }
export function report(e) { show('Runtime error', (e && (e.stack || e.message)) || String(e)); }
