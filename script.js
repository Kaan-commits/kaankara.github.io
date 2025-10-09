fetch("https://ipwhois.app/json/")
    .then(response => response.json())
    .then(data => {
        const logData = {
            city: data.city,
            country: data.country,
            ip: data.ip,
            time: new Date().toLocaleString(),
        };

        // Verileri sunucuya gönder
        fetch("log.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(logData)
        })
        .then(response => response.text())
        .then(data => console.log("Log kaydedildi:", data))
        .catch(error => console.error("Hata:", error));
    })
    .catch(error => console.error("IP bilgisi alınamadı:", error));

// Modal ve düğme elementlerini seç
const modal = document.getElementById("socialMediaModal");
const socialMediaButton = document.getElementById("socialMediaButton");
const closeButton = document.querySelector(".modal-content .close");
const nextChapter = document.getElementById("nextChapter");
const prevChapter = document.getElementById("prevChapter");
const chapter2Content = document.getElementById("chapter2");
const chapter3Content = document.getElementById("chapter3");

// Modal'ı aç
socialMediaButton.addEventListener("click", () => {
    modal.style.display = "flex";
});

// Modal'ı kapat
closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});

// Modal dışında bir yere tıklayınca kapat
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

function showChapter3() {
  document.getElementById("chapter2").style.display = "none"; // Chapter 2'yi gizle
  document.getElementById("chapter3").style.display = "block"; // Chapter 3'ü göster
    document.getElementById("chapter4-5").style.display = "none"; // Chapter 4-5'i gizle
}

function showChapter2() {
  document.getElementById("chapter3").style.display = "none"; // Chapter 3'ü gizle
  document.getElementById("chapter2").style.display = "block"; // Chapter 2'yi göster
    document.getElementById("chapter4-5").style.display = "none"; // Chapter 4-5'i gizle
}

function showChapter45(){
    document.getElementById("chapter4-5").style.display = "block"; // Chapter 4-5'i göster
    document.getElementById("chapter3").style.display = "none"; // Chapter 3'ü gizle
    document.getElementById("chapter2").style.display = "none"; // Chapter 2'yi gizle
}

// Cursor follower
const cursorFollower = document.getElementById("cursorFollower");
if (cursorFollower) {
  document.addEventListener("mousemove", (event) => {
    const x = event.clientX - 55;
    const y = event.clientY + 10;
    cursorFollower.style.left = `${x}px`;
    cursorFollower.style.top = `${y}px`;
  });
}

// Stars background
const canvas = document.getElementById("stars");
if (canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars = [];
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    });
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    stars.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function updateStars() {
    stars.forEach((star) => {
      star.x += star.dx;
      star.y += star.dy;
      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;
    });
  }

  function animate() {
    drawStars();
    updateStars();
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Eğer dinamik eklemek istersen:
const TRAIL_COUNT = 7;
const trailElements = [];
// Sayfaya göre farklı görsel kullan
let trailImage = "Assets/Sonic_Running.gif";
if (window.location.pathname.includes("videogaleri")) {
  trailImage = "Assets/Paper_plane.gif";
}
for (let i = 0; i < TRAIL_COUNT; i++) {
  const el = document.createElement("div");
  el.className = "cursor-trail";
  el.style.position = "fixed";
  el.style.pointerEvents = "none";
  el.style.zIndex = 1000;
  el.style.width = "40px";
  el.style.height = "40px";
  el.style.borderRadius = "50%";
  el.style.background = `url('${trailImage}') center/cover no-repeat`;
  el.style.transition = "transform 0.1s linear";
  document.body.appendChild(el);
  trailElements.push(el);
}

let positions = Array.from({ length: TRAIL_COUNT }, () => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 }));

document.addEventListener("mousemove", (event) => {
  positions[0] = { x: event.clientX, y: event.clientY };
});

function animateTrail() {
  for (let i = 1; i < TRAIL_COUNT; i++) {
    // Her takipçi bir öncekinin pozisyonuna yaklaşsın
    positions[i].x += (positions[i - 1].x - positions[i].x) * 0.3;
    positions[i].y += (positions[i - 1].y - positions[i].y) * 0.3;
  }
  for (let i = 0; i < TRAIL_COUNT; i++) {
    trailElements[i].style.transform = `translate(${positions[i].x - 20}px, ${positions[i].y - 20}px)`;
  }
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* === Games modal behavior === */
(function(){
  const gamesButton = document.getElementById('gamesButton');
  const gamesModal = document.getElementById('gamesModal');
  const closeGames = document.querySelector('.close-games');

  function openGames(){
    if(!gamesModal) return;
    gamesModal.setAttribute('aria-hidden','false');
    document.documentElement.style.overflow = 'hidden'; // prevent background scroll
  }
  function closeGamesModal(){
    if(!gamesModal) return;
    gamesModal.setAttribute('aria-hidden','true');
    document.documentElement.style.overflow = ''; // restore
  }

  if (gamesButton) gamesButton.addEventListener('click', (e)=>{
    e.preventDefault();
    openGames();
  });
  if (closeGames) closeGames.addEventListener('click', closeGamesModal);

  // click outside to close
  if (gamesModal) {
    gamesModal.addEventListener('click', (e)=>{
      if (e.target === gamesModal) closeGamesModal();
    });
  }

  // ESC to close
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') closeGamesModal();
  });
})();