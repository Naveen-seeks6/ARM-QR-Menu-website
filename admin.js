/**
 * TableBite - Admin & Kitchen Portal Controller
 * Manages staff authentication, live Kitchen Order Display (KDS) with audio chime,
 * menu management CMS with instant 86 stock toggle, and real-time sales analytics.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Authentication State & PIN Pad
  // ==========================================
  let authToken = sessionStorage.getItem('tb_admin_token');
  let currentPin = '';
  let soundEnabled = true;
  let knownOrderIds = new Set();
  let kdsPollInterval = null;

  const loginOverlay = document.getElementById('loginOverlay');
  const adminWrapper = document.getElementById('adminWrapper');
  const pinInput = document.getElementById('pinInput');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const tabPinBtn = document.getElementById('tabPinBtn');
  const tabEmailBtn = document.getElementById('tabEmailBtn');
  const pinLoginForm = document.getElementById('pinLoginForm');
  const emailLoginForm = document.getElementById('emailLoginForm');
  const logoutBtn = document.getElementById('logoutBtn');

  // Check existing session
  if (authToken) {
    unlockPortal();
  }

  // Login Tabs Switcher
  if (tabPinBtn) {
    tabPinBtn.addEventListener('click', () => {
      tabPinBtn.classList.add('active');
      tabEmailBtn.classList.remove('active');
      pinLoginForm.classList.remove('hidden');
      emailLoginForm.classList.add('hidden');
      loginErrorMsg.style.display = 'none';
    });
  }

  if (tabEmailBtn) {
    tabEmailBtn.addEventListener('click', () => {
      tabEmailBtn.classList.add('active');
      tabPinBtn.classList.remove('active');
      emailLoginForm.classList.remove('hidden');
      pinLoginForm.classList.add('hidden');
      loginErrorMsg.style.display = 'none';
    });
  }

  // Keypad button clicks
  document.querySelectorAll('.key-btn[data-key]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      if (currentPin.length < 4) {
        currentPin += key;
        updatePinDots();
        if (currentPin.length === 4) {
          verifyPinLogin();
        }
      }
    });
  });

  const clearPinBtn = document.getElementById('clearPinBtn');
  if (clearPinBtn) {
    clearPinBtn.addEventListener('click', () => {
      currentPin = '';
      updatePinDots();
      loginErrorMsg.style.display = 'none';
    });
  }

  const submitPinBtn = document.getElementById('submitPinBtn');
  if (submitPinBtn) {
    submitPinBtn.addEventListener('click', () => {
      if (currentPin.length === 4) verifyPinLogin();
    });
  }

  const quickDemoLoginBtn = document.getElementById('quickDemoLoginBtn');
  if (quickDemoLoginBtn) {
    quickDemoLoginBtn.addEventListener('click', () => {
      currentPin = '1234';
      updatePinDots();
      verifyPinLogin();
    });
  }

  function updatePinDots() {
    for (let i = 1; i <= 4; i++) {
      const dot = document.getElementById(`dot${i}`);
      if (dot) dot.classList.toggle('filled', i <= currentPin.length);
    }
  }

  async function verifyPinLogin() {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: currentPin })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('tb_admin_token', data.token);
        authToken = data.token;
        unlockPortal();
      } else {
        showLoginError(data.message || 'Incorrect PIN');
        currentPin = '';
        updatePinDots();
      }
    } catch (err) {
      // Offline fallback: verify 1234
      if (currentPin === '1234') {
        sessionStorage.setItem('tb_admin_token', 'local_token');
        authToken = 'local_token';
        unlockPortal();
      } else {
        showLoginError('Incorrect PIN (Use 1234)');
        currentPin = '';
        updatePinDots();
      }
    }
  }

  if (emailLoginForm) {
    emailLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('adminEmail').value.trim();
      const password = document.getElementById('adminPassword').value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          sessionStorage.setItem('tb_admin_token', data.token);
          authToken = data.token;
          unlockPortal();
        } else {
          showLoginError(data.message || 'Invalid credentials');
        }
      } catch (err) {
        if (email === 'admin@tablebite.com' && password === 'admin123') {
          sessionStorage.setItem('tb_admin_token', 'local_token');
          authToken = 'local_token';
          unlockPortal();
        } else {
          showLoginError('Invalid credentials');
        }
      }
    });
  }

  function showLoginError(msg) {
    loginErrorMsg.textContent = msg;
    loginErrorMsg.style.display = 'block';
  }

  function unlockPortal() {
    loginOverlay.classList.add('hidden');
    startKdsPolling();
    loadKdsOrders();
    loadMenuCms();
    loadAnalytics();
    loadTables();
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('tb_admin_token');
      authToken = null;
      if (kdsPollInterval) clearInterval(kdsPollInterval);
      loginOverlay.classList.remove('hidden');
      currentPin = '';
      updatePinDots();
    });
  }

  // ==========================================
  // 2. Navigation Tabs
  // ==========================================
  const tabs = document.querySelectorAll('.admin-tab');
  const views = document.querySelectorAll('.admin-view');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetViewId = tab.getAttribute('data-target');
      tabs.forEach(t => t.classList.remove('active'));
      views.forEach(v => {
        v.classList.remove('active');
        v.classList.add('hidden');
      });

      tab.classList.add('active');
      const targetView = document.getElementById(targetViewId);
      if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.add('active');
      }

      // Refresh data for active tab
      if (targetViewId === 'viewKds') loadKdsOrders();
      if (targetViewId === 'viewMenu') loadMenuCms();
      if (targetViewId === 'viewAnalytics') loadAnalytics();
      if (targetViewId === 'viewTables') loadTables();
      if (targetViewId === 'viewSettings') loadShopSettings();
    });
  });

  // ==========================================
  // 3. Audio Chime (Web Audio API)
  // ==========================================
  const chimeToggleBtn = document.getElementById('chimeToggleBtn');
  if (chimeToggleBtn) {
    chimeToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      chimeToggleBtn.classList.toggle('active', soundEnabled);
      const text = chimeToggleBtn.querySelector('.chime-text');
      if (text) text.textContent = soundEnabled ? 'Sound ON' : 'Sound MUTED';
      showToast(soundEnabled ? 'Kitchen audio alerts enabled' : 'Kitchen audio alerts muted');
    });
  }

  function playKitchenChime() {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Note 1: 587.33 Hz (D5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain1.gain.setValueAtTime(0.35, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.4);

      // Note 2: 880 Hz (A5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.0, ctx.currentTime + 0.15);
      gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.65);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // ==========================================
  // 4. Kitchen Display System (KDS) Logic
  // ==========================================
  const manualRefreshKdsBtn = document.getElementById('manualRefreshKdsBtn');
  if (manualRefreshKdsBtn) {
    manualRefreshKdsBtn.addEventListener('click', loadKdsOrders);
  }

  function startKdsPolling() {
    if (kdsPollInterval) clearInterval(kdsPollInterval);
    kdsPollInterval = setInterval(loadKdsOrders, 3500);
  }

  async function loadKdsOrders() {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) return;
      const data = await res.json();
      if (!data.orders) return;

      // Check for newly arrived orders to trigger chime
      let hasNewOrder = false;
      data.orders.forEach(order => {
        if (!knownOrderIds.has(order.id)) {
          if (knownOrderIds.size > 0 && order.status === 'new') {
            hasNewOrder = true;
          }
          knownOrderIds.add(order.id);
        }
      });

      if (hasNewOrder) {
        playKitchenChime();
        showToast('🔔 New kitchen order ticket received!');
      }

      renderKdsKanban(data.orders);
    } catch (err) {
      console.warn('KDS orders polling error', err);
    }
  }

  function renderKdsKanban(orders) {
    const colNew = document.getElementById('ticketsNew');
    const colKitchen = document.getElementById('ticketsKitchen');
    const colReady = document.getElementById('ticketsReady');
    const colCompleted = document.getElementById('ticketsCompleted');

    const countColNew = document.getElementById('countColNew');
    const countColKitchen = document.getElementById('countColKitchen');
    const countColReady = document.getElementById('countColReady');
    const countColCompleted = document.getElementById('countColCompleted');
    const kdsTotalCount = document.getElementById('kdsTotalCount');
    const kdsActiveBadge = document.getElementById('kdsActiveBadge');

    colNew.innerHTML = '';
    colKitchen.innerHTML = '';
    colReady.innerHTML = '';
    colCompleted.innerHTML = '';

    let cNew = 0, cKitchen = 0, cReady = 0, cCompleted = 0;

    orders.forEach(order => {
      const card = createKotTicketCard(order);
      if (order.status === 'new') {
        colNew.appendChild(card);
        cNew++;
      } else if (order.status === 'in_kitchen') {
        colKitchen.appendChild(card);
        cKitchen++;
      } else if (order.status === 'ready') {
        colReady.appendChild(card);
        cReady++;
      } else {
        colCompleted.appendChild(card);
        cCompleted++;
      }
    });

    countColNew.textContent = cNew;
    countColKitchen.textContent = cKitchen;
    countColReady.textContent = cReady;
    countColCompleted.textContent = cCompleted;

    const activeTotal = cNew + cKitchen + cReady;
    if (kdsTotalCount) kdsTotalCount.textContent = activeTotal;
    if (kdsActiveBadge) kdsActiveBadge.textContent = activeTotal;
  }

  function createKotTicketCard(order) {
    const card = document.createElement('div');
    card.className = 'kot-card';

    // Calculate elapsed time
    const createdDate = new Date(order.created_at || Date.now());
    const elapsedMins = Math.max(0, Math.floor((Date.now() - createdDate.getTime()) / 60000));
    const isUrgent = elapsedMins >= 20;

    // Items list
    const itemsHtml = (order.items || []).map(item => {
      const portionMeta = item.selected_portion ? `<span class="kot-item-meta">${item.selected_portion}</span>` : '';
      const specialNoteMeta = item.special_note ? `<span class="kot-item-meta" style="color: #fbbf24;">Note: ${item.special_note}</span>` : '';
      return `
        <div class="kot-item-row">
          <span class="kot-item-qty">${item.quantity}x</span>
          <div class="kot-item-name">
            ${item.item_name}
            ${portionMeta}
            ${specialNoteMeta}
          </div>
        </div>
      `;
    }).join('');

    const notesHtml = order.special_instructions 
      ? `<div class="kot-notes">Special Note: &ldquo;${order.special_instructions}&rdquo;</div>` 
      : '';

    // Action button depending on status
    let actionBtnHtml = '';
    if (order.status === 'new') {
      actionBtnHtml = `<button type="button" class="kot-btn btn-cook" data-action="in_kitchen">Start Cooking &rarr;</button>`;
    } else if (order.status === 'in_kitchen') {
      actionBtnHtml = `<button type="button" class="kot-btn btn-ready" data-action="ready">Mark Ready &check;</button>`;
    } else if (order.status === 'ready') {
      actionBtnHtml = `<button type="button" class="kot-btn btn-serve" data-action="served">Mark Delivered &check;</button>`;
    }

    card.innerHTML = `
      <div class="kot-header">
        <span class="kot-table-badge">Table ${order.table_number.toString().padStart(2, '0')}</span>
        <span class="kot-time-elapsed ${isUrgent ? 'urgent' : ''}">${elapsedMins}m ago</span>
      </div>
      <div class="kot-order-id">${order.order_number} &bull; ${order.customer_name || 'Diner'}</div>
      <div class="kot-items-list">
        ${itemsHtml}
      </div>
      ${notesHtml}
      <div class="kot-actions">
        ${actionBtnHtml}
      </div>
    `;

    const btn = card.querySelector('.kot-btn');
    if (btn) {
      btn.addEventListener('click', async () => {
        const nextStatus = btn.getAttribute('data-action');
        await advanceOrderStatus(order.id, nextStatus);
      });
    }

    return card;
  }

  async function advanceOrderStatus(orderId, nextStatus) {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        showToast(`Order updated to: ${nextStatus}`);
        loadKdsOrders();
      }
    } catch (err) {
      console.warn('Status advance error', err);
    }
  }

  // ==========================================
  // 5. Menu Management CMS Logic
  // ==========================================
  let allDishesCache = [];
  const cmsDishesTableBody = document.getElementById('cmsDishesTableBody');
  const cmsSearchInput = document.getElementById('cmsSearchInput');
  const cmsCategoryFilter = document.getElementById('cmsCategoryFilter');

  const dishModalBackdrop = document.getElementById('dishModalBackdrop');
  const openAddDishModalBtn = document.getElementById('openAddDishModalBtn');
  const closeDishModalBtn = document.getElementById('closeDishModalBtn');
  const cancelDishModalBtn = document.getElementById('cancelDishModalBtn');
  const dishForm = document.getElementById('dishForm');

  async function loadMenuCms() {
    try {
      const res = await fetch('/api/menu');
      if (!res.ok) return;
      const data = await res.json();
      allDishesCache = data.products || [];
      renderMenuCmsTable();
    } catch (err) {
      console.warn('Menu CMS fetch error', err);
    }
  }

  function renderMenuCmsTable() {
    if (!cmsDishesTableBody) return;
    const query = (cmsSearchInput ? cmsSearchInput.value : '').toLowerCase().trim();
    const cat = cmsCategoryFilter ? cmsCategoryFilter.value : 'all';

    let filtered = allDishesCache.filter(dish => {
      if (cat !== 'all' && dish.categoryId !== cat) return false;
      if (query && !dish.name.toLowerCase().includes(query)) return false;
      return true;
    });

    cmsDishesTableBody.innerHTML = '';
    filtered.forEach(dish => {
      const tr = document.createElement('tr');
      const dietBadge = dish.isVeg 
        ? `<span style="color: #16a34a; font-weight: bold;">● Veg</span>` 
        : `<span style="color: #dc2626; font-weight: bold;">▲ Non-Veg</span>`;

      tr.innerHTML = `
        <td>
          <div class="cms-dish-cell">
            <img src="${dish.image}" alt="${dish.name}" class="cms-dish-thumb">
            <div>
              <div class="cms-dish-name">${dish.name}</div>
              <div class="cms-dish-desc">${dish.description || ''}</div>
            </div>
          </div>
        </td>
        <td><span style="text-transform: capitalize;">${dish.categoryId}</span></td>
        <td class="cms-price">₹${dish.price}</td>
        <td>${dietBadge}</td>
        <td>
          <label class="switch-label">
            <input type="checkbox" class="switch-input 86-toggle" data-dish-id="${dish.id}" ${dish.isAvailable ? 'checked' : ''}>
            <span class="switch-slider"></span>
            <span class="switch-text">${dish.isAvailable ? 'In Stock' : 'Sold Out'}</span>
          </label>
        </td>
        <td>
          <div class="action-btns">
            <button type="button" class="icon-action-btn btn-edit" title="Edit dish">✏️</button>
            <button type="button" class="icon-action-btn btn-delete" title="Delete dish">🗑️</button>
          </div>
        </td>
      `;

      // 86 Out-of-Stock Switch
      const toggle = tr.querySelector('.switch-input');
      toggle.addEventListener('change', async () => {
        await toggleDishStock(dish.id, toggle.checked);
      });

      // Edit Button
      tr.querySelector('.btn-edit').addEventListener('click', () => {
        openEditDishModal(dish);
      });

      // Delete Button
      tr.querySelector('.btn-delete').addEventListener('click', async () => {
        if (confirm(`Are you sure you want to delete "${dish.name}" from the menu?`)) {
          await deleteDish(dish.id);
        }
      });

      cmsDishesTableBody.appendChild(tr);
    });
  }

  if (cmsSearchInput) cmsSearchInput.addEventListener('input', renderMenuCmsTable);
  if (cmsCategoryFilter) cmsCategoryFilter.addEventListener('change', renderMenuCmsTable);

  async function toggleDishStock(dishId, isChecked) {
    try {
      const res = await fetch(`/api/products/${dishId}/toggle-stock`, { method: 'PATCH' });
      if (res.ok) {
        showToast(isChecked ? 'Dish marked In Stock' : 'Dish marked Sold Out (86)');
        loadMenuCms();
      }
    } catch (err) {
      console.warn('Toggle stock error', err);
    }
  }

  // Add / Edit Modal
  if (openAddDishModalBtn) {
    openAddDishModalBtn.addEventListener('click', () => {
      dishForm.reset();
      document.getElementById('editDishId').value = '';
      document.getElementById('dishModalTitle').textContent = 'Add New Dish';
      dishModalBackdrop.classList.remove('hidden');
    });
  }

  if (closeDishModalBtn) closeDishModalBtn.addEventListener('click', () => dishModalBackdrop.classList.add('hidden'));
  if (cancelDishModalBtn) cancelDishModalBtn.addEventListener('click', () => dishModalBackdrop.classList.add('hidden'));

  function openEditDishModal(dish) {
    document.getElementById('editDishId').value = dish.id;
    document.getElementById('dishNameInput').value = dish.name;
    document.getElementById('dishCategorySelect').value = dish.categoryId;
    document.getElementById('dishPriceInput').value = dish.price;
    document.getElementById('dishImageUrlInput').value = dish.image || '';
    document.getElementById('dishDescInput').value = dish.description || '';
    document.getElementById('dishIsVegCheckbox').checked = dish.isVeg;
    document.getElementById('dishIsSpicyCheckbox').checked = dish.isSpicy;
    document.getElementById('dishIsBestsellerCheckbox').checked = dish.isBestseller;

    document.getElementById('dishModalTitle').textContent = `Edit Dish: ${dish.name}`;
    dishModalBackdrop.classList.remove('hidden');
  }

  if (dishForm) {
    dishForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const editId = document.getElementById('editDishId').value;
      const payload = {
        name: document.getElementById('dishNameInput').value.trim(),
        categoryId: document.getElementById('dishCategorySelect').value,
        price: parseFloat(document.getElementById('dishPriceInput').value),
        imageUrl: document.getElementById('dishImageUrlInput').value.trim(),
        description: document.getElementById('dishDescInput').value.trim(),
        isVeg: document.getElementById('dishIsVegCheckbox').checked,
        isSpicy: document.getElementById('dishIsSpicyCheckbox').checked,
        isBestseller: document.getElementById('dishIsBestsellerCheckbox').checked
      };

      try {
        if (editId) {
          // Update dish
          const res = await fetch(`/api/menu/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            showToast('Dish updated successfully');
          }
        } else {
          // Create dish
          const res = await fetch('/api/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            showToast('New dish added to catalog');
          }
        }
        dishModalBackdrop.classList.add('hidden');
        loadMenuCms();
      } catch (err) {
        console.warn('Save dish error', err);
      }
    });
  }

  async function deleteDish(dishId) {
    try {
      const res = await fetch(`/api/menu/${dishId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Dish deleted from catalog');
        loadMenuCms();
      }
    } catch (err) {
      console.warn('Delete dish error', err);
    }
  }

  // ==========================================
  // 6. Sales & Analytics Dashboard Logic
  // ==========================================
  async function loadAnalytics() {
    try {
      const res = await fetch('/api/admin/analytics');
      if (!res.ok) return;
      const data = await res.json();
      if (!data.metrics) return;

      const m = data.metrics;
      document.getElementById('metricRevenue').textContent = `₹${m.totalRevenue.toLocaleString('en-IN')}`;
      document.getElementById('metricOrders').textContent = m.totalOrders;
      document.getElementById('metricAov').textContent = `₹${m.aov}`;
      document.getElementById('metricTables').textContent = `${m.activeTablesCount} / 16`;

      // Render Top Selling Dishes
      const topDishesList = document.getElementById('topDishesList');
      if (topDishesList) {
        topDishesList.innerHTML = '';
        (m.topDishes || []).forEach((dish, idx) => {
          const item = document.createElement('div');
          item.className = 'top-dish-item';
          item.innerHTML = `
            <div style="display: flex; align-items: center;">
              <span class="top-dish-rank">#${idx + 1}</span>
              <span class="top-dish-name">${dish.item_name}</span>
            </div>
            <span class="top-dish-sales">${dish.units_sold} ordered &bull; ₹${Math.round(dish.gross_sales)}</span>
          `;
          topDishesList.appendChild(item);
        });
      }

      // Render Recent Orders Table
      const recentRes = await fetch('/api/orders');
      if (recentRes.ok) {
        const ordersData = await recentRes.json();
        const recentOrdersTableBody = document.getElementById('recentOrdersTableBody');
        if (recentOrdersTableBody) {
          recentOrdersTableBody.innerHTML = '';
          (ordersData.orders || []).slice(0, 8).forEach(o => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td><strong>${o.order_number}</strong></td>
              <td>Table ${o.table_number.toString().padStart(2, '0')}</td>
              <td>${o.customer_name || 'Diner'}</td>
              <td style="font-family: var(--font-mono); font-weight: 700;">₹${o.total_amount}</td>
              <td style="text-transform: capitalize;">${o.payment_method.replace('_', ' ')}</td>
              <td><span style="font-size: 0.75rem; text-transform: uppercase; font-weight: bold; color: var(--primary);">${o.status}</span></td>
            `;
            recentOrdersTableBody.appendChild(tr);
          });
        }
      }
    } catch (err) {
      console.warn('Analytics fetch error', err);
    }
  }

  // ==========================================
  // 7. Tables & QR Code Preview (Phase 4)
  // ==========================================
  let tablesCache = [];
  let currentStandeeTable = null;

  async function loadTables() {
    try {
      const res = await fetch('/api/tables');
      if (!res.ok) return;
      const data = await res.json();
      const adminTablesGrid = document.getElementById('adminTablesGrid');
      if (!adminTablesGrid) return;

      tablesCache = data.tables || [];
      adminTablesGrid.innerHTML = '';

      tablesCache.forEach(table => {
        const origin = window.location.origin;
        const targetUrl = `${origin}/?table=${table.table_number}&token=${table.qr_token}`;

        // Generate QR SVG
        let qrSvg = '';
        if (typeof QRCode !== 'undefined' && QRCode.generateSVG) {
          try {
            qrSvg = QRCode.generateSVG(targetUrl, { cellSize: 2.8, margin: 1 });
          } catch (e) {
            console.error('QR generation error', e);
          }
        }

        const card = document.createElement('div');
        card.className = 'admin-table-card';
        card.innerHTML = `
          <div class="admin-table-header">
            <span class="table-num-large">Table ${table.table_number.padStart(2, '0')}</span>
            <span class="occupancy-badge ${table.status}">${table.status}</span>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">Seats ${table.capacity} Guests</p>
          <div class="admin-table-qr-wrap" title="Scan to open Table ${table.table_number}">
            ${qrSvg || '<span style="font-size:0.7rem; color:#999;">QR Error</span>'}
          </div>
          <div class="qr-token-preview" title="Cryptographic Token">Token: ${table.qr_token}</div>
          <div class="admin-table-actions">
            <button type="button" class="table-action-btn view-standee-btn" data-table="${table.table_number}">
              👁️ Standee
            </button>
            <a href="/?table=${table.table_number}&token=${table.qr_token}" target="_blank" class="table-action-btn" style="text-align: center; line-height: 30px; text-decoration: none;">
              🔗 Menu
            </a>
          </div>
        `;

        card.querySelector('.view-standee-btn').addEventListener('click', () => {
          openStandeeModal(table);
        });

        adminTablesGrid.appendChild(card);
      });
    } catch (err) {
      console.warn('Tables fetch error', err);
    }
  }

  // --- Standee Modal Handlers ---
  const singleQrModalBackdrop = document.getElementById('singleQrModalBackdrop');
  const closeSingleQrModalBtn = document.getElementById('closeSingleQrModalBtn');
  const standeeModalTitle = document.getElementById('standeeModalTitle');
  const standeeTableNum = document.getElementById('standeeTableNum');
  const standeeQrSvg = document.getElementById('standeeQrSvg');
  const downloadQrSvgBtn = document.getElementById('downloadQrSvgBtn');
  const printSingleCardBtn = document.getElementById('printSingleCardBtn');

  function openStandeeModal(table) {
    if (!singleQrModalBackdrop) return;
    currentStandeeTable = table;
    const origin = window.location.origin;
    const targetUrl = `${origin}/?table=${table.table_number}&token=${table.qr_token}`;

    if (standeeModalTitle) {
      standeeModalTitle.textContent = `Table ${table.table_number.padStart(2, '0')} • QR Standee Card`;
    }
    if (standeeTableNum) {
      standeeTableNum.textContent = table.table_number.padStart(2, '0');
    }

    if (standeeQrSvg && typeof QRCode !== 'undefined' && QRCode.generateSVG) {
      const svg = QRCode.generateSVG(targetUrl, { cellSize: 6, margin: 2 });
      standeeQrSvg.innerHTML = svg;
    }

    singleQrModalBackdrop.classList.remove('hidden');
  }

  if (closeSingleQrModalBtn) {
    closeSingleQrModalBtn.addEventListener('click', () => {
      singleQrModalBackdrop.classList.add('hidden');
    });
  }

  if (singleQrModalBackdrop) {
    singleQrModalBackdrop.addEventListener('click', (e) => {
      if (e.target === singleQrModalBackdrop) {
        singleQrModalBackdrop.classList.add('hidden');
      }
    });
  }

  if (printSingleCardBtn) {
    printSingleCardBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (downloadQrSvgBtn) {
    downloadQrSvgBtn.addEventListener('click', () => {
      if (!currentStandeeTable || !standeeQrSvg) return;
      const svgContent = standeeQrSvg.innerHTML;
      if (!svgContent) return;
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tablebite-table-${currentStandeeTable.table_number}-qr.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Downloaded Table ${currentStandeeTable.table_number} QR SVG`);
    });
  }

  // --- Batch Print Modal Handlers ---
  const batchPrintBackdrop = document.getElementById('batchPrintBackdrop');
  const printQrPreviewBtn = document.getElementById('printQrPreviewBtn');
  const closeBatchPrintBtn = document.getElementById('closeBatchPrintBtn');
  const cancelBatchPrintBtn = document.getElementById('cancelBatchPrintBtn');
  const triggerBatchPrintBtn = document.getElementById('triggerBatchPrintBtn');
  const batchCardsContainer = document.getElementById('batchCardsContainer');

  function renderBatchCards() {
    if (!batchCardsContainer) return;
    batchCardsContainer.innerHTML = '';
    const origin = window.location.origin;

    tablesCache.forEach(table => {
      const targetUrl = `${origin}/?table=${table.table_number}&token=${table.qr_token}`;
      let svgHtml = '';
      if (typeof QRCode !== 'undefined' && QRCode.generateSVG) {
        svgHtml = QRCode.generateSVG(targetUrl, { cellSize: 4.8, margin: 2 });
      }

      const card = document.createElement('div');
      card.className = 'printable-table-card';
      card.innerHTML = `
        <div class="standee-header">
          <div class="standee-logo">🍽️</div>
          <h2 class="standee-brand-name">Table<span>Bite</span></h2>
          <p class="standee-tagline">Artisanal Dine-in &bull; Contactless Experience</p>
        </div>

        <div class="standee-table-box">
          <span class="standee-label">YOUR TABLE NUMBER</span>
          <span class="standee-number">${table.table_number.padStart(2, '0')}</span>
        </div>

        <div class="standee-qr-frame">
          <div class="standee-qr-svg">${svgHtml}</div>
        </div>

        <div class="standee-steps">
          <div class="standee-step">
            <span class="step-num">1</span>
            <span>Open camera &amp; scan QR</span>
          </div>
          <div class="standee-step">
            <span class="step-num">2</span>
            <span>Select dishes &amp; customize</span>
          </div>
          <div class="standee-step">
            <span class="step-num">3</span>
            <span>Pay via UPI &amp; food arrives!</span>
          </div>
        </div>

        <div class="standee-footer">
          <span>No app download required &bull; Free Wi-Fi: <strong>TableBite_Guest</strong></span>
        </div>
      `;
      batchCardsContainer.appendChild(card);
    });
  }

  if (printQrPreviewBtn) {
    printQrPreviewBtn.addEventListener('click', async () => {
      if (tablesCache.length === 0) {
        await loadTables();
      }
      renderBatchCards();
      if (batchPrintBackdrop) {
        batchPrintBackdrop.classList.remove('hidden');
      }
    });
  }

  if (closeBatchPrintBtn) {
    closeBatchPrintBtn.addEventListener('click', () => {
      batchPrintBackdrop.classList.add('hidden');
    });
  }

  if (cancelBatchPrintBtn) {
    cancelBatchPrintBtn.addEventListener('click', () => {
      batchPrintBackdrop.classList.add('hidden');
    });
  }

  if (batchPrintBackdrop) {
    batchPrintBackdrop.addEventListener('click', (e) => {
      if (e.target === batchPrintBackdrop) {
        batchPrintBackdrop.classList.add('hidden');
      }
    });
  }

  if (triggerBatchPrintBtn) {
    triggerBatchPrintBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================
  // 8. Shop Settings & Onboarding (Phase 6)
  // ==========================================
  const shopSettingsForm = document.getElementById('shopSettingsForm');
  const settingShopName = document.getElementById('settingShopName');
  const settingTagline = document.getElementById('settingTagline');
  const settingUpiVpa = document.getElementById('settingUpiVpa');
  const settingMerchantName = document.getElementById('settingMerchantName');
  const settingTaxPercent = document.getElementById('settingTaxPercent');
  const settingCurrency = document.getElementById('settingCurrency');
  const settingContactPhone = document.getElementById('settingContactPhone');
  const settingWifiName = document.getElementById('settingWifiName');
  const settingWifiPass = document.getElementById('settingWifiPass');

  async function loadShopSettings() {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) return;
      const data = await res.json();
      const s = data.settings || {};

      if (settingShopName) settingShopName.value = s.restaurant_name || '';
      if (settingTagline) settingTagline.value = s.tagline || '';
      if (settingUpiVpa) settingUpiVpa.value = s.upi_vpa || '';
      if (settingMerchantName) settingMerchantName.value = s.upi_merchant_name || '';
      if (settingTaxPercent) settingTaxPercent.value = s.tax_percent || '5';
      if (settingCurrency) settingCurrency.value = s.currency_symbol || '₹';
      if (settingContactPhone) settingContactPhone.value = s.contact_phone || '';
      if (settingWifiName) settingWifiName.value = s.wifi_name || '';
      if (settingWifiPass) settingWifiPass.value = s.wifi_pass || '';
    } catch (err) {
      console.warn('Failed to load shop settings', err);
    }
  }

  if (shopSettingsForm) {
    shopSettingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        restaurant_name: settingShopName ? settingShopName.value.trim() : '',
        tagline: settingTagline ? settingTagline.value.trim() : '',
        upi_vpa: settingUpiVpa ? settingUpiVpa.value.trim() : '',
        upi_merchant_name: settingMerchantName ? settingMerchantName.value.trim() : '',
        tax_percent: settingTaxPercent ? settingTaxPercent.value : '5',
        currency_symbol: settingCurrency ? settingCurrency.value.trim() : '₹',
        contact_phone: settingContactPhone ? settingContactPhone.value.trim() : '',
        wifi_name: settingWifiName ? settingWifiName.value.trim() : '',
        wifi_pass: settingWifiPass ? settingWifiPass.value.trim() : ''
      };

      try {
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast('✓ Restaurant settings updated successfully!');
        } else {
          showToast('Error saving settings');
        }
      } catch (err) {
        showToast('Network error updating settings');
      }
    });
  }

  // ==========================================
  // 9. Toast Alerts
  // ==========================================
  const adminToastContainer = document.getElementById('adminToastContainer');
  function showToast(message) {
    if (!adminToastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    adminToastContainer.appendChild(toast);

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
