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
  { _id: "dia_vw", title: "VIP Weekly Membership", category: "diamonds", price: 1150, diamondCount: "VIP Weekly", description: "Premium VIP Weekly benefits. Level up your game instantly.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "dia_m", title: "Monthly Membership", category: "diamonds", price: 2950, diamondCount: "Monthly Standard", description: "Massive diamond bundle across 30 days. Best value for money.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "dia_vm", title: "VIP Monthly Membership", category: "diamonds", price: 4200, diamondCount: "VIP Monthly", description: "The ultimate Free Fire subscription. Maximum rewards guaranteed.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "gem_100", title: "100+10 Diamonds Pack", category: "diamonds", price: 240, diamondCount: "110 Gems", isGems: true, description: "Instant Top-Up via Player ID.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "gem_210", title: "210+21 Diamonds Pack", category: "diamonds", price: 480, diamondCount: "231 Gems", isGems: true, description: "Instant Top-Up via Player ID.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "gem_530", title: "530+53 Diamonds Pack", category: "diamonds", price: 1150, diamondCount: "583 Gems", isGems: true, description: "Instant Top-Up via Player ID.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "gem_1080", title: "1080+108 Diamonds Pack", category: "diamonds", price: 2300, diamondCount: "1188 Gems", isGems: true, description: "Instant Top-Up via Player ID.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" }
];

let allFetchedItems = []; 
let currentSelectedCategory = 'all'; 
let currentMaxPrice = 10000; 

document.addEventListener("DOMContentLoaded", () => { fetchProducts('all'); });

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  sidebar.classList.toggle("open");
  if(sidebar.classList.contains("open")) { overlay.style.display = "block"; setTimeout(() => overlay.classList.add("active"), 10); } 
  else { overlay.classList.remove("active"); setTimeout(() => overlay.style.display = "none", 300); }
}

function updatePriceFilter(value) {
  currentMaxPrice = parseInt(value);
  const priceValueEl = document.getElementById('price-value');
  if (priceValueEl) priceValueEl.innerText = (currentMaxPrice === 10000) ? "Any Price" : `Rs. ${currentMaxPrice.toLocaleString()}`;
  filterAndRender();
}

function filterAndRender() {
  let filtered = allFetchedItems;
  if (currentSelectedCategory === 'all') {
    filtered = allFetchedItems.filter(item => item.category !== 'diamonds' && item.category !== 'diamond');
  } else {
    filtered = allFetchedItems.filter(item => {
      if (currentSelectedCategory === 'diamonds') return item.category === 'diamonds' || item.category === 'diamond';
      return item.category === currentSelectedCategory;
    });
  }
  if (currentMaxPrice < 10000) filtered = filtered.filter(item => parseInt(item.price) <= currentMaxPrice);
  renderGrid(filtered);
}

async function fetchProducts(category = 'all') {
  currentSelectedCategory = category; 
  const grid = document.getElementById("products-grid");
  grid.innerHTML = '<div class="loading">Loading premium listings...</div>';
  try {
    const url = category === 'all' ? API_BASE_URL : `${API_BASE_URL}?category=${category}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fallback");
    let data = await response.json();
    data = data.map(item => { if (item._id && item._id.startsWith('gem_')) item.isGems = true; return item; });
    mockData.filter(m => m.isGems).forEach(g => { if (!data.some(d => d._id === g._id)) data.push(g); });
    allFetchedItems = data;
  } catch (err) { allFetchedItems = mockData; }
  filterAndRender();
}

function renderGrid(items) {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";
  if (items.length === 0) { grid.innerHTML = '<div class="loading" style="text-align:center; width:100%; color:#6c757d; padding:40px 0;">ඔය මිල ගණන් යටතේ දැනට බඩු කිසිවක් නොමැත.</div>'; return; }
  if (currentSelectedCategory === 'diamonds') {
    items.filter(i => !i.isGems).forEach(i => createCardElement(i, grid));
    const gems = items.filter(i => i.isGems);
    if (gems.length > 0) {
        const d = document.createElement("div"); d.style.gridColumn = "1 / -1";
        d.innerHTML = `<h3 style="text-align:center; margin:20px 0;">💎 Direct Gems Top-Up 💎</h3>`;
        grid.appendChild(d);
        gems.forEach(i => createCardElement(i, grid));
    }
  } else { items.forEach(i => createCardElement(i, grid)); }
}

function createCardElement(item, grid) {
  const card = document.createElement("div");
  card.className = `card ${item.category === 'diamonds' ? 'diamond-card' : ''}`;
  card.onclick = () => openProductModal(item._id);
  card.innerHTML = `<div class="card-img-wrapper"><img src="${item.image}" style="width:100%"></div><div class="card-content"><h4>${item.title}</h4><div class="price">LKR ${item.price.toLocaleString()}</div><button class="buy-btn">View Details</button></div>`;
  grid.appendChild(card);
}

// FIREBASE AUTH SETUP
const firebaseConfig = {
    apiKey: "AIzaSyDQzjYIoFl1uU0c24IkMFYKt9xsIjrlt3U",
    authDomain: "rickey-3c59e.firebaseapp.com",
    projectId: "rickey-3c59e",
    storageBucket: "rickey-3c59e.firebasestorage.app",
    messagingSenderId: "375211284684",
    appId: "1:375211284684:web:cb2faf2d708d53fe6e4a69"
};
const auth = firebase.auth();

// EMAIL VERIFICATION LÒGIC
async function adminLogin() {
    const email = prompt("Enter Email:");
    const password = prompt("Enter Password:");
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        // මෙන්න මෙතන තියෙන්නේ Email Verification එක
        if (!userCredential.user.emailVerified) {
            alert("⚠️ ඔබේ ඊමේල් ලිපිනය තහවුරු (Verify) කර නැත. කරුණාකර ඔබගේ ඊමේල් එක පරීක්ෂා කරන්න.");
            await auth.signOut();
            return;
        }
        alert("Login සාර්ථකයි!");
        localStorage.setItem("isAdminLoggedIn", "true");
        location.reload();
    } catch (error) { alert("Access Denied: " + error.message); }
}

function adminLogout() { auth.signOut().then(() => { localStorage.removeItem("isAdminLoggedIn"); location.reload(); }); }

function openProductModal(itemId) {
  const item = allFetchedItems.find(i => i._id === itemId);
  if (!item) return;
  document.getElementById('modal-title').innerText = item.title;
  document.getElementById('productModal').classList.add('active');
  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  document.getElementById('modal-overlay').classList.remove('active');
}
