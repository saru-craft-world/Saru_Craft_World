// ==========================================
// SARU_CRAFT_WORLD - COMPLETE SCRIPT
// ==========================================

// ---------- FIREBASE ----------

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyC_TBMI_Vb0vaGmWlXUKziphlI_7fUhk10",
    authDomain: "saru07-cb76f.firebaseapp.com",
    projectId: "saru07-cb76f",
    storageBucket: "saru07-cb76f.firebasestorage.app",
    messagingSenderId: "356038184572",
    appId: "1:356038184572:web:e5eb8a867086718af243f9",
    measurementId: "G-MJ8MCNVN5Z"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ==========================================
// PRODUCTS
// ==========================================

const products = [
    {
        id: "dress001",
        name: "Yellow Baby Girl Dress",
        price: 1500,
        category: "dress",
        image: "picture/yellow-dress.jpg",
        rating: 5
    },

    {
        id: "headband001",
        name: "Tulip Headband",
        price: 299,
        category: "accessories",
        image: "picture/headband.jpg",
        rating: 5
    },

    {
        id: "bag001",
        name: "Crochet Hand Bag",
        price: 800,
        category: "bags",
        image: "picture/hand-bag.jpg",
        rating: 5
    },

    {
        id: "jellyfish001",
        name: "Crochet Jellyfish",
        price: 100,
        category: "toys",
        image: "picture/jellyfish.jpg",
        rating: 5
    }
];


// ==========================================
// LOCAL STORAGE
// ==========================================

let cart = JSON.parse(
    localStorage.getItem("saruCart") || "[]"
);

let wishlist = JSON.parse(
    localStorage.getItem("saruWishlist") || "[]"
);

let orders = JSON.parse(
    localStorage.getItem("saruOrders") || "[]"
);


// Make IDs strings
cart = cart.map(item => ({
    ...item,
    id: String(item.id),
    quantity: Number(item.quantity) || 1
}));

wishlist = wishlist.map(id => String(id));


// Remove invalid products
cart = cart.filter(item =>
    getProductById(item.id)
);

wishlist = wishlist.filter(id =>
    products.some(product =>
        String(product.id) === String(id)
    )
);


// ==========================================
// HELPERS
// ==========================================

function getProductById(id) {

    return products.find(product =>
        String(product.id) === String(id)
    );
}


function saveCart() {

    localStorage.setItem(
        "saruCart",
        JSON.stringify(cart)
    );
}


function saveWishlist() {

    localStorage.setItem(
        "saruWishlist",
        JSON.stringify(wishlist)
    );
}


function saveOrders() {

    localStorage.setItem(
        "saruOrders",
        JSON.stringify(orders)
    );
}


function getCartTotal() {

    return cart.reduce((total, item) => {

        const product =
            getProductById(item.id);

        if (!product) {
            return total;
        }

        return total +
            product.price *
            item.quantity;

    }, 0);
}


function formatPrice(price) {

    return "₹" +
        Number(price).toLocaleString("en-IN");
}


// ==========================================
// ELEMENTS
// ==========================================

const productsGrid =
    document.getElementById("productsGrid");

const cartSidebar =
    document.getElementById("cartSidebar");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.getElementById("cartCount");

const wishlistCount =
    document.getElementById("wishlistCount");

const wishlistModal =
    document.getElementById("wishlistModal");

const wishlistItems =
    document.getElementById("wishlistItems");

const overlay =
    document.getElementById("overlay");

const accountModal =
    document.getElementById("accountModal");

const ordersModal =
    document.getElementById("ordersModal");

const checkoutModal =
    document.getElementById("checkoutModal");

const loginSection =
    document.getElementById("loginSection");

const registerSection =
    document.getElementById("registerSection");

const userSection =
    document.getElementById("userSection");


// ==========================================
// PRODUCTS DISPLAY
// ==========================================

