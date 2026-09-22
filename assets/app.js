/* ==========================================================================
   COBAII PETVET SHOP / PETMARKET.DO - FULL INTERACTIVE APPLICATION ENGINE
   ========================================================================== */

// --- GLOBAL APPLICATION STATE ---
const state = {
  products: [
    {
      id: 29,
      title: "Champú Hipoalergénico Piel Sensible 500ml",
      category: "farmacia",
      subCategory: "higiene",
      brand: "VetShampoo",
      price: 620,
      oldPrice: null,
      rating: 4.9,
      reviews: 107,
      isPharma: true,
      isFeatured: false,
      petCash: 31,
      discount: 0,
      img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
      variants: ["500 ml"],
      desc: "Formulado con aloe vera y avena para aliviar picazón y mantener pelo sano."
    },
    {
      id: 28,
      title: "Filtro de Cascada Silencioso Acuario 350L/h",
      category: "acuario",
      subCategory: "accesorios",
      brand: "AquaPro",
      price: 980,
      oldPrice: null,
      rating: 4.8,
      reviews: 85,
      isPharma: false,
      isFeatured: false,
      petCash: 49,
      discount: 0,
      img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      variants: ["350 L/h"],
      desc: "Purificación de agua de 3 etapas biológica, mecánica y química."
    },
    {
      id: 27,
      title: "Rascador Castillo con Hamaca Gatuna 95cm",
      category: "gatos",
      subCategory: "accesorios",
      brand: "CatVilla",
      price: 2750,
      oldPrice: 3125,
      rating: 4.9,
      reviews: 92,
      isPharma: false,
      isFeatured: true,
      petCash: 138,
      discount: 12,
      img: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80",
      variants: ["Altura 95cm"],
      desc: "Rascador de yute natural con felpa suave y nivel de descanso."
    },
    {
      id: 26,
      title: "Juguete Mordedor Resistente KONG Perros",
      category: "perros",
      subCategory: "accesorios",
      brand: "KONG",
      price: 890,
      oldPrice: null,
      rating: 5.0,
      reviews: 150,
      isPharma: false,
      isFeatured: true,
      petCash: 45,
      discount: 0,
      img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
      variants: ["Grande L", "Mediano M"],
      desc: "Caucho natural ultrarresistente ideal para rellenar con snacks y juego dinámico."
    },
    {
      id: 25,
      title: "Jaula de 2 Niveles para Hamster y Roedores",
      category: "roedores",
      subCategory: "accesorios",
      brand: "PetCare",
      price: 1450,
      oldPrice: 1526,
      rating: 4.7,
      reviews: 53,
      isPharma: false,
      isFeatured: false,
      petCash: 73,
      discount: 5,
      img: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=800&q=80",
      variants: ["2 Niveles Completo"],
      desc: "Incluye rueda silenciosa, bebedero antigoteo y casita de recreo."
    },
    {
      id: 24,
      title: "Acuario Panorámico LED 20 Litros",
      category: "acuario",
      subCategory: "accesorios",
      brand: "AquaPro",
      price: 3200,
      oldPrice: 4000,
      rating: 4.9,
      reviews: 42,
      isPharma: false,
      isFeatured: true,
      petCash: 160,
      discount: 20,
      img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80",
      variants: ["20 Litros Kit LED"],
      desc: "Kit completo con filtro sumergible, iluminación LED azul/blanco y termómetro."
    },
    {
      id: 23,
      title: "Comida Húmeda Gatitos Whiskas Atún y Salmón",
      category: "gatos",
      subCategory: "alimentos",
      brand: "Whiskas",
      price: 350,
      oldPrice: 388,
      rating: 4.8,
      reviews: 200,
      isPharma: false,
      isFeatured: true,
      petCash: 18,
      discount: 10,
      img: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80",
      variants: ["Sobres Pack x 4"],
      desc: "Deliciosos sobres de pescado rico en Omega 3 y proteínas esenciales."
    },
    {
      id: 22,
      title: "Alimento Premium Perro Adulto Royal Canin 3kg",
      category: "perros",
      subCategory: "alimentos",
      brand: "Royal Canin",
      price: 1850,
      oldPrice: 2176,
      rating: 5.0,
      reviews: 119,
      isPharma: false,
      isFeatured: true,
      petCash: 93,
      discount: 15,
      img: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
      variants: ["3 kg"],
      desc: "Nutrición de alta gama formulada para digestión saludable y pelaje brillante."
    },
    {
      id: 2,
      title: "NexGard Spectra Masticable (15.1-30 kg)",
      category: "farmacia",
      subCategory: "salud",
      brand: "NexGard",
      price: 2450,
      oldPrice: 2800,
      rating: 5.0,
      reviews: 310,
      isPharma: true,
      isFeatured: true,
      petCash: 122,
      discount: 12,
      img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop",
      variants: ["3 Masticables (3 Meses)"],
      desc: "Tratamiento mensual oral de amplio espectro contra garrapatas y pulgas."
    }
  ],

  cart: JSON.parse(localStorage.getItem('cobaii_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('cobaii_wishlist')) || [],
  orders: [
    {
      id: "PM-94820",
      date: "2026-09-18",
      status: "En camino 🚚",
      statusStep: 3,
      total: 7300,
      items: [
        { title: "Royal Canin Medium Adult 15kg", qty: 1, price: 4850 },
        { title: "NexGard Spectra Masticable", qty: 1, price: 2450 }
      ],
      address: "Av. Abraham Lincoln #402, Piantini, Santo Domingo",
      trackingCode: "EXP-8849-RD"
    },
    {
      id: "PM-88102",
      date: "2026-08-10",
      status: "Entregado ✅",
      statusStep: 4,
      total: 3450,
      items: [
        { title: "Rascador Árbol Multinivel", qty: 1, price: 3450 }
      ],
      address: "C/ El Sol #12, Santiago de los Caballeros",
      trackingCode: "EXP-7721-RD"
    }
  ],
  user: {
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    phone: "809-555-0199",
    petCash: 1250,
    plusMember: true,
    pets: [
      { name: "Max 🐶", breed: "Golden Retriever", age: "3 años", weight: "28 kg" },
      { name: "Luna 🐱", breed: "Persa", age: "2 años", weight: "4 kg" }
    ]
  },
  activeCategory: "todos",
  searchQuery: "",
  brandFilter: "todas",
  sortBy: "destacados",
  heroIndex: 0,
  heroAutoInterval: null,
  announcements: [
    "🐶 <strong>Seguro Médico Mascotas</strong> · Cobertura de consultas y cirugías · <a href=\"javascript:showToast('Planes de Seguro Médico próximamente')\" style='color:white; text-decoration:underline;'>Ver Planes</a>",
    "🚚 <strong>ENVÍO GRATIS</strong> en pedidos mayores a <strong>RD$4,500.00</strong> a todo el país",
    "💊 <strong>Antipulgas y Garrapatas</strong> · Acumulas 10 compras y ganas <strong>1 GRATIS</strong>",
    "⭐ <strong>Membresía Plus</strong> · Envíos Express Gratis + <strong>5x PetCash</strong> en tus compras"
  ],
  announcementIndex: 0
};

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  loadStateFromLocalStorage();
  updateUserHeaderUI();
  initTicker();
  initHeroSlider();
  initPetCanvas();
  renderProducts();
  renderOrders();
  renderProfile();
  updateCartBadges();
  updateWishlistBadges();
  setupEventListeners();
  initSocialProofTicker();
  initFlashSaleTimer();
  initOrderProgressSimulator();

  // Fetch live products from Workers API
  fetchProductsFromApi();
});

function loadStateFromLocalStorage() {
  try {
    const savedUser = localStorage.getItem("cobaii_user");
    if (savedUser) state.user = JSON.parse(savedUser);
    
    const savedOrders = localStorage.getItem("cobaii_orders");
    if (savedOrders) state.orders = JSON.parse(savedOrders);

    const savedCart = localStorage.getItem("cobaii_cart");
    if (savedCart) state.cart = JSON.parse(savedCart);

    const savedWish = localStorage.getItem("cobaii_wishlist");
    if (savedWish) state.wishlist = JSON.parse(savedWish);
  } catch (err) {
    console.error("Error cargando estado guardado:", err);
  }
}

function saveOrders() {
  localStorage.setItem("cobaii_orders", JSON.stringify(state.orders));
}

function saveUser() {
  localStorage.setItem("cobaii_user", JSON.stringify(state.user));
}

