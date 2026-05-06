console.log('Cart.js loaded!');

let cart = [];
let currentLanguage = 'EN';
let users = [];
let currentUser = null;

// Load data on start
function loadData() {
    cart = JSON.parse(localStorage.getItem('floraCart')) || [];
    users = JSON.parse(localStorage.getItem('floraUsers')) || [];
    currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
}

// Save data
function saveData() {
    localStorage.setItem('floraCart', JSON.stringify(cart));
    localStorage.setItem('floraUsers', JSON.stringify(users));
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// Add to cart
function addToCart(id, name, price) {
    console.log('ADD TO CART:', id, name, price);
    
    cart.push({
        id: id,
        name: name,
        price: parseFloat(price)
    });
    
    saveData();
    updateCartBadge();
    
    alert('✅ ' + name + ' added to cart!');
}

// Update badge
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = cart.length;
        console.log('Badge updated:', cart.length);
    }
}

// Open cart modal
function openCartModal() {
    console.log('Opening cart modal');
    displayCartItems();
    const modal = new bootstrap.Modal(document.getElementById('cartModal'));
    modal.show();
}

// Display items
function displayCartItems() {
    const list = document.getElementById('cartItemsList');
    if (!list) return;
    
    console.log('Displaying items. Cart length:', cart.length);
    
    if (cart.length === 0) {
        list.innerHTML = '<p style="color: #851720; text-align: center;">Your cart is empty</p>';
        updatePrices();
        return;
    }

    let html = '';
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        html += `
            <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex-grow: 1;">
                    <p style="margin: 0; color: #851720; font-weight: 500;">${item.name}</p>
                    <p style="margin: 5px 0 0 0; color: #851720; font-weight: bold;">${item.price} OMR</p>
                </div>
                <button onclick="removeFromCart(${i})" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">Remove</button>
            </div>
        `;
    }
    
    list.innerHTML = html;
    updatePrices();
}

// Remove from cart
function removeFromCart(index) {
    console.log('Removing item:', index);
    cart.splice(index, 1);
    saveData();
    updateCartBadge();
    displayCartItems();
}

// Update prices
function updatePrices() {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const delivery = subtotal > 25 ? 0 : 5;
    const total = subtotal + delivery;

    const subEl = document.getElementById('subtotalPrice');
    const delEl = document.getElementById('deliveryFee');
    const totEl = document.getElementById('cartTotal');

    if (subEl) subEl.textContent = subtotal.toFixed(2) + ' OMR';
    if (delEl) delEl.textContent = (delivery === 0 ? 'FREE' : delivery + ' OMR');
    if (totEl) totEl.textContent = total.toFixed(2) + ' OMR';
}

// Apply promo code
function applyPromoCode() {
    const code = document.getElementById('promoCode')?.value.toUpperCase();
    const msg = document.getElementById('promoMessage');
    
    if (!code || !msg) return;
    
    if (code === 'FLOWER20') {
        msg.textContent = '✅ Promo code applied!';
        msg.style.color = '#28a745';
    } else {
        msg.textContent = '❌ Invalid code';
        msg.style.color = '#dc3545';
    }
}

// Go to checkout
function goToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const delivery = subtotal > 25 ? 0 : 5;
    const total = subtotal + delivery;
    
    const checkoutTotal = document.getElementById('checkoutTotal');
    if (checkoutTotal) {
        checkoutTotal.textContent = total.toFixed(2) + ' OMR';
    }
    
    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (cartModal) cartModal.hide();
    
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();
}

// Place order
function placeOrder() {
    const name = document.getElementById('deliveryName')?.value;
    const phone = document.getElementById('deliveryPhone')?.value;
    const address = document.getElementById('deliveryAddress')?.value;
    const city = document.getElementById('deliveryCity')?.value;
    
    if (!name || !phone || !address || !city) {
        alert('Please fill all delivery details!');
        return;
    }
    
    alert('✅ Order Confirmed!\n\nThank you for shopping with FLORA!');
    
    // Reset
    cart = [];
    saveData();
    updateCartBadge();
    
    const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    if (checkoutModal) checkoutModal.hide();
}

// Toggle card details
function toggleCardDetails() {
    const details = document.getElementById('cardDetails');
    const method = document.querySelector('input[name="paymentMethod"]:checked');
    
    if (details && method) {
        details.style.display = method.value === 'creditCard' ? 'block' : 'none';
    }
}

// Language switching
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('floraLanguage', lang);
    console.log('Language switched to:', lang);
}

// Account functions
function openAccountModal() {
    const modal = new bootstrap.Modal(document.getElementById('accountModal'));
    modal.show();
}

function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (tab === 'login') {
        if (loginForm) loginForm.style.display = 'block';
        if (signupForm) signupForm.style.display = 'none';
    } else {
        if (loginForm) loginForm.style.display = 'none';
        if (signupForm) signupForm.style.display = 'block';
    }
}

