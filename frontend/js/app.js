const API_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:5000/api/items' 
  : `${window.location.origin}/api/items`;

const WHATSAPP_NUMBER = "94783938367"; // ⚠️ ඔයාගේ සැබෑ WhatsApp නම්බර් එක දාන්න මචං

const mockData = [
  { _id: "ff1", title: "Free Fire Max Level 72 | Full Evo Gun Skins", category: "freefire", price: 8500, description: "This is a premium account with rare emotes and maxed out guns.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400" },
  { _id: "yt1", title: "International Funny Compilation Channel (Monetized)", category: "youtube", price: 24000, subscribers: "12.4K", description: "Monetized channel, clean history, earning passive income from funny shorts.", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400" },
  { _id: "tt1", title: "Gaming/Editz Viral TikTok Profile", category: "tiktok", price: 4500, followers: "25K", description: "High engagement profile, mostly Sri Lankan and global gaming audience.", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400" },
  
  // 💎 Diamond Shop Memberships
  { _id: "dia_wl", title: "Weekly Membership Lite", category: "diamonds", price: 350, diamondCount: "Weekly Lite", description: "Get instant rewards and daily diamonds with Weekly Lite membership.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "dia_w", title: "Weekly Membership", category: "diamonds", price: 790, diamondCount: "Weekly Standard", description: "Standard Weekly Membership. Super fast activation via Player ID.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "dia_vw", title: "VIP Weekly Membership", category: "diamonds", price: 1150, diamondCount: "VIP Weekly", description: "Premium VIP Weekly benefits. Level up your game instantly.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "dia_m", title: "Monthly Membership", category: "diamonds", price: 2950, diamondCount: "Monthly Standard", description: "Massive diamond bundle across 30 days. Best value for money.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "dia_vm", title: "VIP Monthly Membership", category: "diamonds", price: 4200, diamondCount: "VIP Monthly", description: "The ultimate Free Fire subscription. Maximum rewards guaranteed.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" }
];

let allFetchedItems = []; 
let currentSelectedCategory = 'all'; 

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts('all');
});

// Sidebar Controller Actions
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

