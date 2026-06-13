// 🔥 1. FIREBASE INITIALIZATION
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

// 🔒 2. SECURITY GATEKEEPER
auth.onAuthStateChanged((user) => {
    if (!user && window.location.pathname.includes("store.html")) {
        window.location.href = "index.html";
    }
});

// 3. DATA & CONFIG
const WHATSAPP_NUMBER = "94761305100";
const mockData = [
  { _id: "ff1", title: "Free Fire Max Level 72", category: "freefire", price: 8500, description: "Premium account with rare emotes.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400" },
  { _id: "yt1", title: "Monetized YT Channel", category: "youtube", price: 24000, description: "Clean history, earning passive income.", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400" },
  { _id: "tt1", title: "Gaming/Editz TikTok", category: "tiktok", price: 4500, description: "High engagement profile.", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400" },
  { _id: "dia_w", title: "Weekly Membership", category: "diamonds", price: 790, description: "Standard Weekly Membership.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "dia_m", title: "Monthly Membership", category: "diamonds", price: 2950, description: "Massive diamond bundle.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" }
];

let allFetchedItems = mockData; // MockData එක direct පාවිච්චි කරමු
let currentSelectedCategory = 'all'; 
let currentMaxPrice = 10000; 

// 4. LOAD PRODUCTS
document.addEventListener("DOMContentLoaded", () => {
    renderGrid(allFetchedItems);
});

function selectCategory(cat, element) {
    currentSelectedCategory = cat;
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if(element) element.classList.add('active');
    
    // Filter logic
    let filtered = allFetchedItems.filter(item => {
        if (cat === 'all') return item.category !== 'diamonds';
        return item.category === cat;
    });
    
    renderGrid(filtered);
    toggleSidebar();
}

// 5. RENDER LOGIC
function renderGrid(items) {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = ""; 
    
    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-img-wrapper"><span class="category-badge">${item.category}</span><img src="${item.image}" alt="${item.title}"></div>
            <div class="card-content">
                <h4 class="card-item-title">${item.title}</h4>
                <div class="price-row"><div class="price">LKR ${item.price.toLocaleString()}</div><button class="buy-btn" onclick="openProductModal('${item._id}')">View Details</button></div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 6. MODAL & UTILS
function openProductModal(itemId) {
    const item = allFetchedItems.find(i => i._id === itemId);
    document.getElementById('modal-image').src = item.image;
    document.getElementById('modal-price').innerText = "LKR " + item.price.toLocaleString();
    document.getElementById('modal-description').innerText = item.description;
    document.getElementById('modal-buy-btn').href = `https://wa.me/${WHATSAPP_NUMBER}?text=I want to buy: ${item.title}`;
    document.getElementById('productModal').classList.add('active');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open");
}

function openAboutModal(e) { e.preventDefault(); document.getElementById("aboutModal").classList.add('active'); }
function closeAboutModal() { document.getElementById("aboutModal").classList.remove('active'); }