function handleLogin() {
    const username = document.getElementById('loginUsername')?.value;
    const password = document.getElementById('loginPassword')?.value;
    
    if (!username || !password) {
        alert('Fill all fields!');
        return;
    }
    
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
    
    if (user) {
        currentUser = user;
        saveData();
        alert('Welcome back, ' + user.firstName + '!');
        updateAccountUI();
        const modal = bootstrap.Modal.getInstance(document.getElementById('accountModal'));
        if (modal) modal.hide();
        document.getElementById('loginFormElement')?.reset();
    } else {
        alert('Wrong username or password!');
    }
}

function handleSignup() {
    const first = document.getElementById('firstName')?.value;
    const last = document.getElementById('lastName')?.value;
    const username = document.getElementById('signupUsername')?.value;
    const email = document.getElementById('signupEmail')?.value;
    const phone = document.getElementById('signupPhone')?.value;
    const password = document.getElementById('signupPassword')?.value;
    const confirm = document.getElementById('confirmPassword')?.value;
    
    if (!first || !last || !username || !email || !phone || !password || !confirm) {
        alert('Fill all fields!');
        return;
    }
    
    if (password !== confirm) {
        alert('Passwords do not match!');
        return;
    }
    
    if (users.find(u => u.username === username)) {
        alert('Username already exists!');
        return;
    }
    
    const newUser = {
        firstName: first,
        lastName: last,
        username: username,
        email: email,
        phone: phone,
        password: password
    };
    
    users.push(newUser);
    currentUser = newUser;
    saveData();
    
    alert('Account created! Welcome, ' + first + '!');
    updateAccountUI();
    const modal = bootstrap.Modal.getInstance(document.getElementById('accountModal'));
    if (modal) modal.hide();
    document.getElementById('signupFormElement')?.reset();
    switchTab('login');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    alert('Logged out!');
    updateAccountUI();
    const modal = bootstrap.Modal.getInstance(document.getElementById('accountModal'));
    if (modal) modal.hide();
}

function updateAccountUI() {
    const accContainer = document.getElementById('accountContainer');
    const userAvatar = document.getElementById('userAvatarContainer');
    const authForms = document.getElementById('authForms');
    const userProfile = document.getElementById('userProfile');
    
    if (currentUser) {
        if (accContainer) accContainer.style.display = 'none';
        if (userAvatar) userAvatar.style.display = 'flex';
        
        const initials = currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0);
        if (document.getElementById('userInitials')) {
            document.getElementById('userInitials').textContent = initials.toUpperCase();
        }
        if (document.getElementById('profileInitials')) {
            document.getElementById('profileInitials').textContent = initials.toUpperCase();
        }
        
        if (document.getElementById('profileName')) document.getElementById('profileName').textContent = currentUser.firstName + ' ' + currentUser.lastName;
        if (document.getElementById('profileEmail')) document.getElementById('profileEmail').textContent = currentUser.email;
        if (document.getElementById('profileUsername')) document.getElementById('profileUsername').textContent = currentUser.username;
        if (document.getElementById('profilePhone')) document.getElementById('profilePhone').textContent = currentUser.phone;
        if (document.getElementById('profileEmailDetail')) document.getElementById('profileEmailDetail').textContent = currentUser.email;
        
        if (authForms) authForms.style.display = 'none';
        if (userProfile) userProfile.style.display = 'block';
    } else {
        if (accContainer) accContainer.style.display = 'flex';
        if (userAvatar) userAvatar.style.display = 'none';
        if (authForms) authForms.style.display = 'block';
        if (userProfile) userProfile.style.display = 'none';
    }
}

// Other functions
function openSearchModal() {
    alert('Search feature coming soon!');
}

function openWishlistModal() {
    alert('Wishlist is empty ❤️');
}

function openPolicyModal(type) {
    if (type === 'delivery') {
        alert('Delivery Information:\n- Free: Orders > 25 OMR\n- Standard: 2-3 business days\n- Express: Same day (+5 OMR)');
    } else {
        alert('Return Policy:\n- 7 days from delivery\n- Full refund within 5-7 days');
    }
}

function handleContactForm() {
    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const phone = document.getElementById('phone')?.value;
    const message = document.getElementById('message')?.value;
    
    if (!name || !email || !phone || !message) {
        alert('Fill all fields!');
        return;
    }
    
    if (message.length < 10) {
        alert('Message must be at least 10 characters!');
        return;
    }
    
    alert('✅ Message sent!\n\nWe will reply within 24 hours.');
    document.getElementById('contactForm')?.reset();
}

function addToWishlist(id, name) {
    alert('❤️ ' + name + ' added to wishlist!');
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - initializing');
    loadData();
    updateCartBadge();
    updateAccountUI();
    
    // Setup form listeners
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    const signupForm = document.getElementById('signupFormElement');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm();
        });
    }
    
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(radio => {
        radio.addEventListener('change', toggleCardDetails);
    });
});