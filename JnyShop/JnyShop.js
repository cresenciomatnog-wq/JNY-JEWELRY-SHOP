// Inventory Data
const products = [
  { id: 1, name: "18K Gold Cuban Chain", category: "Necklaces", price: 18500, icon: "📿" },
  { id: 2, name: "Gold Wedding Band", category: "Rings", price: 8200, icon: "💍" },
  { id: 3, name: "Solitaire Diamond Ring", category: "Rings", price: 12400, icon: "💎" },
  { id: 4, name: "18K Solid Gold Bangle", category: "Bracelets", price: 15300, icon: "🔱" },
  { id: 5, name: "Gold Stud Earrings", category: "Earrings", price: 4500, icon: "✨" },
  { id: 6, name: "Rope Chain Necklace", category: "Necklaces", price: 11200, icon: "📿" }
];

let cart = [];
let currentCategory = 'all';

// Render Products
function renderProducts(items) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  if (items.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 2rem;">No products found.</p>`;
    return;
  }

  items.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img">${product.icon}</div>
      <div class="product-info">
        <div class="product-cat">${product.category}</div>
        <div class="product-title">${product.name}</div>
        <div class="product-price">₱${product.price.toLocaleString('en-PH')}</div>
        <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Feature 1: Filter & Search
function filterCategory(category, btn) {
  currentCategory = category;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

function applyFilters() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = products.filter(p => {
    const matchCat = (currentCategory === 'all') || (p.category === currentCategory);
    const matchSearch = p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });
  renderProducts(filtered);
}

// Feature 2: Interactive Cart
function addToCart(id) {
  const item = products.find(p => p.id === id);
  const inCart = cart.find(c => c.id === id);

  if (inCart) {
    inCart.quantity++;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  updateCart();
  showToast(`${item.name} added to cart!`);
}

function updateQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) removeFromCart(id);
  }
  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  countEl.innerText = count;

  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartItems.innerHTML = `<p style="text-align: center; color: #888; margin-top: 2rem;">Cart is empty.</p>`;
    checkoutBtn.disabled = true;
  } else {
    checkoutBtn.disabled = false;
    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div>
          <h4>${item.name}</h4>
          <p>₱${item.price.toLocaleString()} x ${item.quantity}</p>
          <div style="margin-top: 4px;">
            <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
            <span style="font-size: 0.85rem; padding: 0 4px;">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      `;
      cartItems.appendChild(div);
    });
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalEl.innerText = `₱${total.toLocaleString('en-PH')}`;
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
}

// Feature 3: Checkout Modal
function openCheckout() {
  if (cart.length > 0) document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('active');
}

function handleOrderSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  alert(`Order confirmed! Thank you, ${name}.`);
  cart = [];
  updateCart();
  closeCheckout();
  toggleCart();
  document.getElementById('checkoutForm').reset();
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// Initial Render
renderProducts(products);