const buttons = document.querySelectorAll('.choices button');
const youEl = document.getElementById('youMove');
const cpuEl = document.getElementById('cpuMove');
const msg = document.getElementById('msg');

const moves = ['rock','paper','scissors'];

function decide(a,b){
  if(a===b) return 'Draw';
  if((a==='rock'&&b==='scissors')||(a==='paper'&&b==='rock')||(a==='scissors'&&b==='paper')) return 'You Win!';
  return 'You Lose!';
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const you = btn.dataset.move;
    const cpu = moves[Math.floor(Math.random()*moves.length)];
    youEl.textContent = you;
    cpuEl.textContent = cpu;
    msg.textContent = decide(you,cpu);
    // kısa animasyon
    btn.animate([{transform:'scale(1.05)'},{transform:'scale(1)'}],{duration:150});
  });
});