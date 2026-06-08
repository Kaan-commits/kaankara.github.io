// Product Data
const products = [
    {
        id: 1,
        name: "Renkli T-Shirt",
        category: "tshirt",
        price: 45,
        icon: "👕",
        description: "Yumuşak ve rahat %100 pamuk",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 2,
        name: "Mavi Jeans",
        category: "pants",
        price: 89,
        icon: "👖",
        description: "Dayanıklı ve şık tasarım",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 3,
        name: "Prenses Elbisesi",
        category: "dress",
        price: 120,
        icon: "👗",
        description: "Özel günler için perfect",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 4,
        name: "Spor T-Shirt",
        category: "tshirt",
        price: 55,
        icon: "🎽",
        description: "Hareketli çocuklar için ideal",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 5,
        name: "Kahverengi Pantolon",
        category: "pants",
        price: 75,
        icon: "👖",
        description: "Her mevsime uygun",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 6,
        name: "Yaz Elbisesi",
        category: "dress",
        price: 95,
        icon: "👗",
        description: "Havalı ve renkli",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 7,
        name: "Grafik T-Shirt",
        category: "tshirt",
        price: 50,
        icon: "👕",
        description: "Çocukların sevdiği karakterler",
        rating: "⭐⭐⭐⭐"
    },
    {
        id: 8,
        name: "Siyah Pantolon",
        category: "pants",
        price: 85,
        icon: "👖",
        description: "Klasik ve şık",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 9,
        name: "Resmi Elbise",
        category: "dress",
        price: 150,
        icon: "👗",
        description: "Özel etkinlikler için",
        rating: "⭐⭐⭐⭐⭐"
    }
];

let cart = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    displayProducts('all');
    setupCartListener();
});

// Display Products
function displayProducts(category) {
    currentFilter = category;
    const productsGrid = document.getElementById('productsGrid');
    
    let filteredProducts = products;
    if (category !== 'all') {
        filteredProducts = products.filter(p => p.category === category);
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-rating">${product.rating}</div>
                <div class="product-footer">
                    <div class="product-price">₺${product.price}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Ekle
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="filterProducts('${category}')"]`).classList.add('active');
}

// Filter Products
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
        background: linear-gradient(135deg, #FF6B9D, #4ECDC4);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
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

    let total = 0;
    cartItemsDiv.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Miktar: ${item.quantity}</p>
                </div>
                <div>
                    <div class="cart-item-price">₺${itemTotal}</div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i> Sil
                    </button>
                </div>
            </div>
        `;
    }).join('');

    cartTotalDiv.textContent = total.toFixed(2);
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

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Teşekkürler!\n\nSiparişiniz başarıyla oluşturuldu.\nToplam Tutar: ₺${total.toFixed(2)}\n\nÖdeme sayfasına yönlendirileceksiniz.`);
    
    cart = [];
    updateCartCount();
    closeCart();
    displayCartItems();
    showNotification('Siparişiniz alındı! 🎉');
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