function updateUserHeaderUI() {
  const userBtn = document.getElementById("userTopBarBtn");
  if (!userBtn) return;

  if (state.user && state.user.isLoggedIn) {
    const firstName = state.user.name ? state.user.name.split(" ")[0] : "Usuario";
    userBtn.innerHTML = `👤 Hola, <strong>${firstName}</strong> | <a href="javascript:switchTab(3)" style="color:#FFB703; text-decoration:none;">Mi Perfil</a> | <a href="javascript:logoutUser()" style="color:#EF4444; text-decoration:none;">Salir</a>`;
  } else if (state.user && state.user.name) {
    const firstName = state.user.name.split(" ")[0];
    userBtn.innerHTML = `👤 ${firstName} | <a href="javascript:openAuthModal()" style="color:#38BDF8; font-weight:700;">Iniciar Sesión</a>`;
  } else {
    userBtn.innerHTML = `👤 <span onclick="openAuthModal()" style="cursor:pointer; color:#38BDF8; font-weight:700;">Iniciar Sesión / Registro</span>`;
  }
}

// --- API INTEGRATION (COBAII WORKERS API) ---
async function fetchProductsFromApi() {
  try {
    const response = await fetch("https://cobaii.dbedjy.workers.dev/products");
    if (!response.ok) return;
    const json = await response.json();

    if (json.success && Array.isArray(json.result) && json.result.length > 0) {
      const apiProducts = json.result.map(item => {
        let cat = "perros";
        const catLower = (item.category || "").toLowerCase();
        if (catLower.includes("gato")) cat = "gatos";
        else if (catLower.includes("acuario") || catLower.includes("pez")) cat = "acuario";
        else if (catLower.includes("roedor") || catLower.includes("hamster")) cat = "roedores";
        else if (catLower.includes("ave")) cat = "aves";
        else if (catLower.includes("perro")) cat = "perros";

        const nameLower = item.name.toLowerCase();
        const isPharma = nameLower.includes("champu") || nameLower.includes("shampoo") || nameLower.includes("carbatox") || nameLower.includes("hipoalergénico") || nameLower.includes("med");
        if (isPharma && cat === "perros") cat = "farmacia";

        const disc = item.discount_percentage || 0;
        const oldP = disc > 0 ? Math.round(item.price / (1 - disc / 100)) : null;

        return {
          id: item.id,
          title: item.name,
          category: cat,
          subCategory: "general",
          brand: item.brand || "Cobaii Petvet",
          price: item.price,
          oldPrice: oldP,
          rating: 4.8,
          reviews: Math.floor(Math.random() * 150 + 20),
          isPharma: isPharma,
          isFeatured: item.is_featured === 1,
          petCash: Math.round(item.price * 0.05),
          discount: disc,
          img: item.image_url || "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop",
          variants: ["Estándar"],
          desc: item.description || "Producto de alta calidad garantizada por Cobaii Petvet Shop."
        };
      });

      state.products = apiProducts;
      renderProducts();
      showToast("📡 ¡Productos sincronizados en vivo con la API de Cobaii!");
    }
  } catch (err) {
    console.log("Notificación API Cobaii:", err);
  }
}

// --- ANNOUNCEMENT TICKER ---
function initTicker() {
  const tickerContainer = document.getElementById("announcementTicker");
  if (!tickerContainer) return;

  function showNextAnnouncement() {
    tickerContainer.innerHTML = `
      <div class="ticker-content">
        <span class="ticker-badge">PROMO</span>
        <span>${state.announcements[state.announcementIndex]}</span>
      </div>
    `;
    state.announcementIndex = (state.announcementIndex + 1) % state.announcements.length;
  }

  showNextAnnouncement();
  setInterval(showNextAnnouncement, 4500);
}

