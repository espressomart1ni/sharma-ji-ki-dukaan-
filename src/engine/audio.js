let context = null;

export function startAudio() {
  if (typeof AudioContext === 'undefined') return;
  context ||= new AudioContext();
  if (context.state === 'suspended') context.resume();
}

export function tone(frequency, duration = .08, type = 'sine', volume = .03, endFrequency = frequency) {
  if (!context) return;
  const oscillator = context.createOscillator(), gain = context.createGain();
  oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  oscillator.frequency.linearRampToValueAtTime(endFrequency, context.currentTime + duration);
  gain.gain.setValueAtTime(volume, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + duration);
  oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + duration);
}

export const sfx = {
  step: () => tone(90, .04, 'sine', .015),
  slide: () => tone(180, .1, 'triangle', .025, 120),
  crinkle: () => tone(900, .05, 'square', .018, 500),
  put: () => tone(220, .08, 'triangle', .03),
  crunch: () => tone(130, .12, 'sawtooth', .025, 70),
  glass: () => tone(700, .12, 'sine', .025, 1100),
  radio: () => tone(260, .25, 'square', .015, 420),
  tick: () => tone(600, .025, 'square', .02),
  tape: () => tone(180, .3, 'sawtooth', .02, 130),
  pop: () => tone(500, .1, 'triangle', .03, 900),
  chime: () => { tone(660, .12, 'sine', .025); setTimeout(() => tone(880, .16, 'sine', .02), 80); },
};
