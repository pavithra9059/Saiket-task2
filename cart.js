/**
 * LUXE MARKET — Cart Page Script
 * Renders cart items, handles quantity changes, removals, and totals.
 */

document.addEventListener('DOMContentLoaded', renderCartPage);

function renderCartPage() {
  const items = Cart.getAll();

  const listSection  = document.getElementById('cart-items-list');
  const emptyState   = document.getElementById('cart-empty');
  const summaryPanel = document.getElementById('cart-summary');

  if (!listSection) return;

  if (items.length === 0) {
    // Show empty state
    listSection.style.display    = 'none';
    emptyState.classList.add('visible');
    if (summaryPanel) summaryPanel.style.display = 'none';
    return;
  }

  // Hide empty state, show content
  emptyState.classList.remove('visible');
  listSection.style.display  = '';
  if (summaryPanel) summaryPanel.style.display = '';

  // Build item HTML
  listSection.innerHTML = items.map(item => `
    <div class="cart-item" id="item-${item.id}">

      <img class="cart-item-img"
           src="${item.image}"
           alt="${item.name}"
           loading="lazy">

      <div class="cart-item-details">
        <span class="cart-item-category">${item.category}</span>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)} each</div>
      </div>

      <div class="cart-item-controls">
        <div class="cart-item-total" id="item-total-${item.id}">
          ${formatPrice(item.price * item.quantity)}
        </div>

        <div class="qty-controls">
          <button class="qty-btn"
                  onclick="changeQty('${item.id}', -1)"
                  aria-label="Decrease quantity">−</button>
          <span class="qty-value" id="qty-${item.id}">${item.quantity}</span>
          <button class="qty-btn"
                  onclick="changeQty('${item.id}', +1)"
                  aria-label="Increase quantity">+</button>
        </div>

        <button class="btn-remove" onclick="removeFromCart('${item.id}')">
          🗑 Remove
        </button>
      </div>

    </div>
  `).join('');

  updateSummary();
}


/** Change quantity by delta (+1 / -1) */
function changeQty(productId, delta) {
  Cart.updateQuantity(productId, delta);

  const items  = Cart.getAll();
  const item   = items.find(i => i.id === productId);

  if (!item) {
    // Item was removed (qty hit 0)
    const row = document.getElementById(`item-${productId}`);
    if (row) {
      row.style.transition = 'opacity 0.3s, transform 0.3s';
      row.style.opacity    = '0';
      row.style.transform  = 'translateX(20px)';
      setTimeout(() => renderCartPage(), 300);
    }
    return;
  }

  // Patch the DOM without a full re-render
  const qtyEl   = document.getElementById(`qty-${productId}`);
  const totalEl = document.getElementById(`item-total-${productId}`);
  if (qtyEl)   qtyEl.textContent   = item.quantity;
  if (totalEl) totalEl.textContent = formatPrice(item.price * item.quantity);
  updateSummary();
}


/** Remove a product from cart and re-render */
function removeFromCart(productId) {
  const row = document.getElementById(`item-${productId}`);
  if (row) {
    row.style.transition = 'opacity 0.3s, transform 0.3s';
    row.style.opacity    = '0';
    row.style.transform  = 'translateX(20px)';
    setTimeout(() => {
      Cart.removeItem(productId);
      renderCartPage();
    }, 300);
  } else {
    Cart.removeItem(productId);
    renderCartPage();
  }
}


/** Refresh the order summary numbers */
function updateSummary() {
  const items    = Cart.getAll();
  const subtotal = Cart.getTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const total    = subtotal + shipping;

  setText('summary-subtotal', formatPrice(subtotal));
  setText('summary-shipping', shipping === 0 ? 'Free' : formatPrice(shipping));
  setText('summary-total',    formatPrice(total));
  setText('summary-item-count',
          `${Cart.getCount()} ${Cart.getCount() === 1 ? 'item' : 'items'}`);
}


/** Helper: set text content of element by id */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