// --- HERO SLIDER CAROUSEL ---
function initHeroSlider() {
  const track = document.getElementById("heroSliderTrack");
  const dots = document.querySelectorAll(".hero-dot");
  if (!track) return;

  window.moveHeroSlide = function(direction) {
    const totalSlides = 3;
    state.heroIndex = (state.heroIndex + direction + totalSlides) % totalSlides;
    updateHeroUI();
  };

  window.goToHeroSlide = function(index) {
    state.heroIndex = index;
    updateHeroUI();
  };

  function updateHeroUI() {
    track.style.transform = `translateX(-${state.heroIndex * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === state.heroIndex);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => goToHeroSlide(i));
  });

  if (state.heroAutoInterval) clearInterval(state.heroAutoInterval);
  state.heroAutoInterval = setInterval(() => moveHeroSlide(1), 6000);
}

// --- CANVAS PAW ANIMATION ENGINE ---
function initPetCanvas() {
  const canvas = document.getElementById("petBackgroundCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
  });

  const paws = Array.from({ length: 18 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 12 + 10,
    speedY: Math.random() * 0.4 + 0.1,
    opacity: Math.random() * 0.08 + 0.02,
    angle: Math.random() * Math.PI * 2
  }));

  function drawPaw(x, y, size, opacity) {
    ctx.save();
    ctx.fillStyle = `rgba(18, 59, 93, ${opacity})`;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.6, size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    const toeOffset = size * 0.55;
    const toeRadius = size * 0.22;
    const angles = [-0.6, -0.2, 0.2, 0.6];
    angles.forEach(ang => {
      const tx = x + Math.sin(ang) * toeOffset;
      const ty = y - Math.cos(ang) * toeOffset;
      ctx.beginPath();
      ctx.arc(tx, ty, toeRadius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    paws.forEach(paw => {
      paw.y -= paw.speedY;
      if (paw.y < -30) {
        paw.y = height + 30;
        paw.x = Math.random() * width;
      }
      drawPaw(paw.x, paw.y, paw.size, paw.opacity);
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// --- RENDER PRODUCTS GRID ---
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const offersGrid = document.getElementById("offersGrid");
  const productCountLabel = document.getElementById("productCount");
  if (!grid) return;

  let filtered = state.products.filter(p => {
    if (state.activeCategory !== "todos") {
      if (state.activeCategory === "farmacia") {
        if (!p.isPharma) return false;
      } else if (p.category !== state.activeCategory) {
        return false;
      }
    }

    if (state.searchQuery.trim() !== "") {
      const query = state.searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(query);
      const matchBrand = p.brand.toLowerCase().includes(query);
      const matchCategory = p.category.toLowerCase().includes(query);
      if (!matchTitle && !matchBrand && !matchCategory) return false;
    }

    if (state.brandFilter !== "todas") {
      if (p.brand.toLowerCase() !== state.brandFilter.toLowerCase()) return false;
    }

    return true;
  });

  if (state.sortBy === "precio_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "precio_desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (productCountLabel) {
    productCountLabel.textContent = `(${filtered.length})`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <div style="font-size: 3rem; margin-bottom: 12px;">🐾</div>
        <h3 style="font-weight: 800; color: var(--primary);">No encontramos productos que coincidan</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">Intenta buscar por otro término o cambiar la categoría seleccionada.</p>
        <button onclick="resetFilters()" class="btn-search-submit" style="margin-top: 16px;">Ver Todos los Productos</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => createProductCardHTML(p)).join("");

  if (offersGrid) {
    const discountedProducts = state.products.filter(p => p.discount > 0);
    offersGrid.innerHTML = discountedProducts.map(p => createProductCardHTML(p)).join("");
  }
}

function createProductCardHTML(p) {
  const isWishlisted = state.wishlist.includes(p.id);
  const formattedPrice = p.price.toLocaleString("en-US", { minimumFractionDigits: 2 });
  const formattedOldPrice = p.oldPrice ? p.oldPrice.toLocaleString("en-US", { minimumFractionDigits: 2 }) : null;

  return `
    <div class="product-card" data-id="${p.id}">
      <div class="card-badges-row">
        ${p.discount ? `<span class="badge-discount">-${p.discount}%</span>` : ''}
        ${p.isPharma ? `<span class="badge-pharma">💊 Farmacia Vet</span>` : ''}
        ${p.isFeatured ? `<span class="badge-tag" style="background:#00A896; color:white;">⭐ Top Ventas</span>` : ''}
      </div>

      <button class="btn-wishlist-heart ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${p.id})">
        ${isWishlisted ? '❤️' : '🤍'}
      </button>

      <div class="product-img-box" onclick="openProductModal(${p.id})">
        <img src="${p.img}" alt="${p.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop'">
      </div>

      <div class="product-info-box">
        <div style="display:flex; justify-between; align-items:center; font-size:0.75rem; color:var(--text-muted); font-weight:700;">
          <span style="text-transform:uppercase;">${p.brand}</span>
          <span style="color:#D97706;">★ ${p.rating} (${p.reviews})</span>
        </div>

        <h3 class="product-title" onclick="openProductModal(${p.id})">${p.title}</h3>

        <div class="petcash-reward-chip">
          🪙 Ganas <strong>+${p.petCash} PetCash</strong>
        </div>

        <div class="product-price-row">
          <div>
            <span class="current-price">RD$ ${formattedPrice}</span>
            ${formattedOldPrice ? `<span class="old-price">RD$ ${formattedOldPrice}</span>` : ''}
          </div>
        </div>

        ${p.variants && p.variants.length > 0 ? `
          <div class="variant-select-chips">
            ${p.variants.map((v, idx) => `<span class="variant-chip ${idx===0?'selected':''}">${v}</span>`).join('')}
          </div>
        ` : ''}

        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">
          <span>🛒 Añadir al Carrito</span>
        </button>
      </div>
    </div>
  `;
}

// --- CART MANAGEMENT ---
function addToCart(productId, variantName = null) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const chosenVariant = variantName || (product.variants ? product.variants[0] : "Estándar");
  const existingIndex = state.cart.findIndex(item => item.id === productId && item.variant === chosenVariant);

  if (existingIndex > -1) {
    state.cart[existingIndex].qty += 1;
  } else {
    state.cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      img: product.img,
      variant: chosenVariant,
      qty: 1
    });
  }

  saveCart();
  updateCartBadges();
  showToast(`🛒 "${product.title}" agregado al carrito`);

  const cartBtn = document.querySelector(".floating-cart-btn");
  if (cartBtn) {
    cartBtn.style.transform = "scale(1.2)";
    setTimeout(() => cartBtn.style.transform = "none", 250);
  }
}

function updateCartQty(index, change) {
  if (!state.cart[index]) return;
  state.cart[index].qty += change;
  if (state.cart[index].qty <= 0) {
    state.cart.splice(index, 1);
  }
  saveCart();
  updateCartBadges();
  renderCartDrawer();
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  saveCart();
  updateCartBadges();
  renderCartDrawer();
  showToast("🗑️ Producto removido del carrito");
}

function saveCart() {
  localStorage.setItem('cobaii_cart', JSON.stringify(state.cart));
}

function getCartTotals() {
  const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalCount = state.cart.reduce((acc, item) => acc + item.qty, 0);
  const freeShippingGoal = 4500;
  const remainingForFreeShipping = Math.max(0, freeShippingGoal - subtotal);
  return { subtotal, totalCount, remainingForFreeShipping };
}

function updateCartBadges() {
  const { subtotal, totalCount } = getCartTotals();
  const formattedSubtotal = subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 });

  document.querySelectorAll(".cart-count-badge").forEach(el => el.textContent = totalCount);
  document.querySelectorAll(".cart-total-label").forEach(el => el.textContent = `${formattedSubtotal} DOP`);
}

// --- CART DRAWER OVERLAY ---
window.openCartDrawer = function() {
  renderCartDrawer();
  document.getElementById("cartDrawerOverlay")?.classList.add("active");
};

window.closeCartDrawer = function() {
  document.getElementById("cartDrawerOverlay")?.classList.remove("active");
};

function renderCartDrawer() {
  const body = document.getElementById("cartDrawerBody");
  const subtotalLabel = document.getElementById("cartDrawerSubtotal");
  const totalLabel = document.getElementById("cartDrawerTotal");
  if (!body) return;

  const { subtotal, remainingForFreeShipping } = getCartTotals();
  const formattedSubtotal = subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " DOP";

  if (subtotalLabel) subtotalLabel.textContent = formattedSubtotal;
  if (totalLabel) totalLabel.textContent = formattedSubtotal;

  if (state.cart.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 50px 20px;">
        <div style="font-size: 3.5rem; opacity: 0.4;">🛒</div>
        <h3 style="font-weight: 800; color: var(--primary); margin-top: 10px;">Tu carrito está vacío</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 6px;">Explora nuestro catálogo y agrega los mejores productos para tu mascota.</p>
        <button onclick="closeCartDrawer(); switchTab(0)" class="btn-search-submit" style="margin-top: 18px;">Ir a la Tienda</button>
      </div>
    `;
    return;
  }

  const shippingBarHTML = `
    <div style="background: #F1F5F9; padding: 12px; border-radius: var(--radius-md); margin-bottom: 16px; font-size: 0.8rem;">
      ${remainingForFreeShipping === 0 ? `
        <div style="color: #059669; font-weight: 800; display: flex; align-items: center; gap: 6px;">
          🎉 ¡Felicidades! Tienes <strong>ENVÍO GRATIS</strong> en este pedido.
        </div>
      ` : `
        <div style="color: var(--primary); font-weight: 700; margin-bottom: 6px;">
          Te faltan <strong style="color:var(--accent-orange);">RD$ ${remainingForFreeShipping.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong> para Envío GRATIS 🚚
        </div>
        <div style="height: 6px; background: #CBD5E1; border-radius: 99px; overflow: hidden;">
          <div style="height: 100%; width: ${Math.min(100, (subtotal / 4500) * 100)}%; background: var(--accent-orange); transition: width 0.3s;"></div>
        </div>
      `}
    </div>
  `;

  const itemsHTML = state.cart.map((item, idx) => `
    <div class="cart-item-row" style="display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border-color); align-items: center;">
      <img src="${item.img}" alt="${item.title}" style="width: 58px; height: 58px; object-fit: cover; border-radius: 10px; border: 1px solid var(--border-color);">
      <div style="flex: 1;">
        <div style="font-weight: 800; font-size: 0.85rem; color: var(--primary); line-height: 1.2;">${item.title}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Variante: ${item.variant}</div>
        <div style="font-weight: 800; color: var(--accent-cyan); font-size: 0.9rem; margin-top: 4px;">RD$ ${(item.price * item.qty).toLocaleString('en-US', {minimumFractionDigits:2})}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <button onclick="updateCartQty(${idx}, -1)" style="width: 26px; height: 26px; border-radius: 50%; border: 1px solid #CBD5E1; background: white; font-weight: bold; cursor: pointer;">-</button>
        <span style="font-weight: 800; font-size: 0.85rem; width: 18px; text-align: center;">${item.qty}</span>
        <button onclick="updateCartQty(${idx}, 1)" style="width: 26px; height: 26px; border-radius: 50%; border: 1px solid #CBD5E1; background: white; font-weight: bold; cursor: pointer;">+</button>
      </div>
      <button onclick="removeFromCart(${idx})" style="background: none; border: none; color: #94A3B8; font-size: 1.1rem; cursor: pointer; padding: 4px;" title="Eliminar">✕</button>
    </div>
  `).join("");

  body.innerHTML = shippingBarHTML + itemsHTML;
}

// --- USER AUTHENTICATION & REGISTRATION SYSTEM ---
window.openAuthModal = function(activeTab = 'login') {
  let modal = document.getElementById("authModalOverlay");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "authModalOverlay";
    modal.className = "modal-overlay";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="product-modal" style="max-width: 480px; padding: 24px;">
      <button onclick="document.getElementById('authModalOverlay').classList.remove('active')" class="modal-close-btn">✕</button>
      
      <div style="display: flex; border-bottom: 2px solid #E2E8F0; margin-bottom: 20px;">
        <button id="tabBtnLogin" onclick="switchAuthSubTab('login')" style="flex: 1; padding: 10px; font-weight: 800; font-size: 0.95rem; border: none; background: none; cursor: pointer; color: ${activeTab === 'login' ? 'var(--primary)' : '#94A3B8'}; border-bottom: 3px solid ${activeTab === 'login' ? 'var(--accent-orange)' : 'transparent'};">
          🔑 Iniciar Sesión
        </button>
        <button id="tabBtnRegister" onclick="switchAuthSubTab('register')" style="flex: 1; padding: 10px; font-weight: 800; font-size: 0.95rem; border: none; background: none; cursor: pointer; color: ${activeTab === 'register' ? 'var(--primary)' : '#94A3B8'}; border-bottom: 3px solid ${activeTab === 'register' ? 'var(--accent-orange)' : 'transparent'};">
          📝 Crear Cuenta
        </button>
      </div>

      <!-- LOGIN FORM -->
      <form id="formAuthLogin" onsubmit="handleLoginSubmit(event)" style="display: ${activeTab === 'login' ? 'flex' : 'none'}; flex-direction: column; gap: 14px;">
        <div style="text-align: center; margin-bottom: 6px;">
          <h3 style="font-weight: 900; color: var(--primary);">¡Hola de nuevo! 🐾</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted);">Ingresa tus datos para acceder a tu perfil y pedidos.</p>
        </div>

        <div>
          <label style="font-weight: 700; font-size: 0.82rem; color: var(--primary); display: block; margin-bottom: 4px;">Correo Electrónico *</label>
          <input type="email" id="loginEmail" placeholder="tu.correo@ejemplo.com" required value="${state.user?.email || ''}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.9rem;">
        </div>

        <div>
          <label style="font-weight: 700; font-size: 0.82rem; color: var(--primary); display: block; margin-bottom: 4px;">Contraseña *</label>
          <input type="password" id="loginPassword" placeholder="••••••••" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.9rem;">
        </div>

        <button type="submit" class="checkout-btn" style="background: var(--primary); margin-top: 6px;">
          🚀 Entrar a Mi Cuenta
        </button>
      </form>

      <!-- REGISTER FORM -->
      <form id="formAuthRegister" onsubmit="handleRegisterSubmit(event)" style="display: ${activeTab === 'register' ? 'flex' : 'none'}; flex-direction: column; gap: 14px;">
        <div style="text-align: center; margin-bottom: 6px;">
          <h3 style="font-weight: 900; color: var(--primary);">Únete a Cobaii Petvet ⭐</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted);">Ganas 5% de PetCash en todas tus compras y envíos gratis.</p>
        </div>

        <div>
          <label style="font-weight: 700; font-size: 0.82rem; color: var(--primary); display: block; margin-bottom: 4px;">Nombre Completo *</label>
          <input type="text" id="regName" placeholder="Ej. Maria Rodríguez" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.9rem;">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <label style="font-weight: 700; font-size: 0.82rem; color: var(--primary); display: block; margin-bottom: 4px;">Correo Electrónico *</label>
            <input type="email" id="regEmail" placeholder="correo@ejemplo.com" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.88rem;">
          </div>
          <div>
            <label style="font-weight: 700; font-size: 0.82rem; color: var(--primary); display: block; margin-bottom: 4px;">Teléfono / WhatsApp *</label>
            <input type="tel" id="regPhone" placeholder="809-555-0000" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.88rem;">
          </div>
        </div>

        <div>
          <label style="font-weight: 700; font-size: 0.82rem; color: var(--primary); display: block; margin-bottom: 4px;">Nombre de tu Mascota</label>
          <input type="text" id="regPetName" placeholder="Ej. Max (Perro), Luna (Gato)" style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.9rem;">
        </div>

        <div>
          <label style="font-weight: 700; font-size: 0.82rem; color: var(--primary); display: block; margin-bottom: 4px;">Contraseña *</label>
          <input type="password" id="regPassword" placeholder="Crea una contraseña segura" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.9rem;">
        </div>

        <button type="submit" class="checkout-btn" style="background: var(--accent-orange); margin-top: 6px;">
          ✨ Crear Mi Cuenta Gratis
        </button>
      </form>
    </div>
  `;

  modal.classList.add("active");
};

window.switchAuthSubTab = function(tab) {
  const formLogin = document.getElementById("formAuthLogin");
  const formRegister = document.getElementById("formAuthRegister");
  const btnLogin = document.getElementById("tabBtnLogin");
  const btnRegister = document.getElementById("tabBtnRegister");

  if (tab === 'login') {
    if (formLogin) formLogin.style.display = "flex";
    if (formRegister) formRegister.style.display = "none";
    if (btnLogin) { btnLogin.style.color = "var(--primary)"; btnLogin.style.borderBottom = "3px solid var(--accent-orange)"; }
    if (btnRegister) { btnRegister.style.color = "#94A3B8"; btnRegister.style.borderBottom = "3px solid transparent"; }
  } else {
    if (formLogin) formLogin.style.display = "none";
    if (formRegister) formRegister.style.display = "flex";
    if (btnLogin) { btnLogin.style.color = "#94A3B8"; btnLogin.style.borderBottom = "3px solid transparent"; }
    if (btnRegister) { btnRegister.style.color = "var(--primary)"; btnRegister.style.borderBottom = "3px solid var(--accent-orange)"; }
  }
};

window.handleLoginSubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail")?.value;
  
  state.user.email = email;
  state.user.isLoggedIn = true;
  saveUser();
  updateUserHeaderUI();
  renderProfile();

  document.getElementById("authModalOverlay")?.classList.remove("active");
  showToast(`👋 ¡Bienvenido de nuevo, ${state.user.name.split(" ")[0]}!`);
};

window.handleRegisterSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById("regName")?.value;
  const email = document.getElementById("regEmail")?.value;
  const phone = document.getElementById("regPhone")?.value;
  const petName = document.getElementById("regPetName")?.value;

  state.user.name = name;
  state.user.email = email;
  state.user.phone = phone;
  state.user.isLoggedIn = true;
  if (petName) {
    state.user.pets.push({ name: petName, breed: "Mascota", age: "1 año", weight: "5 kg" });
  }

  saveUser();
  updateUserHeaderUI();
  renderProfile();

  document.getElementById("authModalOverlay")?.classList.remove("active");
  showToast(`🎉 ¡Cuenta creada con éxito! Bienvenido a Cobaii, ${name.split(" ")[0]}.`);
};

window.logoutUser = function() {
  state.user.isLoggedIn = false;
  saveUser();
  updateUserHeaderUI();
  renderProfile();
  showToast("👋 Has cerrado sesión correctamente.");
};

// --- CHECKOUT & PAYMENT MODAL ---
window.openCheckoutModal = function() {
  if (state.cart.length === 0) {
    showToast("⚠️ Tu carrito está vacío. Agrega productos para realizar una compra.");
    return;
  }
  closeCartDrawer();

  const { subtotal } = getCartTotals();
  const shippingFee = subtotal >= 4500 ? 0 : 250;
  const total = subtotal + shippingFee;

  let modal = document.getElementById("checkoutModalOverlay");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "checkoutModalOverlay";
    modal.className = "modal-overlay";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="product-modal" style="max-width: 640px; padding: 24px; max-height: 90vh; overflow-y: auto;">
      <button onclick="document.getElementById('checkoutModalOverlay').classList.remove('active')" class="modal-close-btn">✕</button>
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 2.2rem;">🛍️</span>
        <h2 style="font-weight: 900; color: var(--primary);">Finalizar Compra y Pago Seguro</h2>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Completa tus datos de envío y selecciona tu método de pago preferido.</p>
      </div>

      <form onsubmit="handleCheckoutSubmit(event, ${total})" style="display: flex; flex-direction: column; gap: 16px;">
        
        <div style="background: #F8FAFC; border: 1px solid var(--border-color); padding: 14px; border-radius: 12px; font-size: 0.85rem;">
          <div style="font-weight: 800; color: var(--primary); margin-bottom: 8px;">Resumen del Pedido (${state.cart.length} artículos):</div>
          <div style="max-height: 120px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding-right: 6px;">
            ${state.cart.map(it => `
              <div style="display:flex; justify-content:space-between; color:var(--text-dark);">
                <span>${it.qty}x ${it.title} (${it.variant})</span>
                <strong>RD$ ${(it.price*it.qty).toLocaleString('en-US', {minimumFractionDigits:2})}</strong>
              </div>
            `).join('')}
          </div>
          <div style="border-top: 1px dashed #CBD5E1; margin-top: 10px; padding-top: 8px; display: flex; justify-content: space-between; font-weight: 700;">
            <span>Envío:</span>
            <span>${shippingFee === 0 ? '<strong style="color:#059669;">GRATIS 🚚</strong>' : `RD$ ${shippingFee.toLocaleString('en-US', {minimumFractionDigits:2})}`}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 1.05rem; color: var(--accent-orange); margin-top: 4px;">
            <span>Total a Pagar:</span>
            <span>RD$ ${total.toLocaleString('en-US', {minimumFractionDigits:2})} DOP</span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="font-weight: 800; font-size: 0.9rem; color: var(--primary);">1. Datos de Entrega 🚚</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <input type="text" id="chkName" placeholder="Nombre completo *" value="${state.user.name}" required style="padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.88rem;">
            <input type="tel" id="chkPhone" placeholder="Teléfono de contacto *" value="${state.user.phone}" required style="padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.88rem;">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <select id="chkCity" required style="padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.88rem; font-family: inherit;">
              <option value="Distrito Nacional, Santo Domingo">Distrito Nacional (Santo Domingo)</option>
              <option value="Santo Domingo Este / Norte / Oeste">Santo Domingo Este / Norte / Oeste</option>
              <option value="Santiago de los Caballeros">Santiago de los Caballeros</option>
              <option value="Punta Cana / Bávaro">Punta Cana / Bávaro</option>
              <option value="La Romana / San Pedro">La Romana / San Pedro de Macorís</option>
              <option value="Envío Nacional (Otras Provincias)">Envío Nacional (Otras Provincias)</option>
            </select>
            <input type="text" id="chkSector" placeholder="Sector / Ensanche *" required style="padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.88rem;">
          </div>
          <input type="text" id="chkAddress" placeholder="Dirección exacta (Calle, # Casa / Apto, Referencia) *" required style="padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.88rem;">
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="font-weight: 800; font-size: 0.9rem; color: var(--primary);">2. Selecciona Método de Pago 💳</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <label style="display: flex; align-items: center; gap: 8px; border: 1.5px solid #CBD5E1; padding: 10px; border-radius: 10px; cursor: pointer; font-size: 0.82rem; font-weight: 700;">
              <input type="radio" name="payMethod" value="Tarjeta de Crédito / Débito" checked>
              <span>💳 Tarjeta Crédito / Débito</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; border: 1.5px solid #CBD5E1; padding: 10px; border-radius: 10px; cursor: pointer; font-size: 0.82rem; font-weight: 700;">
              <input type="radio" name="payMethod" value="Transferencia Bancaria">
              <span>🏦 Transferencia Bancaria</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; border: 1.5px solid #CBD5E1; padding: 10px; border-radius: 10px; cursor: pointer; font-size: 0.82rem; font-weight: 700;">
              <input type="radio" name="payMethod" value="Contra Entrega">
              <span>💵 Pago Contra Entrega</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; border: 1.5px solid #CBD5E1; padding: 10px; border-radius: 10px; cursor: pointer; font-size: 0.82rem; font-weight: 700;">
              <input type="radio" name="payMethod" value="PayPal">
              <span>🅿️ PayPal / USD</span>
            </label>
          </div>
        </div>

        <button type="submit" class="checkout-btn" style="margin-top: 10px; background: var(--accent-orange); font-size: 1rem;">
          🔒 Confirmar y Realizar Pedido (RD$ ${total.toLocaleString('en-US', {minimumFractionDigits:2})})
        </button>
      </form>
    </div>
  `;

  modal.classList.add("active");
};