function displayProducts(list = products) {

    if (!productsGrid) {
        return;
    }


    if (list.length === 0) {

        productsGrid.innerHTML = `
            <div class="empty-message">
                😔 No products found.
            </div>
        `;

        return;
    }


    productsGrid.innerHTML =
        list.map(product => {

            const isWishlisted =
                wishlist.includes(
                    String(product.id)
                );


            return `
                <div class="product-card">

                    <div class="product-image-wrapper">

                        <img
                            class="product-image"
                            src="${product.image}"
                            alt="${product.name}"
                            onerror="this.style.display='none';"
                        >

                        <button
                            class="wishlist-btn ${isWishlisted ? "active" : ""}"
                            data-wishlist="${product.id}"
                            type="button"
                            aria-label="Wishlist"
                        >
                            ${isWishlisted ? "♥" : "♡"}
                        </button>

                    </div>

                    <div class="product-info">

                        <div class="product-category">
                            ${product.category}
                        </div>

                        <h3 class="product-name">
                            ${product.name}
                        </h3>

                        <div class="product-rating">
                            ⭐⭐⭐⭐⭐
                        </div>

                        <div class="product-bottom">

                            <div class="product-price">
                                ${formatPrice(product.price)}
                            </div>

                            <button
                                class="add-cart-btn"
                                data-add-cart="${product.id}"
                                type="button"
                            >
                                🛒 Add to Cart
                            </button>

                        </div>

                    </div>

                </div>
            `;

        }).join("");
}


// ==========================================
// CART DISPLAY
// ==========================================

