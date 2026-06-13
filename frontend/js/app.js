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
    // සයිට් එකේ ඉන්නේ store.html එකේ නම් සහ ලොග් වෙලා නැත්නම් විතරක් index.html එකට පන්නනවා
    if (!user && window.location.pathname.includes("store.html")) {
        window.location.href = "index.html";
    }
});

// 3. API & WHATSAPP SETTINGS
const API_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:5000/api/items' 
  : `${window.location.origin}/api/items`;

const WHATSAPP_NUMBER = "94761305100";

const mockData = [
  { _id: "ff1", title: "Free Fire Max Level 72 | Full Evo Gun Skins", category: "freefire", price: 8500, description: "This is a premium account with rare emotes and maxed out guns.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400" },
  { _id: "yt1", title: "International Funny Compilation Channel (Monetized)", category: "youtube", price: 24000, subscribers: "12.4K", description: "Monetized channel, clean history, earning passive income from funny shorts.", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400" },
  { _id: "tt1", title: "Gaming/Editz Viral TikTok Profile", category: "tiktok", price: 4500, followers: "25K", description: "High engagement profile, mostly Sri Lankan and global gaming audience.", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400" },
  { _id: "dia_wl", title: "Weekly Membership Lite", category: "diamonds", price: 350, diamondCount: "Weekly Lite", description: "Get instant rewards and daily diamonds with Weekly Lite membership.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "dia_w", title: "Weekly Membership", category: "diamonds", price: 790, diamondCount: "Weekly Standard", description: "Standard Weekly Membership. Super fast activation via Player ID.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "dia_m", title: "Monthly Membership", category: "diamonds", price: 2950, diamondCount: "Monthly Standard", description: "Massive diamond bundle across 30 days. Best value for money.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "gem_100", title: "100+10 Diamonds Pack", category: "diamonds", price: 240, diamondCount: "110 Gems", isGems: true, description: "Instant Top-Up via Player ID.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" }
];

let allFetchedItems = []; 
let currentSelectedCategory = 'all'; 
let currentMaxPrice = 10000; 

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts('all');
});

// 4. NAVIGATION & SIDEBAR LOGIC
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  sidebar.classList.toggle("open");
  if(sidebar.classList.contains("open")) {
    overlay.style.display = "block";
    setTimeout(() => overlay.classList.add("active"), 10);
  } else {
    overlay.classList.remove("active");
    setTimeout(() => overlay.style.display = "none", 300);
  }
}

// 5. PRICE FILTER LOGIC
function updatePriceFilter(value) {
  let sliderValue = parseInt(value);
  currentMaxPrice = (sliderValue === 10000) ? 999999 : sliderValue;
  const priceValueEl = document.getElementById('price-value');
  if (priceValueEl) {
    priceValueEl.innerText = (currentMaxPrice === 999999) ? "Any Price" : `Rs. ${currentMaxPrice.toLocaleString()}`;
  }
  filterAndRender();
}

function filterAndRender() {
  let filtered = allFetchedItems.filter(item => {
    if (currentSelectedCategory === 'all') return item.category !== 'diamonds';
    if (currentSelectedCategory === 'diamonds') return item.category === 'diamonds';
    return item.category === currentSelectedCategory;
  });

  if (currentSelectedCategory !== 'diamonds') {
    filtered = filtered.filter(item => parseInt(item.price) <= currentMaxPrice);
  }
  renderGrid(filtered);
}

// 6. PRODUCT SHOWCASE LOGIC
async function fetchProducts(category = 'all') {
  currentSelectedCategory = category; 
  const grid = document.getElementById("products-grid");
  grid.innerHTML = '<div class="loading">Loading premium listings...</div>';
  
  const filterRow = document.querySelector(".filter-section-row");
  if (filterRow) filterRow.style.display = (category === 'diamonds') ? "none" : "flex";
  
  try {
    const response = await fetch(category === 'all' ? API_BASE_URL : `${API_BASE_URL}?category=${category}`);
    allFetchedItems = await response.json();
  } catch (err) {
    allFetchedItems = mockData; 
  }
  filterAndRender();
}

function renderGrid(items) {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = items.length === 0 ? '<div class="loading">No products found.</div>' : "";
  items.forEach(item => createCardElement(item, grid));
}

function createCardElement(item, grid) {
  const card = document.createElement("div");
  card.className = "card";
  card.setAttribute('onclick', `openProductModal('${item._id}')`);
  card.innerHTML = `
    <div class="card-img-wrapper"><span class="category-badge">${item.category}</span><img src="${item.image}" alt="${item.title}"></div>
    <div class="card-content">
      <h4 class="card-item-title">${item.title}</h4>
      <div class="price-row"><div class="price">LKR ${item.price.toLocaleString()}</div><button class="buy-btn">View Details</button></div>
    </div>
  `;
  grid.appendChild(card);
}

// 7. LOGOUT FUNCTION
function logoutUser() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

// 8. MODAL LOGIC (Product View)
function openProductModal(itemId) {
  const item = allFetchedItems.find(i => i._id === itemId);
  if (!item) return;
  document.getElementById('modal-image').src = item.image;
  document.getElementById('modal-price').innerText = "LKR " + item.price.toLocaleString();
  document.getElementById('modal-description').innerText = item.description;
  const buyBtn = document.getElementById('modal-buy-btn');
  const msg = `Hello RICKEY STORE, I want to buy: ${item.title}`;
  buyBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  document.getElementById('productModal').classList.add('active');
  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  document.getElementById('modal-overlay').classList.remove('active');
}