window.handleCheckoutSubmit = function(e, totalAmount) {
  e.preventDefault();
  const name = document.getElementById("chkName")?.value || state.user.name;
  const phone = document.getElementById("chkPhone")?.value || state.user.phone;
  const city = document.getElementById("chkCity")?.value;
  const sector = document.getElementById("chkSector")?.value;
  const address = document.getElementById("chkAddress")?.value;
  const payMethod = document.querySelector('input[name="payMethod"]:checked')?.value || "Tarjeta de Crédito";

  const newOrderId = "PM-" + Math.floor(10000 + Math.random() * 90000);
  const newTracking = "EXP-" + Math.floor(1000 + Math.random() * 9000) + "-RD";
  const today = new Date().toISOString().split('T')[0];

  const earnedPoints = Math.round(totalAmount * 0.05);

  const orderObj = {
    id: newOrderId,
    date: today,
    status: "Procesando en Sistema 🟡",
    statusStep: 1,
    total: totalAmount,
    items: [...state.cart],
    address: `${address}, ${sector}, ${city}`,
    phone: phone,
    payMethod: payMethod,
    trackingCode: newTracking
  };

  state.orders.unshift(orderObj);
  saveOrders();

  if (state.user) {
    state.user.petCash = (state.user.petCash || 0) + earnedPoints;
    saveUser();
  }

  state.cart = [];
  saveCart();
  updateCartBadges();
  renderOrders();
  renderProfile();

  document.getElementById("checkoutModalOverlay")?.classList.remove("active");
  showOrderConfirmationModal(orderObj, earnedPoints);
};

