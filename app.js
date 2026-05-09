const db = new Dexie('MilkyHugDB');

db.version(1).stores({
    products: '++id,sku,name,category,stock,price,retailPrice',
    sales: '++id,timestamp,total,receiptNumber',
    users: '++id,username,password,role'
});

const state = {
    currentUser: null,
    cart: [],
    productList: [],
    settings: {},
    cartTaxPercent: 0,
    cartDiscount: 0
};

const selectors = {
    loginScreen: document.getElementById('loginScreen'),
    loginForm: document.getElementById('loginForm'),
    usernameInput: document.getElementById('usernameInput'),
    passwordInput: document.getElementById('passwordInput'),
    logoutButton: document.getElementById('logoutButton'),
    userBadge: document.getElementById('userBadge'),
    menuButtons: document.querySelectorAll('.menu-btn'),
    sections: document.querySelectorAll('section'),
    dashboardSection: document.getElementById('dashboardSection'),
    salesSection: document.getElementById('salesSection'),
    productsSection: document.getElementById('productsSection'),
    inventorySection: document.getElementById('inventorySection'),
    reportSection: document.getElementById('reportSection'),
    settingsSection: document.getElementById('settingsSection'),
    totalSales: document.getElementById('totalSales'),
    itemsSold: document.getElementById('itemsSold'),
    lowStockCount: document.getElementById('lowStockCount'),
    latestBill: document.getElementById('latestBill'),
    lastSaleTime: document.getElementById('lastSaleTime'),
    posSearch: document.getElementById('posSearch'),
    productList: document.getElementById('productList'),
    cartItems: document.getElementById('cartItems'),
    cartCount: document.getElementById('cartCount'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartTaxAmount: document.getElementById('cartTaxAmount'),
    cartDiscountDisplay: document.getElementById('cartDiscountDisplay'),
    cartSavings: document.getElementById('cartSavings'),
    cartTotal: document.getElementById('cartTotal'),
    cartTaxPercent: document.getElementById('cartTaxPercent'),
    cartDiscountAmount: document.getElementById('cartDiscountAmount'),
    clearCartBtn: document.getElementById('clearCartBtn'),
    completeSaleBtn: document.getElementById('completeSaleBtn'),
    openReceiptTemplate: document.getElementById('openReceiptTemplate'),
    openAddProduct: document.getElementById('openAddProduct'),
    productsTable: document.getElementById('productsTable'),
    inwardForm: document.getElementById('inwardForm'),
    inwardProduct: document.getElementById('inwardProduct'),
    inwardQuantity: document.getElementById('inwardQuantity'),
    reportDate: document.getElementById('reportDate'),
    reportSalesCount: document.getElementById('reportSalesCount'),
    reportRevenue: document.getElementById('reportRevenue'),
    reportUnits: document.getElementById('reportUnits'),
    recentSales: document.getElementById('recentSales'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),
    exportXlsxBtn: document.getElementById('exportXlsxBtn'),
    sendReportBtn: document.getElementById('sendReportBtn'),
    emailConfigForm: document.getElementById('emailConfigForm'),
    emailServiceId: document.getElementById('emailServiceId'),
    emailTemplateId: document.getElementById('emailTemplateId'),
    emailUserId: document.getElementById('emailUserId'),
    reportEmail: document.getElementById('reportEmail'),
    usersSection: document.getElementById('usersSection'),
    userForm: document.getElementById('userForm'),
    usersTable: document.getElementById('usersTable'),
    newUsername: document.getElementById('newUsername'),
    newPassword: document.getElementById('newPassword'),
    newRole: document.getElementById('newRole'),
    dailyCloseBtn: document.getElementById('dailyCloseBtn'),
    productsSectionEl: document.getElementById('productsSection'),
};

async function initializeData() {
    const userCount = await db.users.count();
    if (!userCount) {
        await db.users.bulkAdd([
            { username: 'admin', password: 'admin123', role: 'admin' },
            { username: 'staff', password: 'staff123', role: 'staff' }
        ]);
    }

    const productCount = await db.products.count();
    if (!productCount) {
        await db.products.bulkAdd([
            { sku: 'MLK-A1', name: 'Fresh Milk 1L', category: 'Milk', stock: 45, price: 60, retailPrice: 75 },
            { sku: 'GHR-B2', name: 'Cow Ghee 500g', category: 'Ghee', stock: 28, price: 260, retailPrice: 320 },
            { sku: 'YGT-C3', name: 'Plain Yogurt 400g', category: 'Yogurt', stock: 32, price: 55, retailPrice: 70 },
            { sku: 'PNK-D4', name: 'Paneer 250g', category: 'Dairy', stock: 18, price: 120, retailPrice: 150 },
            { sku: 'CHS-E5', name: 'Cheese Slices', category: 'Dairy', stock: 15, price: 80, retailPrice: 100 }
        ]);
    }

    const savedSettings = JSON.parse(localStorage.getItem('milkyHugSettings') || '{}');
    state.settings = savedSettings;
    selectors.emailServiceId.value = savedSettings.serviceId || '';
    selectors.emailTemplateId.value = savedSettings.templateId || '';
    selectors.emailUserId.value = savedSettings.userId || '';
    selectors.reportEmail.value = savedSettings.toEmail || '';

    if (savedSettings.userId) {
        emailjs.init(savedSettings.userId);
    }
}

function showSection(targetId) {
    if (targetId === 'usersSection' && state.currentUser?.role !== 'admin') {
        return alert('Only admin users can access user management.');
    }
    selectors.sections.forEach((section) => {
        section.classList.toggle('hidden', section.id !== targetId);
    });
}

function updateUserBadge() {
    if (!state.currentUser) return;
    selectors.logoutButton.classList.remove('hidden');
    selectors.userBadge.classList.remove('hidden');
    selectors.userBadge.textContent = `${state.currentUser.username}`;
}

async function renderDashboard() {
    const sales = await db.sales.toArray();
    const products = await db.products.toArray();
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const itemsSold = sales.reduce((sum, sale) => sum + (Array.isArray(sale.items) ? sale.items.reduce((iSum, item) => iSum + item.quantity, 0) : 0), 0);
    const lowStock = products.filter((product) => product.stock <= 10).length;

    selectors.totalSales.textContent = `LKR${totalSales.toLocaleString()}`;
    selectors.itemsSold.textContent = itemsSold;
    selectors.lowStockCount.textContent = lowStock;
    selectors.latestBill.textContent = sales.length ? `#${sales[sales.length - 1].id}` : '—';
    selectors.lastSaleTime.textContent = sales.length ? new Date(sales[sales.length - 1].timestamp).toLocaleString() : '—';
}

function filterProducts(query) {
    const lower = query.trim().toLowerCase();
    return state.productList.filter((product) => {
        if (!lower) return true;
        return [product.name, product.sku, product.category].some((field) => field.toLowerCase().includes(lower));
    });
}

function renderProducts(products) {
    selectors.productsTable.innerHTML = '';
    selectors.productList.innerHTML = '';
    selectors.inwardProduct.innerHTML = '<option value="">Select a product</option>';

    products.forEach((product) => {
        selectors.inwardProduct.insertAdjacentHTML('beforeend', `<option value="${product.id}">${product.name} — ${product.sku}</option>`);

        const row = document.createElement('tr');
        row.className = product.stock <= 10 ? 'bg-amber-950/30' : 'bg-slate-950/80';
        row.innerHTML = `
            <td class="px-4 py-4 text-slate-300">${product.sku}</td>
            <td class="px-4 py-4 text-slate-100">${product.name}</td>
            <td class="px-4 py-4 text-slate-300">${product.category}</td>
            <td class="px-4 py-4 text-slate-300">${product.stock}</td>
            <td class="px-4 py-4 text-slate-300">LKR${product.retailPrice?.toFixed(2) || product.price.toFixed(2)}</td>
            <td class="px-4 py-4 text-slate-300">LKR${product.price.toFixed(2)}</td>
            <td class="px-4 py-4 text-slate-300 space-x-2">
                <button data-id="${product.id}" class="edit-product-btn rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400">Edit</button>
                <button data-id="${product.id}" class="delete-product-btn rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-red-500">Delete</button>
            </td>
        `;
        selectors.productsTable.appendChild(row);

        const card = document.createElement('div');
        card.className = 'rounded-3xl bg-slate-900 p-5 shadow-inner shadow-slate-900/20';
        card.innerHTML = `
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-slate-400 text-sm">SKU ${product.sku}</p>
                    <h3 class="mt-2 text-xl font-semibold text-slate-100">${product.name}</h3>
                    <p class="mt-1 text-slate-400">${product.category}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-slate-400 line-through">Retail LKR${product.retailPrice?.toFixed(2) || product.price.toFixed(2)}</p>
                    <p class="text-xl font-semibold text-sky-300">Outlet LKR${product.price.toFixed(2)}</p>
                    <p class="mt-2 text-sm text-slate-400">Stock: ${product.stock}</p>
                </div>
            </div>
            <div class="mt-5 flex flex-wrap gap-3">
                <button data-id="${product.id}" class="add-cart-btn rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400">Add</button>
            </div>
        `;

        selectors.productList.appendChild(card);
    });
}

async function loadProducts() {
    state.productList = await db.products.orderBy('name').toArray();
    renderProducts(state.productList);
}

async function loadUsers() {
    const users = await db.users.orderBy('username').toArray();
    renderUsers(users);
}

function renderUsers(users) {
    if (!selectors.usersTable) return;
    selectors.usersTable.innerHTML = '';
    if (!users.length) {
        selectors.usersTable.innerHTML = '<tr><td colspan="3" class="px-4 py-4 text-slate-400">No user accounts found.</td></tr>';
        return;
    }
    users.forEach((user) => {
        selectors.usersTable.insertAdjacentHTML('beforeend', `
            <tr class="bg-slate-950/80">
                <td class="px-4 py-4 text-slate-200">${user.username}</td>
                <td class="px-4 py-4 text-slate-300">${user.role}</td>
                <td class="px-4 py-4 text-slate-300 space-x-2">
                    <button data-id="${user.id}" class="reset-user-btn rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400">Reset Password</button>
                    <button data-id="${user.id}" class="delete-user-btn rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-red-500">Delete</button>
                </td>
            </tr>
        `);
    });
}

async function handleUserCreate(event) {
    event.preventDefault();
    const username = selectors.newUsername.value.trim();
    const password = selectors.newPassword.value.trim();
    const role = selectors.newRole.value;
    if (!username || !password) {
        return alert('Please enter a username and password.');
    }
    const existing = await db.users.where('username').equals(username).first();
    if (existing) {
        return alert('Username already exists. Choose a different username.');
    }
    await db.users.add({ username, password, role });
    selectors.newUsername.value = '';
    selectors.newPassword.value = '';
    selectors.newRole.value = 'staff';
    await loadUsers();
    alert('User account created.');
}

async function dailyClose() {
    await downloadXlsxBackup();
    await renderReport();
    if (state.settings.serviceId && state.settings.templateId && state.settings.userId && state.settings.toEmail) {
        await sendReportEmail();
    }
    alert('Daily close completed. Backup downloaded and report queued.');
}

function renderCart() {
    selectors.cartItems.innerHTML = '';
    if (!state.cart.length) {
        selectors.cartItems.innerHTML = '<p class="text-slate-400">Add products to the cart to begin checkout.</p>';
    }

    state.cart.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'rounded-3xl bg-slate-800 p-4 shadow-inner shadow-slate-950/10';
        row.innerHTML = `
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-slate-200 font-semibold">${item.name}</p>
                    <p class="mt-1 text-slate-400 text-sm">${item.sku}</p>
                </div>
                <div class="text-right">
                    <p class="text-slate-100 font-semibold">LKR${item.lineTotal.toFixed(2)}</p>
                    <p class="mt-1 text-xs text-emerald-300">Saved LKR${(((item.retailPrice || item.price) - item.price) * item.quantity).toFixed(2)}</p>
                </div>
            </div>
            <div class="mt-3 flex items-center justify-between gap-3 text-sm text-slate-300">
                <div class="inline-flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-2">
                    <button data-index="${index}" class="decrement-btn rounded-full bg-slate-700 px-2 py-1 hover:bg-slate-600">-</button>
                    <span>${item.quantity}</span>
                    <button data-index="${index}" class="increment-btn rounded-full bg-slate-700 px-2 py-1 hover:bg-slate-600">+</button>
                </div>
                <button data-index="${index}" class="remove-cart-btn rounded-full bg-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-500">Remove</button>
            </div>
        `;
        selectors.cartItems.appendChild(row);
    });

    const subtotal = state.cart.reduce((sum, item) => sum + item.lineTotal, 0);
    const savings = state.cart.reduce((sum, item) => sum + ((item.retailPrice || item.price) - item.price) * item.quantity, 0);
    const discount = state.cartDiscount || 0;
    const taxAmount = subtotal * (state.cartTaxPercent || 0) / 100;
    const total = Math.max(0, subtotal + taxAmount - discount);
    selectors.cartCount.textContent = `${state.cart.length} items`;
    selectors.cartSubtotal.textContent = `LKR${subtotal.toFixed(2)}`;
    if (selectors.cartTaxAmount) selectors.cartTaxAmount.textContent = `LKR${taxAmount.toFixed(2)}`;
    if (selectors.cartDiscountDisplay) selectors.cartDiscountDisplay.textContent = `LKR${discount.toFixed(2)}`;
    if (selectors.cartSavings) selectors.cartSavings.textContent = `LKR${savings.toFixed(2)}`;
    selectors.cartTotal.textContent = `LKR${total.toFixed(2)}`;
}

