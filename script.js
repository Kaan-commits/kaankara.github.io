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
const btn = document.getElementById("socialMediaButton");
const closeBtn = document.querySelector(".close");

// Düğmeye tıklandığında modal'ı göster
btn.addEventListener("click", () => {
    modal.style.display = "block";
});

// Kapatma butonuna tıklandığında modal'ı gizle
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Modal dışında bir yere tıklandığında modal'ı gizle
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

const cursorFollower = document.getElementById("cursorFollower");

// Fare hareketlerini dinle
document.addEventListener("mousemove", (event) => {
    const x = event.clientX - 60; // Fare X koordinatından 60 piksel sola kaydır
    const y = event.clientY - 30; // Fare Y koordinatından 30 piksel yukarı kaydır

    // Görseli fare imlecine taşı
    cursorFollower.style.left = `${x}px`;
    cursorFollower.style.top = `${y}px`;
});

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        dx: Math.random() * 0.5,
        dy: Math.random() * 0.5,
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

        if (star.x > canvas.width) star.x = 0;
        if (star.y > canvas.height) star.y = 0;
    });
}

function animate() {
    drawStars();
    updateStars();
    requestAnimationFrame(animate);
}

animate();