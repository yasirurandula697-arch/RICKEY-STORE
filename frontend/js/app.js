// 1. FIREBASE & BACKEND CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyDQzjYIoFl1uU0c24IkMFYKt9xsIjrlt3U",
    authDomain: "rickey-3c59e.firebaseapp.com",
    projectId: "rickey-3c59e",
    storageBucket: "rickey-3c59e.firebasestorage.app",
    messagingSenderId: "375211284684",
    appId: "1:375211284684:web:cb2faf2d708d53fe6e4a69"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const API_URL = "http://localhost:5000/api/items"; // ඔයාගේ Backend එකේ URL එක

// 2. FETCH PRODUCTS FROM BACKEND
async function fetchProducts(category = '') {
    const grid = document.getElementById("products-grid");
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading">Loading premium listings...</div>';

    try {
        let url = category && category !== 'all' ? `${API_URL}?category=${category}` : API_URL;
        const response = await fetch(url);
        const data = await response.json();
        
        renderGrid(data);
    } catch (error) {
        console.error("Backend Error:", error);
        grid.innerHTML = '<div class="error">Server error. Check your Backend!</div>';
    }
}

// 3. RENDER GRID
function renderGrid(items) {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = ""; 
    
    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        // දත්ත string එකක් විදිහට ආරක්ෂිතව යැවීම
        const itemData = JSON.stringify(item).replace(/"/g, '&quot;');
        
        card.innerHTML = `
            <div class="card-img-wrapper"><span class="category-badge">${item.category}</span><img src="${item.image}" alt="${item.title}"></div>
            <div class="card-content">
                <h4 class="card-item-title">${item.title}</h4>
                <div class="price-row"><div class="price">LKR ${item.price.toLocaleString()}</div><button class="buy-btn" onclick="openProductModal(${itemData})">View Details</button></div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 4. MODAL LOGIC (Product & About)
function openProductModal(item) {
    document.getElementById('modal-image').src = item.image;
    document.getElementById('modal-price').innerText = "LKR " + item.price.toLocaleString();
    document.getElementById('modal-description').innerText = item.description;
    document.getElementById('modal-buy-btn').href = `https://wa.me/94761305100?text=I want to buy: ${item.title}`;
    
    document.getElementById('productModal').classList.add('active');
    document.getElementById('modal-overlay').classList.add('active');
}

function openAboutModal(e) {
    if(e) e.preventDefault();
    document.getElementById("aboutModal").classList.add('active');
    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('aboutModal').classList.remove('active');
    document.getElementById('modal-overlay').classList.remove('active');
}

// 5. SIDEBAR & CATEGORY
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open");
    document.getElementById("sidebar-overlay").classList.toggle("open");
}

function selectCategory(cat, element) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if(element) element.classList.add('active');
    
    fetchProducts(cat);
    toggleSidebar();
}

// 6. INITIAL LOAD
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});
