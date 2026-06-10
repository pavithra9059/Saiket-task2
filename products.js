/**
 * LUXE MARKET — Product Catalog
 * Single source of truth for all product data.
 * Uses placeholder images from picsum.photos (works offline after first load).
 */

const PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Meridian Leather Watch',
    category: 'Accessories',
    price: 4999,
    originalPrice: 6500,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    badge: 'Best Seller',
    desc: 'Handcrafted genuine leather strap with minimalist Swiss-inspired dial.',
    rating: 4.8,
    reviews: 214
  },
  {
    id: 'prod-002',
    name: 'Arc Wireless Headphones',
    category: 'Electronics',
    price: 7499,
    originalPrice: 9999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    badge: 'Sale',
    desc: '40-hour battery, active noise cancellation, studio-grade sound.',
    rating: 4.7,
    reviews: 389
  },
  {
    id: 'prod-003',
    name: 'Linen Structured Jacket',
    category: 'Clothing',
    price: 3299,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80',
    badge: null,
    desc: 'Breathable Belgian linen with a clean, modern silhouette.',
    rating: 4.5,
    reviews: 97
  },
  {
    id: 'prod-004',
    name: 'Terracotta Mug Set',
    category: 'Home',
    price: 1199,
    originalPrice: 1500,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80',
    badge: 'New',
    desc: 'Set of 4 hand-thrown ceramic mugs in earthy terracotta glaze.',
    rating: 4.9,
    reviews: 158
  },
  {
    id: 'prod-005',
    name: 'Canvas Minimal Backpack',
    category: 'Accessories',
    price: 2499,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    badge: null,
    desc: 'Waxed canvas body with brass hardware; fits 15" laptop.',
    rating: 4.6,
    reviews: 73
  },
  {
    id: 'prod-006',
    name: 'Obsidian Desk Lamp',
    category: 'Home',
    price: 3899,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80',
    badge: 'Sale',
    desc: 'Matte black aluminum body with warm 2700K LED and touch dimmer.',
    rating: 4.7,
    reviews: 201
  },
  {
    id: 'prod-007',
    name: 'Slim Mechanical Keyboard',
    category: 'Electronics',
    price: 6999,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
    badge: 'New',
    desc: 'TKL layout, low-profile red switches, per-key RGB backlight.',
    rating: 4.8,
    reviews: 312
  },
  {
    id: 'prod-008',
    name: 'Cashmere Ribbed Sweater',
    category: 'Clothing',
    price: 5499,
    originalPrice: 7000,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80',
    badge: 'Sale',
    desc: 'Grade-A Mongolian cashmere in a relaxed, oversized fit.',
    rating: 4.9,
    reviews: 145
  },
  {
    id: 'prod-009',
    name: 'Stainless Tumbler 500ml',
    category: 'Home',
    price: 899,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    badge: null,
    desc: 'Triple-wall vacuum insulation; keeps cold 24h, hot 12h.',
    rating: 4.6,
    reviews: 521
  },
  {
    id: 'prod-010',
    name: 'Polaroid Instant Camera',
    category: 'Electronics',
    price: 5999,
    originalPrice: 7500,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80',
    badge: 'Popular',
    desc: 'Pastel edition with self-timer and double-exposure mode.',
    rating: 4.7,
    reviews: 267
  },
  {
    id: 'prod-011',
    name: 'Merino Wool Scarf',
    category: 'Clothing',
    price: 1699,
    originalPrice: 2200,
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80',
    badge: 'Sale',
    desc: 'Extra-fine 18.5 micron merino in a versatile oversized wrap.',
    rating: 4.5,
    reviews: 88
  },
  {
    id: 'prod-012',
    name: 'Hammered Brass Bookends',
    category: 'Home',
    price: 2199,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
    badge: 'New',
    desc: 'Solid brass with antique hammered finish; weight 1.2 kg each.',
    rating: 4.8,
    reviews: 56
  }
];


/**
 * Build a single product card HTML string.
 * @param {Object} product
 * @returns {string} HTML
 */
function buildProductCard(product) {
  const badge = product.badge
    ? `<span class="product-badge">${product.badge}</span>`
    : '';

  const originalPrice = product.originalPrice
    ? `<span class="original">${formatPrice(product.originalPrice)}</span>`
    : '';

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image-wrap">
        ${badge}
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <div class="product-footer">
          <div class="product-price">
            ${formatPrice(product.price)}
            ${originalPrice}
          </div>
          <button
            class="btn-add-cart"
            onclick="handleAddToCart('${product.id}')"
            aria-label="Add ${product.name} to cart"
          >
            ＋ Add
          </button>
        </div>
      </div>
    </div>
  `;
}


/**
 * Handle add-to-cart click (called from HTML onclick).
 * @param {string} productId
 */
function handleAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (product) {
    Cart.addItem({
      id:       product.id,
      name:     product.name,
      category: product.category,
      price:    product.price,
      image:    product.image
    });
  }
}