function updateCartFromProduct(productId) {
    const product = state.productList.find((item) => item.id === Number(productId));
    if (!product || product.stock <= 0) {
        return alert('Unable to add product. Stock unavailable or the item does not exist.');
    }
    const cartItem = state.cart.find((item) => item.id === product.id);
    if (cartItem) {
        if (cartItem.quantity + 1 > product.stock) {
            return alert('Cannot add more than stock available.');
        }
        cartItem.quantity += 1;
        cartItem.lineTotal = cartItem.quantity * cartItem.price;
    } else {
        state.cart.push({
            id: product.id,
            sku: product.sku,
            name: product.name,
            price: product.price,
            retailPrice: product.retailPrice || product.price,
            quantity: 1,
            lineTotal: product.price
        });
    }
    renderCart();
}

function clearCart() {
    state.cart = [];
    renderCart();
}

async function completeSale() {
    if (!state.cart.length) {
        return alert('Your cart is empty. Add products before completing the sale.');
    }

    try {
        const updatedProducts = [];
        for (const item of state.cart) {
            const product = await db.products.get(item.id);
            if (!product || product.stock < item.quantity) {
                return alert(`Insufficient stock for ${item.name}. Please adjust your cart.`);
            }
            product.stock -= item.quantity;
            updatedProducts.push(product);
        }

        const subtotal = state.cart.reduce((sum, item) => sum + item.lineTotal, 0);
        const savings = state.cart.reduce((sum, item) => sum + ((item.retailPrice || item.price) - item.price) * item.quantity, 0);
        const taxAmount = subtotal * (state.cartTaxPercent || 0) / 100;
        const discount = state.cartDiscount || 0;
        const total = Math.max(0, subtotal + taxAmount - discount);
        const saleRecord = {
            timestamp: new Date().toISOString(),
            subtotal,
            taxPercent: state.cartTaxPercent,
            taxAmount,
            discount,
            savings,
            total,
            items: state.cart.map((item) => ({ ...item })),
        };
        let saleId;
        await db.transaction('rw', db.products, db.sales, async () => {
            await Promise.all(updatedProducts.map((prod) => db.products.put(prod)));
            saleId = await db.sales.add(saleRecord);
        });
        const receiptNumber = `MH-${String(saleId).padStart(6, '0')}`;
        await db.sales.update(saleId, { receiptNumber });
        saleRecord.receiptNumber = receiptNumber;
        await loadProducts();
        await renderDashboard();
        clearCart();
        renderCart();
        openReceiptPreview(saleRecord);
    } catch (error) {
        alert(`Sale failed: ${error.message}`);
    }
}

