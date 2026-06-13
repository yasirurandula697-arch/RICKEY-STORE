const API_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:5000/api/items' 
  : `${window.location.origin}/api/items`;

const WHATSAPP_NUMBER = "94761305100"; // ⚠️ ඔයාගේ සැබෑ WhatsApp නම්බර් එක

const mockData = [
  { _id: "ff1", title: "Free Fire Max Level 72 | Full Evo Gun Skins", category: "freefire", price: 8500, description: "This is a premium account with rare emotes and maxed out guns.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400" },
  { _id: "yt1", title: "International Funny Compilation Channel (Monetized)", category: "youtube", price: 24000, subscribers: "12.4K", description: "Monetized channel, clean history, earning passive income from funny shorts.", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400" },
  { _id: "tt1", title: "Gaming/Editz Viral TikTok Profile", category: "tiktok", price: 4500, followers: "25K", description: "High engagement profile, mostly Sri Lankan and global gaming audience.", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400" },
  
  // 💎 Diamond Shop Memberships
  { _id: "dia_wl", title: "Weekly Membership Lite", category: "diamonds", price: 350, diamondCount: "Weekly Lite", description: "Get instant rewards and daily diamonds with Weekly Lite membership.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "dia_w", title: "Weekly Membership", category: "diamonds", price: 790, diamondCount: "Weekly Standard", description: "Standard Weekly Membership. Super fast activation via Player ID.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "dia_vw", title: "VIP Weekly Membership", category: "diamonds", price: 1150, diamondCount: "VIP Weekly", description: "Premium VIP Weekly benefits. Level up your game instantly.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "dia_m", title: "Monthly Membership", category: "diamonds", price: 2950, diamondCount: "Monthly Standard", description: "Massive diamond bundle across 30 days. Best value for money.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "dia_vm", title: "VIP Monthly Membership", category: "diamonds", price: 4200, diamondCount: "VIP Monthly", description: "The ultimate Free Fire subscription. Maximum rewards guaranteed.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  
  // 🔥 [Gems Packs]
  { _id: "gem_100", title: "100+10 Diamonds Pack", category: "diamonds", price: 240, diamondCount: "110 Gems", isGems: true, description: "Instant Top-Up via Player ID.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "gem_210", title: "210+21 Diamonds Pack", category: "diamonds", price: 480, diamondCount: "231 Gems", isGems: true, description: "Instant Top-Up via Player ID.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "gem_530", title: "530+53 Diamonds Pack", category: "diamonds", price: 1150, diamondCount: "583 Gems", isGems: true, description: "Instant Top-Up via Player ID.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" },
  { _id: "gem_1080", title: "1080+108 Diamonds Pack", category: "diamonds", price: 2300, diamondCount: "1188 Gems", isGems: true, description: "Instant Top-Up via Player ID.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" }
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
    let data = await response.json();
    
    if (data && data.length > 0) {
      data = data.map(item => {
        if (item._id && item._id.startsWith('gem_')) {
          item.isGems = true;
        }
        return item;
      });
      
      const onlyGemsFromMock = mockData.filter(mockItem => mockItem.isGems === true);
      
      onlyGemsFromMock.forEach(gemItem => {
        if (!data.some(serverItem => serverItem._id === gemItem._id)) {
          data.push(gemItem);
        }
      });
      allFetchedItems = data;
    } else {
      allFetchedItems = mockData;
    }
    
    if (category === 'all') {
      const accountsOnly = allFetchedItems.filter(item => item.category !== 'diamonds' && item.category !== 'diamond');
      renderGrid(accountsOnly);
    } else {
      const filtered = allFetchedItems.filter(item => {
        if (category === 'diamonds') {
          return item.category === 'diamonds' || item.category === 'diamond';
        }
        return item.category === category;
      });
      renderGrid(filtered);
    }
  } catch (err) {
    allFetchedItems = mockData; 
    if (category === 'all') {
      const accountsOnly = mockData.filter(item => item.category !== 'diamonds' && item.category !== 'diamond');
      renderGrid(accountsOnly);
    } else {
      const filtered = mockData.filter(item => item.category === 'diamonds' || item.category === 'diamond');
      renderGrid(filtered);
    }
  }
}

function renderGrid(items) {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";
  
  let displayItems = items;
  if (currentSelectedCategory === 'all') {
    displayItems = items.filter(item => item.category !== 'diamonds' && item.category !== 'diamond');
  }

  if (displayItems.length === 0) {
    grid.innerHTML = '<div class="loading">No listings available at the moment.</div>';
    return;
  }
  
  if (currentSelectedCategory === 'diamonds') {
    const memberships = displayItems.filter(item => !item.isGems && !(item._id && item._id.startsWith('gem_')));
    const gemsPacks = displayItems.filter(item => item.isGems || (item._id && item._id.startsWith('gem_')));

    memberships.forEach(item => createCardElement(item, grid));

    if (gemsPacks.length > 0) {
      const divider = document.createElement("div");
      divider.style.gridColumn = "1 / -1"; 
      divider.innerHTML = `
        <hr style="border: 0; height: 1px; background: linear-gradient(to right, transparent, #ff416c, transparent); margin: 40px 0 20px 0;">
        <h3 style="font-family: 'Orbitron', sans-serif; text-align: center; color: #212529 !important; margin-bottom: 20px; font-size: 1.4rem; text-transform: uppercase; letter-spacing: 2px;">💎 Direct Gems Top-Up 💎</h3>
      `;
      grid.appendChild(divider);

      gemsPacks.forEach(item => createCardElement(item, grid));
    }
  } else {
    displayItems.forEach(item => createCardElement(item, grid));
  }
}

function createCardElement(item, grid) {
  const isDiamond = item.category === 'diamonds' || item.category === 'diamond';
  const isSold = item.status === 'sold';
  
  const card = document.createElement("div");
  card.className = `card ${isDiamond ? 'diamond-card' : ''}`;
  if (isSold) card.style.opacity = "0.65";

  card.setAttribute('onclick', `openProductModal('${item._id}')`);
  card.style.cursor = 'pointer'; 

  let metaHTML = '';
  if (item.category === 'freefire') {
    metaHTML = `<span>Gaming Account</span>`;
  } else if (item.category === 'youtube') {
    metaHTML = `<span>Subs: <strong>${item.subscribers || '0'}</strong></span>`;
  } else if (item.category === 'tiktok') {
    metaHTML = `<span>Followers: <strong>${item.followers || '0'}</strong></span>`;
  } else if (item.category === 'diamonds' || item.category === 'diamond') {
    const checkGems = item.isGems || (item._id && item._id.startsWith('gem_'));
    metaHTML = checkGems 
      ? `<span>Gems Pack: <strong>💎 ${item.diamondCount || 'Instant'}</strong></span>`
      : `<span>Type: <strong>👑 ${item.diamondCount || 'Membership'}</strong></span>`;
  }

  // 🔥 [නියම ෆික්ස් එක]: කැටගරි එක Diamonds නම් (Gems + Membership දෙකටම) Title එක පෙන්වනවා, Account වලට පෙන්වන්නේ නැහැ.
  let cardTitleHTML = '';
  if (isDiamond) {
    cardTitleHTML = `<h4 class="card-item-title" style="color: #fff; font-size: 0.95rem; margin: 5px 0; font-weight: 600; font-family: 'Poppins', sans-serif; opacity: 0.9;">${item.title}</h4>`;
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
      ${cardTitleHTML} <!-- 💡 දියමන්ති ස්ටෝර් එකේ හැම බඩුවකටම මෙතනින් Title එක වැටෙනවා මචං -->
      <div class="meta-info">${metaHTML}</div>
      <div class="price-row">
        <div class="price">LKR ${item.price.toLocaleString()}</div>
        ${buttonHTML}
      </div>
    </div>
  `;
  grid.appendChild(card);
}

function selectCategory(category, element) {
  document.querySelectorAll(".nav-link").forEach(lnk => lnk.classList.remove("active"));
  element.classList.add("active");
  
  const titles = {
    all: "All Available Products",
    freefire: "Premium Free Fire Accounts",
    youtube: "Available YouTube Channels",
    tiktok: "Premium TikTok Accounts",
    diamonds: "💎 Diamond Store"
  };
  document.getElementById("store-title").innerText = titles[category] || "Store";
  
  fetchProducts(category);
  toggleSidebar();
}

function openProductModal(itemId) {
  const item = allFetchedItems.find(i => i._id === itemId);
  if (!item) return;

  const imgEl = document.getElementById('modal-image');
  if (imgEl) imgEl.src = item.image;

  const titleEl = document.getElementById('modal-title');
  if (titleEl) titleEl.innerText = item.title;

  const priceEl = document.getElementById('modal-price');
  if (priceEl) priceEl.innerText = "LKR " + item.price.toLocaleString();

  const badgeEl = document.getElementById('modal-badge');
  if (badgeEl) badgeEl.innerText = item.category;

  const descEl = document.getElementById('modal-description');
  if (descEl) descEl.innerText = item.description || "No description provided by seller.";

  const specsContainer = document.getElementById('modal-specs');
  let whatsappDetails = '';

  if (specsContainer) {
    specsContainer.innerHTML = ''; 
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
      const isItemGem = item.isGems || (item._id && item._id.startsWith('gem_'));
      if (isItemGem) {
        specsContainer.innerHTML = `<div><strong>Top-Up Type:</strong> Direct Gems (Player ID)</div>`;
        whatsappDetails = `💎 Pack: ${item.diamondCount || 'Gems Pack'}\n🆔 Top-Up Method: Player ID`;
      } else {
        specsContainer.innerHTML = `<div><strong>Membership Type:</strong> ${item.diamondCount || 'Free Fire Pack'}</div>`;
        whatsappDetails = `👑 Membership: ${item.diamondCount || 'Membership Pack'}`;
      }
    }
  }

  const buyBtn = document.getElementById('modal-buy-btn');
  if (buyBtn) {
    if (item.status === 'sold') {
      buyBtn.innerText = "❌ Sold Out";
      buyBtn.style.background = "#6c757d";
      buyBtn.style.pointerEvents = "none";
      buyBtn.href = "#";
    } else {
      buyBtn.innerText = "💬 Order Via WhatsApp";
      buyBtn.style.background = "#25d366";
      buyBtn.style.pointerEvents = "auto";
      
      const fullImageUrl = item.image.startsWith('http') 
        ? item.image 
        : `${window.location.origin}${item.image.startsWith('/') ? '' : '/'}${item.image}`;
        
      const message = `Hello RICKEY STORE,\n\nCAN I BUY THIS?\n\n📌 Product: ${item.title}\n🆔 Item ID: ${item._id}\n${whatsappDetails}\n💰 Price: LKR ${item.price.toLocaleString()}\n\n🖼️ Product Photo: ${fullImageUrl}`;
      buyBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    }
  }

  const modalEl = document.getElementById('productModal');
  const overlayEl = document.getElementById('modal-overlay');
  if (modalEl) modalEl.classList.add('active');
  if (overlayEl) overlayEl.classList.add('active');
}

function closeModal() {
  const modalEl = document.getElementById('productModal');
  const overlayEl = document.getElementById('modal-overlay');
  if (modalEl) modalEl.classList.remove('active');
  if (overlayEl) overlayEl.classList.remove('active');
}