function displayCart() {

    if (!cartItems) {
        return;
    }


    cart = cart.filter(item =>
        getProductById(item.id)
    );


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-message">
                🛒 Your cart is empty.
            </div>
        `;

    } else {

        cartItems.innerHTML =
            cart.map(item => {

                const product =
                    getProductById(item.id);

                if (!product) {
                    return "";
                }


                return `
                    <div class="cart-item">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >

                        <div>

                            <h4>
                                ${product.name}
                            </h4>

                            <p>
                                ${formatPrice(product.price)}
                            </p>

                            <div class="cart-controls">

                                <button
                                    class="qty-btn"
                                    data-minus="${product.id}"
                                    type="button"
                                >
                                    −
                                </button>

                                <span>
                                    ${item.quantity}
                                </span>

                                <button
                                    class="qty-btn"
                                    data-plus="${product.id}"
                                    type="button"
                                >
                                    +
                                </button>

                            </div>

                        </div>

                        <button
                            class="remove-cart-btn"
                            data-remove-cart="${product.id}"
                            type="button"
                        >
                            Remove
                        </button>

                    </div>
                `;

            }).join("");
    }


    if (cartTotal) {

        cartTotal.textContent =
            getCartTotal()
                .toLocaleString("en-IN");
    }


    if (cartCount) {

        cartCount.textContent =
            cart.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            );
    }


    saveCart();
}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(id) {

    const product =
        getProductById(id);

    if (!product) {
        return;
    }


    const existing =
        cart.find(item =>
            String(item.id) === String(id)
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            id: String(id),
            quantity: 1
        });
    }


    saveCart();

    displayCart();


    alert(
        `${product.name} has been added to your cart! 🧶`
    );
}


// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeQuantity(id, amount) {

    const item =
        cart.find(item =>
            String(item.id) === String(id)
        );

    if (!item) {
        return;
    }


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart = cart.filter(item =>
            String(item.id) !== String(id)
        );
    }


    saveCart();

    displayCart();
}


// ==========================================
// REMOVE FROM CART
// ==========================================

function removeFromCart(id) {

    cart = cart.filter(item =>
        String(item.id) !== String(id)
    );


    saveCart();

    displayCart();
}


// ==========================================
// WISHLIST DISPLAY
// ==========================================

function displayWishlist() {

    if (!wishlistItems) {
        return;
    }


    const validWishlist =
        wishlist
            .map(id => getProductById(id))
            .filter(Boolean);


    wishlist =
        validWishlist.map(product =>
            String(product.id)
        );


    saveWishlist();


    if (wishlistCount) {

        wishlistCount.textContent =
            wishlist.length;
    }


    if (validWishlist.length === 0) {

        wishlistItems.innerHTML = `
            <div class="empty-message">
                ♡ Your wishlist is empty.
            </div>
        `;

        return;
    }


    wishlistItems.innerHTML =
        validWishlist.map(product => {

            return `
                <div class="wishlist-item">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div>

                        <h4>
                            ${product.name}
                        </h4>

                        <p>
                            ${formatPrice(product.price)}
                        </p>

                    </div>

                    <button
                        class="wishlist-remove"
                        data-remove-wishlist="${product.id}"
                        type="button"
                    >
                        ♥
                    </button>

                </div>
            `;

        }).join("");
}


// ==========================================
// TOGGLE WISHLIST
// ==========================================

function toggleWishlist(id) {

    id = String(id);


    if (!getProductById(id)) {
        return;
    }


    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(item =>
                item !== id
            );

    } else {

        wishlist.push(id);
    }


    saveWishlist();

    displayWishlist();

    displayProducts();
}


// ==========================================
// SEARCH
// ==========================================

const searchInput =
    document.getElementById("searchInput");


if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const search =
                this.value
                    .trim()
                    .toLowerCase();


            const filtered =
                products.filter(product =>

                    product.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.category
                        .toLowerCase()
                        .includes(search)
                );


            displayProducts(filtered);
        }
    );
}


// ==========================================
// CATEGORY FILTER
// ==========================================

document
    .querySelectorAll(".category-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        ".category-btn"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                this.classList.add("active");


                const category =
                    this.dataset.category;


                if (category === "all") {

                    displayProducts(products);

                } else {

                    displayProducts(
                        products.filter(product =>
                            product.category ===
                            category
                        )
                    );
                }

            }
        );

    });


// ==========================================
// PRODUCT EVENTS
// ==========================================

if (productsGrid) {

    productsGrid.addEventListener(
        "click",
        function (event) {

            const cartButton =
                event.target.closest(
                    "[data-add-cart]"
                );


            const wishlistButton =
                event.target.closest(
                    "[data-wishlist]"
                );


            if (cartButton) {

                addToCart(
                    cartButton.dataset.addCart
                );

                return;
            }


            if (wishlistButton) {

                toggleWishlist(
                    wishlistButton.dataset.wishlist
                );
            }

        }
    );
}


// ==========================================
// CART EVENTS
// ==========================================

if (cartItems) {

    cartItems.addEventListener(
        "click",
        function (event) {

            const plus =
                event.target.closest(
                    "[data-plus]"
                );

            const minus =
                event.target.closest(
                    "[data-minus]"
                );

            const remove =
                event.target.closest(
                    "[data-remove-cart]"
                );


            if (plus) {

                changeQuantity(
                    plus.dataset.plus,
                    1
                );

                return;
            }


            if (minus) {

                changeQuantity(
                    minus.dataset.minus,
                    -1
                );

                return;
            }


            if (remove) {

                removeFromCart(
                    remove.dataset.removeCart
                );
            }

        }
    );
}


// ==========================================
// WISHLIST EVENTS
// ==========================================

if (wishlistItems) {

    wishlistItems.addEventListener(
        "click",
        function (event) {

            const remove =
                event.target.closest(
                    "[data-remove-wishlist]"
                );


            if (remove) {

                toggleWishlist(
                    remove.dataset.removeWishlist
                );
            }

        }
    );
}


// ==========================================
// MODAL FUNCTIONS
// ==========================================

function openModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    if (overlay) {

        overlay.classList.add("active");
    }
}


function closeModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    const anyOpen =
        document.querySelector(
            ".modal.active, .cart-sidebar.active"
        );


    if (!anyOpen && overlay) {

        overlay.classList.remove("active");
    }
}


// ==========================================
// CART OPEN / CLOSE
// ==========================================

function openCart() {

    if (!cartSidebar) {
        return;
    }


    displayCart();

    cartSidebar.classList.add("active");


    if (overlay) {

        overlay.classList.add("active");
    }
}


function closeCart() {

    if (!cartSidebar) {
        return;
    }


    cartSidebar.classList.remove("active");


    if (overlay) {

        overlay.classList.remove("active");
    }
}


document
    .getElementById("cartBtn")
    ?.addEventListener(
        "click",
        openCart
    );


document
    .getElementById("closeCart")
    ?.addEventListener(
        "click",
        closeCart
    );


// ==========================================
// OVERLAY
// ==========================================

overlay?.addEventListener(
    "click",
    function () {

        closeCart();

        closeModal(wishlistModal);

        closeModal(accountModal);

        closeModal(ordersModal);

        closeModal(checkoutModal);
    }
);


// ==========================================
// WISHLIST OPEN
// ==========================================

document
    .getElementById("wishlistBtn")
    ?.addEventListener(
        "click",
        function () {

            displayWishlist();

            openModal(wishlistModal);
        }
    );


document
    .getElementById("closeWishlist")
    ?.addEventListener(
        "click",
        function () {

            closeModal(wishlistModal);
        }
    );


// ==========================================
// ACCOUNT
// ==========================================

function openAccount() {

    openModal(accountModal);
}


document
    .getElementById("menuLoginBtn")
    ?.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            openAccount();
        }
    );


document
    .getElementById("closeAccount")
    ?.addEventListener(
        "click",
        function () {

            closeModal(accountModal);
        }
    );


// ==========================================
// LOGIN / REGISTER SWITCH
// ==========================================

document
    .getElementById("showRegister")
    ?.addEventListener(
        "click",
        function () {

            if (loginSection) {

                loginSection.style.display =
                    "none";
            }


            if (registerSection) {

                registerSection.style.display =
                    "block";
            }

        }
    );


document
    .getElementById("showLogin")
    ?.addEventListener(
        "click",
        function () {

            if (registerSection) {

                registerSection.style.display =
                    "none";
            }


            if (loginSection) {

                loginSection.style.display =
                    "block";
            }

        }
    );


// ==========================================
// REGISTER
// ==========================================

document
    .getElementById("registerForm")
    ?.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "registerName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "registerEmail"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "registerPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;


            if (!name) {

                alert(
                    "Please enter your name."
                );

                return;
            }


            if (!email) {

                alert(
                    "Please enter your email."
                );

                return;
            }


            if (!password) {

                alert(
                    "Please enter a password."
                );

                return;
            }


            if (password.length < 6) {

                alert(
                    "Password must be at least 6 characters."
                );

                return;
            }


            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                return;
            }


            try {

                const result =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                await setDoc(
                    doc(
                        db,
                        "users",
                        result.user.uid
                    ),
                    {
                        name: name,
                        email: email,
                        createdAt:
                            new Date().toISOString()
                    }
                );


                alert(
                    "Account created successfully! ❤️"
                );


                document
                    .getElementById(
                        "registerForm"
                    )
                    ?.reset();


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                alert(
                    getFirebaseError(error)
                );
            }

        }
    );


// ==========================================
// LOGIN
// ==========================================

document
    .getElementById("loginForm")
    ?.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            if (!email) {

                alert(
                    "Please enter your email."
                );

                return;
            }


            if (!password) {

                alert(
                    "Please enter your password."
                );

                return;
            }


            try {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                document
                    .getElementById(
                        "loginForm"
                    )
                    ?.reset();


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                alert(
                    getFirebaseError(error)
                );
            }

        }
    );


// ==========================================
// FIREBASE ERROR MESSAGE
// ==========================================

function getFirebaseError(error) {

    switch (error.code) {

        case "auth/email-already-in-use":
            return "This email is already registered.";

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/weak-password":
            return "Password must be at least 6 characters.";

        case "auth/invalid-credential":
            return "Invalid email or password.";

        case "auth/user-not-found":
            return "No account found with this email.";

        case "auth/wrong-password":
            return "Incorrect password.";

        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";

        case "auth/network-request-failed":
            return "Network error. Please check your internet connection.";

        default:
            return "Something went wrong. Please try again.";
    }
}


// ==========================================
// PASSWORD VISIBILITY
// ==========================================

document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    this.dataset.target;


                const input =
                    document.getElementById(
                        targetId
                    );


                if (!input) {
                    return;
                }


                if (input.type === "password") {

                    input.type = "text";

                    this.textContent = "🙈";

                    this.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                } else {

                    input.type = "password";

                    this.textContent = "👁️";

                    this.setAttribute(
                        "aria-label",
                        "Show password"
                    );
                }

            }
        );

    });


// ==========================================
// LOGIN GATE
// ==========================================

let currentUser = null;


document.body.classList.add(
    "auth-locked"
);


// Create login gate CSS
const authGateStyle =
    document.createElement("style");


authGateStyle.textContent = `
    body.auth-locked {
        overflow: hidden;
    }

    body.auth-locked > *:not(#accountModal) {
        display: none !important;
    }

    body.auth-locked #accountModal {
        display: flex !important;
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(0, 0, 0, 0.65);
        align-items: center;
        justify-content: center;
    }

    body.auth-locked #closeAccount {
        display: none !important;
    }

    body.auth-locked #overlay {
        display: none !important;
    }