function buildReceiptBodyHtml(sale) {
    const logoHtml = state.settings.receiptLogoUrl ? `<div style="text-align:center;margin-bottom:18px;"><img src="${state.settings.receiptLogoUrl}" alt="Logo" style="max-width:180px;max-height:100px;object-fit:contain;" /></div>` : '';
    const storeName = state.settings.receiptStoreName || 'Milky Hug POS';
    const receiptTitle = state.settings.receiptHeader || 'Receipt';
    const receiptSubtitle = state.settings.receiptSubtitle || '';
    const footerHtml = state.settings.receiptFooter ? `<div style="margin-top:18px;font-size:13px;color:#333;line-height:1.5;">${state.settings.receiptFooter}</div>` : '';
    const itemsHtml = sale.items.map((item) => `
        <div style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;">
                <span>${item.name} x${item.quantity}</span>
                <span>LKR${item.lineTotal.toFixed(2)}</span>
            </div>
            <div style="font-size:12px;color:#555;margin-top:4px;">
                <span>Retail LKR${item.retailPrice?.toFixed(2) || item.price.toFixed(2)}</span>
                <span style="float:right;">Outlet LKR${item.price.toFixed(2)}</span>
            </div>
        </div>
    `).join('');
    const defaultTemplate = `
        <div style="text-align:center; margin-bottom:20px;">
            {{logo}}
            <h1 style="margin:0;font-size:24px;letter-spacing:0.03em;">{{storeName}}</h1>
            <p style="margin:8px 0 0;color:#555;font-size:14px;">{{receiptTitle}}</p>
            <p style="margin:4px 0 0;color:#777;font-size:13px;">{{receiptSubtitle}}</p>
            <p style="margin:10px 0 0;color:#666;font-size:12px;">Receipt #: {{receiptNumber}}</p>
            <p style="margin:2px 0 0;color:#666;font-size:12px;">Date: {{receiptDate}}</p>
        </div>
        <div style="font-size:14px;color:#111;">{{items}}</div>
        <hr style="border:none;border-top:1px dashed #ccc;margin:18px 0;" />
        <div style="font-size:14px;color:#111;line-height:1.6;">
            <div style="display:flex;justify-content:space-between;"><span>Subtotal</span><span>LKR{{subtotal}}</span></div>
            <div style="display:flex;justify-content:space-between;"><span>Tax</span><span>LKR{{taxAmount}}</span></div>
            <div style="display:flex;justify-content:space-between;"><span>Discount</span><span>LKR{{discount}}</span></div>
            <div style="display:flex;justify-content:space-between;"><span>Total Savings</span><span>LKR{{savings}}</span></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:16px;margin-top:16px;">
            <span>Total</span>
            <span>LKR{{total}}</span>
        </div>
        <div style="margin-top:16px;">{{footer}}</div>
    `;
    const template = state.settings.receiptHtmlTemplate || defaultTemplate;
    return template
        .replace(/{{logo}}/g, logoHtml)
        .replace(/{{storeName}}/g, storeName)
        .replace(/{{receiptTitle}}/g, receiptTitle)
        .replace(/{{receiptSubtitle}}/g, receiptSubtitle)
        .replace(/{{receiptNumber}}/g, sale.receiptNumber || '')
        .replace(/{{receiptDate}}/g, new Date(sale.timestamp).toLocaleString())
        .replace(/{{items}}/g, itemsHtml)
        .replace(/{{subtotal}}/g, sale.subtotal.toFixed(2))
        .replace(/{{taxAmount}}/g, sale.taxAmount.toFixed(2))
        .replace(/{{discount}}/g, sale.discount.toFixed(2))
        .replace(/{{savings}}/g, sale.savings.toFixed(2))
        .replace(/{{total}}/g, sale.total.toFixed(2))
        .replace(/{{footer}}/g, footerHtml);
}

