const $ = s => document.querySelector(s);
let tT, fT;
// Minimal smart-glasses HUD: reticle, target pill, toast, action bar, finds counter.
export const ui = {
  handlers: { use() {}, inspect() {}, back() {}, action() {} },
  target(text) { const t = $('#target'); t.textContent = text || ''; t.style.opacity = text ? 1 : 0; $('#reticle').classList.toggle('hot', !!text); },
  toast(text, ms = 5200) { const e = $('#toast'); e.textContent = text; e.style.opacity = 1; clearTimeout(tT); tT = setTimeout(() => { e.style.opacity = 0; }, ms); },
  finds(n, total) { const f = $('#finds'); f.textContent = `Little finds ${n} / ${total}`; f.style.opacity = 1; clearTimeout(fT); fT = setTimeout(() => { f.style.opacity = .55; }, 3000); },
  bar(held, inspecting, actions) {
    const b = $('#bar'); b.innerHTML = '';
    const mk = (key, label, fn) => { const x = document.createElement('button'); x.innerHTML = `<b>${key}</b>${label}`; x.onclick = e => { e.stopPropagation(); fn(); }; b.appendChild(x); };
    mk('E', 'Use', () => ui.handlers.use());
    if (held) {
      mk('F', inspecting ? 'Step back' : 'Inspect', () => ui.handlers.inspect());
      actions.forEach((a, i) => mk(String(i + 1), a.label, () => ui.handlers.action(i)));
      mk('Q', 'Put back', () => ui.handlers.back());
    }
  },
};