function showOrderConfirmationModal(order, pointsEarned = 0) {
  let modal = document.getElementById("confirmationModalOverlay");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "confirmationModalOverlay";
    modal.className = "modal-overlay";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="product-modal" style="max-width: 520px; padding: 24px; text-align: center;">
      <div style="font-size: 3.5rem;">🎉</div>
      <h2 style="font-weight: 900; color: #059669; margin-top: 6px;">¡Gracias por tu compra!</h2>
      <p style="font-size: 0.9rem; color: var(--text-dark); margin-top: 4px;">Tu pedido <strong>${order.id}</strong> ha sido recibido exitosamente.</p>
      
      <div style="background: #F8FAFC; border: 1px solid var(--border-color); padding: 16px; border-radius: 14px; margin: 16px 0; text-align: left; font-size: 0.85rem;">
        <div><strong>Código de Rastreo:</strong> <span style="color:var(--accent-cyan); font-weight:800;">${order.trackingCode}</span></div>
        <div style="margin-top: 4px;"><strong>Método de Pago:</strong> ${order.payMethod}</div>
        <div style="margin-top: 4px;"><strong>Dirección de Entrega:</strong> ${order.address}</div>
        <div style="margin-top: 4px;"><strong>Total Pagado:</strong> RD$ ${order.total.toLocaleString('en-US', {minimumFractionDigits:2})} DOP</div>
        ${pointsEarned > 0 ? `<div style="margin-top: 8px; color: #D97706; font-weight: 800; background: #FEF3C7; padding: 6px 10px; border-radius: 8px; text-align: center;">🪙 ¡Acabas de ganar +${pointsEarned} Puntos PetCash con este pedido!</div>` : ''}
      </div>

      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 18px;">Puedes darle seguimiento al envío de tu compra en tiempo real desde la pestaña <strong>Mis Pedidos</strong>.</p>

      <button onclick="document.getElementById('confirmationModalOverlay').classList.remove('active'); switchTab(1);" class="checkout-btn" style="background: var(--primary);">
        📋 Ver Rastreo de Mi Pedido en Vivo
      </button>
    </div>
  `;
  modal.classList.add("active");
}

window.openWishlistModal = function() {
  let modal = document.getElementById("wishlistModalOverlay");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "wishlistModalOverlay";
    modal.className = "modal-overlay";
    document.body.appendChild(modal);
  }

  const wishlistedItems = state.products.filter(p => state.wishlist.includes(p.id));

  modal.innerHTML = `
    <div class="product-modal" style="max-width: 600px; padding: 24px; max-height: 85vh; overflow-y: auto;">
      <button onclick="document.getElementById('wishlistModalOverlay').classList.remove('active')" class="modal-close-btn">✕</button>
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 2.2rem;">❤️</span>
        <h2 style="font-weight: 900; color: var(--primary);">Mis Productos Favoritos (${wishlistedItems.length})</h2>
      </div>

      ${wishlistedItems.length === 0 ? `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 3rem; opacity: 0.3;">🤍</div>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 8px;">No tienes productos guardados en tus favoritos todavía.</p>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${wishlistedItems.map(p => `
            <div style="display: flex; gap: 12px; align-items: center; background: #F8FAFC; padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);">
              <img src="${p.img}" alt="${p.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 10px;">
              <div style="flex: 1;">
                <div style="font-weight: 800; color: var(--primary); font-size: 0.9rem;">${p.title}</div>
                <div style="font-weight: 900; color: var(--accent-orange); font-size: 0.92rem;">RD$ ${p.price.toLocaleString('en-US', {minimumFractionDigits:2})}</div>
              </div>
              <button onclick="addToCart(${p.id}); showToast('🛒 Añadido al carrito');" class="btn-search-submit" style="padding: 6px 14px; font-size: 0.8rem;">🛒 Añadir</button>
              <button onclick="toggleWishlist(${p.id}); openWishlistModal();" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;">✕</button>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  modal.classList.add("active");
};

// --- NUTRITIONAL QUIZ WIZARD ---
window.openNutriQuizModal = function() {
  let modal = document.getElementById("nutriQuizModalOverlay");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "nutriQuizModalOverlay";
    modal.className = "modal-overlay";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="product-modal" style="max-width: 600px; padding: 28px;">
      <button onclick="document.getElementById('nutriQuizModalOverlay').classList.remove('active')" class="modal-close-btn">✕</button>
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 2.8rem;">🥣</span>
        <h2 style="font-weight: 900; color: var(--primary);">Asesor Nutricional & Ración Inteligente</h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Descubre el alimento ideal y la cantidad exacta en gramos para tu mascota.</p>
      </div>

      <form onsubmit="handleNutriQuizSubmit(event)" style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="font-weight: 800; font-size: 0.85rem; color: var(--primary); display: block; margin-bottom: 6px;">1. ¿Qué tipo de mascota tienes? *</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <label style="border: 2px solid var(--accent-cyan); padding: 14px; border-radius: 12px; display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 800;">
              <input type="radio" name="qzType" value="perro" checked>
              <span>🐶 Perro</span>
            </label>
            <label style="border: 2px solid #CBD5E1; padding: 14px; border-radius: 12px; display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 800;">
              <input type="radio" name="qzType" value="gato">
              <span>🐱 Gato</span>
            </label>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="font-weight: 800; font-size: 0.85rem; color: var(--primary); display: block; margin-bottom: 4px;">Etapa de Vida *</label>
            <select id="qzStage" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-family: inherit; font-size: 0.88rem;">
              <option value="Cachorro / Kitten (< 1 año)">Cachorro / Kitten (< 1 año)</option>
              <option value="Adulto (1 a 7 años)" selected>Adulto (1 a 7 años)</option>
              <option value="Senior (> 7 años)">Senior (> 7 años)</option>
            </select>
          </div>
          <div>
            <label style="font-weight: 800; font-size: 0.85rem; color: var(--primary); display: block; margin-bottom: 4px;">Peso Aproximado (kg) *</label>
            <input type="number" id="qzWeight" placeholder="Ej. 15" value="12" required min="1" max="90" style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.88rem;">
          </div>
        </div>

        <div>
          <label style="font-weight: 800; font-size: 0.85rem; color: var(--primary); display: block; margin-bottom: 4px;">Necesidad o Meta Especial *</label>
          <select id="qzGoal" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-family: inherit; font-size: 0.88rem;">
            <option value="Nutrición General & Energía">🥩 Nutrición General & Energía</option>
            <option value="Control de Peso & Digestión">⚖️ Control de Peso & Digestión Sensible</option>
            <option value="Piel Radiante & Pelo Brillante">✨ Piel Radiante & Pelo Brillante</option>
            <option value="Salud Urinaria & Renal">💧 Salud Urinaria & Renal</option>
          </select>
        </div>

        <button type="submit" class="checkout-btn" style="margin-top: 10px; background: var(--accent-orange); font-size: 1rem;">
          📊 Calcular Plan & Ver Alimento Recomendado
        </button>
      </form>
    </div>
  `;

  modal.classList.add("active");
};

window.handleNutriQuizSubmit = function(e) {
  e.preventDefault();
  const type = document.querySelector('input[name="qzType"]:checked')?.value || "perro";
  const weight = parseFloat(document.getElementById("qzWeight")?.value || 10);
  const portionGrams = Math.round(weight * 22 + (type === "perro" ? 50 : 15));
  const suggestedProduct = state.products.find(p => p.category === (type === "perro" ? "perros" : "gatos")) || state.products[0];

  const modal = document.getElementById("nutriQuizModalOverlay");
  if (!modal) return;

  modal.querySelector(".product-modal").innerHTML = `
    <button onclick="document.getElementById('nutriQuizModalOverlay').classList.remove('active')" class="modal-close-btn">✕</button>
    <div style="text-align: center; margin-bottom: 16px;">
      <span style="font-size: 3rem;">✨</span>
      <h2 style="font-weight: 900; color: #059669;">Plan Nutricional Calculado</h2>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Basado en las características de tu ${type}.</p>
    </div>

    <div style="background: linear-gradient(135deg, #123B5D 0%, #007BA7 100%); color: white; padding: 20px; border-radius: 16px; margin-bottom: 20px; text-align: center;">
      <div style="font-size: 0.8rem; font-weight: 700; opacity: 0.85; text-transform: uppercase;">RACIÓN DIARIA RECOMENDADA</div>
      <div style="font-size: 2.2rem; font-weight: 900; color: #FFB703; margin: 4px 0;">${portionGrams} gramos / día</div>
      <div style="font-size: 0.78rem; opacity: 0.9;">Servir dividido en 2 tomas diarias con agua fresca.</div>
    </div>

    <div style="background: #F8FAFC; border: 1px solid var(--border-color); padding: 16px; border-radius: 14px; margin-bottom: 20px;">
      <div style="font-weight: 800; color: var(--primary); font-size: 0.9rem; margin-bottom: 10px;">🏆 Alimento Recomendado por Veterinarios:</div>
      <div style="display: flex; gap: 14px; align-items: center;">
        <img src="${suggestedProduct.img}" alt="${suggestedProduct.title}" style="width: 70px; height: 70px; object-fit: contain; border-radius: 10px; background: white; padding: 4px; border: 1px solid var(--border-color);">
        <div style="flex: 1;">
          <div style="font-weight: 800; color: var(--primary); font-size: 0.95rem;">${suggestedProduct.title}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">Marca: ${suggestedProduct.brand}</div>
          <div style="font-weight: 900; color: var(--accent-orange); font-size: 1.05rem; margin-top: 4px;">RD$ ${suggestedProduct.price.toLocaleString('en-US', {minimumFractionDigits:2})}</div>
        </div>
      </div>
    </div>

    <button onclick="addToCart(${suggestedProduct.id}); document.getElementById('nutriQuizModalOverlay').classList.remove('active'); openCartDrawer();" class="checkout-btn" style="background: var(--accent-orange);">
      🛒 Añadir Alimento Recomendado al Carrito
    </button>
  `;
};

// --- LIVE SOCIAL PROOF TICKER ---
function initSocialProofTicker() {
  const buyerNames = [
    { name: "Pedro M.", city: "Piantini, Santo Domingo", item: "Royal Canin Medium Adult 15kg", icon: "🐶" },
    { name: "Laura F.", city: "Santiago de los Caballeros", item: "NexGard Spectra (15-30kg)", icon: "💊" },
    { name: "Gabriel R.", city: "Punta Cana / Bávaro", item: "Arena Clumping Odor Lock 12kg", icon: "🐱" },
    { name: "Ana S.", city: "Bella Vista, Santo Domingo", item: "Taste of the Wild High Prairie", icon: "🍖" },
    { name: "Carlos T.", city: "La Romana", item: "Rascador Árbol Multinivel", icon: "🐱" }
  ];
  let idx = 0;

  function showNotification() {
    const buyer = buyerNames[idx];
    idx = (idx + 1) % buyerNames.length;

    let toast = document.createElement("div");
    toast.className = "social-proof-toast";
    toast.innerHTML = `
      <div style="font-size: 1.6rem;">${buyer.icon}</div>
      <div>
        <div style="font-weight: 800; font-size: 0.8rem; color: var(--primary);">${buyer.name} en ${buyer.city}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">Compró <strong>${buyer.item}</strong> hace 2 min</div>
      </div>
      <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#CBD5E1; cursor:pointer; font-size:0.9rem; margin-left:auto;">✕</button>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  setInterval(showNotification, 16000);
}

// --- FLASH SALE COUNTDOWN TIMER ---
function initFlashSaleTimer() {
  let secondsLeft = 14250;
  const timerLabel = document.getElementById("flashSaleTimer");
  if (!timerLabel) return;

  setInterval(() => {
    secondsLeft = Math.max(0, secondsLeft - 1);
    const h = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
    const m = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
    const s = String(secondsLeft % 60).padStart(2, '0');
    timerLabel.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

// --- BOOKING MODAL (CITAS VETERINARIAS & GROOMING) ---
window.openBookingModal = function() {
  let modal = document.getElementById("bookingModalOverlay");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "bookingModalOverlay";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="product-modal" style="max-width: 580px; padding: 24px;">
        <button onclick="document.getElementById('bookingModalOverlay').classList.remove('active')" class="modal-close-btn">✕</button>
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 2.5rem;">🩺</span>
          <h2 style="font-weight: 900; color: var(--primary);">Reserva de Cita Veterinaria & Grooming</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Selecciona el servicio y la fecha conveniente para tu mascota.</p>
        </div>
        <form onsubmit="handleBookingSubmit(event)" style="display: flex; flex-direction: column; gap: 14px;">
          <div>
            <label style="font-weight: 700; font-size: 0.82rem; color: var(--primary); display: block; margin-bottom: 4px;">Servicio Requerido *</label>
            <select id="bookService" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-family: inherit; font-size: 0.9rem;">
              <option value="Consulta General">🩺 Consulta Médica General (RD$ 1,500.00)</option>
              <option value="Vacunación">💉 Esquema de Vacunación / Refuerzo (RD$ 1,200.00)</option>
              <option value="Grooming Baño y Corte">✂️ Grooming Completo - Baño & Corte (RD$ 1,800.00)</option>
              <option value="Profilaxis Dental">🪥 Limpieza Dental Profilaxis (RD$ 3,500.00)</option>
              <option value="Desparasitación">🦠 Desparasitación Interna/Externa (RD$ 850.00)</option>
            </select>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-weight: 700; font-size: 0.82rem; color: var(--primary); display: block; margin-bottom: 4px;">Nombre de la Mascota *</label>
              <input type="text" id="bookPetName" placeholder="Ej. Max, Luna" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.9rem;">
            </div>
            <div>
              <label style="font-weight: 700; font-size: 0.82rem; color: var(--primary); display: block; margin-bottom: 4px;">Especie / Raza *</label>
              <input type="text" id="bookPetBreed" placeholder="Ej. Perro Poodle, Gato" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.9rem;">
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-weight: 700; font-size: 0.82rem; color: var(--primary); display: block; margin-bottom: 4px;">Fecha de Cita *</label>
              <input type="date" id="bookDate" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.9rem;">
            </div>
            <div>
              <label style="font-weight: 700; font-size: 0.82rem; color: var(--primary); display: block; margin-bottom: 4px;">Horario Preferido *</label>
              <select id="bookTime" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.9rem;">
                <option value="09:00 AM">09:00 AM - Mañana</option>
                <option value="11:00 AM">11:00 AM - Mañana</option>
                <option value="02:30 PM">02:30 PM - Tarde</option>
                <option value="04:30 PM">04:30 PM - Tarde</option>
              </select>
            </div>
          </div>
          <div>
            <label style="font-weight: 700; font-size: 0.82rem; color: var(--primary); display: block; margin-bottom: 4px;">Teléfono de Contacto (WhatsApp) *</label>
            <input type="tel" id="bookPhone" placeholder="809-555-0000" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1.5px solid #CBD5E1; font-size: 0.9rem;">
          </div>
          <button type="submit" class="checkout-btn" style="margin-top: 10px; background: var(--accent-cyan);">Confirmar Reserva de Cita</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }
  const dateInput = modal.querySelector("#bookDate");
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }
  modal.classList.add("active");
};

window.handleBookingSubmit = function(e) {
  e.preventDefault();
  const service = document.getElementById("bookService")?.value;
  const petName = document.getElementById("bookPetName")?.value;
  const date = document.getElementById("bookDate")?.value;
  const time = document.getElementById("bookTime")?.value;

  document.getElementById("bookingModalOverlay")?.classList.remove("active");
  showToast(`📅 ¡Cita confirmada para ${petName}! Servicio: ${service} el ${date} a las ${time}.`);
};

// --- PHOTO SEARCH SIMULATION ---
window.triggerPhotoSearch = function() {
  let modal = document.getElementById("photoSearchModalOverlay");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "photoSearchModalOverlay";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="product-modal" style="max-width: 520px; padding: 24px; text-align: center;">
        <button onclick="document.getElementById('photoSearchModalOverlay').classList.remove('active')" class="modal-close-btn">✕</button>
        <span style="font-size: 3rem;">📷</span>
        <h2 style="font-weight: 900; color: var(--primary); margin-top: 8px;">Búsqueda Inteligente por Foto</h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Sube o escanea la foto del empaque de alimento o medicamento de tu mascota para buscarlo automáticamente.</p>
        
        <div id="photoScanBox" style="margin: 20px 0; padding: 30px; border: 2px dashed var(--accent-cyan); border-radius: 16px; background: #F0F9FF; cursor: pointer;" onclick="simulateScanProcess()">
          <div style="font-size: 2.2rem; color: var(--accent-cyan);">📸</div>
          <div style="font-weight: 800; color: var(--primary); margin-top: 8px;">Haz clic aquí para tomar foto o subir imagen</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Soporta JPG, PNG, HEIC</div>
        </div>

        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 10px;">O selecciona una muestra rápida:</div>
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <button class="cat-pill" onclick="runSamplePhotoSearch('Royal Canin')">🐶 Royal Canin</button>
          <button class="cat-pill" onclick="runSamplePhotoSearch('NexGard')">💊 NexGard Spectra</button>
          <button class="cat-pill" onclick="runSamplePhotoSearch('Taste of the Wild')">🍖 Taste of the Wild</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.classList.add("active");
};

window.simulateScanProcess = function() {
  const box = document.getElementById("photoScanBox");
  if (!box) return;
  box.innerHTML = `
    <div style="font-size: 2.2rem; animation: pulse 1s infinite;">🔍</div>
    <div style="font-weight: 800; color: var(--accent-cyan); margin-top: 8px;">Analizando empaque con IA de Cobaii...</div>
    <div style="font-size: 0.75rem; color: var(--text-muted);">Identificando marca, peso y especificaciones</div>
  `;
  setTimeout(() => {
    document.getElementById("photoSearchModalOverlay")?.classList.remove("active");
    box.innerHTML = `
      <div style="font-size: 2.2rem; color: var(--accent-cyan);">📸</div>
      <div style="font-weight: 800; color: var(--primary); margin-top: 8px;">Haz clic aquí para tomar foto o subir imagen</div>
      <div style="font-size: 0.75rem; color: var(--text-muted);">Soporta JPG, PNG, HEIC</div>
    `;
    runSamplePhotoSearch("Royal Canin");
  }, 1800);
};

window.runSamplePhotoSearch = function(brandName) {
  document.getElementById("photoSearchModalOverlay")?.classList.remove("active");
  state.searchQuery = brandName;
  const inputDesktop = document.getElementById("searchInputDesktop");
  const inputMobile = document.getElementById("searchInputMobile");
  if (inputDesktop) inputDesktop.value = brandName;
  if (inputMobile) inputMobile.value = brandName;
  renderProducts();
  showToast(`📸 IA detectó el producto: "${brandName}". Mostrando resultados.`);
};

// --- AI VET ADVISOR CHATBOT ---
window.toggleAiChat = function() {
  const win = document.getElementById("aiChatWindow");
  win?.classList.toggle("open");
};

window.sendAiMessage = function() {
  const input = document.getElementById("aiChatInput");
  const body = document.getElementById("aiChatBody");
  if (!input || !body) return;

  const text = input.value.trim();
  if (!text) return;

  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user";
  userBubble.textContent = text;
  body.appendChild(userBubble);
  input.value = "";
  body.scrollTop = body.scrollHeight;

  setTimeout(() => {
    const botBubble = document.createElement("div");
    botBubble.className = "chat-bubble bot";

    const query = text.toLowerCase();
    let reply = "¡Entendido! 🐾 En Cobaii Petvet Shop contamos con una amplia variedad de productos recomendados por médicos veterinarios para esa necesidad.";

    if (query.includes("hola") || query.includes("buenas")) {
      reply = "¡Hola! 👋 Soy tu Asesor Veterinario IA de Cobaii. ¿Tu consulta es sobre nutrición, antipulgas, accesorios o una cita medica?";
    } else if (query.includes("alimento") || query.includes("comida") || query.includes("perro")) {
      reply = "Para perros adultos recomendamos marcas super premium como **Royal Canin**, **Purina Pro Plan** o **Taste of the Wild**. ¿De qué raza o peso es tu perro?";
    } else if (query.includes("pulga") || query.includes("garrapata") || query.includes("nexgard") || query.includes("bravecto")) {
      reply = "Para control de pulgas y garrapatas te sugiero **NexGard Spectra** (mensual de amplio espectro) o **Bravecto** (12 semanas de protección continuada). Ambos disponibles en nuestra Farmacia Vet 💊.";
    } else if (query.includes("gato") || query.includes("arena")) {
      reply = "Para mininos tenemos alimentos de fórmula especial Hairball Care de Royal Canin y la excelente **Arena Odor Lock** que neutraliza amoníaco por 40 días.";
    } else if (query.includes("cita") || query.includes("grooming") || query.includes("baño")) {
      reply = "¡Con gusto! Puedes agendar una cita de grooming o consulta médica haciendo clic en el botón superior de **Reserva Cita Veterinaria** 🩺.";
    } else if (query.includes("envio") || query.includes("envío") || query.includes("delivery")) {
      reply = "¡Enviamos a todo el país! En el Distrito Nacional, Santo Domingo, Santiago y Punta Cana tus pedidos llegan express. ¡Y son GRATIS en compras sobre RD$4,500!";
    }

    botBubble.innerHTML = reply;
    body.appendChild(botBubble);
    body.scrollTop = body.scrollHeight;
  }, 700);
};

// --- MIS PEDIDOS & RASTREO VIEW ---
function renderOrders() {
  const container = document.getElementById("ordersList");
  if (!container) return;

  if (state.orders.length === 0) {
    container.innerHTML = `
      <div style="background: white; padding: 40px; border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--border-color);">
        <div style="font-size: 3rem; opacity: 0.5;">📋</div>
        <h3 style="font-weight: 800; color: var(--primary); margin-top: 10px;">Aún no tienes pedidos realizados</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Tus compras recientes y el rastreo de envíos aparecerán en este lugar.</p>
        <button onclick="switchTab(0)" class="btn-search-submit" style="margin-top: 16px; background: var(--accent-orange);">🛍️ Ir a Comprar Ahora</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="margin-bottom: 18px; display: flex; gap: 10px;">
      <input type="text" id="orderLookupInput" placeholder="Ingresa tu código de rastreo (Ej. EXP-8849-RD o PM-88102)..." style="flex: 1; padding: 10px 16px; border-radius: var(--radius-full); border: 1.5px solid #CBD5E1; font-size: 0.88rem;">
      <button onclick="lookupOrderTrack()" class="btn-search-submit">Rastrear</button>
    </div>
    ${state.orders.map(o => `
      <div style="background: white; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 20px; margin-bottom: 18px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 14px;">
          <div>
            <div style="font-weight: 900; color: var(--primary); font-size: 1.05rem;">Pedido ${o.id}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
              Realizado el ${o.date} · Tracking: <strong style="color:var(--accent-cyan);">${o.trackingCode}</strong>
            </div>
          </div>
          <span style="background: ${o.statusStep===4?'#D1FAE5':'#FEF3C7'}; color: ${o.statusStep===4?'#059669':'#D97706'}; font-weight: 800; padding: 6px 14px; border-radius: var(--radius-full); font-size: 0.82rem;">
            ${o.status}
          </span>
        </div>

        <!-- STEP PROGRESS BAR -->
        <div style="margin: 16px 0; background: #F8FAFC; padding: 14px; border-radius: 12px; border: 1px solid #E2E8F0;">
          <div style="font-size: 0.75rem; font-weight: 800; color: var(--primary); margin-bottom: 10px; text-transform: uppercase;">Progreso del Envío en Tiempo Real:</div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; text-align: center;">
            <div style="background: ${o.statusStep >= 1 ? '#007BA7' : '#CBD5E1'}; color: white; padding: 6px 4px; border-radius: 6px; font-size: 0.72rem; font-weight: 800;">1. Recibido</div>
            <div style="background: ${o.statusStep >= 2 ? '#007BA7' : '#CBD5E1'}; color: white; padding: 6px 4px; border-radius: 6px; font-size: 0.72rem; font-weight: 800;">2. Empacado</div>
            <div style="background: ${o.statusStep >= 3 ? '#FF5000' : '#CBD5E1'}; color: white; padding: 6px 4px; border-radius: 6px; font-size: 0.72rem; font-weight: 800;">3. En Camino</div>
            <div style="background: ${o.statusStep >= 4 ? '#10B981' : '#CBD5E1'}; color: white; padding: 6px 4px; border-radius: 6px; font-size: 0.72rem; font-weight: 800;">4. Entregado</div>
          </div>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-dark); margin-bottom: 14px;">
          <strong>Artículos Comprados:</strong>
          <ul style="margin-top: 6px; padding-left: 18px; color: var(--text-muted); display: flex; flex-direction: column; gap: 4px;">
            ${o.items.map(it => `
              <li style="display: flex; justify-content: space-between;">
                <span>${it.qty}x ${it.title} ${it.variant ? `(${it.variant})` : ''}</span>
                <strong>RD$ ${(it.price * it.qty).toLocaleString('en-US', {minimumFractionDigits:2})}</strong>
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px; background: #F8FAFC; padding: 10px; border-radius: 8px;">
          <div><strong>Dirección de Entrega:</strong> ${o.address}</div>
          <div><strong>Método de Pago:</strong> ${o.payMethod || 'Tarjeta de Crédito'}</div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color); padding-top: 12px;">
          <div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Total: </span>
            <strong style="color: var(--accent-orange); font-size: 1.15rem;">RD$ ${o.total.toLocaleString('en-US', {minimumFractionDigits: 2})}</strong>
          </div>
          ${o.statusStep < 4 ? `
            <button onclick="advanceOrderStep('${o.id}')" class="btn-search-submit" style="padding: 6px 14px; font-size: 0.78rem; background: var(--accent-cyan);">
              🔄 Simular Avance de Estado
            </button>
          ` : `
            <span style="color: #10B981; font-weight: 800; font-size: 0.82rem;">✅ Entrega Completada</span>
          `}
        </div>
      </div>
    `).join('')}
  `;
}

window.advanceOrderStep = function(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  if (order.statusStep < 4) {
    order.statusStep += 1;
    const statusMap = {
      1: "Procesando en Sistema 🟡",
      2: "Empacado en Almacén 📦",
      3: "En Camino con Mensajero 🚚",
      4: "Entregado con Éxito 🟢"
    };
    order.status = statusMap[order.statusStep];
    saveOrders();
    renderOrders();
    showToast(`📦 Pedido ${order.id} avanzó a: ${order.status}`);
  } else {
    showToast(`✅ Pedido ${order.id} ya fue completado y entregado.`);
  }
};

function initOrderProgressSimulator() {
  setInterval(() => {
    let updated = false;
    state.orders.forEach(order => {
      if (order.statusStep < 4 && Math.random() > 0.4) {
        order.statusStep += 1;
        const statusMap = {
          1: "Procesando en Sistema 🟡",
          2: "Empacado en Almacén 📦",
          3: "En Camino con Mensajero 🚚",
          4: "Entregado con Éxito 🟢"
        };
        order.status = statusMap[order.statusStep];
        updated = true;
      }
    });

    if (updated) {
      saveOrders();
      if (document.getElementById("tabOrdersView")?.classList.contains("active")) {
        renderOrders();
      }
    }
  }, 25000);
}

window.lookupOrderTrack = function() {
  const code = document.getElementById("orderLookupInput")?.value.trim().toUpperCase();
  if (!code) return;
  const found = state.orders.find(o => o.trackingCode.toUpperCase().includes(code) || o.id.toUpperCase().includes(code));
  if (found) {
    showToast(`📦 Pedido ${found.id} estado actual: "${found.status}"`);
  } else {
    showToast(`⚠️ No se encontró ningún pedido con la guía "${code}"`);
  }
};

// --- PROFILE & REWARDS VIEW ---
function renderProfile() {
  const container = document.getElementById("profileContainer");
  if (!container) return;

  const userInitials = state.user?.name ? state.user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "US";

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 24px;">
      
      <div style="background: linear-gradient(135deg, #123B5D 0%, #1E4E79 100%); color: white; border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-md);">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: #FF5000; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 900;">${userInitials}</div>
          <div>
            <h3 style="font-weight: 900; font-size: 1.1rem;">${state.user.name}</h3>
            <div style="font-size: 0.78rem; opacity: 0.85;">${state.user.email}</div>
            <span style="display: inline-block; background: #FFB703; color: #123B5D; font-weight: 900; font-size: 0.68rem; padding: 2px 8px; border-radius: 99px; margin-top: 4px;">MIEMBRO PLUS ⭐</span>
          </div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.12); padding: 14px; border-radius: 14px; margin-bottom: 16px;">
          <div style="font-size: 0.75rem; opacity: 0.8; font-weight: 700;">SALDO PETCASH ACUMULADO</div>
          <div style="font-size: 1.8rem; font-weight: 900; color: #FFB703;">🪙 ${state.user.petCash} Puntos</div>
          <div style="font-size: 0.72rem; opacity: 0.85; margin-top: 2px;">Equivalente a RD$ ${state.user.petCash.toLocaleString('en-US')} para compras</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button onclick="openAuthModal()" class="btn-search-submit" style="background: rgba(255,255,255,0.2); width: 100%;">
            👤 Switch / Iniciar con Otra Cuenta
          </button>
          <button onclick="logoutUser()" class="btn-search-submit" style="background: #EF4444; width: 100%;">
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      <div style="background: white; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 24px;">
        <h3 style="font-weight: 900; color: var(--primary); margin-bottom: 16px;">Mis Mascotas Registradas 🐾</h3>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 24px;">
          ${state.user.pets.map(pet => `
            <div style="background: #F8FAFC; border: 1px solid var(--border-color); padding: 16px; border-radius: 14px;">
              <div style="font-weight: 800; color: var(--primary); font-size: 1rem;">${pet.name}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Raza: ${pet.breed}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Edad: ${pet.age} · Peso: ${pet.weight}</div>
            </div>
          `).join('')}
        </div>

        <button onclick="showToast('🐾 Funcionalidad para agregar nueva mascota')" class="btn-search-submit" style="background: var(--primary);">+ Registrar Nueva Mascota</button>
      </div>

    </div>
  `;
}

// --- TAB SWITCHER ENGINE ---
window.switchTab = function(tabIndex) {
  const tabs = [
    document.getElementById("tabHomeView"),
    document.getElementById("tabOrdersView"),
    document.getElementById("tabOffersView"),
    document.getElementById("tabProfileView")
  ];

  tabs.forEach((t, i) => {
    if (t) t.classList.toggle("active", i === tabIndex);
  });

  const bottomItems = document.querySelectorAll(".bottom-nav-item");
  bottomItems.forEach((item, i) => {
    item.classList.toggle("active", i === tabIndex);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
};

// --- SEARCH & FILTER HANDLERS ---
function setupEventListeners() {
  document.querySelectorAll(".desktop-cat-nav .cat-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".desktop-cat-nav .cat-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.activeCategory = pill.dataset.category || "todos";
      renderProducts();
    });
  });

  const searchInputDesktop = document.getElementById("searchInputDesktop");
  if (searchInputDesktop) {
    searchInputDesktop.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }

  const searchInputMobile = document.getElementById("searchInputMobile");
  if (searchInputMobile) {
    searchInputMobile.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });
  }

  document.getElementById("closeCartDrawerBtn")?.addEventListener("click", closeCartDrawer);
  document.getElementById("closeModalBtn")?.addEventListener("click", () => {
    document.getElementById("productModalOverlay")?.classList.remove("active");
  });
}

window.filterByBrand = function(brandName) {
  state.searchQuery = brandName;
  const inputDesktop = document.getElementById("searchInputDesktop");
  if (inputDesktop) inputDesktop.value = brandName;
  renderProducts();
  showToast(`🏷️ Filtrando por marca: ${brandName}`);
  document.getElementById("productsGrid")?.scrollIntoView({ behavior: 'smooth' });
};

window.resetFilters = function() {
  state.activeCategory = "todos";
  state.searchQuery = "";
  state.brandFilter = "todas";
  const inputDesktop = document.getElementById("searchInputDesktop");
  const inputMobile = document.getElementById("searchInputMobile");
  if (inputDesktop) inputDesktop.value = "";
  if (inputMobile) inputMobile.value = "";
  document.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
  document.querySelector(".cat-pill[data-category=todos]")?.classList.add("active");
  renderProducts();
};

// --- TOAST NOTIFICATIONS SYSTEM ---
window.showToast = function(message) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>🐾</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
};
