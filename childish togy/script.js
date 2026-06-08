// Product Data
const products = [
    {
        id: 1,
        name: "Classic Black Tee",
        category: "tshirt",
        price: 45,
        image: "Assets/fotogaleri/tees/tee1.jpg",
        description: "Klasik siyah tişört, her stile uyar"
    },
    {
        id: 2,
        name: "Neon Vibes",
        category: "tshirt",
        price: 45,
        image: "Assets/fotogaleri/tees/tee2.jpg",
        description: "Neon renkli trend tişört"
    },
    {
        id: 3,
        name: "Street Artist",
        category: "tshirt",
        price: 45,
        image: "Assets/fotogaleri/tees/tee3.jpg",
        description: "Sokak sanatı temalı tasarım"
    },
    {
        id: 4,
        name: "Urban Dreams",
        category: "tshirt",
        price: 45,
        image: "Assets/fotogaleri/tees/tee4.jpg",
        description: "Şehir hayatı temalı tişört"
    },
    {
        id: 5,
        name: "Vintage Style",
        category: "tshirt",
        price: 45,
        image: "Assets/fotogaleri/tees/tee5.jpg",
        description: "Retro stil tişört"
    },
    {
        id: 6,
        name: "Bold Statement",
        category: "tshirt",
        price: 45,
        image: "Assets/fotogaleri/tees/tee6.jpg",
        description: "Cesur ve çarpıcı tasarım"
    },
    {
        id: 7,
        name: "Minimalist",
        category: "tshirt",
        price: 45,
        image: "Assets/fotogaleri/tees/tee7.jpg",
        description: "Sade ve şık tasarım"
    },
    {
        id: 8,
        name: "Street Legends",
        category: "tshirt",
        price: 45,
        image: "Assets/fotogaleri/tees/tee8.jpg",
        description: "Sokak kültürü efsanesi"
    },
    {
        id: 9,
        name: "Future Tense",
        category: "tshirt",
        price: 45,
        image: "Assets/fotogaleri/tees/tee9.jpg",
        description: "Futuristik tasarım"
    }
];

let cart = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    displayProducts('all');
    setupCartListener();
    initSlider();
});

// Slider images - place your images in `childish togy/slider/` (slide1.jpg, slide2.jpg...)
const sliderImages = [
    'slider/slide1.jpg',
    'slider/slide2.jpg',
    'slider/slide3.jpg'
];

function initSlider() {
    const slidesEl = document.getElementById('slides');
    if (!slidesEl) return;
    slidesEl.innerHTML = sliderImages.map((src, i) => `\n        <div class="slide${i===0? ' active': ''}"><img src="${src}" alt="Slide ${i+1}"></div>\n    `).join('');

    const slideEls = slidesEl.querySelectorAll('.slide');
    if (slideEls.length === 0) return;
    let current = 0;
    function show(n) {
        slideEls.forEach((s, idx) => s.classList.toggle('active', idx === n));
    }

    document.getElementById('prevBtn').addEventListener('click', () => { current = (current - 1 + slideEls.length) % slideEls.length; show(current); reset(); });
    document.getElementById('nextBtn').addEventListener('click', () => { current = (current + 1) % slideEls.length; show(current); reset(); });

    let interval = setInterval(() => { current = (current + 1) % slideEls.length; show(current); }, 4000);
    function reset() { clearInterval(interval); interval = setInterval(() => { current = (current + 1) % slideEls.length; show(current); }, 4000); }
}
function displayProducts(category) {
    currentFilter = category;
    const productsGrid = document.getElementById('productsGrid');
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-rating">⭐⭐⭐⭐⭐</div>
                <div class="product-footer">
                    <div class="product-price">₺${product.price}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Sepete Ekle
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Products (not used but kept for compatibility)
function filterProducts(category) {
    displayProducts(category);
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartCount();
    showNotification(`${product.name} sepete eklendi!`);
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(90deg, #00D4FF, #FF006E);
        color: #0A0E27;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 0 25px rgba(0, 212, 255, 0.4);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        font-weight: bold;
        text-transform: uppercase;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Setup Cart Icon Listener
function setupCartListener() {
    document.querySelector('.cart-icon').addEventListener('click', openCart);
}

// Open Cart
function openCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.add('active');
    displayCartItems();
}

// Close Cart
function closeCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.remove('active');
}

// Display Cart Items
function displayCartItems() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalDiv = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart">Sepetiniz boş</p>';
        cartTotalDiv.textContent = '0';
        return;
    }

    let totalItems = 0;
    cartItemsDiv.innerHTML = cart.map((item, index) => {
        totalItems += item.quantity;

        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Adet: ${item.quantity}</p>
                </div>
                <div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </div>
            </div>
        `;
    }).join('');

    cartTotalDiv.textContent = totalItems;
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    displayCartItems();
    showNotification('Ürün sepetten kaldırıldı');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Sepetiniz boş!');
        return;
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    alert(`Teşekkürler!\n\nSiparişiniz başarıyla oluşturuldu.\nToplam Adet: ${totalItems}\n\nÖdeme sayfasına yönlendirileceksiniz.`);
    
    cart = [];
    updateCartCount();
    closeCart();
    displayCartItems();
    showNotification('Siparişiniz alındı! 🔥');
}

// Handle Contact Form Submit
function handleSubmit(event) {
    event.preventDefault();
    showNotification('Mesajınız gönderildi! Teşekkürler.');
    event.target.reset();
}

// Close cart when clicking outside
window.addEventListener('click', function(event) {
    const cartModal = document.getElementById('cartModal');
    if (event.target === cartModal) {
        closeCart();
    }
});

// Add smooth animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
