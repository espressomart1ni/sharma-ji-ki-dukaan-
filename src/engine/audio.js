// Everything is synthesised with WebAudio, so there are no sound files to ship.
let AC;
export function startAudio() {
  if (!AC) {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    const n = AC.sampleRate * 2 | 0, b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const s = AC.createBufferSource(); s.buffer = b; s.loop = true;
    const f = AC.createBiquadFilter(); f.frequency.value = 200;
    const g = AC.createGain(); g.gain.value = .045;
    s.connect(f).connect(g).connect(AC.destination); s.start();
  }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
export function tone(f, d = .1, type = 'sine', v = .08, f2, at = 0) {
  try {
    const a = startAudio(), o = a.createOscillator(), g = a.createGain(), s = a.currentTime + at;
    o.type = type; o.frequency.setValueAtTime(f, s);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, s + d);
    g.gain.setValueAtTime(v, s); g.gain.exponentialRampToValueAtTime(.0001, s + d);
    o.connect(g).connect(a.destination); o.start(s); o.stop(s + d);
  } catch (e) { /* audio is optional */ }
}
export function noise(d = .2, v = .1, fq = 3000) {
  try {
    const a = startAudio(), n = a.sampleRate * d | 0, b = a.createBuffer(1, n, a.sampleRate), x = b.getChannelData(0);
    for (let i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = a.createBufferSource(); s.buffer = b;
    const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = fq;
    const g = a.createGain(); g.gain.value = v;
    s.connect(f).connect(g).connect(a.destination); s.start();
  } catch (e) { /* audio is optional */ }
}
export const sfx = {
  tick: () => tone(900, .05, 'square', .03),
  pick: () => { noise(.12, .12, 1200); tone(300, .08, 'triangle', .05, 450); },
  put: () => tone(220, .08, 'triangle', .1, 90),
  crinkle: () => { noise(.35, .25, 4500); noise(.2, .15, 2500); },
  slide: () => noise(.3, .12, 900),
  glass: () => { tone(1800, .3, 'sine', .05, 1500); noise(.1, .1, 6000); },
  pop: () => tone(500, .12, 'sine', .1, 900),
  step: () => noise(.05, .04, 300),
  crunch: () => noise(.16, .22, 3500),
  tape: () => { [392, 440, 494, 523, 494, 440].forEach((f, i) => tone(f, .28, 'triangle', .05, 0, i * .3)); },
  chime: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .4, 'triangle', .06, 0, i * .12)),
  radio: () => { noise(1.2, .1, 1800); [588, 660, 741, 784].forEach((f, i) => tone(f, .22, 'triangle', .05, 0, 1.2 + i * .25)); },
};
