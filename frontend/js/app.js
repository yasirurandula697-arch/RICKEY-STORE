// 1. FIREBASE INITIALIZATION
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

// 2. DATA
const mockData = [
  { _id: "ff1", title: "Free Fire Max Level 72", category: "freefire", price: 8500, description: "Premium account with rare emotes.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400" },
  { _id: "yt1", title: "Monetized YT Channel", category: "youtube", price: 24000, description: "Clean history, earning passive income.", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400" },
  { _id: "tt1", title: "Gaming/Editz TikTok", category: "tiktok", price: 4500, description: "High engagement profile.", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400" },
  { _id: "dia_w", title: "Weekly Membership", category: "diamonds", price: 790, description: "Standard Weekly Membership.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "dia_m", title: "Monthly Membership", category: "diamonds", price: 2950, description: "Massive diamond bundle.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" }
];

// 3. RENDER GRID (සම්පූර්ණ කෝඩ් එක)
function renderGrid(items) {
    const grid = document.getElementById("products-grid");
    if (!grid) {
        console.error("Products-grid ID eka hoyaganna bari una!");
        return;
    }
    
    grid.innerHTML = ""; // පරණ දේවල් මකනවා
    
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

// 4. CATEGORY SELECT (දැන් මේක 100% වැඩ කරනවා)
function selectCategory(cat, element) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if(element) element.classList.add('active');
    
    let filtered = (cat === 'all') ? mockData : mockData.filter(i => i.category === cat);
    renderGrid(filtered);
    
    const sidebar = document.getElementById("sidebar");
    if(sidebar) sidebar.classList.remove("open");
}

// 5. MODAL LOGIC
function openProductModal(itemId) {
    const item = mockData.find(i => i._id === itemId);
    if(!item) return;
    
    document.getElementById('modal-image').src = item.image;
    document.getElementById('modal-price').innerText = "LKR " + item.price.toLocaleString();
    document.getElementById('modal-description').innerText = item.description;
    document.getElementById('modal-buy-btn').href = `https://wa.me/94761305100?text=I want to buy: ${item.title}`;
    document.getElementById('productModal').classList.add('active');
    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('modal-overlay').classList.remove('active');
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open");
    document.getElementById("sidebar-overlay").classList.toggle("open");
}

// 6. INITIAL LOAD
document.addEventListener("DOMContentLoaded", () => {
    console.log("App eka load una!");
    renderGrid(mockData);
});
