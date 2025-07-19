// --- Products Data ---
// This array holds all the product information.
// You should update the 'image' paths to point to your actual product images.
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSslDzKpkA9wvc7Apy-qsETEMgM7AEzDnQhtQ&s", // Example: Path to your image file
        price: 99.99
    },
    {
        id: 2,
        name: "Smartwatch",
        image: "https://www.leafstudios.in/cdn/shop/files/1_1099cd20-7237-4bdf-a180-b7126de5ef3d_grande.png?v=1722230645", // Example: Path to your image file
        price: 199.99
    },
    {
        id: 3,
        name: "Portable Bluetooth Speaker",
        image: "https://mobilla.in/cdn/shop/collections/Mrock_101-1_533x.jpg?v=1702109941", // Example: Path to your image file
        price: 75.00
    },
    {
        id: 4,
        name: "Gaming Mouse",
        image: "https://m.media-amazon.com/images/I/61Ahjsi1iOL._UF1000,1000_QL80_.jpg", // Example: Path to your image file
        price: 49.99
    },
    {
        id: 5,
        name: "4K Monitor",
        image: "https://images.philips.com/is/image/philipsconsumer/69eecb195f244550b8d5b01f00d52b20?$pnglarge$&wid=1250", // Example: Path to your image file
        price: 349.99
    },
    {
        id: 6,
        name: "USB-C Hub",
        image: "https://mm.digikey.com/Volume0/opasdata/d220001/medias/images/5881/MFG_5G4AB-USB-C-HUB.jpg", // Example: Path to your image file
        price: 29.99
    }
    // Add more products here as needed
];

// --- Cart Functionality (using localStorage) ---

/**
 * Retrieves the current cart from localStorage.
 * @returns {Array} An array of cart items, or an empty array if no cart exists.
 */
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

/**
 * Saves the given cart array to localStorage.
 * @param {Array} cart - The cart array to save.
 */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Adds a product to the cart or increments its quantity if it already exists.
 * @param {number} productId - The ID of the product to add.
 */
function addToCart(productId) {
    const cart = getCart();
    const product = products.find(p => p.id === productId);

    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            // Add a new item to the cart with quantity 1
            cart.push({ ...product, quantity: 1 });
        }
        saveCart(cart);
        alert(`${product.name} added to cart!`); // Simple confirmation
        renderCartItems(); // Re-render cart if on the cart page
    }
}

/**
 * Removes a product completely from the cart.
 * @param {number} productId - The ID of the product to remove.
 */
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId); // Keep items that don't match the productId
    saveCart(cart);
    renderCartItems(); // Re-render cart after removal
}

/**
 * Updates the quantity of a product in the cart. If quantity is 0, removes the item.
 * @param {number} productId - The ID of the product to update.
 * @param {number} newQuantity - The new quantity for the product.
 */
function updateQuantity(productId, newQuantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            // If new quantity is 0 or less, remove the item
            removeFromCart(productId);
            return; // Exit to avoid double rendering/saving
        }
        saveCart(cart);
        renderCartItems(); // Re-render cart after quantity update
    }
}

// --- Homepage: Smart Suggestions ---
const suggestions = [
    "Check out our new line of noise-cancelling headphones!",
    "Get ready for summer with our portable Bluetooth speakers.",
    "Upgrade your home office with our ergonomic keyboards.",
    "Discover amazing deals on high-resolution monitors.",
    "Power up your devices with our fast-charging power banks."
];

let currentSuggestionIndex = 0;
const suggestionTextElement = document.getElementById('suggestion-text');

/**
 * Rotates the "Smart Suggestion" text on the homepage.
 */
function rotateSuggestion() {
    if (suggestionTextElement) { // Ensure the element exists on the page (only on index.html)
        suggestionTextElement.textContent = suggestions[currentSuggestionIndex];
        currentSuggestionIndex = (currentSuggestionIndex + 1) % suggestions.length;
    }
}

// Set interval to rotate suggestion every 5 seconds
setInterval(rotateSuggestion, 5000);

// --- Products Page: Dynamic Product Display ---
/**
 * Renders product cards on the products page.
 * Attaches event listeners for "Add to Cart" buttons.
 */
