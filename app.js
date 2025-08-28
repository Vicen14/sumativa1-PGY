/* app.js — carro de compras (localStorage) + sesión (simulada) */
const CART_KEY = 'ppg_cart';
const USER_KEY = 'ppg_user';
const RETURN_KEY = 'ppg_return';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function clearCart() { saveCart([]); }

function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; } catch { return null; }
}
function setUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
function logoutUser() { localStorage.removeItem(USER_KEY); }

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (!countEl) return;
  const cart = getCart();
  const total = cart.reduce((a, it) => a + it.qty, 0);
  countEl.textContent = total;
}

function addToCart(item) {
  const cart = getCart();
  const idx = cart.findIndex(x => x.id === item.id);
  if (idx >= 0) {
    cart[idx].qty += item.qty || 1;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, image: item.image || '', qty: item.qty || 1 });
  }
  saveCart(cart);
  alert('Producto agregado al carro 🛒');
}

function removeFromCart(id) {
  const cart = getCart().filter(x => x.id !== id);
  saveCart(cart);
  renderCartTable();
}

function changeQty(id, delta) {
  const cart = getCart();
  const it = cart.find(x => x.id === id);
  if (!it) return;
  it.qty = Math.max(1, it.qty + delta);
  saveCart(cart);
  renderCartTable();
}

function requireAuth(redirectTo) {
  const user = getUser();
  if (user && user.loggedIn) return true;
  if (redirectTo) localStorage.setItem(RETURN_KEY, redirectTo);
  window.location.href = 'login.html';
  return false;
}

/* Adjunta listeners a botones "Agregar" */
function initAddButtons() {
  document.querySelectorAll('.btn-add[data-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price || '0');
      const image = btn.dataset.image || '';
      addToCart({ id, name, price, image, qty: 1 });
    });
  });
}

/* Render del carro (carro.html) */
function renderCartTable() {
  const tbody = document.getElementById('cartBody');
  const totalEl = document.getElementById('cartTotal');
  if (!tbody || !totalEl) return;

  const cart = getCart();
  tbody.innerHTML = '';
  let subtotal = 0;

  cart.forEach(it => {
    const line = it.price * it.qty;
    subtotal += line;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="align-middle">
        <div class="d-flex align-items-center gap-2">
          ${it.image ? `<img src="${it.image}" alt="${it.name}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;">` : ''}
          <strong>${it.name}</strong>
        </div>
      </td>
      <td class="align-middle">$${it.price.toLocaleString('es-CL')}</td>
      <td class="align-middle">
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-secondary" data-dec="${it.id}">-</button>
          <button class="btn btn-light disabled">${it.qty}</button>
          <button class="btn btn-outline-secondary" data-inc="${it.id}">+</button>
        </div>
      </td>
      <td class="align-middle">$${line.toLocaleString('es-CL')}</td>
      <td class="align-middle text-end">
        <button class="btn btn-sm btn-outline-danger" data-del="${it.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  totalEl.textContent = `$${subtotal.toLocaleString('es-CL')}`;

  // Delegación de eventos
  tbody.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.inc, +1)));
  tbody.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.dec, -1)));
  tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => removeFromCart(b.dataset.del)));
}

/* Checkout (checkout.html) */
function renderCheckout() {
  const list = document.getElementById('checkoutList');
  const totalEl = document.getElementById('checkoutTotal');
  if (!list || !totalEl) return;

  if (!requireAuth('checkout.html')) return;

  const cart = getCart();
  if (cart.length === 0) {
    alert('Tu carro está vacío.');
    window.location.href = 'carro.html';
    return;
  }

  list.innerHTML = '';
  let subtotal = 0;
  cart.forEach(it => {
    const line = it.price * it.qty;
    subtotal += line;
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `<span>${it.name} × ${it.qty}</span><strong>$${line.toLocaleString('es-CL')}</strong>`;
    list.appendChild(li);
  });
  totalEl.textContent = `$${subtotal.toLocaleString('es-CL')}`;

  // Prefill usuario
  const user = getUser();
  if (user) {
    const email = document.getElementById('chkEmail');
    const nombre = document.getElementById('chkNombre');
    if (email && !email.value) email.value = user.email || '';
    if (nombre && !nombre.value) nombre.value = user.name || 'Usuario';
  }

  // Submit pedido
  const form = document.getElementById('checkoutForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const orderId = 'PPG-' + Date.now().toString().slice(-8);
      alert(`Compra realizada ✅\nOrden: ${orderId}`);
      clearCart();
      window.location.href = 'index.html';
    });
  }
}

/* Redirección post-login */
function handlePostLoginRedirect() {
  const ret = localStorage.getItem(RETURN_KEY);
  if (ret) {
    localStorage.removeItem(RETURN_KEY);
    window.location.href = ret;
  }
}

/* Init global */
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initAddButtons();

  // Si estamos en carro.html
  if (document.getElementById('cartBody')) renderCartTable();

  // Si estamos en checkout.html
  if (document.getElementById('checkoutForm')) renderCheckout();
});