function printReceipt(sale = null) {
    if (!sale) {
        sale = {
            items: state.cart,
            subtotal: state.cart.reduce((sum, item) => sum + item.lineTotal, 0),
            taxAmount: state.cart.reduce((sum, item) => sum + item.lineTotal, 0) * (state.cartTaxPercent || 0) / 100,
            discount: state.cartDiscount || 0,
            savings: state.cart.reduce((sum, item) => sum + ((item.retailPrice || item.price) - item.price) * item.quantity, 0),
            total: Math.max(0, state.cart.reduce((sum, item) => sum + item.lineTotal,0) + (state.cartTaxPercent || 0)*state.cart.reduce((sum, item) => sum + item.lineTotal, 0) / 100 - (state.cartDiscount || 0)),
            receiptNumber: '',
            timestamp: new Date().toISOString(),
        };
    }
    if (!sale.items || !sale.items.length) {
        return alert('Add items to the cart before printing a receipt.');
    }
    const receiptHtml = `
        <html>
            <head>
                <title>Milky Hug Receipt</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
                    img { max-width: 100%; height: auto; }
                </style>
            </head>
            <body>
                ${buildReceiptBodyHtml(sale)}
            </body>
        </html>
    `;
    const win = window.open('', '_blank', 'width=450,height=650');
    if (win) {
        win.document.write(receiptHtml);
        win.document.close();
        win.onload = () => {
            win.focus();
            win.print();
        };
    } else {
        alert('Please allow popups for this page so printing can proceed.');
    }
}

