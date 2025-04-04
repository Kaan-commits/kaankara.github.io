fetch("https://ip-api.com/json")
    .then(response => response.json())
    .then(data => {
        const logData = {
            city: data.city,
            country: data.country,
            ip: data.query,
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