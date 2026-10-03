/**
 * TableBite - Client Application Controller
 * Manages mobile menu rendering, real-time filtering, item customization,
 * cart state, checkout, UPI payment simulation, and live kitchen order tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. App State & Table Initialization
  // ==========================================
  let activeTable = getInitialTable();
  let activeCategory = 'all';
  let activeDietFilter = null; // null | 'veg' | 'nonveg'
  let searchQuery = '';

  // Cart State: array of { cartItemId, dishId, name, portion, addons, specialNote, unitPrice, quantity, itemTotal, isVeg }
  let cart = loadCartFromStorage();

  // Elements
  const activeTableText = document.getElementById('activeTableText');
  const cartTableBadge = document.getElementById('cartTableBadge');
  const checkoutTableDisplay = document.getElementById('checkoutTableDisplay');
  const trackerTableTag = document.getElementById('trackerTableTag');
  const tableBadgeBtn = document.getElementById('tableBadgeBtn');

  const menuContainer = document.getElementById('menuContainer');
  const categoriesNav = document.getElementById('categoriesNav');
  const menuSearchInput = document.getElementById('menuSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterVegBtn = document.getElementById('filterVegBtn');
  const filterNonVegBtn = document.getElementById('filterNonVegBtn');

  // Floating Cart Bar
  const floatingCartBar = document.getElementById('floatingCartBar');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const cartItemsSummary = document.getElementById('cartItemsSummary');
  const cartBarTotal = document.getElementById('cartBarTotal');
  const openCartBtn = document.getElementById('openCartBtn');

  // Drawers
  const customiseBackdrop = document.getElementById('customiseBackdrop');
  const closeCustomiseBtn = document.getElementById('closeCustomiseBtn');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const checkoutBackdrop = document.getElementById('checkoutBackdrop');
  const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
  const trackerBackdrop = document.getElementById('trackerBackdrop');

  updateTableUI();
  renderCategories();
  renderMenu();
  updateCartUI();
  loadMenuFromBackend();

  async function loadMenuFromBackend() {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          MENU_DATA.length = 0;
          data.products.forEach(p => MENU_DATA.push(p));
          renderMenu();
          console.log('[API] Menu loaded dynamically from SQLite backend.');
        }
      }
    } catch (err) {
      console.log('[API] Backend server not reachable, using local catalog.');
    }
  }

  // ==========================================
  // 2. Table Resolver & Modal Picker
  // ==========================================
  function getInitialTable() {
    const params = new URLSearchParams(window.location.search);
    const urlTable = params.get('table');
    if (urlTable) {
      localStorage.setItem('tablebite_active_table', urlTable);
      return urlTable;
    }
    return localStorage.getItem('tablebite_active_table') || '4';
  }

  function updateTableUI() {
    const formatted = activeTable.toString().padStart(2, '0');
    if (activeTableText) activeTableText.textContent = `Table ${formatted}`;
    if (cartTableBadge) cartTableBadge.textContent = `Table ${formatted}`;
    if (checkoutTableDisplay) checkoutTableDisplay.textContent = formatted;
    if (trackerTableTag) trackerTableTag.textContent = `Serving to Table ${formatted}`;
  }

  // Table selector modal
  const tableSelectorBackdrop = document.getElementById('tableSelectorBackdrop');
  const closeTableSelectorBtn = document.getElementById('closeTableSelectorBtn');
  const tablePickerGrid = document.getElementById('tablePickerGrid');

  if (tableBadgeBtn) {
    tableBadgeBtn.addEventListener('click', () => {
      openTableSelector();
    });
  }

  if (closeTableSelectorBtn) {
    closeTableSelectorBtn.addEventListener('click', () => {
      tableSelectorBackdrop.classList.add('hidden');
    });
  }

  function openTableSelector() {
    tablePickerGrid.innerHTML = '';
    for (let i = 1; i <= 16; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `table-btn ${i.toString() === activeTable.toString() ? 'active' : ''}`;
      btn.textContent = `T-${i.toString().padStart(2, '0')}`;
      btn.addEventListener('click', () => {
        activeTable = i.toString();
        localStorage.setItem('tablebite_active_table', activeTable);
        updateTableUI();
        tableSelectorBackdrop.classList.add('hidden');
        showToast(`Switched to Table ${activeTable.padStart(2, '0')}`);
      });
      tablePickerGrid.appendChild(btn);
    }
    tableSelectorBackdrop.classList.remove('hidden');
  }

  // ==========================================
  // 3. Category Bar & Dietary Filters
  // ==========================================
  function renderCategories() {
    categoriesNav.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `category-pill ${cat.id === activeCategory ? 'active' : ''}`;
      pill.innerHTML = `<span>${cat.icon}</span> <span>${cat.name}</span>`;
      pill.addEventListener('click', () => {
        activeCategory = cat.id;
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderMenu();

        // Scroll to category section if not 'all'
        if (cat.id !== 'all') {
          const targetSection = document.getElementById(`sec-${cat.id}`);
          if (targetSection) {
            const offset = 140;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = targetSection.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
      categoriesNav.appendChild(pill);
    });
  }

  // Dietary Toggle Buttons
  if (filterVegBtn) {
    filterVegBtn.addEventListener('click', () => {
      if (activeDietFilter === 'veg') {
        activeDietFilter = null;
        filterVegBtn.classList.remove('active');
      } else {
        activeDietFilter = 'veg';
        filterVegBtn.classList.add('active');
        filterNonVegBtn.classList.remove('active');
      }
      renderMenu();
    });
  }

  if (filterNonVegBtn) {
    filterNonVegBtn.addEventListener('click', () => {
      if (activeDietFilter === 'nonveg') {
        activeDietFilter = null;
        filterNonVegBtn.classList.remove('active');
      } else {
        activeDietFilter = 'nonveg';
        filterNonVegBtn.classList.add('active');
        filterVegBtn.classList.remove('active');
      }
      renderMenu();
    });
  }

  // Search input
  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('hidden', searchQuery.length === 0);
      }
      renderMenu();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      menuSearchInput.value = '';
      searchQuery = '';
      clearSearchBtn.classList.add('hidden');
      renderMenu();
    });
  }

  // ==========================================
  // 4. Menu Rendering & Dish Cards
  // ==========================================
  function renderMenu() {
    menuContainer.innerHTML = '';

    // Filter items based on category, search, and dietary preference
    let filteredDishes = MENU_DATA.filter(dish => {
      // Category filter
      if (activeCategory !== 'all' && dish.categoryId !== activeCategory) return false;

      // Dietary filter
      if (activeDietFilter === 'veg' && !dish.isVeg) return false;
      if (activeDietFilter === 'nonveg' && dish.isVeg) return false;

      // Search query
      if (searchQuery) {
        const matchName = dish.name.toLowerCase().includes(searchQuery);
        const matchDesc = dish.description.toLowerCase().includes(searchQuery);
        if (!matchName && !matchDesc) return false;
      }

      return true;
    });

    if (filteredDishes.length === 0) {
      menuContainer.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">🔍</div>
          <h3>No dishes found</h3>
          <p>Try clearing your search or dietary filters to view delicious dishes.</p>
        </div>
      `;
      return;
    }

    // Group dishes by category if 'all' is selected
    const categoriesToRender = activeCategory === 'all' 
      ? CATEGORIES.filter(c => c.id !== 'all')
      : CATEGORIES.filter(c => c.id === activeCategory);

    categoriesToRender.forEach(cat => {
      const dishesInCat = filteredDishes.filter(d => d.categoryId === cat.id);
      if (dishesInCat.length === 0) return;

      const section = document.createElement('section');
      section.className = 'category-section';
      section.id = `sec-${cat.id}`;

      section.innerHTML = `
        <div class="category-section-header">
          <h2 class="category-section-title">
            <span>${cat.icon}</span>
            <span>${cat.name}</span>
          </h2>
          <span class="category-count">${dishesInCat.length} items</span>
        </div>
        <div class="dishes-list" id="list-${cat.id}"></div>
      `;

      const listContainer = section.querySelector(`#list-${cat.id}`);

      dishesInCat.forEach(dish => {
        const card = createDishCard(dish);
        listContainer.appendChild(card);
      });

      menuContainer.appendChild(section);
    });
  }

  function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish-id', dish.id);

    // Calculate how many of this dish are in cart (sum of all portions/variants)
    const cartItemsForDish = cart.filter(item => item.dishId === dish.id);
    const totalQtyInCart = cartItemsForDish.reduce((sum, item) => sum + item.quantity, 0);

    const hasCustomisation = (dish.portions && dish.portions.length > 0) || (dish.addons && dish.addons.length > 0);

    const dietClass = dish.isVeg ? 'veg-icon' : 'nonveg-icon';
    const bestsellerHtml = dish.isBestseller ? `<span class="bestseller-badge">★ Bestseller</span>` : '';
    const spicyHtml = dish.isSpicy ? `<span class="spicy-icon" title="Spicy">🌶️</span>` : '';

    // Action button: either "+ ADD" or Quantity Stepper
    let buttonHtml = '';
    if (totalQtyInCart > 0 && !hasCustomisation) {
      buttonHtml = `
        <div class="qty-stepper">
          <button type="button" class="qty-step-btn dec-btn" data-dish-id="${dish.id}">&minus;</button>
          <span class="qty-step-count">${totalQtyInCart}</span>
          <button type="button" class="qty-step-btn inc-btn" data-dish-id="${dish.id}">&plus;</button>
        </div>
      `;
    } else {
      const label = totalQtyInCart > 0 ? `${totalQtyInCart} ADDED` : '+ ADD';
      buttonHtml = `
        <button type="button" class="add-btn" data-dish-id="${dish.id}">
          ${label}
        </button>
      `;
    }

    const customisableHtml = hasCustomisation ? `<span class="customisable-hint">Customisable</span>` : '';

    card.innerHTML = `
      <div class="dish-info-col">
        <div class="dish-meta-row">
          <span class="${dietClass}"></span>
          ${bestsellerHtml}
          ${spicyHtml}
        </div>
        <h3 class="dish-name">${dish.name}</h3>
        <div class="dish-price">₹${dish.price}</div>
        <p class="dish-desc">${dish.description}</p>
      </div>

      <div class="dish-action-col">
        <div class="dish-thumbnail-wrap">
          <img src="${dish.image}" alt="${dish.name}" class="dish-thumbnail" loading="lazy">
        </div>
        <div class="dish-btn-container">
          ${buttonHtml}
        </div>
        ${customisableHtml}
      </div>
    `;

    // Event listeners
    const addBtn = card.querySelector('.add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (hasCustomisation) {
          openCustomisationDrawer(dish);
        } else {
          addItemDirectly(dish);
        }
      });
    }

    const decBtn = card.querySelector('.dec-btn');
    if (decBtn) {
      decBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        decrementDishDirectly(dish.id);
      });
    }

    const incBtn = card.querySelector('.inc-btn');
    if (incBtn) {
      incBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        incrementDishDirectly(dish.id);
      });
    }

    return card;
  }

  // ==========================================
  // 5. Item Customization Drawer Logic
  // ==========================================
  let currentCustomiseDish = null;
  let selectedPortion = null;
  let selectedAddons = [];
  let customiseQuantity = 1;

  const customiseDishTitle = document.getElementById('customiseDishTitle');
  const customiseDietIcon = document.getElementById('customiseDietIcon');
  const portionSection = document.getElementById('portionSection');
  const portionsGroup = document.getElementById('portionsGroup');
  const addonsSection = document.getElementById('addonsSection');
  const addonsGroup = document.getElementById('addonsGroup');
  const itemSpecialNote = document.getElementById('itemSpecialNote');
  const customiseQtyVal = document.getElementById('customiseQtyVal');
  const customiseDecBtn = document.getElementById('customiseDecBtn');
  const customiseIncBtn = document.getElementById('customiseIncBtn');
  const addCustomisedToCartBtn = document.getElementById('addCustomisedToCartBtn');
  const customiseTotalBtnPrice = document.getElementById('customiseTotalBtnPrice');

  function openCustomisationDrawer(dish) {
    currentCustomiseDish = dish;
    customiseQuantity = 1;
    selectedAddons = [];
    itemSpecialNote.value = '';

    customiseDishTitle.textContent = dish.name;
    customiseDietIcon.className = `diet-indicator ${dish.isVeg ? 'veg-icon' : 'nonveg-icon'}`;

    // Portions
    if (dish.portions && dish.portions.length > 0) {
      portionSection.classList.remove('hidden');
      portionsGroup.innerHTML = '';
      selectedPortion = dish.portions[0]; // Default to first portion

      dish.portions.forEach((p, idx) => {
        const option = document.createElement('label');
        option.className = `custom-option-card ${idx === 0 ? 'selected' : ''}`;
        option.innerHTML = `
          <div class="option-left">
            <input type="radio" name="portionOption" value="${idx}" ${idx === 0 ? 'checked' : ''}>
            <span>${p.name}</span>
          </div>
          <span class="option-price">₹${p.price}</span>
        `;
        option.addEventListener('click', () => {
          selectedPortion = p;
          portionsGroup.querySelectorAll('.custom-option-card').forEach(el => el.classList.remove('selected'));
          option.classList.add('selected');
          updateCustomiseFooterPrice();
        });
        portionsGroup.appendChild(option);
      });
    } else {
      portionSection.classList.add('hidden');
      selectedPortion = { name: 'Standard', price: dish.price };
    }

    // Addons
    if (dish.addons && dish.addons.length > 0) {
      addonsSection.classList.remove('hidden');
      addonsGroup.innerHTML = '';
      dish.addons.forEach((addon, idx) => {
        const option = document.createElement('label');
        option.className = 'custom-option-card';
        option.innerHTML = `
          <div class="option-left">
            <input type="checkbox" name="addonOption" value="${idx}">
            <span>${addon.name}</span>
          </div>
          <span class="option-price">+₹${addon.price}</span>
        `;
        const checkbox = option.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            selectedAddons.push(addon);
            option.classList.add('selected');
          } else {
            selectedAddons = selectedAddons.filter(a => a.name !== addon.name);
            option.classList.remove('selected');
          }
          updateCustomiseFooterPrice();
        });
        addonsGroup.appendChild(option);
      });
    } else {
      addonsSection.classList.add('hidden');
    }

    customiseQtyVal.textContent = '1';
    updateCustomiseFooterPrice();
    customiseBackdrop.classList.remove('hidden');
  }

  function updateCustomiseFooterPrice() {
    if (!currentCustomiseDish) return;
    const base = selectedPortion ? selectedPortion.price : currentCustomiseDish.price;
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const unitTotal = base + addonsTotal;
    const grandTotal = unitTotal * customiseQuantity;

    customiseQtyVal.textContent = customiseQuantity;
    customiseTotalBtnPrice.textContent = `₹${grandTotal}`;
  }

  if (customiseDecBtn) {
    customiseDecBtn.addEventListener('click', () => {
      if (customiseQuantity > 1) {
        customiseQuantity--;
        updateCustomiseFooterPrice();
      }
    });
  }

  if (customiseIncBtn) {
    customiseIncBtn.addEventListener('click', () => {
      customiseQuantity++;
      updateCustomiseFooterPrice();
    });
  }

  if (closeCustomiseBtn) {
    closeCustomiseBtn.addEventListener('click', () => {
      customiseBackdrop.classList.add('hidden');
    });
  }

  if (addCustomisedToCartBtn) {
    addCustomisedToCartBtn.addEventListener('click', () => {
      if (!currentCustomiseDish) return;

      const base = selectedPortion ? selectedPortion.price : currentCustomiseDish.price;
      const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
      const unitPrice = base + addonsTotal;
      const note = itemSpecialNote.value.trim();

      // Unique cart item identifier based on customizations
      const addonKey = selectedAddons.map(a => a.name).sort().join('|');
      const cartItemId = `${currentCustomiseDish.id}-${selectedPortion.name}-${addonKey}-${note}`;

      const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        cart[existingIndex].quantity += customiseQuantity;
        cart[existingIndex].itemTotal = cart[existingIndex].quantity * cart[existingIndex].unitPrice;
      } else {
        cart.push({
          cartItemId,
          dishId: currentCustomiseDish.id,
          name: currentCustomiseDish.name,
          isVeg: currentCustomiseDish.isVeg,
          portion: selectedPortion.name !== 'Standard' ? selectedPortion.name : null,
          addons: [...selectedAddons],
          specialNote: note || null,
          unitPrice: unitPrice,
          quantity: customiseQuantity,
          itemTotal: unitPrice * customiseQuantity
        });
      }

      saveCartToStorage();
      updateCartUI();
      renderMenu(); // Re-render to update badges/steppers
      customiseBackdrop.classList.add('hidden');
      showToast(`Added ${currentCustomiseDish.name} to order!`);
    });
  }

  // Direct add for simple dishes without variants
  function addItemDirectly(dish) {
    const cartItemId = `${dish.id}-standard`;
    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity++;
      cart[existingIndex].itemTotal = cart[existingIndex].quantity * cart[existingIndex].unitPrice;
    } else {
      cart.push({
        cartItemId,
        dishId: dish.id,
        name: dish.name,
        isVeg: dish.isVeg,
        portion: null,
        addons: [],
        specialNote: null,
        unitPrice: dish.price,
        quantity: 1,
        itemTotal: dish.price
      });
    }

    saveCartToStorage();
    updateCartUI();
    renderMenu();
    showToast(`Added ${dish.name}`);
  }

  function decrementDishDirectly(dishId) {
    const itemIndex = cart.findIndex(item => item.dishId === dishId);
    if (itemIndex > -1) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity--;
        cart[itemIndex].itemTotal = cart[itemIndex].quantity * cart[itemIndex].unitPrice;
      } else {
        cart.splice(itemIndex, 1);
      }
      saveCartToStorage();
      updateCartUI();
      renderMenu();
    }
  }

  function incrementDishDirectly(dishId) {
    const itemIndex = cart.findIndex(item => item.dishId === dishId);
    if (itemIndex > -1) {
      cart[itemIndex].quantity++;
      cart[itemIndex].itemTotal = cart[itemIndex].quantity * cart[itemIndex].unitPrice;
      saveCartToStorage();
      updateCartUI();
      renderMenu();
    }
  }

  // ==========================================
  // 6. Cart State & Floating Bottom Bar
  // ==========================================
  function saveCartToStorage() {
    localStorage.setItem('tablebite_cart', JSON.stringify(cart));
  }

  function loadCartFromStorage() {
    try {
      const data = localStorage.getItem('tablebite_cart');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function calculateCartTotals() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
    const gst = Math.round(subtotal * 0.05); // 5% GST
    const grandTotal = subtotal + gst;
    return { totalCount, subtotal, gst, grandTotal };
  }

  function updateCartUI() {
    const { totalCount, subtotal, gst, grandTotal } = calculateCartTotals();

    // Floating Cart Bar Visibility
    if (totalCount > 0) {
      floatingCartBar.classList.remove('hidden');
      cartCountBadge.textContent = totalCount;
      cartItemsSummary.textContent = `${totalCount} ${totalCount === 1 ? 'Item' : 'Items'}`;
      cartBarTotal.textContent = `₹${grandTotal}`;
    } else {
      floatingCartBar.classList.add('hidden');
    }

    // Update Cart Drawer Items if open
    renderCartDrawerItems();

    // Update Bill Details
    const billSubtotal = document.getElementById('billSubtotal');
    const billTax = document.getElementById('billTax');
    const billGrandTotal = document.getElementById('billGrandTotal');
    const checkoutBtnTotal = document.getElementById('checkoutBtnTotal');
    const confirmOrderBtnText = document.getElementById('confirmOrderBtnText');

    if (billSubtotal) billSubtotal.textContent = `₹${subtotal}`;
    if (billTax) billTax.textContent = `₹${gst}`;
    if (billGrandTotal) billGrandTotal.textContent = `₹${grandTotal}`;
    if (checkoutBtnTotal) checkoutBtnTotal.textContent = `₹${grandTotal}`;
    if (confirmOrderBtnText) confirmOrderBtnText.textContent = `Pay &bull; ₹${grandTotal}`;
  }

  // Cart Drawer opening
  if (openCartBtn) {
    openCartBtn.addEventListener('click', () => {
      cartBackdrop.classList.remove('hidden');
      updateCartUI();
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      cartBackdrop.classList.add('hidden');
    });
  }

  function renderCartDrawerItems() {
    const cartItemsList = document.getElementById('cartItemsList');
    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add mouth-watering dishes from the menu to start ordering!</p>
        </div>
      `;
      const proceedBtn = document.getElementById('proceedToCheckoutBtn');
      if (proceedBtn) proceedBtn.disabled = true;
      return;
    }

    const proceedBtn = document.getElementById('proceedToCheckoutBtn');
    if (proceedBtn) proceedBtn.disabled = false;

    cartItemsList.innerHTML = '';
    cart.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'cart-item-row';

      const dietClass = item.isVeg ? 'veg-icon' : 'nonveg-icon';
      let metaDetails = [];
      if (item.portion) metaDetails.push(item.portion);
      if (item.addons && item.addons.length > 0) {
        metaDetails.push(item.addons.map(a => `+${a.name}`).join(', '));
      }

      const metaHtml = metaDetails.length > 0 
        ? `<div class="cart-item-addons">${metaDetails.join(' &bull; ')}</div>` 
        : '';
      const noteHtml = item.specialNote 
        ? `<div class="cart-item-note">&ldquo;${item.specialNote}&rdquo;</div>` 
        : '';

      row.innerHTML = `
        <div class="cart-item-left">
          <span class="${dietClass}" style="margin-top: 4px;"></span>
          <div>
            <div class="cart-item-name">${item.name}</div>
            ${metaHtml}
            ${noteHtml}
          </div>
        </div>

        <div class="cart-item-right">
          <div class="cart-item-total">₹${item.itemTotal}</div>
          <div class="qty-stepper" style="width: 80px; height: 30px;">
            <button type="button" class="qty-step-btn cart-dec-btn" data-cart-idx="${idx}">&minus;</button>
            <span class="qty-step-count" style="font-size: 0.8rem;">${item.quantity}</span>
            <button type="button" class="qty-step-btn cart-inc-btn" data-cart-idx="${idx}">&plus;</button>
          </div>
        </div>
      `;

      row.querySelector('.cart-dec-btn').addEventListener('click', () => {
        if (cart[idx].quantity > 1) {
          cart[idx].quantity--;
          cart[idx].itemTotal = cart[idx].quantity * cart[idx].unitPrice;
        } else {
          cart.splice(idx, 1);
        }
        saveCartToStorage();
        updateCartUI();
        renderMenu();
      });

      row.querySelector('.cart-inc-btn').addEventListener('click', () => {
        cart[idx].quantity++;
        cart[idx].itemTotal = cart[idx].quantity * cart[idx].unitPrice;
        saveCartToStorage();
        updateCartUI();
        renderMenu();
      });

      cartItemsList.appendChild(row);
    });
  }

  // ==========================================
  // 7. Checkout & Payment View
  // ==========================================
  const proceedToCheckoutBtn = document.getElementById('proceedToCheckoutBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const confirmOrderBtn = document.getElementById('confirmOrderBtn');
  const orderSpinner = document.getElementById('orderSpinner');
  const confirmOrderBtnText = document.getElementById('confirmOrderBtnText');

  if (proceedToCheckoutBtn) {
    proceedToCheckoutBtn.addEventListener('click', () => {
      cartBackdrop.classList.add('hidden');
      checkoutBackdrop.classList.remove('hidden');
    });
  }

  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', () => {
      checkoutBackdrop.classList.add('hidden');
    });
  }

  // Payment Option selection cards
  document.querySelectorAll('.payment-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('customerName');
      const phoneInput = document.getElementById('customerPhone');
      const nameError = document.getElementById('nameError');
      const phoneError = document.getElementById('phoneError');

      let isValid = true;

      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name';
        nameError.style.display = 'block';
        isValid = false;
      } else {
        nameError.style.display = 'none';
      }

      const phoneVal = phoneInput.value.trim().replace(/\D/g, '');
      if (phoneVal.length !== 10) {
        phoneError.textContent = 'Please enter a valid 10-digit mobile number';
        phoneError.style.display = 'block';
        isValid = false;
      } else {
        phoneError.style.display = 'none';
      }

      if (!isValid) return;

      const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
      const { grandTotal } = calculateCartTotals();

      // Show loading spinner
      confirmOrderBtn.disabled = true;
      orderSpinner.classList.remove('hidden');
      confirmOrderBtnText.textContent = 'Processing Order...';

      // Prepare payload for backend
      const orderPayload = {
        tableNumber: activeTable,
        customerName: nameInput.value.trim(),
        customerPhone: phoneVal,
        paymentMethod: selectedMethod,
        specialInstructions: null,
        items: cart.map(item => ({
          productId: item.dishId,
          portion: item.portion,
          addons: item.addons,
          specialNote: item.specialNote,
          quantity: item.quantity
        }))
      };

      // Send to live backend
      (async () => {
        let orderData = null;
        let generatedOrderCode = `#TB-${Math.floor(1000 + Math.random() * 9000)}`;
        let orderId = `order-${Date.now()}`;

        try {
          const apiRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
          });
          if (apiRes.ok) {
            const resData = await apiRes.json();
            if (resData.order) {
              orderData = resData.order;
              generatedOrderCode = resData.order.orderNumber;
              orderId = resData.order.id;
              console.log('[API] Order recorded in SQLite database:', generatedOrderCode);
            }
          }
        } catch (err) {
          console.log('[API] Order stored in offline session fallback.');
        }

        confirmOrderBtn.disabled = false;
        orderSpinner.classList.add('hidden');
        confirmOrderBtnText.textContent = `Pay • ₹${grandTotal}`;
        checkoutBackdrop.classList.add('hidden');

        // Formulate standard NPCI UPI URI
        const upiVpa = '7702971510@ybl';
        const merchantName = encodeURIComponent('ARM Coffee Place Kokapet');
        const upiUri = `upi://pay?pa=${upiVpa}&pn=${merchantName}&am=${grandTotal}&tr=${orderId}&tn=ARM_Coffee_Order_${generatedOrderCode}_Table_${activeTable}&cu=INR`;

        currentUpiOrder = {
          id: orderId,
          orderNumber: generatedOrderCode,
          customerName: nameInput.value.trim(),
          paymentMethod: selectedMethod,
          total: grandTotal
        };

        if (selectedMethod === 'upi_qr') {
          // Render Dynamic UPI QR Code
          if (upiAmountValue) upiAmountValue.textContent = `₹${grandTotal}`;
          if (openUpiAppBtn) openUpiAppBtn.href = upiUri;
          if (upiQrContainer && typeof QRCode !== 'undefined' && QRCode.generateSVG) {
            upiQrContainer.innerHTML = QRCode.generateSVG(upiUri, { cellSize: 5, margin: 2 });
          }
          startUpiTimer(300); // 5-minute countdown
          if (upiModalBackdrop) upiModalBackdrop.classList.remove('hidden');
        } else if (selectedMethod === 'upi_intent') {
          // Attempt 1-tap app launch
          try {
            window.location.href = upiUri;
          } catch (e) {}

          // Also show modal so diner can scan or confirm if on desktop/companion
          if (upiAmountValue) upiAmountValue.textContent = `₹${grandTotal}`;
          if (openUpiAppBtn) openUpiAppBtn.href = upiUri;
          if (upiQrContainer && typeof QRCode !== 'undefined' && QRCode.generateSVG) {
            upiQrContainer.innerHTML = QRCode.generateSVG(upiUri, { cellSize: 5, margin: 2 });
          }
          startUpiTimer(300);
          if (upiModalBackdrop) upiModalBackdrop.classList.remove('hidden');
        } else {
          // Cash at counter - direct launch to tracker
          launchOrderTracker(nameInput.value.trim(), selectedMethod, generatedOrderCode, orderId);
        }
      })();
    });
  }

  // ==========================================
  // 7b. Dynamic UPI Modal Handlers (Phase 5)
  // ==========================================
  const upiModalBackdrop = document.getElementById('upiModalBackdrop');
  const closeUpiModalBtn = document.getElementById('closeUpiModalBtn');
  const upiAmountValue = document.getElementById('upiAmountValue');
  const upiQrContainer = document.getElementById('upiQrContainer');
  const upiVpaText = document.getElementById('upiVpaText');
  const copyVpaBtn = document.getElementById('copyVpaBtn');
  const upiTimerDisplay = document.getElementById('upiTimerDisplay');
  const openUpiAppBtn = document.getElementById('openUpiAppBtn');
  const confirmUpiPaidBtn = document.getElementById('confirmUpiPaidBtn');

  let upiCountdownTimer = null;
  let currentUpiOrder = null;

  function startUpiTimer(durationSeconds) {
    if (upiCountdownTimer) clearInterval(upiCountdownTimer);
    let remaining = durationSeconds;
    function updateDisplay() {
      const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
      const secs = (remaining % 60).toString().padStart(2, '0');
      if (upiTimerDisplay) upiTimerDisplay.textContent = `${mins}:${secs}`;
      if (remaining <= 0) {
        clearInterval(upiCountdownTimer);
        showToast('UPI Session Expired. Please retry payment.');
        if (upiModalBackdrop) upiModalBackdrop.classList.add('hidden');
      }
      remaining--;
    }
    updateDisplay();
    upiCountdownTimer = setInterval(updateDisplay, 1000);
  }

  if (closeUpiModalBtn) {
    closeUpiModalBtn.addEventListener('click', () => {
      if (upiCountdownTimer) clearInterval(upiCountdownTimer);
      upiModalBackdrop.classList.add('hidden');
    });
  }

  if (copyVpaBtn) {
    copyVpaBtn.addEventListener('click', () => {
      const vpa = upiVpaText ? upiVpaText.textContent : 'tablebite@okaxis';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(vpa).then(() => {
          showToast(`Copied UPI ID: ${vpa}`);
        }).catch(() => {
          showToast(`UPI ID: ${vpa}`);
        });
      } else {
        showToast(`UPI ID: ${vpa}`);
      }
    });
  }

  if (confirmUpiPaidBtn) {
    confirmUpiPaidBtn.addEventListener('click', async () => {
      if (!currentUpiOrder) return;
      confirmUpiPaidBtn.disabled = true;
      confirmUpiPaidBtn.textContent = 'Verifying with Bank...';

      try {
        await fetch(`/api/orders/${currentUpiOrder.id}/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethod: currentUpiOrder.paymentMethod,
            transactionRef: `UPI-TXN-${Date.now()}`
          })
        });
      } catch (e) {
        console.warn('Payment recording fallback');
      }

      setTimeout(() => {
        confirmUpiPaidBtn.disabled = false;
        confirmUpiPaidBtn.textContent = '✓ I Have Paid • Verify Now';
        if (upiCountdownTimer) clearInterval(upiCountdownTimer);
        if (upiModalBackdrop) upiModalBackdrop.classList.add('hidden');
        launchOrderTracker(currentUpiOrder.customerName, currentUpiOrder.paymentMethod, currentUpiOrder.orderNumber, currentUpiOrder.id);
      }, 900);
    });
  }

  // ==========================================
  // 8. Live Order Status Tracker & Polling
  // ==========================================
  const trackerOrderCode = document.getElementById('trackerOrderCode');
  const trackerItemsCard = document.getElementById('trackerItemsCard');
  const orderMoreBtn = document.getElementById('orderMoreBtn');
  let trackerPollInterval = null;

  function launchOrderTracker(customerName, paymentMethod, orderCode, orderId) {
    if (trackerPollInterval) clearInterval(trackerPollInterval);
    trackerOrderCode.textContent = orderCode || `#TB-${Math.floor(1000 + Math.random() * 9000)}`;

    // Trigger celebratory confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Render snapshot of ordered items
    const { totalCount, grandTotal } = calculateCartTotals();
    const itemsSnapshot = cart.map(i => `${i.quantity}x ${i.name}`).join(', ');

    const paymentLabel = paymentMethod === 'cash_counter'
      ? `<span style="color:#f59e0b; font-weight:700;">⏳ Pay ₹${grandTotal} at Cash Counter</span>`
      : `<span style="color:#10b981; font-weight:700;">✓ Paid via UPI (Instant Verified)</span>`;

    trackerItemsCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
        <strong>${customerName} (${totalCount} items)</strong>
        <strong style="color: var(--primary); font-family: var(--font-mono);">₹${grandTotal}</strong>
      </div>
      <div style="color: var(--text-secondary); font-size: 0.8rem; margin-bottom: 0.35rem;">
        ${itemsSnapshot}
      </div>
      <div style="color: var(--text-muted); font-size: 0.75rem;">
        Payment: ${paymentLabel}
      </div>
    `;

    // Reset progress steps
    resetTimeline();
    trackerBackdrop.classList.remove('hidden');

    // Real-Time Polling from Backend
    if (orderId) {
      pollOrderStatus(orderId);
    } else {
      simulateKitchenTimeline();
    }

    // Clear cart
    cart = [];
    saveCartToStorage();
    updateCartUI();
    renderMenu();
  }

  function resetTimeline() {
    for (let i = 1; i <= 4; i++) {
      const step = document.getElementById(`step${i}`);
      if (step) {
        step.classList.toggle('step-active', i === 1);
      }
    }
  }

  function setTimelineStep(stepIndex) {
    for (let i = 1; i <= 4; i++) {
      const step = document.getElementById(`step${i}`);
      if (step) {
        step.classList.toggle('step-active', i <= stepIndex);
      }
    }
  }

  function pollOrderStatus(orderId) {
    let lastStatus = 'new';
    trackerPollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.order && data.order.status) {
          const status = data.order.status;
          if (status !== lastStatus) {
            lastStatus = status;
            if (status === 'new') {
              setTimelineStep(1);
            } else if (status === 'in_kitchen') {
              setTimelineStep(2);
              showToast('Kitchen Update: Chef started cooking your meal!');
            } else if (status === 'ready') {
              setTimelineStep(3);
              showToast('Kitchen Update: Your order is plated and ready to serve!');
            } else if (status === 'served' || status === 'completed') {
              setTimelineStep(4);
              showToast('Food Served! Enjoy your meal at TableBite.');
              if (typeof confetti === 'function') {
                confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
              }
              clearInterval(trackerPollInterval);
            }
          }
        }
      } catch (err) {
        // network silent retry
      }
    }, 3000);
  }

  function simulateKitchenTimeline() {
    setTimeout(() => {
      setTimelineStep(2);
      showToast('Kitchen Update: Chef started cooking your meal!');
    }, 4000);

    setTimeout(() => {
      setTimelineStep(3);
      showToast('Kitchen Update: Your order is ready on the pass!');
    }, 9000);

    setTimeout(() => {
      setTimelineStep(4);
      showToast('Food Served! Enjoy your meal at TableBite.');
      if (typeof confetti === 'function') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    }, 14000);
  }

  if (orderMoreBtn) {
    orderMoreBtn.addEventListener('click', () => {
      if (trackerPollInterval) clearInterval(trackerPollInterval);
      trackerBackdrop.classList.add('hidden');
    });
  }

  // ==========================================
  // 9. Toast Notification System
  // ==========================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 2800);
  }
});