function openReceiptPreview(sale) {
    const preview = document.createElement('div');
    preview.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4';
    preview.innerHTML = `
        <div class="w-full max-w-3xl rounded-[2rem] bg-white p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-2xl font-bold text-slate-900">Sale Preview</h3>
                    <p class="text-sm text-slate-500">Review the receipt before printing.</p>
                </div>
                <button id="closeReceiptPreview" class="rounded-full bg-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-300">X</button>
            </div>
            <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
                ${buildReceiptBodyHtml(sale)}
            </div>
            <div class="mt-6 flex flex-col gap-3 sm:flex-row">
                <button id="printReceiptConfirm" class="w-full rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-500">Print</button>
                <button id="cancelReceiptPreview" class="w-full rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(preview);
    preview.querySelector('#closeReceiptPreview').addEventListener('click', () => preview.remove());
    preview.querySelector('#cancelReceiptPreview').addEventListener('click', () => preview.remove());
    preview.querySelector('#printReceiptConfirm').addEventListener('click', () => {
        printReceipt(sale);
        preview.remove();
    });
}

function createDownloadLink(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}

async function buildBackupData() {
    const products = await db.products.toArray();
    const sales = await db.sales.toArray();
    return { products, sales };
}

async function downloadCsvBackup() {
    const { products, sales } = await buildBackupData();
    const rows = ['type,id,timestamp,sku,name,category,stock,price,total,items'];

    products.forEach((product) => {
        rows.push(`product,${product.id},,,${product.name},${product.category},${product.stock},${product.price},,`);
    });

    sales.forEach((sale) => {
        const items = Array.isArray(sale.items) ? sale.items.map((item) => `${item.quantity}x ${item.name}`).join(' | ') : '';
        rows.push(`sale,${sale.id},${sale.timestamp},,,, , ,${sale.total},"${items}"`);
    });

    createDownloadLink(`milkyhug-backup-${new Date().toISOString().slice(0,10)}.csv`, rows.join('\n'), 'text/csv;charset=utf-8;');
}

async function downloadXlsxBackup() {
    const { products, sales } = await buildBackupData();
    const worksheets = {
        Products: products,
        Sales: sales.map((sale) => ({ ...sale, items: Array.isArray(sale.items) ? sale.items.map((item) => `${item.quantity}x ${item.name}`).join(' | ') : '' }))
    };
    const workbook = XLSX.utils.book_new();
    Object.entries(worksheets).forEach(([name, data]) => {
        const sheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, sheet, name);
    });
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    createDownloadLink(`milkyhug-backup-${new Date().toISOString().slice(0,10)}.xlsx`, wbout, 'application/octet-stream');
}

async function renderReport() {
    const sales = await db.sales.toArray();
    const reportDate = new Date().toLocaleDateString();
    const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const units = sales.reduce((sum, sale) => sum + (Array.isArray(sale.items) ? sale.items.reduce((iSum, item) => iSum + item.quantity, 0) : 0), 0);

    selectors.reportDate.textContent = reportDate;
    selectors.reportSalesCount.textContent = sales.length;
    selectors.reportRevenue.textContent = `LKR${revenue.toLocaleString()}`;
    selectors.reportUnits.textContent = units;
    selectors.recentSales.innerHTML = '';

    const recent = sales.slice(-5).reverse();
    if (!recent.length) {
        selectors.recentSales.innerHTML = '<p class="text-slate-400">No sales recorded yet.</p>';
        return;
    }

    recent.forEach((sale) => {
        const itemSummary = Array.isArray(sale.items) ? sale.items.map((item) => `${item.quantity}Ã— ${item.name}`).join(', ') : '';
        selectors.recentSales.insertAdjacentHTML('beforeend', `
            <div class="rounded-3xl bg-slate-800 p-4 text-slate-200">
                <p class="text-sm text-slate-400">#${sale.id} • ${new Date(sale.timestamp).toLocaleTimeString()}</p>
                <p class="mt-2 font-semibold">LKR${sale.total.toFixed(2)}</p>
                <p class="mt-1 text-slate-400 text-sm">${itemSummary}</p>
            </div>
        `);
    });
}

async function sendReportEmail() {
    const { serviceId, templateId, userId, toEmail } = state.settings;
    if (!serviceId || !templateId || !userId || !toEmail) {
        alert('Please configure EmailJS settings and destination email first.');
        return false;
    }
    emailjs.init(userId);
    const sales = await db.sales.toArray();
    const revenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const items = sales.reduce((sum, sale) => sum + (Array.isArray(sale.items) ? sale.items.reduce((iSum, item) => iSum + item.quantity, 0) : 0), 0);
    const params = {
        to_email: toEmail,
        report_date: new Date().toLocaleDateString(),
        report_sales: sales.length,
        report_revenue: `LKR${revenue.toFixed(2)}`,
        report_items: items,
        report_summary: sales.slice(-5).map((sale) => `#${sale.id} = LKR${sale.total.toFixed(2)}`).join('\n')
    };

    try {
        await emailjs.send(serviceId, templateId, params);
        alert('Daily report email sent successfully.');
        return true;
    } catch (err) {
        alert(`Email send failed. Check your EmailJS settings and network. ${err.text || err}`);
        return false;
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const username = selectors.usernameInput.value.trim();
    const password = selectors.passwordInput.value;
    const user = await db.users.where({ username, password }).first();
    if (!user) {
        return alert('Login failed. Please verify your username and password.');
    }
    state.currentUser = user;
    localStorage.setItem('milkyHugCurrentUser', JSON.stringify(user));
    selectors.loginScreen.classList.add('hidden');
    updateUserBadge();
    await loadProducts();
    await loadUsers();
    await renderDashboard();
    await renderReport();
    showSection('dashboardSection');
    toggleAdminFeatures();
}

