const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const PW = canvas.width, PH = canvas.height;
let ball = { x: PW/2, y: PH/2, r: 8, vx: 4*(Math.random()<0.5?1:-1), vy: 3 };
let paddle = { w: 120, h: 12, x: PW/2 - 60, y: PH - 30 };
let score = 0;

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  paddle.x = Math.max(0, Math.min(PW - paddle.w, mx - paddle.w/2));
});

function resetBall() {
  ball.x = PW/2; ball.y = PH/2;
  ball.vx = 4*(Math.random()<0.5?1:-1);
  ball.vy = 3;
}

function draw() {
  ctx.clearRect(0,0,PW,PH);
  // ball
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); ctx.fill();
  // paddle
  ctx.fillStyle = '#d35400';
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
  // score
  ctx.fillStyle = '#bbb'; ctx.font='16px Arial';
  ctx.fillText('Score: '+score, 10, 20);
}

function update() {
  ball.x += ball.vx; ball.y += ball.vy;
  // walls
  if (ball.x - ball.r < 0 || ball.x + ball.r > PW) ball.vx *= -1;
  if (ball.y - ball.r < 0) ball.vy *= -1;
  // paddle collision
  if (ball.y + ball.r >= paddle.y && ball.y + ball.r < paddle.y + paddle.h + 10) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
      ball.vy *= -1;
      // deflect based on hit position
      const hitPos = (ball.x - (paddle.x + paddle.w/2)) / (paddle.w/2);
      ball.vx += hitPos * 2;
      score++;
    }
  }
  // missed
  if (ball.y - ball.r > PH) {
    score = 0;
    resetBall();
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

resetBall();
loop();