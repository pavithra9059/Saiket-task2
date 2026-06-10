/**
 * LUXE MARKET — Checkout Page Script
 * Handles: order summary population, form validation,
 *          payment toggle, and order submission.
 */

document.addEventListener('DOMContentLoaded', initCheckout);

function initCheckout() {
  renderCheckoutSummary();
  setupPaymentToggle();
  setupFormSubmission();
}


// ── Render the order summary panel ──────────────────────────────

function renderCheckoutSummary() {
  const items = Cart.getAll();

  const listEl     = document.getElementById('checkout-item-list');
  const subtotalEl = document.getElementById('co-subtotal');
  const shippingEl = document.getElementById('co-shipping');
  const totalEl    = document.getElementById('co-total');

  if (!listEl) return;

  if (items.length === 0) {
    listEl.innerHTML = '<p style="color:var(--color-muted);font-size:.85rem">Your cart is empty.</p>';
  } else {
    listEl.innerHTML = items.map(item => `
      <div class="checkout-item">
        <img class="checkout-item-img" src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="checkout-item-info">
          <div class="name">${item.name}</div>
          <div class="meta">Qty: ${item.quantity} · ${formatPrice(item.price)} each</div>
        </div>
        <div class="checkout-item-price">${formatPrice(item.price * item.quantity)}</div>
      </div>
    `).join('');
  }

  const subtotal = Cart.getTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const total    = subtotal + shipping;

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
  if (totalEl)    totalEl.textContent    = formatPrice(total);
}


// ── Payment method toggle ────────────────────────────────────────

function setupPaymentToggle() {
  const radios    = document.querySelectorAll('input[name="payment"]');
  const ccFields  = document.getElementById('credit-card-fields');

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'credit_card' && ccFields) {
        ccFields.classList.add('visible');
      } else if (ccFields) {
        ccFields.classList.remove('visible');
      }
    });
  });
}


// ── Form Validation & Submission ─────────────────────────────────

function setupFormSubmission() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (validateCheckoutForm()) {
      placeOrder();
    }
  });
}


/**
 * Validate all checkout form fields.
 * Returns true if valid, false otherwise.
 */
function validateCheckoutForm() {
  let valid = true;

  // Define fields to validate: [inputId, errorId, validation fn, error msg]
  const rules = [
    ['full-name',    'err-name',    val => val.trim().length >= 2,
      'Please enter your full name.'],
    ['email',        'err-email',   val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'Enter a valid email address.'],
    ['phone',        'err-phone',   val => /^[6-9]\d{9}$/.test(val.replace(/\s/g, '')),
      'Enter a valid 10-digit mobile number.'],
    ['address',      'err-address', val => val.trim().length >= 5,
      'Enter your full shipping address.'],
    ['city',         'err-city',    val => val.trim().length >= 2,
      'Enter your city.'],
    ['state',        'err-state',   val => val !== '',
      'Select your state.'],
    ['zip',          'err-zip',     val => /^\d{6}$/.test(val.trim()),
      'Enter a valid 6-digit PIN code.'],
  ];

  // Check credit card fields if that method is selected
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
  if (paymentMethod === 'credit_card') {
    rules.push(
      ['card-number', 'err-card-number', val => val.replace(/\s/g, '').length === 16,
        'Enter a valid 16-digit card number.'],
      ['card-expiry', 'err-card-expiry',
        val => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val.trim()),
        'Enter expiry as MM/YY.'],
      ['card-cvv',    'err-card-cvv',    val => /^\d{3,4}$/.test(val.trim()),
        'Enter a valid CVV.']
    );
  }

  // Run each rule
  rules.forEach(([inputId, errorId, testFn, message]) => {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (!input) return;

    const ok = testFn(input.value);
    input.classList.toggle('error', !ok);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.toggle('visible', !ok);
    }
    if (!ok) valid = false;
  });

  // Scroll to first error
  if (!valid) {
    const firstError = document.querySelector('.form-group input.error, .form-group select.error');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return valid;
}


/**
 * Place the order: show confirmation, clear cart.
 */
function placeOrder() {
  const orderId   = generateOrderId();
  const nameInput = document.getElementById('full-name');
  const customerName = nameInput ? nameInput.value.split(' ')[0] : 'there';

  // Update success message elements
  const orderIdEl   = document.getElementById('order-id');
  const greetingEl  = document.getElementById('order-greeting');
  if (orderIdEl)  orderIdEl.textContent  = orderId;
  if (greetingEl) greetingEl.textContent = `Thank you, ${customerName}!`;

  // Hide form sections
  document.querySelectorAll('.form-card, .checkout-layout > *:not(.order-success-wrap)')
    .forEach(el => el.style.opacity = '0.3');

  // Show success card
  const successEl = document.getElementById('order-success');
  if (successEl) successEl.classList.add('visible');

  // Scroll to success
  successEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Clear the cart
  Cart.clear();

  // Update nav count
  Cart.updateNavCount();
}
