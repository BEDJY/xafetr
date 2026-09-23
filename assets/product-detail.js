// LuxePaws Royale - Lógica Dedicada para product.html (PDP Standalone Page)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener ID del producto desde la URL (?id=X)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;

    let product = typeof PRODUCTS !== 'undefined' ? PRODUCTS.find(p => p.id === productId) : null;
    if (!product && typeof PRODUCTS !== 'undefined') product = PRODUCTS[0];
    if (!product) return;

    // Estado local del producto
    let selectedColor = product.colors ? product.colors[0].name : null;
    let selectedSize = product.sizes ? product.sizes[0] : null;
    let currentQty = 1;
    let isEngraved = false;

    // Estado global de la tienda
    let cart = JSON.parse(localStorage.getItem('luxepaws_cart')) || [];
    let wishlist = new Set(JSON.parse(localStorage.getItem('luxepaws_wishlist')) || []);
    let userPoints = parseInt(localStorage.getItem('luxepaws_user_points')) || 240;
    let currentCurrency = localStorage.getItem('luxepaws_currency') || 'USD';
    let currentTheme = localStorage.getItem('luxepaws_theme') || 'light';
    let discountRate = 0;

    // Tema y Moneda
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
            renderPDP();
            updateCartUI();
            renderRelatedProducts();
            showToast(`💱 Moneda cambiada a ${currentCurrency}`);
        });
    }

    function formatPrice(amountUSD) {
        if (typeof CURRENCIES === 'undefined' || !CURRENCIES[currentCurrency]) return `$${amountUSD.toFixed(2)}`;
        const curr = CURRENCIES[currentCurrency];
        const converted = amountUSD * curr.rate;
        if (currentCurrency === 'COP') return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
        return `${curr.symbol}${converted.toFixed(2)}`;
    }

    // 2. RENDER PDP DATA
    function renderPDP() {
        document.title = `${product.name} | LuxePaws Royale`;

        // Breadcrumbs & Badges
        const categoryBreadcrumb = document.getElementById('pdp-category-breadcrumb');
        const titleBreadcrumb = document.getElementById('pdp-title-breadcrumb');
        if (categoryBreadcrumb) categoryBreadcrumb.textContent = product.species.toUpperCase();
        if (titleBreadcrumb) titleBreadcrumb.textContent = product.name;

        const mainImg = document.getElementById('pdp-main-img');
        const discountBadge = document.getElementById('pdp-discount-badge');
        const earnedPoints = document.getElementById('pdp-earned-points');
        const badgeTag = document.getElementById('pdp-badge-tag');

        if (mainImg) mainImg.src = product.image;
        if (discountBadge) discountBadge.textContent = `-${product.discount}%`;
        if (earnedPoints) earnedPoints.textContent = `👑 +${Math.floor(product.price * 10)} Pts Royale`;
        if (badgeTag) badgeTag.textContent = product.badge;

        // Info básica
        const titleEl = document.getElementById('pdp-product-title');
        const ratingStars = document.getElementById('pdp-rating-stars');
        const reviewsCount = document.getElementById('pdp-reviews-count');
        const priceCurrent = document.getElementById('pdp-price-current');
        const priceOriginal = document.getElementById('pdp-price-original');
        const descEl = document.getElementById('pdp-description');

        if (titleEl) titleEl.textContent = product.name;
        if (ratingStars) ratingStars.textContent = `⭐ ${product.rating.toFixed(1)}`;
        if (reviewsCount) reviewsCount.textContent = `(${product.reviewsCount} reseñas de clientes VIP)`;
        if (priceCurrent) priceCurrent.textContent = formatPrice(product.price);
        if (priceOriginal) priceOriginal.textContent = formatPrice(product.originalPrice);
        if (descEl) descEl.textContent = product.description;

        // Miniaturas Galería
        const thumbsContainer = document.getElementById('pdp-gallery-thumbs');
        if (thumbsContainer) {
            const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
            thumbsContainer.innerHTML = gallery.map((imgUrl, i) => `
                <img src="${imgUrl}" alt="Vista" class="modal-thumb ${i === 0 ? 'active' : ''}">
            `).join('');

            thumbsContainer.querySelectorAll('.modal-thumb').forEach(thumb => {
                thumb.addEventListener('click', () => {
                    thumbsContainer.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    if (mainImg) mainImg.src = thumb.src;
                });
            });
        }

        // Swatches de Color
        const colorContainer = document.getElementById('pdp-color-swatches');
        const selectedColorLabel = document.getElementById('pdp-selected-color');
        if (colorContainer && product.colors) {
            if (selectedColorLabel) selectedColorLabel.textContent = product.colors[0].name;
            colorContainer.innerHTML = product.colors.map((c, i) => `
                <div class="color-swatch-item ${i === 0 ? 'active' : ''}" style="background-color: ${c.hex};" data-name="${c.name}" title="${c.name}"></div>
            `).join('');

            colorContainer.querySelectorAll('.color-swatch-item').forEach(swatch => {
                swatch.addEventListener('click', () => {
                    colorContainer.querySelectorAll('.color-swatch-item').forEach(s => s.classList.remove('active'));
                    swatch.classList.add('active');
                    selectedColor = swatch.dataset.name;
                    if (selectedColorLabel) selectedColorLabel.textContent = selectedColor;
                });
            });
        }

        // Cápsulas de Talla
        const sizeContainer = document.getElementById('pdp-size-capsules');
        const selectedSizeLabel = document.getElementById('pdp-selected-size');
        if (sizeContainer && product.sizes) {
            if (selectedSizeLabel) selectedSizeLabel.textContent = product.sizes[0];
            sizeContainer.innerHTML = product.sizes.map((s, i) => `
                <div class="size-capsule-item ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</div>
            `).join('');

            sizeContainer.querySelectorAll('.size-capsule-item').forEach(capsule => {
                capsule.addEventListener('click', () => {
                    sizeContainer.querySelectorAll('.size-capsule-item').forEach(c => c.classList.remove('active'));
                    capsule.classList.add('active');
                    selectedSize = capsule.dataset.size;
                    if (selectedSizeLabel) selectedSizeLabel.textContent = selectedSize;
                });
            });
        }

        // Specs Acordiones
        const accShip = document.getElementById('pdp-acc-shipping');
        const accMat = document.getElementById('pdp-acc-material');
        if (accShip && product.specs) accShip.textContent = product.specs.shipping;
        if (accMat && product.specs) accMat.textContent = product.specs.material;
    }

    // Grabado en vivo sobre imagen PDP
    const engCheck = document.getElementById('pdp-engraving-check');
    const engInputs = document.getElementById('pdp-engraving-inputs');
    const engName = document.getElementById('pdp-engraving-name');
    const engPreview = document.getElementById('pdp-engraving-preview');

    if (engCheck && engInputs && engPreview) {
        engCheck.addEventListener('change', (e) => {
            isEngraved = e.target.checked;
            if (isEngraved) {
                engInputs.style.display = 'flex';
                engPreview.classList.add('active');
                if (engName) engPreview.textContent = engName.value.trim().toUpperCase() || 'TU MASCOTA';
            } else {
                engInputs.style.display = 'none';
                engPreview.classList.remove('active');
            }
        });
    }

    if (engName && engPreview) {
        engName.addEventListener('input', (e) => {
            const val = e.target.value.trim().toUpperCase();
            engPreview.textContent = val || 'TU MASCOTA';
        });
    }

    // Control de Cantidad
    const qtyVal = document.getElementById('pdp-qty-val');
    const qtyMinus = document.getElementById('pdp-qty-minus');
    const qtyPlus = document.getElementById('pdp-qty-plus');

    if (qtyMinus) {
        qtyMinus.addEventListener('click', () => {
            if (currentQty > 1) { currentQty--; if (qtyVal) qtyVal.textContent = currentQty; }
        });
    }
    if (qtyPlus) {
        qtyPlus.addEventListener('click', () => {
            currentQty++; if (qtyVal) qtyVal.textContent = currentQty;
        });
    }

    // Botón Agregar al Carrito PDP
    const btnAddToCartPDP = document.getElementById('pdp-add-to-cart-btn');
    if (btnAddToCartPDP) {
        btnAddToCartPDP.addEventListener('click', () => {
            const engravedName = isEngraved && engName ? engName.value.trim().toUpperCase() : null;
            addToCart(product.id, currentQty, { size: selectedSize, color: selectedColor, engravedName });
        });
    }

    // Urgencia de Despacho Ticker
    function startDispatchUrgencyTimer() {
        const timerEl = document.getElementById('pdp-dispatch-timer');
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

    // 3. CARRITO DE COMPRAS
    function addToCart(pId, qty = 1, options = {}) {
        if (typeof PRODUCTS === 'undefined') return;
        let prod = PRODUCTS.find(p => p.id === pId);
        if (!prod) return;

        const size = options.size || (prod.sizes ? prod.sizes[0] : null);
        const color = options.color || (prod.colors ? prod.colors[0].name : null);
        const engravedName = options.engravedName || null;
        const cartItemId = `${prod.id}-${size || 'default'}-${color || 'default'}-${engravedName || 'none'}`;

        const existing = cart.find(item => item.cartItemId === cartItemId);
        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({
                cartItemId,
                id: prod.id,
                name: prod.name,
                price: prod.price,
                image: prod.image,
                size,
                color,
                engravedName,
                qty
            });
        }

        const pointsEarned = Math.floor(prod.price * 10 * qty);
        userPoints += pointsEarned;
        updatePointsDisplay();

        saveCart();
        updateCartUI();
        openCartDrawer();
        showToast(`✨ ¡'${prod.name.slice(0, 18)}...' al carrito! (+${pointsEarned} Pts)`);
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

    function saveCart() { localStorage.setItem('luxepaws_cart', JSON.stringify(cart)); }

    const cartBadge = document.getElementById('cart-badge');
    const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    const cartBtn = document.getElementById('cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartView = document.getElementById('empty-cart-view');
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const totalEl = document.getElementById('cart-total');

    function openCartDrawer() { if (cartDrawerOverlay) cartDrawerOverlay.classList.add('active'); }
    function closeCartDrawer() { if (cartDrawerOverlay) cartDrawerOverlay.classList.remove('active'); }
    if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeCartDrawer);

    function updateCartUI() {
        if (!cartBadge) return;
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartBadge.textContent = totalItems;
        const dockBadge = document.getElementById('dock-cart-badge');
        if (dockBadge) dockBadge.textContent = totalItems;

        const rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const discountAmount = rawSubtotal * discountRate;
        const total = rawSubtotal - discountAmount;

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
        if (discountEl) discountEl.textContent = discountRate > 0 ? `-${formatPrice(discountAmount)}` : '$0.00';
        if (totalEl) totalEl.textContent = formatPrice(total);

        // Termómetro Envío Gratis
        const freeShippingProgress = document.getElementById('free-shipping-progress');
        const freeShippingText = document.getElementById('free-shipping-text');
        if (freeShippingProgress && freeShippingText) {
            const targetAmount = 50.0;
            const progressPercent = Math.min(100, (rawSubtotal / targetAmount) * 100);
            freeShippingProgress.style.width = `${progressPercent}%`;
            if (rawSubtotal >= targetAmount) {
                freeShippingText.innerHTML = `🎉 ¡FELICIDADES! Tienes <strong>Envío Express GRATIS</strong> 🚀`;
            } else {
                const remaining = (targetAmount - rawSubtotal).toFixed(2);
                freeShippingText.innerHTML = `¡Agrega <strong>$${remaining}</strong> más para Envío Express GRATIS! 🚚`;
            }
        }
    }

    // 4. PRODUCTOS RELACIONADOS
    function renderRelatedProducts() {
        const container = document.getElementById('pdp-related-grid');
        if (!container || typeof PRODUCTS === 'undefined') return;

        const related = PRODUCTS.filter(p => p.id !== product.id && (p.species === product.species || p.category === product.category)).slice(0, 4);
        container.innerHTML = related.map(p => `
            <div class="recently-card" onclick="window.location.href='product.html?id=${p.id}'">
                <img src="${p.image}" alt="${p.name}" class="recently-img">
                <div>
                    <div class="recently-title">${p.name.slice(0, 24)}...</div>
                    <div class="recently-price">${formatPrice(p.price)}</div>
                </div>
            </div>
        `).join('');
    }

    // Express Checkout
    ['pdp-apple-pay', 'pdp-google-pay', 'pdp-paypal'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                showToast('🚀 Redirigiendo a Pago Express VIP...');
                setTimeout(() => {
                    alert('🎉 ¡PAGO EXPRESS EXITOSO! Pedido procesado con envío prioritario.');
                }, 1000);
            });
        }
    });

    // Modal Guía de Tallas
    const sizeGuideModal = document.getElementById('size-guide-modal');
    const btnOpenSizeGuide = document.getElementById('btn-open-size-guide-pdp');
    const btnCloseSizeGuide = document.getElementById('btn-close-size-guide');
    if (btnOpenSizeGuide && sizeGuideModal) btnOpenSizeGuide.addEventListener('click', () => sizeGuideModal.classList.add('active'));
    if (btnCloseSizeGuide && sizeGuideModal) btnCloseSizeGuide.addEventListener('click', () => sizeGuideModal.classList.remove('active'));

    // Toasts
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

    // INICIALIZACIÓN PDP
    renderPDP();
    startDispatchUrgencyTimer();
    renderRelatedProducts();
    updateCartUI();
});