function toggleAdminFeatures() {
    const isAdmin = state.currentUser?.role === 'admin';
    document.querySelectorAll('.edit-product-btn, .delete-product-btn, #openAddProduct, #openReceiptTemplate, #emailConfigForm button, #userForm button, .reset-user-btn, .delete-user-btn').forEach((button) => {
        button.disabled = !isAdmin;
        button.classList.toggle('opacity-40', !isAdmin);
    });
    const userButton = document.querySelector('[data-target="usersSection"]');
    if (userButton) {
        userButton.classList.toggle('opacity-40', !isAdmin);
        userButton.disabled = !isAdmin;
    }
    if (!isAdmin) {
        selectors.productsSectionEl.querySelector('button#openAddProduct').classList.add('hidden');
        if (selectors.openReceiptTemplate) selectors.openReceiptTemplate.classList.add('hidden');
        if (selectors.usersSection) selectors.usersSection.classList.add('hidden');
    } else {
        if (selectors.usersSection && selectors.usersSection.id === 'usersSection') selectors.usersSection.classList.add('hidden');
        if (selectors.openReceiptTemplate) selectors.openReceiptTemplate.classList.remove('hidden');
    }
}

function openReceiptTemplateModal() {
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4';
    dialog.innerHTML = `
        <div class="w-full max-w-3xl rounded-[2rem] bg-white p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-4 gap-4">
                <div>
                    <h3 class="text-2xl font-bold text-slate-900">Receipt Customization</h3>
                    <p class="text-sm text-slate-500">Add a logo and build a fully customizable receipt layout.</p>
                </div>
                <button id="closeReceiptTemplate" class="rounded-full bg-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-300">X</button>
            </div>
            <div class="grid gap-4 lg:grid-cols-2">
                <div class="space-y-4">
                    <div>
                        <label class="text-sm text-slate-500">Receipt Logo URL</label>
                        <input id="receiptLogoUrl" type="url" value="${state.settings.receiptLogoUrl || ''}" placeholder="https://..." class="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
                    </div>
                    <div>
                        <label class="text-sm text-slate-500">Store Name</label>
                        <input id="receiptStoreName" value="${state.settings.receiptStoreName || 'Milky Hug POS'}" class="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
                    </div>
                    <div>
                        <label class="text-sm text-slate-500">Receipt Title</label>
                        <input id="receiptHeader" value="${state.settings.receiptHeader || 'Receipt'}" class="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
                    </div>
                    <div>
                        <label class="text-sm text-slate-500">Receipt Subtitle</label>
                        <input id="receiptSubtitle" value="${state.settings.receiptSubtitle || 'Thank you for shopping with us!'}" class="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
                    </div>
                </div>
                <div>
                    <label class="text-sm text-slate-500">Footer Message</label>
                    <textarea id="receiptFooter" class="mt-2 h-40 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" placeholder="Enter footer text">${state.settings.receiptFooter || 'Powered by Milky Hug POS.'}</textarea>
                </div>
            </div>
            <div class="mt-4">
                <label class="text-sm text-slate-500">Advanced Receipt HTML Template</label>
                <textarea id="receiptHtmlTemplate" class="mt-2 h-48 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" placeholder="Use {{logo}}, {{storeName}}, {{receiptTitle}}, {{receiptSubtitle}}, {{items}}, {{total}}, {{footer}}">${state.settings.receiptHtmlTemplate || ''}</textarea>
                <p class="mt-2 text-sm text-slate-500">Use placeholders: <span class="font-semibold">{{logo}}</span>, <span class="font-semibold">{{storeName}}</span>, <span class="font-semibold">{{receiptTitle}}</span>, <span class="font-semibold">{{receiptSubtitle}}</span>, <span class="font-semibold">{{receiptNumber}}</span>, <span class="font-semibold">{{receiptDate}}</span>, <span class="font-semibold">{{items}}</span>, <span class="font-semibold">{{subtotal}}</span>, <span class="font-semibold">{{taxAmount}}</span>, <span class="font-semibold">{{discount}}</span>, <span class="font-semibold">{{savings}}</span>, <span class="font-semibold">{{total}}</span>, <span class="font-semibold">{{footer}}</span>.</p>
            </div>
            <div class="mt-5 flex flex-col gap-3 sm:flex-row">
                <button id="previewReceiptTemplate" class="w-full rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-500">Preview</button>
                <button id="saveReceiptTemplate" class="w-full rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500">Save</button>
                <button id="cancelReceiptTemplate" class="w-full rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.querySelector('#closeReceiptTemplate').addEventListener('click', () => dialog.remove());
    dialog.querySelector('#cancelReceiptTemplate').addEventListener('click', () => dialog.remove());
    dialog.querySelector('#previewReceiptTemplate').addEventListener('click', () => {
        const previewItems = state.cart.length ? state.cart : [{ name: 'Sample Product', quantity: 1, price: 0, lineTotal: 0, retailPrice: 0 }];
        const previewSale = {
            items: previewItems,
            subtotal: previewItems.reduce((sum, item) => sum + item.lineTotal, 0),
            taxAmount: 0,
            discount: 0,
            savings: previewItems.reduce((sum, item) => sum + ((item.retailPrice || item.price) - item.price) * item.quantity, 0),
            total: previewItems.reduce((sum, item) => sum + item.lineTotal, 0),
            receiptNumber: 'PREVIEW',
            timestamp: new Date().toISOString(),
        };
        const previewHtml = buildReceiptBodyHtml(previewSale);
        const previewWindow = window.open('', '_blank', 'width=450,height=650');
        if (previewWindow) {
            previewWindow.document.write(`<html><head><title>Receipt Preview</title><style>body{font-family:Arial,sans-serif;padding:20px;color:#111;}img{max-width:100%;height:auto;}</style></head><body>${previewHtml}</body></html>`);
            previewWindow.document.close();
        } else {
            alert('Please allow popups to preview the receipt.');
        }
    });
    dialog.querySelector('#saveReceiptTemplate').addEventListener('click', () => {
        state.settings.receiptLogoUrl = dialog.querySelector('#receiptLogoUrl').value.trim();
        state.settings.receiptStoreName = dialog.querySelector('#receiptStoreName').value.trim();
        state.settings.receiptHeader = dialog.querySelector('#receiptHeader').value.trim();
        state.settings.receiptSubtitle = dialog.querySelector('#receiptSubtitle').value.trim();
        state.settings.receiptFooter = dialog.querySelector('#receiptFooter').value.trim();
        state.settings.receiptHtmlTemplate = dialog.querySelector('#receiptHtmlTemplate').value.trim();
        localStorage.setItem('milkyHugSettings', JSON.stringify(state.settings));
        dialog.remove();
        alert('Receipt customization saved.');
    });
}

