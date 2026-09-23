// LuxePaws Royale Store + AERIS 3D Carousel Hero + Shopify Plus Enterprise Features + Ultra-VIP Modules

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CARRUSEL AERIS 3D HERO CON PRODUCTOS ALEATORIOS Y TRANSICIÓN AUTOMÁTICA
       ========================================================================== */
    const aerisCardsContainer = document.querySelector("#aeris-experience .cards");
    const aerisNextButton = document.querySelector("#aeris-experience .arrow-next");
    const aerisPrevButton = document.querySelector("#aeris-experience .arrow-prev");
    const aerisCurrent = document.querySelector("#aeris-experience #current");
    const aerisTotal = document.querySelector("#aeris-experience #total");
    const aerisDestination = document.querySelector("#aeris-experience #destination");
    const aerisCountry = document.querySelector("#aeris-experience #country");
    const aerisProgress = document.querySelector("#aeris-experience .progress-fill");
    const aerisBackground = document.querySelector("#aeris-experience .bg-image");

    let aerisCards = [];
    let aerisIndex = 0;
    let aerisLocked = false;
    let aerisAutoplayTimer = null;
    const AUTOPLAY_INTERVAL = 4000;

    const HERO_BANNERS = [
        { title: "PetSalud Medicamentos & Salud Completa", image: "images/banner3.jpg" },
        { title: "Dudi Pets Spa VIP", image: "images/banner1.png" },
        { title: "Cobaii Puntos & Beneficios", image: "images/banner2.jpg" }
    ];

    function renderRandomAerisCards() {
        if (!aerisCardsContainer) return;

        aerisCardsContainer.innerHTML = HERO_BANNERS.map((banner, idx) => {
            const numStr = String(idx + 1).padStart(2, "0");
            return `
                <article
                    class="card ${idx === 0 ? 'active' : ''}"
                    data-title="${banner.title}"
                    data-location="Promoción Royale"
                    data-number="${numStr}"
                    data-image="${banner.image}"
                >
                    <div class="card-media-frame">
                        <img src="${banner.image}" alt="${banner.title}">
                        <div class="card-glow"></div>
                    </div>
                </article>
            `;
        }).join('');

        if (aerisTotal) aerisTotal.textContent = String(HERO_BANNERS.length).padStart(2, "0");
        aerisCards = [...document.querySelectorAll("#aeris-experience .card")];
        bindAerisCardEvents();
    }

    function bindAerisCardEvents() {
        aerisCards.forEach(card => {
            card.addEventListener("pointermove", e => {
                if (!card.classList.contains("active")) return;
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `translateX(0) scale(1.015) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
            });

            card.addEventListener("pointerleave", () => {
                if (card.classList.contains("active")) card.style.transform = "";
            });
        });
    }

    function updateAeris(direction = 1) {
        if (aerisLocked || aerisCards.length === 0) return;
        aerisLocked = true;
        const total = aerisCards.length;
        aerisIndex = (aerisIndex + direction + total) % total;

        aerisCards.forEach((card, i) => {
            card.classList.remove("active", "previous", "next");
            const difference = (i - aerisIndex + total) % total;
            if (difference === 0) card.classList.add("active");
            else if (difference === total - 1) card.classList.add("previous");
            else if (difference === 1) card.classList.add("next");
        });

        const activeCard = aerisCards[aerisIndex];
        if (aerisCurrent) aerisCurrent.textContent = String(aerisIndex + 1).padStart(2, "0");
        if (aerisDestination) aerisDestination.textContent = (activeCard.dataset.title || "").toUpperCase();
        if (aerisCountry) aerisCountry.textContent = (activeCard.dataset.location || "").toUpperCase();
        if (aerisBackground && activeCard.dataset.image) aerisBackground.style.backgroundImage = `url("${activeCard.dataset.image}")`;
        if (aerisProgress) aerisProgress.style.width = `${((aerisIndex + 1) / total) * 100}%`;

        setTimeout(() => { aerisLocked = false; }, 700);
    }

    function startAerisAutoplay() {
        stopAerisAutoplay();
        aerisAutoplayTimer = setInterval(() => updateAeris(1), AUTOPLAY_INTERVAL);
    }

    function stopAerisAutoplay() {
        if (aerisAutoplayTimer) { clearInterval(aerisAutoplayTimer); aerisAutoplayTimer = null; }
    }

    function resetAerisAutoplay() { stopAerisAutoplay(); startAerisAutoplay(); }

    if (aerisNextButton) aerisNextButton.addEventListener("click", () => { updateAeris(1); resetAerisAutoplay(); });
    if (aerisPrevButton) aerisPrevButton.addEventListener("click", () => { updateAeris(-1); resetAerisAutoplay(); });


    /* ==========================================================================
       2. LÓGICA DE TIENDA SHOPIFY PLUS ENTERPRISE & ULTRA-VIP
       ========================================================================== */
    let cart = JSON.parse(localStorage.getItem('luxepaws_cart')) || [];
    let wishlist = new Set(JSON.parse(localStorage.getItem('luxepaws_wishlist')) || []);
    let recentlyViewed = JSON.parse(localStorage.getItem('luxepaws_recently_viewed')) || [];
    let userPoints = parseInt(localStorage.getItem('luxepaws_user_points')) || 240;
    let currentCategory = 'all';
    let searchQuery = '';
    let discountRate = 0;
    let currentCurrency = localStorage.getItem('luxepaws_currency') || 'USD';
    let currentTheme = localStorage.getItem('luxepaws_theme') || 'light';
    let selectedModalColor = null;
    let selectedModalSize = null;
    let quickViewProductId = null;
    let isGiftWrap = false;
    let exitModalShown = false;

    // APLICAR TEMA, MONEDA Y PUNTOS HEADER
    const htmlEl = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const currencySelect = document.getElementById('currency-select');
    const headerUserPointsEl = document.getElementById('header-user-points');

    function applyTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        currentTheme = theme;
        localStorage.setItem('luxepaws_theme', theme);
        if (themeIcon) themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    applyTheme(currentTheme);
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', () => applyTheme(currentTheme === 'light' ? 'dark' : 'light'));

    function updatePointsDisplay() {
        if (headerUserPointsEl) headerUserPointsEl.textContent = userPoints;
        const modalPts = document.getElementById('vip-modal-points');
        if (modalPts) modalPts.textContent = `${userPoints} Pts`;
        localStorage.setItem('luxepaws_user_points', userPoints);
    }
    updatePointsDisplay();

    if (currencySelect) {
        currencySelect.value = currentCurrency;
        currencySelect.addEventListener('change', (e) => {
            currentCurrency = e.target.value;
            localStorage.setItem('luxepaws_currency', currentCurrency);
            renderCatalog();
            updateCartUI();
            if (quickViewProductId) openQuickView(quickViewProductId);
            renderRecentlyViewed();
            showToast(`💱 Moneda cambiada a ${currentCurrency}`);
        });
    }

    function formatPrice(amountUSD) {
        if (typeof CURRENCIES === 'undefined' || !CURRENCIES[currentCurrency]) return `$${amountUSD.toFixed(2)}`;
        const curr = CURRENCIES[currentCurrency];
        const converted = amountUSD * curr.rate;
        if (currentCurrency === 'COP') {
            return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
        }
        return `${curr.symbol}${converted.toFixed(2)}`;
    }

    // ELEMENTOS DOM TIENDA
    const productsGrid = document.getElementById('products-grid');
    const headerPetSwitcher = document.getElementById('header-pet-switcher');
    const btnToggleSearch = document.getElementById('btn-toggle-search');
    const btnCloseSearch = document.getElementById('btn-close-search');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    const trendTags = document.querySelectorAll('.trend-tag');

    const cartBtn = document.getElementById('cart-btn');
    const cartBadge = document.getElementById('cart-badge');
    const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartView = document.getElementById('empty-cart-view');
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const totalEl = document.getElementById('cart-total');
    const couponInput = document.getElementById('coupon-input');
    const btnApplyCoupon = document.getElementById('btn-apply-coupon');
    const btnCheckout = document.getElementById('btn-checkout');

    // BUSCADOR OVERLAY
    if (btnToggleSearch && searchOverlay) {
        btnToggleSearch.addEventListener('click', () => {
            searchOverlay.classList.toggle('active');
            if (searchOverlay.classList.contains('active') && searchInput) searchInput.focus();
        });
    }
    if (btnCloseSearch && searchOverlay) {
        btnCloseSearch.addEventListener('click', () => searchOverlay.classList.remove('active'));
    }

    // SORTING & WISHLIST HEADER FILTER
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.addEventListener('change', () => renderCatalog());

    const wishlistHeaderBtn = document.getElementById('wishlist-header-btn');
    let showingWishlistOnly = false;
    if (wishlistHeaderBtn) {
        wishlistHeaderBtn.addEventListener('click', () => {
            showingWishlistOnly = !showingWishlistOnly;
            if (showingWishlistOnly) {
                wishlistHeaderBtn.style.borderColor = 'var(--gold)';
                wishlistHeaderBtn.style.background = 'rgba(212, 175, 55, 0.2)';
                showToast(`❤️ Mostrando ${wishlist.size} favoritos`);
            } else {
                wishlistHeaderBtn.style.borderColor = '';
                wishlistHeaderBtn.style.background = '';
                showToast('✨ Mostrando todo el catálogo');
            }
            renderCatalog();
        });
    }

    // RENDER CATALOGO PINTEREST MASONRY (CON HOVER DE SEGUNDA IMAGEN & QUICK SIZES)
    function renderCatalog() {
        if (!productsGrid || typeof PRODUCTS === 'undefined') return;

        let filtered = PRODUCTS.filter(product => {
            const matchesCategory = (currentCategory === 'all') || 
                                     (product.species === currentCategory) ||
                                     (product.category === currentCategory);
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  product.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesWishlist = !showingWishlistOnly || wishlist.has(product.id);
            return matchesCategory && matchesSearch && matchesWishlist;
        });

        if (sortSelect) {
            const sortVal = sortSelect.value;
            if (sortVal === 'price-low') filtered.sort((a, b) => a.price - b.price);
            else if (sortVal === 'price-high') filtered.sort((a, b) => b.price - a.price);
            else if (sortVal === 'rating') filtered.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
        }

        if (filtered.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-grid-view">
                    <div class="empty-grid-icon">🐾</div>
                    <h3 class="empty-grid-title">No encontramos productos VIP</h3>
                    <p class="empty-grid-desc">No hay artículos disponibles para esta selección o búsqueda.</p>
                    <button class="btn-reset-filters" id="btn-reset-search">👑 Mostrar Todo el Catálogo</button>
                </div>
            `;
            const btnReset = document.getElementById('btn-reset-search');
            if (btnReset) {
                btnReset.addEventListener('click', () => {
                    currentCategory = 'all';
                    searchQuery = '';
                    showingWishlistOnly = false;
                    if (wishlistHeaderBtn) {
                        wishlistHeaderBtn.style.borderColor = '';
                        wishlistHeaderBtn.style.background = '';
                    }
                    if (headerPetSwitcher) headerPetSwitcher.value = 'all';
                    if (searchInput) searchInput.value = '';
                    renderCatalog();
                });
            }
            return;
        }

        productsGrid.innerHTML = filtered.map(product => createPinterestPinHTML(product)).join('');
        bindCardEvents();
    }

    function createPinterestPinHTML(product) {
        const isWishlisted = wishlist.has(product.id);
        const sizesHtml = product.sizes && product.sizes.length > 0
            ? `<div class="quick-size-bar">
                ${product.sizes.map(s => `<button class="quick-size-pill" data-id="${product.id}" data-size="${s}">${s}</button>`).join('')}
               </div>`
            : '';

        return `
            <div class="product-card" data-id="${product.id}">
                <div class="card-img-wrapper ${product.aspectRatio}">
                    <img src="${product.image}" alt="${product.name}" class="img-main" loading="lazy">
                    <img src="${product.hoverImage || product.image}" alt="${product.name}" class="img-secondary" loading="lazy">
                    ${sizesHtml}
                </div>

                <div class="card-body">
                    <div class="card-header-row">
                        <div class="card-badges">
                            <span class="badge-discount">-${product.discount}%</span>
                            <span class="badge-tag">${product.badge}</span>
                        </div>
                        <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" data-id="${product.id}">
                            ${isWishlisted ? '❤️' : '🤍'}
                        </button>
                    </div>

                    <div class="card-rating">
                        <span>★ ${product.rating.toFixed(1)}</span>
                        <span class="reviews-count">(${product.reviewsCount})</span>
                    </div>

                    <h3 class="card-title">${product.name}</h3>

                    <div class="card-footer">
                        <div>
                            <span class="price-current">${formatPrice(product.price)}</span>
                            <span class="price-original">${formatPrice(product.originalPrice)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function bindCardEvents() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn-wishlist') || e.target.closest('.quick-size-pill')) return;
                const productId = parseInt(card.dataset.id);
                if (productId) {
                    addRecentlyViewed(productId);
                    window.location.href = `product.html?id=${productId}`;
                }
            });
        });

        document.querySelectorAll('.quick-size-pill').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.id);
                const size = btn.dataset.size;
                addToCart(productId, 1, { size });
            });
        });

        document.querySelectorAll('.btn-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleWishlist(parseInt(btn.dataset.id), btn);
            });
        });
    }

    // CARRITO DE COMPRAS CON VARIANTE & GRABADO
    function addToCart(productId, qty = 1, options = {}) {
        if (typeof PRODUCTS === 'undefined') return;
        let product = PRODUCTS.find(p => p.id === productId);

        if (!product && typeof CART_UPSELLS !== 'undefined') {
            const upsell = CART_UPSELLS.find(u => u.id === productId);
            if (upsell) {
                product = {
                    id: upsell.id,
                    name: upsell.name,
                    price: upsell.price,
                    image: upsell.image
                };
            }
        }
        if (!product) return;

        const selectedSize = options.size || (product.sizes ? product.sizes[0] : null);
        const selectedColor = options.color || (product.colors ? product.colors[0].name : null);
        const engravedName = options.engravedName || null;
        const cartItemId = `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}-${engravedName || 'none'}`;

        const existing = cart.find(item => item.cartItemId === cartItemId);
        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({
                cartItemId,
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: selectedSize,
                color: selectedColor,
                engravedName,
                qty
            });
        }

        // Sumar Puntos Royale
        const pointsEarned = Math.floor(product.price * 10 * qty);
        userPoints += pointsEarned;
        updatePointsDisplay();

        saveCart();
        updateCartUI();
        openCartDrawer();
        showToast(`✨ ¡'${product.name.slice(0, 18)}...' al carrito! (+${pointsEarned} Pts)`);
    }

    function removeFromCart(cartItemId) {
        cart = cart.filter(item => item.cartItemId !== cartItemId);
        saveCart();
        updateCartUI();
    }

    function updateCartQty(cartItemId, delta) {
        const item = cart.find(i => i.cartItemId === cartItemId);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) removeFromCart(cartItemId);
            else { saveCart(); updateCartUI(); }
        }
    }

    function saveCart() {
        localStorage.setItem('luxepaws_cart', JSON.stringify(cart));
    }

    const floatingFab = document.getElementById('floating-cart-fab');
    const fabCartCount = document.getElementById('fab-cart-count');
    const fabCartTotal = document.getElementById('fab-cart-total');

    if (floatingFab) floatingFab.addEventListener('click', openCartDrawer);

    window.addEventListener('scroll', () => {
        if (!floatingFab) return;
        floatingFab.style.display = (window.scrollY > 300 && cart.length > 0) ? 'flex' : 'none';
    });

    function updateCartUI() {
        if (!cartBadge) return;
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartBadge.textContent = totalItems;
        const dockBadge = document.getElementById('dock-cart-badge');
        if (dockBadge) dockBadge.textContent = totalItems;

        let rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        if (isGiftWrap) rawSubtotal += 4.99;

        const discountAmount = rawSubtotal * discountRate;
        const total = rawSubtotal - discountAmount;

        if (fabCartCount) fabCartCount.textContent = totalItems;
        if (fabCartTotal) fabCartTotal.textContent = formatPrice(total);

        if (cart.length === 0) {
            if (emptyCartView) emptyCartView.style.display = 'block';
            if (cartItemsContainer) cartItemsContainer.innerHTML = '';
        } else {
            if (emptyCartView) emptyCartView.style.display = 'none';
            if (cartItemsContainer) {
                cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <small style="color: var(--text-muted); font-size: 0.72rem;">
                                ${item.size ? `Talla: ${item.size}` : ''} ${item.color ? `| Color: ${item.color}` : ''}
                                ${item.engravedName ? `<br><strong style="color: var(--gold);">✨ Grabado: ${item.engravedName}</strong>` : ''}
                            </small>
                            <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
                            <div class="cart-qty-controls">
                                <button class="btn-qty btn-minus" data-cart-id="${item.cartItemId}">-</button>
                                <span>${item.qty}</span>
                                <button class="btn-qty btn-plus" data-cart-id="${item.cartItemId}">+</button>
                                <button class="btn-remove-item" data-cart-id="${item.cartItemId}">🗑️</button>
                            </div>
                        </div>
                    </div>
                `).join('');

                cartItemsContainer.querySelectorAll('.btn-minus').forEach(b => {
                    b.addEventListener('click', () => updateCartQty(b.dataset.cartId, -1));
                });
                cartItemsContainer.querySelectorAll('.btn-plus').forEach(b => {
                    b.addEventListener('click', () => updateCartQty(b.dataset.cartId, 1));
                });
                cartItemsContainer.querySelectorAll('.btn-remove-item').forEach(b => {
                    b.addEventListener('click', () => removeFromCart(b.dataset.cartId));
                });
            }
        }

        if (subtotalEl) subtotalEl.textContent = formatPrice(rawSubtotal);
        if (discountEl) discountEl.textContent = discountRate > 0 ? `-${formatPrice(discountAmount)} (${discountRate * 100}%)` : '$0.00';
        if (totalEl) totalEl.textContent = formatPrice(total);

        // Termómetro Multi-tier Reward (Free shipping + Gift)
        const freeShippingProgress = document.getElementById('free-shipping-progress');
        const freeShippingText = document.getElementById('free-shipping-text');
        if (freeShippingProgress && freeShippingText) {
            const targetAmount = 50.0;
            const giftAmount = 100.0;
            const progressPercent = Math.min(100, (rawSubtotal / giftAmount) * 100);
            freeShippingProgress.style.width = `${progressPercent}%`;

            if (rawSubtotal >= giftAmount) {
                freeShippingText.innerHTML = `🎁 ¡FELICIDADES! Tienes <strong>Envío Gratis + JUGUETE VIP DE REGALO</strong> 🎉`;
            } else if (rawSubtotal >= targetAmount) {
                const neededGift = (giftAmount - rawSubtotal).toFixed(2);
                freeShippingText.innerHTML = `🚚 ¡Envío Gratis Conseguido! Agrega <strong>$${neededGift}</strong> para Juguete VIP Gratis 🎁`;
            } else {
                const remaining = (targetAmount - rawSubtotal).toFixed(2);
                freeShippingText.innerHTML = `¡Agrega <strong>$${remaining}</strong> más para Envío Express GRATIS! 🚚`;
            }
        }

        renderCartUpsells();
    }

    // UPSELLS EN CARRITO
    function renderCartUpsells() {
        const container = document.getElementById('cart-upsells-container');
        if (!container || typeof CART_UPSELLS === 'undefined') return;

        container.innerHTML = CART_UPSELLS.map(u => `
            <div class="cart-upsell-card">
                <img src="${u.image}" alt="${u.name}" class="cart-upsell-img">
                <div class="cart-upsell-info">
                    <div class="cart-upsell-name">${u.name}</div>
                    <div class="cart-upsell-price">${formatPrice(u.price)}</div>
                </div>
                <button class="btn-add-upsell" data-id="${u.id}">+ Añadir</button>
            </div>
        `).join('');

        container.querySelectorAll('.btn-add-upsell').forEach(btn => {
            btn.addEventListener('click', () => {
                addToCart(parseInt(btn.dataset.id));
            });
        });
    }

    const giftWrapCheck = document.getElementById('cart-gift-wrap-check');
    if (giftWrapCheck) {
        giftWrapCheck.addEventListener('change', (e) => {
            isGiftWrap = e.target.checked;
            updateCartUI();
        });
    }

    // WISHLIST
    function toggleWishlist(productId, btnElement) {
        if (wishlist.has(productId)) {
            wishlist.delete(productId);
            btnElement.classList.remove('active');
            btnElement.textContent = '🤍';
            showToast('Removido de Favoritos');
        } else {
            wishlist.add(productId);
            btnElement.classList.add('active');
            btnElement.textContent = '❤️';
            showToast('❤️ ¡Añadido a Favoritos!');
        }
        localStorage.setItem('luxepaws_wishlist', JSON.stringify([...wishlist]));
    }

    // MODAL VISTA RÁPIDA (PDP CON GALERÍA, VARIANTES & GRABADO DE NOMBRE EN VIVO)
    const quickViewModal = document.getElementById('quick-view-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPriceCurrent = document.getElementById('modal-price-current');
    const modalPriceOriginal = document.getElementById('modal-price-original');
    const modalAddCartBtn = document.getElementById('modal-add-cart-btn');

    // Personalización Grabado elementos
    const engravingCheck = document.getElementById('engraving-check');
    const engravingInputsContainer = document.getElementById('engraving-inputs-container');
    const engravingNameInput = document.getElementById('engraving-name-input');
    const engravingLivePreview = document.getElementById('engraving-live-preview');

    if (engravingCheck && engravingInputsContainer && engravingLivePreview) {
        engravingCheck.addEventListener('change', (e) => {
            if (e.target.checked) {
                engravingInputsContainer.style.display = 'flex';
                engravingLivePreview.classList.add('active');
                if (engravingNameInput) engravingLivePreview.textContent = engravingNameInput.value.toUpperCase() || 'TU MASCOTA';
            } else {
                engravingInputsContainer.style.display = 'none';
                engravingLivePreview.classList.remove('active');
            }
        });
    }

    if (engravingNameInput && engravingLivePreview) {
        engravingNameInput.addEventListener('input', (e) => {
            const val = e.target.value.trim().toUpperCase();
            engravingLivePreview.textContent = val || 'TU MASCOTA';
        });
    }

    function openQuickView(productId) {
        if (typeof PRODUCTS === 'undefined') return;
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        quickViewProductId = productId;
        selectedModalColor = product.colors ? product.colors[0].name : null;
        selectedModalSize = product.sizes ? product.sizes[0] : null;

        if (modalImg) modalImg.src = product.image;
        if (modalTitle) modalTitle.textContent = product.name;
        if (modalDesc) modalDesc.textContent = product.description;
        if (modalPriceCurrent) modalPriceCurrent.textContent = formatPrice(product.price);
        if (modalPriceOriginal) modalPriceOriginal.textContent = formatPrice(product.originalPrice);

        // Earned Points Badge
        const ptsBadge = document.getElementById('modal-earned-points-badge');
        if (ptsBadge) ptsBadge.textContent = `👑 +${Math.floor(product.price * 10)} Pts Royale`;

        // Reset Grabado
        if (engravingCheck) engravingCheck.checked = false;
        if (engravingInputsContainer) engravingInputsContainer.style.display = 'none';
        if (engravingLivePreview) engravingLivePreview.classList.remove('active');
        if (engravingNameInput) engravingNameInput.value = '';

        // Galería de Miniaturas
        const thumbsContainer = document.getElementById('modal-gallery-thumbs');
        if (thumbsContainer) {
            const galleryList = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
            thumbsContainer.innerHTML = galleryList.map((imgUrl, i) => `
                <img src="${imgUrl}" alt="Vista" class="modal-thumb ${i === 0 ? 'active' : ''}">
            `).join('');

            thumbsContainer.querySelectorAll('.modal-thumb').forEach(thumb => {
                thumb.addEventListener('click', () => {
                    thumbsContainer.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    if (modalImg) modalImg.src = thumb.src;
                });
            });
        }

        // Swatches de Color
        const colorSwatchesContainer = document.getElementById('modal-color-swatches');
        const selectedColorLabel = document.getElementById('selected-color-name');
        if (colorSwatchesContainer && product.colors) {
            if (selectedColorLabel) selectedColorLabel.textContent = product.colors[0].name;
            colorSwatchesContainer.innerHTML = product.colors.map((c, i) => `
                <div class="color-swatch-item ${i === 0 ? 'active' : ''}" style="background-color: ${c.hex};" data-name="${c.name}" title="${c.name}"></div>
            `).join('');

            colorSwatchesContainer.querySelectorAll('.color-swatch-item').forEach(swatch => {
                swatch.addEventListener('click', () => {
                    colorSwatchesContainer.querySelectorAll('.color-swatch-item').forEach(s => s.classList.remove('active'));
                    swatch.classList.add('active');
                    selectedModalColor = swatch.dataset.name;
                    if (selectedColorLabel) selectedColorLabel.textContent = selectedModalColor;
                });
            });
        }

        // Cápsulas de Talla
        const sizeCapsulesContainer = document.getElementById('modal-size-capsules');
        const selectedSizeLabel = document.getElementById('selected-size-name');
        if (sizeCapsulesContainer && product.sizes) {
            if (selectedSizeLabel) selectedSizeLabel.textContent = product.sizes[0];
            sizeCapsulesContainer.innerHTML = product.sizes.map((s, i) => `
                <div class="size-capsule-item ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</div>
            `).join('');

            sizeCapsulesContainer.querySelectorAll('.size-capsule-item').forEach(capsule => {
                capsule.addEventListener('click', () => {
                    sizeCapsulesContainer.querySelectorAll('.size-capsule-item').forEach(c => c.classList.remove('active'));
                    capsule.classList.add('active');
                    selectedModalSize = capsule.dataset.size;
                    if (selectedSizeLabel) selectedSizeLabel.textContent = selectedModalSize;
                });
            });
        }

        // Acordiones Specs
        const matAcc = document.getElementById('modal-accordion-material');
        const shipAcc = document.getElementById('modal-accordion-shipping');
        if (matAcc && product.specs) matAcc.textContent = product.specs.material;
        if (shipAcc && product.specs) shipAcc.textContent = product.specs.shipping;

        if (modalAddCartBtn) {
            modalAddCartBtn.onclick = () => {
                const isEngraved = engravingCheck && engravingCheck.checked;
                const engravedName = isEngraved && engravingNameInput ? engravingNameInput.value.trim().toUpperCase() : null;
                addToCart(product.id, 1, { size: selectedModalSize, color: selectedModalColor, engravedName });
                closeQuickView();
            };
        }

        if (quickViewModal) quickViewModal.classList.add('active');

        // Track Vistos Recientemente
        addRecentlyViewed(productId);
    }

    function closeQuickView() {
        if (quickViewModal) quickViewModal.classList.remove('active');
        quickViewProductId = null;
    }

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeQuickView);

    // DISPATCH URGENCY TICKER
    function startDispatchUrgencyTimer() {
        const timerEl = document.getElementById('dispatch-timer');
        if (!timerEl) return;
        let sec = 2 * 3600 + 14 * 60 + 32;
        setInterval(() => {
            if (sec <= 0) sec = 8 * 3600;
            else sec--;
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            timerEl.textContent = `${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
        }, 1000);
    }

    // MODAL GUÍA DE TALLAS
    const sizeGuideModal = document.getElementById('size-guide-modal');
    const btnOpenSizeGuide = document.getElementById('btn-open-size-guide');
    const btnCloseSizeGuide = document.getElementById('btn-close-size-guide');

    if (btnOpenSizeGuide && sizeGuideModal) btnOpenSizeGuide.addEventListener('click', () => sizeGuideModal.classList.add('active'));
    if (btnCloseSizeGuide && sizeGuideModal) btnCloseSizeGuide.addEventListener('click', () => sizeGuideModal.classList.remove('active'));

    // MODAL VIP REWARDS & TIERS
    const vipModal = document.getElementById('vip-rewards-modal');
    const btnOpenVip = document.getElementById('btn-open-vip-rewards');
    const btnCloseVip = document.getElementById('btn-close-vip-modal');
    const vipTiersContainer = document.getElementById('vip-tiers-container');

    function renderVipTiers() {
        if (!vipTiersContainer || typeof VIP_TIERS === 'undefined') return;
        vipTiersContainer.innerHTML = VIP_TIERS.map(tier => {
            const isCurrent = userPoints >= tier.minPoints;
            return `
                <div class="vip-tier-card ${isCurrent ? 'current' : ''}">
                    <div>
                        <div class="vip-tier-name">${tier.name} ${isCurrent ? '✨ (Nivel Actual)' : ''}</div>
                        <div class="vip-tier-perk">${tier.perk}</div>
                    </div>
                    <span class="points-earned-pill">${tier.minPoints} Pts</span>
                </div>
            `;
        }).join('');
    }

    if (btnOpenVip && vipModal) {
        btnOpenVip.addEventListener('click', () => {
            renderVipTiers();
            vipModal.classList.add('active');
        });
    }
    if (btnCloseVip && vipModal) btnCloseVip.addEventListener('click', () => vipModal.classList.remove('active'));

    // SHOPPABLE INSTAGRAM GRID RENDERER
    function renderShoppableInstagram() {
        const grid = document.getElementById('shoppable-instagram-grid');
        if (!grid || typeof INSTAGRAM_UGC === 'undefined') return;

        grid.innerHTML = INSTAGRAM_UGC.map(item => `
            <div class="shoppable-card" data-product-id="${item.productId}">
                <img src="${item.image}" alt="${item.username}">
                <div class="shoppable-overlay">
                    <div class="shoppable-user">${item.username}</div>
                    <div class="shoppable-pet">${item.petName} • ❤️ ${item.likes}</div>
                    <span class="buy-look-badge">🛍️ Comprar Look: ${item.productName.slice(0, 18)}...</span>
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.shoppable-card').forEach(card => {
            card.addEventListener('click', () => {
                const pId = parseInt(card.dataset.productId);
                if (pId) {
                    addRecentlyViewed(pId);
                    window.location.href = `product.html?id=${pId}`;
                }
            });
        });
    }

    // MOBILE BOTTOM DOCK NAV HANDLERS
    const dockHome = document.getElementById('dock-home');
    const dockSearch = document.getElementById('dock-search');
    const dockQuiz = document.getElementById('dock-quiz');
    const dockWishlist = document.getElementById('dock-wishlist');
    const dockCart = document.getElementById('dock-cart');

    if (dockHome) dockHome.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    if (dockSearch && searchOverlay) dockSearch.addEventListener('click', () => searchOverlay.classList.add('active'));
    if (dockWishlist && wishlistHeaderBtn) dockWishlist.addEventListener('click', () => wishlistHeaderBtn.click());
    if (dockCart) dockCart.addEventListener('click', openCartDrawer);

    // PET QUIZ INTERACTIVO SYSTEM
    const quizModal = document.getElementById('pet-quiz-modal');
    const btnOpenQuiz = document.getElementById('btn-open-pet-quiz');
    const btnCloseQuiz = document.getElementById('btn-close-quiz-modal');
    const quizContainer = document.getElementById('quiz-step-container');

    let quizCurrentStep = 0;
    let quizAnswers = { species: null, size: null, category: null };

    if (dockQuiz) dockQuiz.addEventListener('click', () => startQuiz());
    if (btnOpenQuiz) btnOpenQuiz.addEventListener('click', () => startQuiz());
    if (btnCloseQuiz && quizModal) btnCloseQuiz.addEventListener('click', () => quizModal.classList.remove('active'));

    function startQuiz() {
        quizCurrentStep = 0;
        quizAnswers = { species: null, size: null, category: null };
        renderQuizStep();
        if (quizModal) quizModal.classList.add('active');
    }

    function renderQuizStep() {
        if (!quizContainer || typeof PET_QUIZ_QUESTIONS === 'undefined') return;

        if (quizCurrentStep < PET_QUIZ_QUESTIONS.length) {
            const q = PET_QUIZ_QUESTIONS[quizCurrentStep];
            quizContainer.innerHTML = `
                <div class="quiz-step-box">
                    <h4 class="quiz-question-title">${q.title}</h4>
                    <div class="quiz-options-grid">
                        ${q.options.map(opt => `
                            <div class="quiz-option-card" data-val="${opt.value}">
                                <div class="quiz-option-icon">${opt.icon}</div>
                                <div class="quiz-option-label">${opt.label}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            quizContainer.querySelectorAll('.quiz-option-card').forEach(card => {
                card.addEventListener('click', () => {
                    const val = card.dataset.val;
                    if (quizCurrentStep === 0) quizAnswers.species = val;
                    else if (quizCurrentStep === 1) quizAnswers.size = val;
                    else if (quizCurrentStep === 2) quizAnswers.category = val;

                    quizCurrentStep++;
                    renderQuizStep();
                });
            });
        } else {
            // Generar Kit Recomendado
            const recommended = PRODUCTS.filter(p => p.species === quizAnswers.species || p.category === quizAnswers.category).slice(0, 2);
            const bundleItems = recommended.length > 0 ? recommended : PRODUCTS.slice(0, 2);
            const bundleTotalPrice = bundleItems.reduce((sum, item) => sum + item.price, 0);

            quizContainer.innerHTML = `
                <div style="text-align: center; padding: 15px 0;">
                    <div style="font-size: 3rem; margin-bottom: 8px;">👑🎁</div>
                    <h3 style="font-size: 1.3rem; font-weight: 900;">¡Kit Imperial Recomendado Listo!</h3>
                    <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 20px;">Diseñado especialmente según la personalidad y talla de tu mascota.</p>

                    <div style="display: flex; gap: 15px; justify-content: center; margin-bottom: 20px;">
                        ${bundleItems.map(item => `
                            <div style="background: rgba(255,255,255,0.9); border: 1px solid var(--gold); border-radius: 16px; padding: 12px; width: 160px; text-align: center;">
                                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 10px;">
                                <div style="font-size: 0.78rem; font-weight: 700; margin-top: 6px;">${item.name.slice(0, 20)}...</div>
                                <div style="font-size: 0.85rem; font-weight: 900; color: var(--gold);">${formatPrice(item.price)}</div>
                            </div>
                        `).join('')}
                    </div>

                    <button class="btn-checkout" id="btn-add-quiz-bundle">
                        🛒 Añadir Kit Completo (${formatPrice(bundleTotalPrice)})
                    </button>
                </div>
            `;

            const btnBundle = document.getElementById('btn-add-quiz-bundle');
            if (btnBundle) {
                btnBundle.addEventListener('click', () => {
                    bundleItems.forEach(item => addToCart(item.id, 1, { size: quizAnswers.size }));
                    if (quizModal) quizModal.classList.remove('active');
                    showToast('🎉 ¡Kit Imperial completo agregado al carrito!');
                });
            }
        }
    }

    // DRAWER CONTROLS
    function openCartDrawer() { if (cartDrawerOverlay) cartDrawerOverlay.classList.add('active'); }
    function closeCartDrawer() { if (cartDrawerOverlay) cartDrawerOverlay.classList.remove('active'); }

    if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeCartDrawer);

    // CUPÓN
    if (btnApplyCoupon) {
        btnApplyCoupon.addEventListener('click', () => {
            const code = couponInput.value.trim().toUpperCase();
            if (code === 'LUXE2026' || code === 'ROYALE15') {
                discountRate = 0.20;
                showToast(`🎉 ¡Cupón ${code} aplicado! 20% OFF`);
            } else if (code === 'TEMU70') {
                discountRate = 0.35;
                showToast('🔥 ¡Cupón TEMU70 aplicado! 35% OFF');
            } else {
                showToast('❌ Cupón no válido. Usa LUXE2026 o ROYALE15');
            }
            updateCartUI();
        });
    }

    // EXPRESS PAY BUTTONS
    ['btn-apple-pay', 'btn-google-pay', 'btn-paypal'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                if (cart.length === 0) { showToast('⚠️ Tu carrito está vacío'); return; }
                showToast('🚀 Redirigiendo a Pago Express VIP...');
                setTimeout(() => {
                    alert('🎉 ¡PAGO EXPRESS EXITOSO! Pedido procesado con envío prioritario. Código: LX-EXPRESS99');
                    cart = [];
                    saveCart();
                    updateCartUI();
                    closeCartDrawer();
                }, 1000);
            });
        }
    });

    // CHECKOUT STANDARD
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            if (cart.length === 0) { showToast('⚠️ Tu carrito está vacío'); return; }
            showToast('💳 Procesando pago VIP seguro...');
            setTimeout(() => {
                alert('🎉 ¡PAGO REALIZADO CON ÉXITO! Tu pedido VIP ha sido procesado. Código de Rastreo: LX-9481230');
                cart = [];
                saveCart();
                updateCartUI();
                closeCartDrawer();
            }, 1200);
        });
    }

    // TOAST NOTIFICATIONS
    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>🛍️</span> <div>${message}</div>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-30px)';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    function startLivePurchaseToasts() {
        if (typeof LIVE_PURCHASES === 'undefined') return;
        let index = 0;
        setInterval(() => {
            const purchase = LIVE_PURCHASES[index % LIVE_PURCHASES.length];
            showToast(`<strong>${purchase.name}</strong> (${purchase.city}) compró <em>${purchase.product}</em> ${purchase.time}`);
            index++;
        }, 12000);
    }

    // VISTOS RECIENTEMENTE (TRACKING & RENDER)
    function addRecentlyViewed(id) {
        recentlyViewed = recentlyViewed.filter(item => item !== id);
        recentlyViewed.unshift(id);
        if (recentlyViewed.length > 4) recentlyViewed = recentlyViewed.slice(0, 4);
        localStorage.setItem('luxepaws_recently_viewed', JSON.stringify(recentlyViewed));
        renderRecentlyViewed();
    }

    function renderRecentlyViewed() {
        const container = document.getElementById('recently-viewed-grid');
        const section = document.getElementById('recently-viewed-section');
        if (!container || !section || typeof PRODUCTS === 'undefined' || recentlyViewed.length === 0) return;

        const items = recentlyViewed.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
        if (items.length === 0) { section.style.display = 'none'; return; }

        section.style.display = 'block';
        container.innerHTML = items.map(p => `
            <div class="recently-card" data-id="${p.id}">
                <img src="${p.image}" alt="${p.name}" class="recently-img">
                <div>
                    <div class="recently-title">${p.name.slice(0, 24)}...</div>
                    <div class="recently-price">${formatPrice(p.price)}</div>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.recently-card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = parseInt(card.dataset.id);
                if (productId) window.location.href = `product.html?id=${productId}`;
            });
        });
    }

    // FAQ ACCORDIONS RENDERER
    function renderFAQ() {
        const grid = document.getElementById('faq-grid');
        if (!grid || typeof FAQ_ITEMS === 'undefined') return;

        grid.innerHTML = FAQ_ITEMS.map(item => `
            <details class="faq-card">
                <summary>${item.question}</summary>
                <p>${item.answer}</p>
            </details>
        `).join('');
    }

    // ESCRIBIR RESEÑA MODAL
    const reviewModal = document.getElementById('add-review-modal');
    const btnOpenReviewModal = document.getElementById('btn-open-review-modal');
    const btnCloseReviewModal = document.getElementById('btn-close-review-modal');
    const reviewForm = document.getElementById('review-form');

    if (btnOpenReviewModal && reviewModal) btnOpenReviewModal.addEventListener('click', () => reviewModal.classList.add('active'));
    if (btnCloseReviewModal && reviewModal) btnCloseReviewModal.addEventListener('click', () => reviewModal.classList.remove('active'));

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const author = document.getElementById('review-author').value.trim();
            const city = document.getElementById('review-city').value.trim();
            const starsNum = parseInt(document.getElementById('review-stars-select').value);
            const comment = document.getElementById('review-comment').value.trim();

            const grid = document.getElementById('reviews-grid');
            if (grid) {
                const starsStr = '⭐'.repeat(starsNum);
                const newCard = document.createElement('div');
                newCard.className = 'review-card';
                newCard.innerHTML = `
                    <div class="review-user-info">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="${author}" class="user-avatar">
                        <div>
                            <div class="user-name">${author}</div>
                            <div class="user-city">${city}</div>
                        </div>
                    </div>
                    <div class="review-stars">${starsStr}</div>
                    <p class="review-text">"${comment}"</p>
                `;
                grid.prepend(newCard);
            }

            reviewForm.reset();
            reviewModal.classList.remove('active');
            showToast('🎉 ¡Gracias! Tu reseña VIP ha sido publicada.');
        });
    }

    // EXIT INTENT POPUP (CURSOR SALIENDO POR ARRIBA)
    const exitModal = document.getElementById('exit-intent-modal');
    const btnCloseExitModal = document.getElementById('btn-close-exit-modal');
    const btnClaimExitCoupon = document.getElementById('btn-claim-exit-coupon');

    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !exitModalShown && exitModal) {
            exitModalShown = true;
            exitModal.classList.add('active');
        }
    });

    if (btnCloseExitModal && exitModal) btnCloseExitModal.addEventListener('click', () => exitModal.classList.remove('active'));
    if (btnClaimExitCoupon) {
        btnClaimExitCoupon.addEventListener('click', () => {
            discountRate = 0.15;
            if (couponInput) couponInput.value = 'ROYALE15';
            updateCartUI();
            if (exitModal) exitModal.classList.remove('active');
            showToast('🎉 ¡Cupón ROYALE15 del 15% OFF aplicado!');
        });
    }

    // EVENTOS CÍRCULOS DE CATEGORÍAS 3D
    const circleItems = document.querySelectorAll('.category-circle-item');
    circleItems.forEach(item => {
        item.addEventListener('click', () => {
            circleItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentCategory = item.dataset.category;
            if (headerPetSwitcher) headerPetSwitcher.value = currentCategory;
            renderCatalog();
        });
    });

    if (headerPetSwitcher) {
        headerPetSwitcher.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            circleItems.forEach(item => {
                if (item.dataset.category === currentCategory) item.classList.add('active');
                else item.classList.remove('active');
            });
            renderCatalog();
        });
    }

    function renderFlashDeals() {
        const container = document.getElementById('flash-deals-container');
        if (!container || typeof PRODUCTS === 'undefined') return;

        const flashProducts = PRODUCTS.filter(p => p.isFlashSale);
        container.innerHTML = flashProducts.map(product => `
            <div class="flash-deal-card" data-id="${product.id}">
                <div class="flash-deal-img-box">
                    <img src="${product.image}" alt="${product.name}">
                    <span class="flash-deal-badge">-${product.discount}% OFF</span>
                </div>
                <div class="flash-deal-info">
                    <div class="flash-deal-title">${product.name.slice(0, 24)}...</div>
                    <div class="flash-deal-price-row">
                        <span class="price-current">${formatPrice(product.price)}</span>
                        <span class="price-original">${formatPrice(product.originalPrice)}</span>
                    </div>
                    <div class="flash-scarcity-bar-box">
                        <div class="flash-scarcity-text">🔥 Quedan solo ${product.stockLeft} unidades</div>
                        <div class="flash-scarcity-bar">
                            <div class="flash-scarcity-fill" style="width: ${Math.min(100, (1 - product.stockLeft / product.totalStock) * 100)}%;"></div>
                        </div>
                    </div>
                    <button class="btn-checkout btn-add-flash-deal" data-id="${product.id}" style="margin-top: 0; padding: 8px; font-size: 0.8rem;">
                        ⚡ Añadir a 1-Clic
                    </button>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.flash-deal-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn-add-flash-deal')) return;
                const productId = parseInt(card.dataset.id);
                if (productId) {
                    addRecentlyViewed(productId);
                    window.location.href = `product.html?id=${productId}`;
                }
            });
        });

        container.querySelectorAll('.btn-add-flash-deal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.id);
                addToCart(productId, 1);
            });
        });
    }

    const btnFlashPrev = document.getElementById('flash-nav-prev');
    const btnFlashNext = document.getElementById('flash-nav-next');
    const flashContainer = document.getElementById('flash-deals-container');

    if (btnFlashPrev && flashContainer) {
        btnFlashPrev.addEventListener('click', () => {
            flashContainer.scrollBy({ left: -260, behavior: 'smooth' });
        });
    }
    if (btnFlashNext && flashContainer) {
        btnFlashNext.addEventListener('click', () => {
            flashContainer.scrollBy({ left: 260, behavior: 'smooth' });
        });
    }

    function startFlashSaleTimer() {
        const hoursEl = document.getElementById('timer-hours');
        const minutesEl = document.getElementById('timer-minutes');
        const secondsEl = document.getElementById('timer-seconds');

        const heroHoursEl = document.getElementById('hero-flash-hours');
        const heroMinutesEl = document.getElementById('hero-flash-minutes');
        const heroSecondsEl = document.getElementById('hero-flash-seconds');

        let totalSeconds = 4 * 3600 + 18 * 60 + 42;
        setInterval(() => {
            if (totalSeconds <= 0) totalSeconds = 24 * 3600;
            else totalSeconds--;

            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;

            const hStr = String(h).padStart(2, '0');
            const mStr = String(m).padStart(2, '0');
            const sStr = String(s).padStart(2, '0');

            if (hoursEl) hoursEl.textContent = hStr;
            if (minutesEl) minutesEl.textContent = mStr;
            if (secondsEl) secondsEl.textContent = sStr;

            if (heroHoursEl) heroHoursEl.textContent = hStr;
            if (heroMinutesEl) heroMinutesEl.textContent = mStr;
            if (heroSecondsEl) heroSecondsEl.textContent = sStr;
        }, 1000);
    }

    // INICIALIZACIÓN
    renderRandomAerisCards();
    updateAeris(0);
    startAerisAutoplay();
    renderFlashDeals();
    startFlashSaleTimer();
    startDispatchUrgencyTimer();
    startLivePurchaseToasts();
    renderFAQ();
    renderShoppableInstagram();
    renderRecentlyViewed();

    renderCatalog();
    updateCartUI();
});
