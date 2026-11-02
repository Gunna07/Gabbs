/**
 * GABBS LUXURY STOREFRONT - MAIN JAVASCRIPT
 * Handles:
 * - Category Carousel (Swiper.js setup)
 * - Interactive Shopping Bag Slide-Over Drawer
 * - Product Quick-View Modal
 * - Product Category Filtering
 * - Mobile Menu Overlay & Focus Management
 * - Toast Notification System
 * - Newsletter Subscription Handling
 * - Owner Placeholder Inspection Toggle
 * - Back to Top Button
 */

(function () {
  'use strict';

  // State Management
  const state = {
    cart: [
      {
        id: 'gabbs-01',
        title: 'Village Market Smoked Bush Meat & Spice Bundle',
        category: 'Gabbs Village Market',
        price: 18500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'gabbs-03',
        title: 'Scent Haven Signature Eau de Parfum',
        category: 'Fashion & Scent Haven',
        price: 35000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80'
      }
    ],
    quickViewProduct: null
  };

  /* ==========================================================================
     1. TOAST NOTIFICATION SYSTEM
     ========================================================================== */
  function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');

    const icon = type === 'success' 
      ? `<svg class="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`
      : `<svg class="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

    toast.innerHTML = `
      ${icon}
      <span class="text-xs tracking-wider uppercase">${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  /* ==========================================================================
     2. CATEGORY CAROUSEL (SWIPER.JS)
     ========================================================================== */
  function initCategorySwiper() {
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper not available.');
      return;
    }

    const swiperContainer = document.querySelector('.category-swiper');
    if (!swiperContainer) return;

    new Swiper(swiperContainer, {
      slidesPerView: 1.15,
      spaceBetween: 16,
      grabCursor: true,
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      navigation: {
        nextEl: '.category-next',
        prevEl: '.category-prev',
      },
      pagination: {
        el: '.category-pagination',
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2.2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3.3,
          spaceBetween: 28,
        },
        1440: {
          slidesPerView: 4.2,
          spaceBetween: 32,
        }
      }
    });
  }

  /* ==========================================================================
     3. SHOPPING BAG / CART DRAWER
     ========================================================================== */
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartPanel = document.getElementById('cart-panel');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartCountBadges = document.querySelectorAll('.cart-count-badge');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const openCartBtns = document.querySelectorAll('.open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const checkoutBtn = document.getElementById('checkout-btn');

  function updateCartUI() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCountBadges.forEach(badge => {
      badge.textContent = totalCount;
      if (totalCount > 0) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });

    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = `₦${subtotal.toLocaleString('en-NG')}`;
    }

    if (!cartItemsContainer) return;

    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="h-64 flex flex-col items-center justify-center text-center p-6 text-warm-subtle">
          <svg class="w-12 h-12 mb-4 text-warm-subtle/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p class="font-serif-luxury text-lg text-ivory mb-2">Your Bag is Empty</p>
          <p class="text-xs text-warm-subtle max-w-xs mb-6">Discover our curated offerings across gourmet food, apparel, and exquisite objects.</p>
          <button type="button" class="btn-ghost-luxury text-xs py-2 px-5 close-cart-btn">Explore Collections</button>
        </div>
      `;
      const exploreBtn = cartItemsContainer.querySelector('.close-cart-btn');
      if (exploreBtn) exploreBtn.addEventListener('click', closeCart);
      return;
    }

    cartItemsContainer.innerHTML = state.cart.map(item => `
      <div class="flex items-center gap-4 py-4 border-b border-surface-border/50 group" data-item-id="${item.id}">
        <div class="w-16 h-20 bg-surface flex-shrink-0 overflow-hidden rounded border border-surface-border">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        </div>
        <div class="flex-grow">
          <span class="text-[10px] tracking-widest uppercase text-gold block mb-0.5">${item.category}</span>
          <h4 class="text-sm font-serif-luxury text-ivory line-clamp-1">${item.title}</h4>
          <span class="text-xs text-warm-text font-medium mt-1 block">₦${item.price.toLocaleString('en-NG')}</span>
          <div class="flex items-center gap-3 mt-2">
            <div class="flex items-center border border-surface-border rounded px-1.5 py-0.5 bg-black/40">
              <button class="cart-qty-btn text-xs px-1 text-warm-subtle hover:text-ivory" data-action="dec" data-id="${item.id}" aria-label="Decrease quantity">-</button>
              <span class="text-xs px-2 text-ivory font-mono">${item.quantity}</span>
              <button class="cart-qty-btn text-xs px-1 text-warm-subtle hover:text-ivory" data-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
            <button class="cart-remove-btn text-[11px] text-warm-subtle hover:text-red-400 transition-colors uppercase tracking-wider" data-id="${item.id}">Remove</button>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-medium text-ivory">₦${(item.price * item.quantity).toLocaleString('en-NG')}</span>
        </div>
      </div>
    `).join('');

    // Attach listeners
    cartItemsContainer.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const action = e.currentTarget.getAttribute('data-action');
        const targetItem = state.cart.find(it => it.id === id);
        if (targetItem) {
          if (action === 'inc') {
            targetItem.quantity++;
          } else if (action === 'dec') {
            targetItem.quantity--;
            if (targetItem.quantity <= 0) {
              state.cart = state.cart.filter(it => it.id !== id);
            }
          }
          updateCartUI();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const itemToRemove = state.cart.find(it => it.id === id);
        state.cart = state.cart.filter(it => it.id !== id);
        updateCartUI();
        if (itemToRemove) {
          showToast(`Removed "${itemToRemove.title}" from bag`);
        }
      });
    });
  }

  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    updateCartUI();
    requestAnimationFrame(() => {
      cartBackdrop.classList.remove('opacity-0');
      cartPanel.classList.remove('translate-x-full');
    });
  }

  function closeCart() {
    if (!cartDrawer) return;
    cartBackdrop.classList.add('opacity-0');
    cartPanel.classList.add('translate-x-full');
    setTimeout(() => {
      cartDrawer.classList.add('hidden');
      document.body.style.overflow = '';
    }, 350);
  }

  openCartBtns.forEach(btn => btn.addEventListener('click', openCart));
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (state.cart.length === 0) {
        showToast('Your bag is currently empty.');
        return;
      }
      showToast('Connecting with Gabbs Asaba delivery desk...', 'success');
      setTimeout(() => {
        closeCart();
      }, 1000);
    });
  }

  // Add to cart buttons across all products
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-to-cart-trigger');
    if (addBtn) {
      e.preventDefault();
      const id = addBtn.getAttribute('data-id') || 'item-' + Date.now();
      const title = addBtn.getAttribute('data-title') || 'Curated Object';
      const price = parseFloat(addBtn.getAttribute('data-price') || '120');
      const category = addBtn.getAttribute('data-category') || 'Curated Selection';
      const image = addBtn.getAttribute('data-image') || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';

      const existing = state.cart.find(item => item.id === id);
      if (existing) {
        existing.quantity++;
      } else {
        state.cart.push({ id, title, price, category, image, quantity: 1 });
      }

      updateCartUI();
      showToast(`Added "${title}" to bag`, 'success');

      // Subtle gold button pulse
      addBtn.classList.add('scale-95');
      setTimeout(() => addBtn.classList.remove('scale-95'), 200);
    }
  });

  /* ==========================================================================
     4. PRODUCT QUICK VIEW MODAL
     ========================================================================== */
  const quickViewModal = document.getElementById('quick-view-modal');
  const quickViewBackdrop = document.getElementById('quick-view-backdrop');
  const closeQuickViewBtn = document.getElementById('close-quick-view-btn');

  function openQuickView(productData) {
    if (!quickViewModal) return;

    document.getElementById('qv-title').textContent = productData.title;
    document.getElementById('qv-category').textContent = productData.category;
    document.getElementById('qv-price').textContent = `₦${parseFloat(productData.price).toLocaleString('en-NG')}`;
    document.getElementById('qv-description').textContent = productData.desc || 'An exemplar of intentional craftsmanship, selected for discerning connoisseurs of form and substance.';
    document.getElementById('qv-image').src = productData.image;
    document.getElementById('qv-image').alt = productData.title;

    // Set Add to Bag button data
    const qvAddBtn = document.getElementById('qv-add-btn');
    if (qvAddBtn) {
      qvAddBtn.setAttribute('data-id', productData.id);
      qvAddBtn.setAttribute('data-title', productData.title);
      qvAddBtn.setAttribute('data-price', productData.price);
      qvAddBtn.setAttribute('data-category', productData.category);
      qvAddBtn.setAttribute('data-image', productData.image);
    }

    quickViewModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      quickViewBackdrop.classList.remove('opacity-0');
      document.getElementById('qv-card').classList.remove('scale-95', 'opacity-0');
    });
  }

  function closeQuickView() {
    if (!quickViewModal) return;
    quickViewBackdrop.classList.add('opacity-0');
    document.getElementById('qv-card').classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      quickViewModal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }

  document.addEventListener('click', (e) => {
    const qvBtn = e.target.closest('.quick-view-trigger');
    if (qvBtn) {
      e.preventDefault();
      const productCard = qvBtn.closest('.product-grid-card');
      if (productCard) {
        const id = productCard.getAttribute('data-id');
        const title = productCard.getAttribute('data-title');
        const price = productCard.getAttribute('data-price');
        const category = productCard.getAttribute('data-category');
        const desc = productCard.getAttribute('data-desc');
        const imgEl = productCard.querySelector('img');
        const image = imgEl ? imgEl.src : '';

        openQuickView({ id, title, price, category, desc, image });
      }
    }
  });

  if (closeQuickViewBtn) closeQuickViewBtn.addEventListener('click', closeQuickView);
  if (quickViewBackdrop) quickViewBackdrop.addEventListener('click', closeQuickView);

  // Global ESC key listener for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (cartDrawer && !cartDrawer.classList.contains('hidden')) closeCart();
      if (quickViewModal && !quickViewModal.classList.contains('hidden')) closeQuickView();
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     5. PRODUCT GRID FILTERING
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.product-filter-btn');
  const productCards = document.querySelectorAll('.product-grid-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-gold', 'text-surface', 'border-gold');
        b.classList.add('text-warm-subtle', 'border-surface-border');
      });
      btn.classList.add('bg-gold', 'text-surface', 'border-gold');
      btn.classList.remove('text-warm-subtle', 'border-surface-border');

      const filterValue = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const cardCat = card.getAttribute('data-category-tag');
        if (filterValue === 'all' || cardCat === filterValue) {
          card.style.display = '';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     6. MOBILE MENU OVERLAY
     ========================================================================== */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-menu-icon');

  function openMobileMenu() {
    if (!mobileMenuOverlay) return;
    mobileMenuOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    hamburgerIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');

    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.mobile-menu-item', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out', delay: 0.1 }
      );
    }
  }

  function closeMobileMenu() {
    if (!mobileMenuOverlay || mobileMenuOverlay.classList.contains('hidden')) return;
    hamburgerIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      if (mobileMenuOverlay.classList.contains('hidden')) {
        openMobileMenu();
      } else {
        closeMobileMenu();
      }
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ==========================================================================
     7. NEWSLETTER SUBSCRIPTION
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value.trim() !== '') {
        showToast('Welcome to Gabbs Ultramart updates!', 'success');
        input.value = '';
      }
    });
  }

  /* ==========================================================================
     8. OWNER PLACEHOLDER INSPECTION TOGGLE
     ========================================================================== */
  const placeholderToggleBtn = document.getElementById('placeholder-toggle-btn');
  if (placeholderToggleBtn) {
    placeholderToggleBtn.addEventListener('click', () => {
      const isShowing = document.body.classList.toggle('show-placeholders');
      placeholderToggleBtn.classList.toggle('bg-gold/20', isShowing);
      placeholderToggleBtn.classList.toggle('border-gold', isShowing);
      showToast(isShowing ? 'Owner placeholder outlines enabled' : 'Owner placeholder outlines hidden');
    });
  }

  /* ==========================================================================
     9. BACK TO TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Initialize Swiper on DOM readiness
  initCategorySwiper();
  updateCartUI();
})();