async function handleLogout() {
    localStorage.removeItem('milkyHugCurrentUser');
    state.currentUser = null;
    selectors.logoutButton.classList.add('hidden');
    selectors.userBadge.classList.add('hidden');
    selectors.loginScreen.classList.remove('hidden');
}

async function saveEmailSettings(event) {
    event.preventDefault();
    state.settings.serviceId = selectors.emailServiceId.value.trim();
    state.settings.templateId = selectors.emailTemplateId.value.trim();
    state.settings.userId = selectors.emailUserId.value.trim();
    state.settings.toEmail = selectors.reportEmail.value.trim();
    localStorage.setItem('milkyHugSettings', JSON.stringify(state.settings));
    if (state.settings.userId) {
        emailjs.init(state.settings.userId);
    }
    alert('Email settings saved.');
}

async function openProductModal() {
    const formHtml = `
        <form id="productForm" class="space-y-4 text-slate-100">
            <div>
                <label class="block text-sm">Product Name</label>
                <input id="modalName" class="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" required />
            </div>
            <div>
                <label class="block text-sm">SKU</label>
                <input id="modalSku" class="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" required />
            </div>
            <div>
                <label class="block text-sm">Category</label>
                <input id="modalCategory" class="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" required />
            </div>
            <div class="grid gap-4 md:grid-cols-2">
                <div>
                    <label class="block text-sm">Stock</label>
                    <input id="modalStock" type="number" min="0" class="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" required />
                </div>
                <div>
                    <label class="block text-sm">Outlet Price</label>
                    <input id="modalPrice" type="number" min="0" step="0.01" class="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" required />
                </div>
            </div>
            <div>
                <label class="block text-sm">Retail Price</label>
                <input id="modalRetailPrice" type="number" min="0" step="0.01" class="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" required />
            </div>
            <button type="submit" class="w-full rounded-3xl bg-sky-500 px-4 py-3 font-semibold text-slate-950">Save Product</button>
        </form>
    `;
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4';
    dialog.innerHTML = `
        <div class="w-full max-w-2xl rounded-[2rem] bg-slate-900 p-8 shadow-2xl shadow-slate-950/40">
            <div class="flex items-center justify-between gap-4">
                <h3 class="text-2xl font-bold text-slate-100">Add New Product</h3>
                <button id="closeModal" class="rounded-full bg-slate-800 px-3 py-2 text-slate-300 hover:bg-slate-700">X</button>
            </div>
            <div class="mt-6">${formHtml}</div>
        </div>
    `;
    document.body.appendChild(dialog);
    dialog.querySelector('#closeModal').addEventListener('click', () => dialog.remove());
    dialog.querySelector('#productForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = dialog.querySelector('#modalName').value.trim();
        const sku = dialog.querySelector('#modalSku').value.trim();
        const category = dialog.querySelector('#modalCategory').value.trim();
        const stock = Number(dialog.querySelector('#modalStock').value);
        const price = Number(dialog.querySelector('#modalPrice').value);
        const retailPrice = Number(dialog.querySelector('#modalRetailPrice').value) || price;
        await db.products.add({ name, sku, category, stock, price, retailPrice });
        await loadProducts();
        dialog.remove();
        alert('Product saved.');
    });
}

async function initProductActions(eventOrElement) {
    let targetElement = eventOrElement instanceof Event ? eventOrElement.target : eventOrElement;
    if (targetElement && targetElement.nodeType !== Node.ELEMENT_NODE) {
        targetElement = targetElement.parentElement;
    }
    const button = targetElement?.closest('button') || targetElement;
    if (!button) return;
    const productId = button.dataset.id;
    if (button.classList.contains('add-cart-btn') || button.classList.contains('add-to-cart-btn')) {
        updateCartFromProduct(productId);
    }
    if (button.classList.contains('edit-product-btn')) {
        await editProduct(Number(productId));
    }
    if (button.classList.contains('delete-product-btn')) {
        const confirmDelete = confirm('Delete this product permanently?');
        if (confirmDelete) {
            await db.products.delete(Number(productId));
            await loadProducts();
        }
    }
};