`;


document.head.appendChild(
    authGateStyle
);


// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(
    auth,
    async function (user) {

        currentUser = user;


        if (user) {

            document.body.classList.remove(
                "auth-locked"
            );


            await showLoggedInUser(
                user
            );


            closeModal(
                accountModal
            );

        } else {

            document.body.classList.add(
                "auth-locked"
            );


            showLoggedOutUser();


            if (loginSection) {

                loginSection.style.display =
                    "block";
            }


            if (registerSection) {

                registerSection.style.display =
                    "none";
            }


            if (userSection) {

                userSection.style.display =
                    "none";
            }


            if (accountModal) {

                accountModal.classList.add(
                    "active"
                );

                accountModal.setAttribute(
                    "aria-hidden",
                    "false"
                );
            }

        }

    }
);


// ==========================================
// LOGGED IN USER
// ==========================================

async function showLoggedInUser(user) {

    if (loginSection) {

        loginSection.style.display =
            "none";
    }


    if (registerSection) {

        registerSection.style.display =
            "none";
    }


    if (userSection) {

        userSection.style.display =
            "block";
    }


    const welcomeUser =
        document.getElementById(
            "welcomeUser"
        );


    let name = "";


    try {

        const userDoc =
            await getDoc(
                doc(
                    db,
                    "users",
                    user.uid
                )
            );


        if (userDoc.exists()) {

            name =
                userDoc.data().name || "";
        }

    } catch (error) {

        console.error(
            "User data load error:",
            error
        );
    }


    if (!name) {

        name =
            user.email
                ? user.email.split("@")[0]
                : "User";
    }


    if (welcomeUser) {

        welcomeUser.textContent =
            `Welcome, ${name}! 💜`;
    }
}


// ==========================================
// LOGGED OUT USER
// ==========================================

function showLoggedOutUser() {

    if (loginSection) {

        loginSection.style.display =
            "block";
    }


    if (registerSection) {

        registerSection.style.display =
            "none";
    }


    if (userSection) {

        userSection.style.display =
            "none";
    }
}


// ==========================================
// LOGOUT
// ==========================================

document
    .getElementById("logoutBtn")
    ?.addEventListener(
        "click",
        async function () {

            try {

                await signOut(auth);

                alert(
                    "Logged out successfully! ❤️"
                );

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "Unable to log out. Please try again."
                );
            }

        }
    );


// ==========================================
// MY ORDERS
// ==========================================

document
    .getElementById("myOrdersBtn")
    ?.addEventListener(
        "click",
        function () {

            if (!currentUser) {

                alert(
                    "Please log in first."
                );

                return;
            }


            displayOrders();

            closeModal(accountModal);

            openModal(ordersModal);
        }
    );


document
    .getElementById("closeOrders")
    ?.addEventListener(
        "click",
        function () {

            closeModal(ordersModal);
        }
    );


// ==========================================
// DISPLAY ORDERS
// ==========================================

function displayOrders() {

    const ordersList =
        document.getElementById(
            "ordersList"
        );


    if (!ordersList) {
        return;
    }


    let userOrders = [];


    if (currentUser) {

        userOrders =
            orders.filter(order =>
                order.userId ===
                currentUser.uid
            );
    }


    if (userOrders.length === 0) {

        ordersList.innerHTML = `
            <div class="empty-message">
                📦 You have no orders yet.
            </div>
        `;

        return;
    }


    ordersList.innerHTML =
        userOrders
            .slice()
            .reverse()
            .map(order => {

                const orderDate =
                    order.date
                        ? new Date(
                            order.date
                        ).toLocaleString(
                            "en-IN"
                        )
                        : "";


                return `
                    <div class="order-card">

                        <h3>
                            Order #${order.id}
                        </h3>

                        <p>
                            <strong>Name:</strong>
                            ${order.customerName}
                        </p>

                        <p>
                            <strong>Phone:</strong>
                            ${order.customerPhone}
                        </p>

                        <p>
                            <strong>Date:</strong>
                            ${orderDate}
                        </p>

                        <div class="order-products">

                            ${order.items.map(item => {

                                const product =
                                    getProductById(
                                        item.id
                                    );

                                if (!product) {
                                    return "";
                                }


                                return `
                                    <div class="order-product-line">

                                        <span>
                                            ${product.name}
                                            × ${item.quantity}
                                        </span>

                                        <strong>
                                            ${formatPrice(
                                                product.price *
                                                item.quantity
                                            )}
                                        </strong>

                                    </div>
                                `;

                            }).join("")}

                        </div>


                        <div class="summary-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ${formatPrice(
                                    order.total
                                )}
                            </strong>

                        </div>


                        <span class="order-status">
                            ${order.status || "Order Placed"}
                        </span>

                    </div>
                `;

            })
            .join("");
}


// ==========================================
// CHECKOUT
// ==========================================

document
    .getElementById("checkoutBtn")
    ?.addEventListener(
        "click",
        function () {

            if (!currentUser) {

                alert(
                    "Please log in before placing an order."
                );

                closeCart();

                openAccount();

                return;
            }


            if (cart.length === 0) {

                alert(
                    "Your cart is empty! 🛒"
                );

                return;
            }


            closeCart();

            openModal(
                checkoutModal
            );


            const addressStep =
                document.getElementById(
                    "addressStep"
                );

            const paymentStep =
                document.getElementById(
                    "paymentStep"
                );


            if (addressStep) {

                addressStep.style.display =
                    "block";
            }


            if (paymentStep) {

                paymentStep.style.display =
                    "none";
            }

        }
    );


// ==========================================
// CLOSE CHECKOUT
// ==========================================

document
    .getElementById("closeCheckout")
    ?.addEventListener(
        "click",
        function () {

            closeModal(
                checkoutModal
            );
        }
    );


// ==========================================
// ADDRESS TO PAYMENT
// ==========================================

document
    .getElementById("continueToPayment")
    ?.addEventListener(
        "click",
        function () {

            const name =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "customerPhone"
                    )
                    .value
                    .trim();


            const address =
                document
                    .getElementById(
                        "customerAddress"
                    )
                    .value
                    .trim();


            const confirmAddress =
                document
                    .getElementById(
                        "confirmAddress"
                    )
                    .value
                    .trim();


            if (
                !name ||
                !phone ||
                !address ||
                !confirmAddress
            ) {

                alert(
                    "Please fill in all the required information."
                );

                return;
            }


            if (address !== confirmAddress) {

                alert(
                    "The addresses do not match."
                );

                return;
            }


            const summaryName =
                document.getElementById(
                    "summaryName"
                );


            const summaryPhone =
                document.getElementById(
                    "summaryPhone"
                );


            const summaryAddress =
                document.getElementById(
                    "summaryAddress"
                );


            const summaryTotal =
                document.getElementById(
                    "summaryTotal"
                );


            if (summaryName) {

                summaryName.textContent =
                    name;
            }


            if (summaryPhone) {

                summaryPhone.textContent =
                    phone;
            }


            if (summaryAddress) {

                summaryAddress.textContent =
                    address;
            }


            if (summaryTotal) {

                summaryTotal.textContent =
                    getCartTotal()
                        .toLocaleString(
                            "en-IN"
                        );
            }


            const addressStep =
                document.getElementById(
                    "addressStep"
                );


            const paymentStep =
                document.getElementById(
                    "paymentStep"
                );


            if (addressStep) {

                addressStep.style.display =
                    "none";
            }


            if (paymentStep) {

                paymentStep.style.display =
                    "block";
            }

        }
    );


// ==========================================
// BACK TO ADDRESS
// ==========================================

document
    .getElementById("backAddress")
    ?.addEventListener(
        "click",
        function () {

            const paymentStep =
                document.getElementById(
                    "paymentStep"
                );


            const addressStep =
                document.getElementById(
                    "addressStep"
                );


            if (paymentStep) {

                paymentStep.style.display =
                    "none";
            }


            if (addressStep) {

                addressStep.style.display =
                    "block";
            }

        }
    );


// ==========================================
// PLACE ORDER
// ==========================================

document
    .getElementById("placeOrder")
    ?.addEventListener(
        "click",
        function () {

            if (!currentUser) {

                alert(
                    "Please log in first."
                );

                return;
            }


            if (cart.length === 0) {

                alert(
                    "Your cart is empty! 🛒"
                );

                return;
            }


            const customerName =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const customerPhone =
                document
                    .getElementById(
                        "customerPhone"
                    )
                    .value
                    .trim();


            const customerAddress =
                document
                    .getElementById(
                        "customerAddress"
                    )
                    .value
                    .trim();


            if (
                !customerName ||
                !customerPhone ||
                !customerAddress
            ) {

                alert(
                    "Please complete your delivery information."
                );

                return;
            }


            const paymentMethod =
                document.querySelector(
                    'input[name="paymentMethod"]:checked'
                )?.value || "cod";


            const total =
                getCartTotal();


            const order = {

                id:
                    "SCW-" +
                    Date.now(),

                userId:
                    currentUser.uid,

                customerName:
                    customerName,

                customerPhone:
                    customerPhone,

                customerAddress:
                    customerAddress,

                paymentMethod:
                    paymentMethod,

                items:
                    cart.map(item => ({

                        id:
                            String(item.id),

                        quantity:
                            item.quantity

                    })),

                total:
                    total,

                status:
                    "Order Placed",

                date:
                    new Date().toISOString()
            };


            orders.push(order);

            saveOrders();


            sendWhatsAppOrder(
                order
            );

        }
    );


// ==========================================
// WHATSAPP ORDER
// ==========================================

function sendWhatsAppOrder(order) {

    let message =
        `🧶 *SARU_CRAFT_WORLD - NEW ORDER* ❤️\n\n`;


    message +=
        `🆔 *Order ID:* ${order.id}\n`;


    message +=
        `👤 *Customer:* ${order.customerName}\n`;


    message +=
        `📱 *Phone:* ${order.customerPhone}\n`;


    message +=
        `📍 *Address:* ${order.customerAddress}\n\n`;


    message +=
        `🛍️ *ORDER DETAILS*\n`;


    message +=
        `━━━━━━━━━━━━━━\n`;


    order.items.forEach(item => {

        const product =
            getProductById(item.id);


        if (!product) {
            return;
        }


        const itemTotal =
            product.price *
            item.quantity;


        message +=
            `• ${product.name}\n`;


        message +=
            `  Qty: ${item.quantity}\n`;


        message +=
            `  Price: ${formatPrice(
                itemTotal
            )}\n\n`;

    });


    message +=
        `━━━━━━━━━━━━━━\n`;


    message +=
        `💰 *TOTAL: ${formatPrice(
            order.total
        )}*\n`;


    message +=
        `💳 *Payment:* ${
            order.paymentMethod === "upi"
                ? "UPI"
                : "Cash on Delivery"
        }\n\n`;


    message +=
        `Thank you for shopping with Saru_Craft_World! ❤️`;


    const whatsappNumber =
        "917025337305";


    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(
            message
        );


    window.open(
        whatsappURL,
        "_blank"
    );


    cart = [];


    saveCart();

    displayCart();


    closeModal(
        checkoutModal
    );


    alert(
        "Order placed successfully! ❤️ WhatsApp will open."
    );
}


// ==========================================
// DARK MODE
// ==========================================

const darkModeBtn =
    document.getElementById(
        "darkModeBtn"
    );


const savedDarkMode =
    localStorage.getItem(
        "saruDarkMode"
    );


if (savedDarkMode === "true") {

    document.body.classList.add(
        "dark"
    );


    if (darkModeBtn) {

        darkModeBtn.textContent =
            "☀️";
    }
}


darkModeBtn?.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const enabled =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "saruDarkMode",
            enabled
        );


        this.textContent =
            enabled
                ? "☀️"
                : "🌙";
    }
);


// ==========================================
// MOBILE MENU
// ==========================================

const menuBtn =
    document.getElementById(
        "menuBtn"
    );


const navbar =
    document.getElementById(
        "navbar"
    );


menuBtn?.addEventListener(
    "click",
    function () {

        navbar?.classList.toggle(
            "active"
        );
    }
);


navbar
    ?.querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            function () {

                navbar.classList.remove(
                    "active"
                );
            }
        );

    });


// ==========================================
// CURRENT YEAR
// ==========================================

const currentYear =
    document.getElementById(
        "currentYear"
    );


if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();
}


// ==========================================
// INITIAL LOAD
// ==========================================

saveCart();

saveWishlist();

saveOrders();

displayProducts();

displayCart();

displayWishlist();