function renderProducts() {
    const productContainer = document.getElementById('product-cards-container');

    if (productContainer) { // Ensure we are on the products.html page
        productContainer.innerHTML = ''; // Clear existing content
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="btn add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
            `;
            productContainer.appendChild(productCard);
        });

        // Use event delegation for "Add to Cart" buttons
        productContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-cart-btn')) {
                const productId = parseInt(event.target.dataset.productId);
                addToCart(productId);
            }
        });
    }
}

// --- Cart Page: Display Cart Items and Summary ---
const cartItemsContainer = document.getElementById('cart-items-container');
const totalBillElement = document.getElementById('total-bill');
const emptyCartMessage = document.getElementById('empty-cart-message');

/**
 * Renders the items currently in the cart on the cart page.
 * Calculates and displays the total bill.
 * Attaches event listeners for remove buttons and quantity inputs.
 */
function renderCartItems() {
    if (!cartItemsContainer || !totalBillElement || !emptyCartMessage) {
        // Not on the cart page, so don't try to render cart items
        return;
    }

    const cart = getCart();
    cartItemsContainer.innerHTML = ''; // Clear existing items
    let totalBill = 0;

    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block'; // Show empty cart message
        document.querySelector('.cart-summary').style.display = 'none'; // Hide summary
        totalBillElement.textContent = '0.00';
    } else {
        emptyCartMessage.style.display = 'none'; // Hide empty cart message
        document.querySelector('.cart-summary').style.display = 'block'; // Show summary

        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <div class="quantity-control">
                        <label for="qty-${item.id}">Quantity:</label>
                        <input type="number" id="qty-${item.id}" value="${item.quantity}" min="1" data-product-id="${item.id}">
                    </div>
                    <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="btn remove-from-cart-btn" data-product-id="${item.id}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
            totalBill += item.price * item.quantity;
        });

        totalBillElement.textContent = totalBill.toFixed(2);

        // Add event listeners for remove buttons
        cartItemsContainer.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.productId);
                removeFromCart(productId);
            });
        });

        // Add event listeners for quantity input changes
        cartItemsContainer.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('change', (event) => {
                const productId = parseInt(event.target.dataset.productId);
                const newQuantity = parseInt(event.target.value);
                if (!isNaN(newQuantity)) { // Ensure it's a valid number
                    updateQuantity(productId, newQuantity);
                }
            });
        });
    }
}

// --- Contact Page: Form Validation ---
/**
 * Basic email validation function.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Handles form submission and performs basic validation for the contact form.
 */
function setupContactFormValidation() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) { // Ensure we are on the contact.html page
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const messageError = document.getElementById('message-error');
        const formSubmissionMessage = document.getElementById('form-submission-message');

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            let isValid = true;

            // Validate Name
            if (nameInput.value.trim() === '') {
                nameError.textContent = 'Name is required.';
                isValid = false;
            } else {
                nameError.textContent = '';
            }

            // Validate Email
            if (emailInput.value.trim() === '') {
                emailError.textContent = 'Email is required.';
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                emailError.textContent = 'Please enter a valid email address.';
                isValid = false;
            } else {
                emailError.textContent = '';
            }

            // Validate Message
            if (messageInput.value.trim() === '') {
                messageError.textContent = 'Message is required.';
                isValid = false;
            } else {
                messageError.textContent = '';
            }

            if (isValid) {
                // Simulate form submission success
                formSubmissionMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formSubmissionMessage.style.display = 'block';
                contactForm.reset(); // Clear the form fields
                // In a real application, you would send this data to a backend here.
                console.log('Form Submitted:', {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    message: messageInput.value.trim()
                });
            } else {
                formSubmissionMessage.style.display = 'none'; // Hide success message if validation fails
            }
        });
    }
}

// --- DOM Content Loaded Listener (Initial Setup for Different Pages) ---
document.addEventListener('DOMContentLoaded', () => {
    // Call homepage functions
    rotateSuggestion(); // Display initial suggestion immediately

    // Call products page functions
    renderProducts();

    // Call cart page functions
    renderCartItems();

    // Call contact page functions
    setupContactFormValidation();
});