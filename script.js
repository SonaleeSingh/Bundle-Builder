const products = [
  { id: 1, name: "Tie-Dye Lounge Set", price: 150.00, image: "./assets/product-1.jpg" },
  { id: 2, name: "Sunburst Tracksuit", price: 150.00, image: "./assets/product-2.jpg" },
  { id: 3, name: "Retro Red Streetwear", price: 150.00, image: "./assets/product-3.jpg" },
  { id: 4, name: "Urban Sportswear Combo", price: 150.00, image: "./assets/product-4.jpg" },
  { id: 5, name: "Oversized Knit & Coat", price: 150.00, image: "./assets/product-5.jpg" },
  { id: 6, name: "Chic Monochrome Blazer", price: 150.00, image: "./assets/product-6.jpg" }
];
    let bundle = [];

    function init() {
      renderProducts();
      updateBundle();
    }

    function renderProducts() {
      const grid = document.getElementById('productGrid');
      products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';
        productDiv.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
          <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-btn" id="btn-${product.id}" onclick="toggleProduct(${product.id})">
              <span id="btn-text-${product.id}">Add to Bundle</span>
              <span class="btn-icon" id="btn-icon-${product.id}">+</span>
            </button>
          </div>
        `;
        grid.appendChild(productDiv);
      });
    }

    function toggleProduct(productId) {
      const product = products.find(p => p.id === productId);
      const exists = bundle.find(item => item.id === productId);

      if (exists) {
        removeFromBundle(productId);
      } else {
        addToBundle(product);
      }
    }

    function addToBundle(product) {
      bundle.push({ ...product, quantity: 1 });
      updateProductButton(product.id, true);
      updateBundle();
    }

    function removeFromBundle(productId) {
      bundle = bundle.filter(item => item.id !== productId);
      updateProductButton(productId, false);
      updateBundle();
    }

    function increaseQuantity(productId) {
      const item = bundle.find(item => item.id === productId);
      if (item) {
        item.quantity++;
        updateBundle();
      }
    }

    function decreaseQuantity(productId) {
      const item = bundle.find(item => item.id === productId);
      if (item && item.quantity > 1) {
        item.quantity--;
        updateBundle();
      } else if (item && item.quantity === 1) {
        removeFromBundle(productId);
      }
    }

    function updateProductButton(productId, inBundle) {
      const btn = document.getElementById(`btn-${productId}`);
      const btnText = document.getElementById(`btn-text-${productId}`);
      const btnIcon = document.getElementById(`btn-icon-${productId}`);

      if (inBundle) {
        btn.classList.add('added');
        btnText.textContent = 'Added to Bundle';
        btnIcon.textContent = '✓';
      } else {
        btn.classList.remove('added');
        btnText.textContent = 'Add to Bundle';
        btnIcon.textContent = '+';
      }
    }

    function updateBundle() {
      const bundleItems = document.getElementById('bundleItems');
      const bundleSummary = document.getElementById('bundleSummary');
      const checkoutBtn = document.getElementById('checkoutBtn');
      const progressFill = document.getElementById('progressFill');

      const totalItems = bundle.reduce((sum, item) => sum + item.quantity, 0);
      const progressPercent = Math.min((totalItems / 3) * 100, 100);
      progressFill.style.width = `${progressPercent}%`;

      if (bundle.length === 0) {
        bundleItems.innerHTML = `
          <div class="empty-placeholder">
            <div class="skeleton-grid">
              <div class="skeleton-box"></div>
              <div class="skeleton-box"></div>
              <div class="skeleton-box"></div>
              <div class="skeleton-box"></div>
              <div class="skeleton-box"></div>
              <div class="skeleton-box"></div>
            </div>
          </div>
        `;
        bundleSummary.style.display = 'none';
        checkoutBtn.innerHTML = `<span>Add 3 Items to Proceed</span><span class="arrow">→</span>`;
        checkoutBtn.disabled = true;
        return;
      }

      const fragment = document.createDocumentFragment();
      bundle.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'bundle-item';
        itemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="bundle-item-image" loading="lazy">
          <div class="bundle-item-info">
            <div class="bundle-item-name">${item.name}</div>
            <div class="bundle-item-price">$${item.price.toFixed(2)}</div>
          </div>
          <div class="bundle-item-controls">
            <div class="quantity-controls">
              <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">−</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <button class="remove-item" onclick="removeFromBundle(${item.id})" title="Remove">🗑</button>
          </div>
        `;
        fragment.appendChild(itemDiv);
      });

      bundleItems.innerHTML = '';
      bundleItems.appendChild(fragment);

      const subtotalBeforeDiscount = bundle.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discount = totalItems >= 3 ? subtotalBeforeDiscount * 0.3 : 0;
      const subtotal = subtotalBeforeDiscount - discount;

      document.getElementById('discountAmount').textContent = `- $${discount.toFixed(2)} (30%)`;
      document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
      bundleSummary.style.display = 'block';

      if (totalItems >= 3) {
        checkoutBtn.innerHTML = `<span>Add ${totalItems} Items to Proceed</span><span class="arrow">→</span>`;
        checkoutBtn.disabled = false;
      } else {
        const remaining = 3 - totalItems;
        checkoutBtn.innerHTML = `<span>Add ${remaining} More Item${remaining > 1 ? 's' : ''} to Proceed</span><span class="arrow">→</span>`;
        checkoutBtn.disabled = true;
      }
    }

    document.getElementById('checkoutBtn').addEventListener('click', function () {
      const totalItems = bundle.reduce((sum, item) => sum + item.quantity, 0);
      if (totalItems >= 3) {
        alert('Proceeding to checkout with your bundle!');
      }
    });

    init();