async function editProduct(productId) {
    const product = await db.products.get(productId);
    if (!product) return;

    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4';
    dialog.innerHTML = `
        <div class="w-full max-w-2xl rounded-[2rem] bg-slate-900 p-8 shadow-2xl shadow-slate-950/40">
            <div class="flex items-center justify-between gap-4">
                <h3 class="text-2xl font-bold text-slate-100">Edit Product</h3>
                <button id="closeEditModal" class="rounded-full bg-slate-800 px-3 py-2 text-slate-300 hover:bg-slate-700">X</button>
            </div>
            <form id="editProductForm" class="mt-6 space-y-4 text-slate-100">
                <div>
                    <label class="block text-sm">Product Name</label>
                    <input id="modalName" value="${product.name}" class="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" required />
                </div>
                <div>
                    <label class="block text-sm">SKU</label>
                    <input id="modalSku" value="${product.sku}" class="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" required />
                </div>
                <div>
                    <label class="block text-sm">Category</label>
                    <input id="modalCategory" value="${product.category}" class="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" required />
                </div>
                <div class="grid gap-4 md:grid-cols-2">
                    <div>
                        <label class="block text-sm">Stock</label>
                        <input id="modalStock" type="number" min="0" value="${product.stock}" class="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" required />
                    </div>
                    <div>
                        <label class="block text-sm">Outlet Price</label>
                        <input id="modalPrice" type="number" min="0" step="0.01" value="${product.price}" class="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" required />
                    </div>
                </div>
                <div>
                    <label class="block text-sm">Retail Price</label>
                    <input id="modalRetailPrice" type="number" min="0" step="0.01" value="${product.retailPrice || product.price}" class="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3" required />
                </div>
                <button type="submit" class="w-full rounded-3xl bg-sky-500 px-4 py-3 font-semibold text-slate-950">Update Product</button>
            </form>
        </div>
    `;

    document.body.appendChild(dialog);
    dialog.querySelector('#closeEditModal').addEventListener('click', () => dialog.remove());
    dialog.querySelector('#editProductForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const updated = {
            ...product,
            name: dialog.querySelector('#modalName').value.trim(),
            sku: dialog.querySelector('#modalSku').value.trim(),
            category: dialog.querySelector('#modalCategory').value.trim(),
            stock: Number(dialog.querySelector('#modalStock').value),
            price: Number(dialog.querySelector('#modalPrice').value),
            retailPrice: Number(dialog.querySelector('#modalRetailPrice').value) || Number(dialog.querySelector('#modalPrice').value)
        };
        await db.products.put(updated);
        await loadProducts();
        dialog.remove();
        alert('Product updated.');
    });
}

async function hydrateApp() {
    await initializeData();
    const savedUser = JSON.parse(localStorage.getItem('milkyHugCurrentUser') || 'null');
    if (savedUser) {
        const user = await db.users.get(savedUser.id);
        if (user) {
            state.currentUser = user;
            selectors.loginScreen.classList.add('hidden');
            updateUserBadge();
            await loadProducts();
            await loadUsers();
            await renderDashboard();
            await renderReport();
            toggleAdminFeatures();
        }
    }
}

selectors.menuButtons.forEach((button) => {
    button.addEventListener('click', () => showSection(button.dataset.target));
});
selectors.loginForm.addEventListener('submit', handleLogin);
selectors.logoutButton.addEventListener('click', handleLogout);
selectors.posSearch.addEventListener('input', (event) => renderProducts(filterProducts(event.target.value)));
selectors.clearCartBtn.addEventListener('click', clearCart);
selectors.completeSaleBtn.addEventListener('click', completeSale);
if (selectors.openReceiptTemplate) {
    selectors.openReceiptTemplate.addEventListener('click', openReceiptTemplateModal);
}
selectors.exportCsvBtn.addEventListener('click', downloadCsvBackup);
selectors.exportXlsxBtn.addEventListener('click', downloadXlsxBackup);
selectors.sendReportBtn.addEventListener('click', sendReportEmail);
selectors.dailyCloseBtn.addEventListener('click', dailyClose);
selectors.userForm.addEventListener('submit', handleUserCreate);
selectors.emailConfigForm.addEventListener('submit', saveEmailSettings);
selectors.openAddProduct.addEventListener('click', openProductModal);
if (selectors.cartTaxPercent) {
    selectors.cartTaxPercent.addEventListener('input', (event) => {
        state.cartTaxPercent = Number(event.target.value) || 0;
        renderCart();
    });
}
if (selectors.cartDiscountAmount) {
    selectors.cartDiscountAmount.addEventListener('input', (event) => {
        state.cartDiscount = Number(event.target.value) || 0;
        renderCart();
    });
}
selectors.inwardForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const productId = Number(selectors.inwardProduct.value);
    const quantity = Number(selectors.inwardQuantity.value);
    if (!productId || quantity <= 0) {
        return alert('Select a valid product and quantity.');
    }
    const product = await db.products.get(productId);
    if (!product) {
        return alert('Product not found.');
    }
    product.stock += quantity;
    await db.products.put(product);
    await loadProducts();
    alert('Inventory updated successfully.');
});

document.body.addEventListener('click', async (event) => {
    const target = event.target;
    if (target.closest('.add-cart-btn')) {
        await initProductActions(target.closest('.add-cart-btn'));
    }
    if (target.closest('.add-to-cart-btn') || target.closest('.view-detail-btn') || target.closest('.edit-product-btn') || target.closest('.delete-product-btn')) {
        await initProductActions(target.closest('button'));
    }
    if (target.classList.contains('increment-btn')) {
        const index = Number(target.dataset.index);
        state.cart[index].quantity += 1;
        state.cart[index].lineTotal = state.cart[index].quantity * state.cart[index].price;
        renderCart();
    }
    if (target.classList.contains('decrement-btn')) {
        const index = Number(target.dataset.index);
        if (state.cart[index].quantity > 1) {
            state.cart[index].quantity -= 1;
            state.cart[index].lineTotal = state.cart[index].quantity * state.cart[index].price;
            renderCart();
        }
    }
    if (target.classList.contains('remove-cart-btn')) {
        const index = Number(target.dataset.index);
        state.cart.splice(index, 1);
        renderCart();
    }
});

window.addEventListener('DOMContentLoaded', hydrateApp);

