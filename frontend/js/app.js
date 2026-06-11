const API_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:5000/api/items' 
  : `${window.location.origin}/api/items`;

const WHATSAPP_NUMBER = "94771234567"; // Customize with real number

const mockData = [
  { _id: "ff1", title: "Free Fire Max Level 72 | Full Evo Gun Skins", category: "freefire", price: 8500, level: 72, skins: "6 Evo Max", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400" },
  { _id: "yt1", title: "International Funny Compilation Channel (Monetized)", category: "youtube", price: 24000, subscribers: "12.4K", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400" },
  { _id: "tt1", title: "Gaming/Editz Viral TikTok Profile", category: "tiktok", price: 4500, followers: "25K", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400" },
  { _id: "dia1", title: "1080 + 108 Bonus Direct ID Top-Up", category: "diamonds", price: 2150, diamondCount: 1188, image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" }
];

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
  const grid = document.getElementById("products-grid");
  grid.innerHTML = '<div class="loading">Loading premium listings...</div>';
  
  try {
    const url = category === 'all' ? API_BASE_URL : `${API_BASE_URL}?category=${category}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fallback execution trigger");
    const data = await response.json();
    renderGrid(data.length ? data : mockData.filter(i => category === 'all' || i.category === category));
  } catch (err) {
    const filtered = mockData.filter(item => category === 'all' || item.category === category);
    renderGrid(filtered);
  }
}

function renderGrid(items) {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";
  
  items.forEach(item => {
    const isDiamond = item.category === 'diamonds';
    const isSold = item.status === 'sold'; // Sold Out ද නැද්ද කියා බලනවා
    
    const card = document.createElement("div");
    card.className = `card ${isDiamond ? 'diamond-card' : ''}`;
    if (isSold) card.style.opacity = "0.65"; // Sold Out නම් කාඩ් එක ලාවට අඳුරු කරනවා

    let metaHTML = '';
    if (item.category === 'freefire') {
      metaHTML = `<span>Lv: <strong>${item.level || 0}</strong></span> <span>Skins: <strong>${item.skins || 'N/A'}</strong></span>`;
    } else if (item.category === 'youtube') {
      metaHTML = `<span>Subs: <strong>${item.subscribers || '0'}</strong></span>`;
    } else if (item.category === 'tiktok') {
      metaHTML = `<span>Followers: <strong>${item.followers || '0'}</strong></span>`;
    } else if (item.category === 'diamonds') {
      metaHTML = `<span>Count: <strong>💎 ${item.diamondCount || item.title}</strong></span>`;
    }

    // Sold Out නම් බටන් එක වෙනස් කරනවා
    const buttonHTML = isSold 
      ? `<button class="buy-btn" style="background:#6c757d; cursor:not-allowed;" disabled>Sold Out</button>`
      : `<button class="buy-btn" onclick="triggerCheckout('${item.title}', '${item._id}', ${item.price})">Buy Now</button>`;

    // Sold Out ලේබල් එක සකස් කිරීම
    const badgeHTML = isSold 
      ? `<span class="category-badge" style="background:#dc3545; color:white;">SOLD OUT</span>`
      : `<span class="category-badge">${item.category}</span>`;

    // 📸 Cloudinary එකෙන් අප්ලෝඩ් කරපු ෆොටෝ එක මෙතනින් img src එකට automatic වැටෙනවා
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
  // Update internal UI filters
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
  toggleSidebar(); // Auto-close sidebar panel drawer on selecting option
}

function triggerCheckout(title, id, price) {
  const message = `Hello RICKEY STORE,\n\nMala meka madiwa ganna puluwanda?\n\n📌 Product: ${title}\n🆔 Item ID: ${id}\n💰 Price: LKR ${price.toLocaleString()}`;
  const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');
}
