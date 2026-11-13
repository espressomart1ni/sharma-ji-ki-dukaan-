const $ = s => document.querySelector(s);
// Sharma uncle. Choices are picked with number keys (1-4) or by tapping.
export class Dialogue {
  constructor() { this.active = false; this.perm = false; this.choices = []; this.lines = ['Kuch lena hai ya sirf dekhna hai?', 'Haath lagao, par jahan se uthaya wahin rakhna.', 'Bachcha, school nahi hai aaj?', 'Paise chhutte nahi hain, fir bhi poochh raha hoon.']; }
  say(text, ch) {
    this.active = true; $('#dlg').style.display = 'block'; $('#dt').textContent = text; const c = $('#dc'); c.innerHTML = ''; this.choices = ch;
    ch.forEach(([n, f], i) => { const b = document.createElement('button'); b.textContent = `${i + 1}. ${n}`; b.onclick = e => { e.stopPropagation(); f(); }; c.appendChild(b); });
  }
  choose(i) { if (this.choices[i]) this.choices[i][1](); }
  close() { this.active = false; $('#dlg').style.display = 'none'; }
  open(onComputer) {
    const menu = () => this.say(this.perm ? 'Haan, bolo.' : 'Haan beta, kya chahiye?', [
      ...(this.perm ? [['Sit at the computer', () => { this.close(); onComputer(); }]] : [['Uncle, can I use the computer?', () => this.say('Arre, woh? Chalta hai. Half an hour only, aur wire ko haath mat lagana. DVD bhi laga sakte ho — peeche wali shelf mein hain.', [['Thanks, Uncle', () => { this.perm = true; this.close(); }]])]]),
      ['Where are the toffees?', () => this.say('Counter pe jar dekho. Aur peeche wali shelf mein Poppins hai, thoda purana stock.', [['Okay', menu]])],
      ['Anything hidden around here?', () => this.say('Dukaan mein sab dikhta hai, beta. Bas counter ka drawer kabhi kholke dekha hai?', [['Hmm…', menu]])],
      ['Just looking', () => this.close()]]);
    menu();
  }
  idleLine() { return 'Uncle: ' + this.lines[Math.random() * this.lines.length | 0]; }
}