async function fetchProducts(category = 'all') {
  currentSelectedCategory = category; 
  const grid = document.getElementById("products-grid");
  grid.innerHTML = '<div class="loading">Loading premium listings...</div>';
  
  try {
    const url = category === 'all' ? API_BASE_URL : `${API_BASE_URL}?category=${category}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fallback execution trigger");
    const data = await response.json();
    
    allFetchedItems = data.length ? data : mockData;
    
    if (category === 'all') {
      const accountsOnly = allFetchedItems.filter(item => item.category !== 'diamonds');
      renderGrid(accountsOnly);
    } else {
      const filtered = allFetchedItems.filter(item => item.category === category);
      renderGrid(filtered);
    }
  } catch (err) {
    allFetchedItems = mockData; 
    if (category === 'all') {
      const accountsOnly = mockData.filter(item => item.category !== 'diamonds');
      renderGrid(accountsOnly);
    } else {
      const filtered = mockData.filter(item => item.category === category);
      renderGrid(filtered);
    }
  }
}

function renderGrid(items) {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";
  
  let displayItems = items;
  if (currentSelectedCategory === 'all') {
    displayItems = items.filter(item => item.category !== 'diamonds');
  }

  if (displayItems.length === 0) {
    grid.innerHTML = '<div class="loading">No listings available at the moment.</div>';
    return;
  }
  
  displayItems.forEach(item => {
    const isDiamond = item.category === 'diamonds';
    const isSold = item.status === 'sold';
    
    const card = document.createElement("div");
    card.className = `card ${isDiamond ? 'diamond-card' : ''}`;
    if (isSold) card.style.opacity = "0.65";

    card.setAttribute('onclick', `openProductModal('${item._id}')`);
    card.style.cursor = 'pointer'; 

    let metaHTML = '';
    // 💡 [වෙනස් කළා]: Free Fire කැටගරි එකේදී Lv සහ Skins කෑල්ල කාඩ් එකෙන් සම්පූර්ණයෙන්ම අයින් කරලා හිස් කළා මචං
    if (item.category === 'freefire') {
      metaHTML = `<span>Gaming Account</span>`;
    } else if (item.category === 'youtube') {
      metaHTML = `<span>Subs: <strong>${item.subscribers || '0'}</strong></span>`;
    } else if (item.category === 'tiktok') {
      metaHTML = `<span>Followers: <strong>${item.followers || '0'}</strong></span>`;
    } else if (item.category === 'diamonds') {
      metaHTML = `<span>Type: <strong>💎 ${item.diamondCount || 'Membership'}</strong></span>`;
    }

    const buttonHTML = isSold 
      ? `<button class="buy-btn" style="background:#6c757d; cursor:not-allowed;" disabled onclick="event.stopPropagation();">Sold Out</button>`
      : `<button class="buy-btn" onclick="event.stopPropagation(); openProductModal('${item._id}');">View Details</button>`;

    const badgeHTML = isSold 
      ? `<span class="category-badge" style="background:#dc3545; color:white;">SOLD OUT</span>`
      : `<span class="category-badge">${item.category}</span>`;

    card.innerHTML = `
      <div class="card-img-wrapper">
        ${badgeHTML}
        <img src="${item.image}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div class="card-content">
        <h3>${item.title}</h3>
        <div class="meta-info">${metaHTML}</div>
        <div class="price-row">
          <div class="price">LKR ${item.price.toLocaleString()}</div>
          ${buttonHTML}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function selectCategory(category, element) {
  document.querySelectorAll(".nav-link").forEach(lnk => lnk.classList.remove("active"));
  element.classList.add("active");
  
  const titles = {
    all: "All Available Products",
    freefire: "Premium Free Fire Accounts",
    youtube: "Available YouTube Channels",
    tiktok: "Premium TikTok Accounts",
    diamonds: "💎 Diamond Instant Top-Up Store"
  };
  document.getElementById("store-title").innerText = titles[category] || "Store";
  
  fetchProducts(category);
  toggleSidebar();
}

function openProductModal(itemId) {
  const item = allFetchedItems.find(i => i._id === itemId);
  if (!item) return;

  document.getElementById('modal-image').src = item.image;
  document.getElementById('modal-title').innerText = item.title;
  document.getElementById('modal-price').innerText = "LKR " + item.price.toLocaleString();
  document.getElementById('modal-badge').innerText = item.category;
  
  document.getElementById('modal-description').innerText = item.description || "No description provided by seller.";

  const specsContainer = document.getElementById('modal-specs');
  specsContainer.innerHTML = ''; 

  let whatsappDetails = '';

  // 💡 [වෙනස් කළා]: Popup එක ඇතුළෙත් Specs Box එක Free Fire වලට ඕනෙ නැති නිසා සරල කරලා, WhatsApp යන මැසේජ් එකත් පිළිවෙල කලා
  if (item.category === 'freefire') {
    specsContainer.innerHTML = `<div><strong>Item:</strong> Premium Free Fire Gaming Account</div>`;
    whatsappDetails = `🎮 Type: Free Fire Account`;
  } else if (item.category === 'youtube') {
    specsContainer.innerHTML = `<div><strong>Subscribers:</strong> ${item.subscribers || 'N/A'}</div>`;
    whatsappDetails = `🔴 Subscribers: ${item.subscribers || 'N/A'}`;
  } else if (item.category === 'tiktok') {
    specsContainer.innerHTML = `<div><strong>Followers:</strong> ${item.followers || 'N/A'}</div>`;
    whatsappDetails = `🎵 Followers: ${item.followers || 'N/A'}`;
  } else if (item.category === 'diamonds') {
    specsContainer.innerHTML = `<div><strong>Membership Type:</strong> ${item.diamondCount || 'Free Fire Pack'}</div>`;
    whatsappDetails = `💎 Pack Type: ${item.diamondCount || 'Membership Pack'}`;
  }

  const buyBtn = document.getElementById('modal-buy-btn');
  if (item.status === 'sold') {
    buyBtn.innerText = "❌ Sold Out";
    buyBtn.style.background = "#6c757d";
    buyBtn.style.pointerEvents = "none";
    buyBtn.href = "#";
  } else {
    buyBtn.innerText = "💬 Order Via WhatsApp";
    buyBtn.style.background = "#25d366";
    buyBtn.style.pointerEvents = "auto";
    
    const message = `Hello RICKEY STORE,\n\nMala meka madiwa ganna puluwanda?\n\n📌 Product: ${item.title}\n🆔 Item ID: ${item._id}\n${whatsappDetails}\n💰 Price: LKR ${item.price.toLocaleString()}`;
    buyBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  document.getElementById('productModal').classList.add('active');
  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  document.getElementById('modal-overlay').classList.remove('active');
}
