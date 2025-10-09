const canvas = document.getElementById('pong2');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

const paddleH = 100, paddleW = 12;
const left = { x: 20, y: (H - paddleH)/2, dy: 0, score:0 };
const right = { x: W - 20 - paddleW, y: (H - paddleH)/2, dy: 0, score:0 };
let ball = { x: W/2, y: H/2, r:8, vx:4*(Math.random()<0.5?1:-1), vy:3*(Math.random()<0.5?1:-1) };

const keys = { ArrowUp: false, ArrowDown: false, w:false, s:false };

function resetBall(){
  ball.x = W/2; ball.y = H/2;
  ball.vx = 4*(Math.random()<0.5?1:-1);
  ball.vy = 3*(Math.random()<0.5?1:-1);
}

function draw(){
  ctx.clearRect(0,0,W,H);
  // middle line
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for(let i=10;i<H;i+=28) ctx.fillRect(W/2-1, i, 2, 18);
  // paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(left.x, left.y, paddleW, paddleH);
  ctx.fillRect(right.x, right.y, paddleW, paddleH);
  // ball
  ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r,0,Math.PI*2); ctx.fill();
  // scores
  ctx.font = '20px monospace'; ctx.fillStyle='#cfcfcf';
  ctx.fillText(left.score, W*0.25, 30);
  ctx.fillText(right.score, W*0.75, 30);
}

function update(){
  // paddle movement
  if(keys.w) left.y -= 6;
  if(keys.s) left.y += 6;
  if(keys.ArrowUp) right.y -= 6;
  if(keys.ArrowDown) right.y += 6;
  left.y = Math.max(0, Math.min(H - paddleH, left.y));
  right.y = Math.max(0, Math.min(H - paddleH, right.y));

  // ball
  ball.x += ball.vx; ball.y += ball.vy;
  if(ball.y - ball.r < 0 || ball.y + ball.r > H) ball.vy *= -1;

  // left paddle collision
  if(ball.x - ball.r < left.x + paddleW && ball.y > left.y && ball.y < left.y + paddleH){
    ball.vx = Math.abs(ball.vx) + 0.2;
    // add spin by paddle zone
    const hit = (ball.y - (left.y + paddleH/2)) / (paddleH/2);
    ball.vy += hit * 2;
  }
  // right paddle collision
  if(ball.x + ball.r > right.x && ball.y > right.y && ball.y < right.y + paddleH){
    ball.vx = -Math.abs(ball.vx) - 0.2;
    const hit = (ball.y - (right.y + paddleH/2)) / (paddleH/2);
    ball.vy += hit * 2;
  }

  // score
  if(ball.x < 0){
    right.score++; resetBall();
  } else if(ball.x > W){
    left.score++; resetBall();
  }
}

function loop(){
  update(); draw();
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', e=>{
  if(e.key === 'r') { left.score=right.score=0; resetBall(); }
  if(e.key === 'w') keys.w = true;
  if(e.key === 's') keys.s = true;
  if(e.key === 'ArrowUp') keys.ArrowUp = true;
  if(e.key === 'ArrowDown') keys.ArrowDown = true;
});
document.addEventListener('keyup', e=>{
  if(e.key === 'w') keys.w = false;
  if(e.key === 's') keys.s = false;
  if(e.key === 'ArrowUp') keys.ArrowUp = false;
  if(e.key === 'ArrowDown') keys.ArrowDown = false;
});

resetBall();
loop();