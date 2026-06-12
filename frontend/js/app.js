const API_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:5000/api/items' 
  : `${window.location.origin}/api/items`;

const WHATSAPP_NUMBER = "94771234567"; // ⚠️ මෙතනට ඔයාගේ සැබෑ WhatsApp නම්බර් එක දාන්න මචං (94 වලින් පටන්ගන්න)

const mockData = [
  { _id: "ff1", title: "Free Fire Max Level 72 | Full Evo Gun Skins", category: "freefire", price: 8500, level: 72, skins: "6 Evo Max", description: "This is a premium account with rare emotes and maxed out guns.", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400" },
  { _id: "yt1", title: "International Funny Compilation Channel (Monetized)", category: "youtube", price: 24000, subscribers: "12.4K", description: "Monetized channel, clean history, earning passive income from funny shorts.", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400" },
  { _id: "tt1", title: "Gaming/Editz Viral TikTok Profile", category: "tiktok", price: 4500, followers: "25K", description: "High engagement profile, mostly Sri Lankan and global gaming audience.", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400" },
  { _id: "dia1", title: "1080 + 108 Bonus Direct ID Top-Up", category: "diamonds", price: 2150, diamondCount: 1188, description: "Instant top-up within 5 minutes via Player ID. 100% safe.", image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=400" }
];

// 🌍 සර්වර් එකෙන් හෝ Mock ඩේටා වලින් එන ඔක්කොම බඩු ටික තියාගන්න global array එකක්
let allFetchedItems = []; 

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
    
    // 🔗 ආපු ඩේටා ටික ග්ලෝබල් ඇරේ එකට දාගන්නවා
    allFetchedItems = data.length ? data : mockData;
    renderGrid(data.length ? data : mockData.filter(i => category === 'all' || i.category === category));
  } catch (err) {
    allFetchedItems = mockData; // Error එකක් ආවොත් mockData ටික දාගන්නවා
    const filtered = mockData.filter(item => category === 'all' || item.category === category);
    renderGrid(filtered);
  }
}

function renderGrid(items) {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";
  
  items.forEach(item => {
    const isDiamond = item.category === 'diamonds';
    const isSold = item.status === 'sold';
    
    const card = document.createElement("div");
    card.className = `card ${isDiamond ? 'diamond-card' : ''}`;
    if (isSold) card.style.opacity = "0.65";

    // 💡 [වෙනස් කළා]: Card එක උඩ Click කරාම Popup එක ඇරෙන්න Function එක මෙතනට සෙට් කළා මචං
    card.setAttribute('onclick', `openProductModal('${item._id}')`);
    card.style.cursor = 'pointer'; // Card එක උඩට mouse එක ගියාම click කරන්න පුළුවන් බව පෙන්වන්න

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

    // 💡 [වෙනස් කළා]: Buy Now බටන් එක එබුවාම කෙලින්ම popup එක ඇරෙන විදියට වෙනස් කළා (Sold Out නැත්නම්)
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

// 🛍️ [අලුතින් එකතු කළා]: Popup එක ඇරලා විස්තර සහ Description එක පුරවන සිරාම Function එක
function openProductModal(itemId) {
  const item = allFetchedItems.find(i => i._id === itemId);
  if (!item) return;

  // Modal එක ඇතුලේ තියෙන Elements වලට දත්ත දානවා
  document.getElementById('modal-image').src = item.image;
  document.getElementById('modal-title').innerText = item.title;
  document.getElementById('modal-price').innerText = "LKR " + item.price.toLocaleString();
  document.getElementById('modal-badge').innerText = item.category;
  
  // 📝 Admin Panel එකෙන් දාපු Description එක මෙතනින් තමයි වදින්නේ මචං!
  document.getElementById('modal-description').innerText = item.description || "No description provided by seller.";

  // Category එක අනුව Specs (Level/Skins) වෙනස් කරනවා
  const specsContainer = document.getElementById('modal-specs');
  specsContainer.innerHTML = ''; 

  if (item.category === 'freefire') {
    specsContainer.innerHTML = `
      <div><strong>Level:</strong> ${item.level || 'N/A'}</div>
      <div><strong>Evo Skins:</strong> ${item.skins || 'None'}</div>
    `;
  } else if (item.category === 'youtube') {
    specsContainer.innerHTML = `<div><strong>Subscribers:</strong> ${item.subscribers || 'N/A'}</div>`;
  } else if (item.category === 'tiktok') {
    specsContainer.innerHTML = `<div><strong>Followers:</strong> ${item.followers || 'N/A'}</div>`;
  } else if (item.category === 'diamonds') {
    specsContainer.innerHTML = `<div><strong>Pack Size:</strong> ${item.diamondCount || '0'} Diamonds</div>`;
  }

  // Sold out ද නැද්ද කියලා බලලා WhatsApp බටන් එක සකස් කිරීම
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
    
    // WhatsApp එකට යන මැසේජ් එක සකස් කිරීම
    const message = `Hello RICKEY STORE,\n\nMala meka madiwa ganna puluwanda?\n\n📌 Product: ${item.title}\n🆔 Item ID: ${item._id}\n💰 Price: LKR ${item.price.toLocaleString()}`;
    buyBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  // Popup එක සහ Overlay එක Screen එකට පෙන්වනවා (Active කරනවා)
  document.getElementById('productModal').classList.add('active');
  document.getElementById('modal-overlay').classList.add('active');
}

// ❌ [අලුතින් එකතු කළා]: Popup එක වහන Function එක
function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  document.getElementById('modal-overlay').classList.remove('active');
}
