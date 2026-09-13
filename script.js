/* =========================================================
   SARU_CRAFTS_WORLD
   FINAL MATCHED JAVASCRIPT
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

const WHATSAPP_NUMBER = "917025337305";
const INSTAGRAM_USERNAME = "saru_craft_world";
const EMAIL_ADDRESS = "sarusb07@gmail.com";

const FREE_DELIVERY_LIMIT = 2000;


/* =========================================================
   PRODUCTS
========================================================= */

const products = [

    {
        id: 1,
        name: "Yellow Baby Girl Dress",
        price: 1500,
        category: "dress",
        image: "picture/yellow-dress.jpg",
        rating: 5,
        badge: "Handmade",

        colors: [
            "#f5d76e",
            "#f3b6c0",
            "#ffffff",
            "#b7cdb0"
        ],

        sizes: [
            "0-3M",
            "3-6M",
            "6-12M",
            "1-2Y"
        ],

        delivery: "Estimated delivery: 4–7 days",

        description:
            "Beautiful handmade crochet dress for baby girls."
    },

    {
        id: 2,
        name: "Tulip Headband",
        price: 299,
        category: "accessories",
        image: "picture/headband.jpg",
        rating: 5,
        badge: "Best Seller",

        colors: [
            "#f4a9b7",
            "#e8c86a",
            "#ffffff",
            "#8fa98b"
        ],

        sizes: [
            "Free Size"
        ],

        delivery: "Estimated delivery: 3–5 days",

        description:
            "Cute handmade crochet tulip headband."
    },

    {
        id: 3,
        name: "Crochet Hand Bag",
        price: 800,
        category: "bags",
        image: "picture/hand-bag.jpg",
        rating: 5,
        badge: "New Arrival",

        colors: [
            "#f4c8cf",
            "#d7c29e",
            "#8fa98b",
            "#ffffff"
        ],

        sizes: [
            "Standard"
        ],

        delivery: "Estimated delivery: 4–7 days",

        description:
            "Stylish handmade crochet handbag for everyday use."
    },

    {
        id: 4,
        name: "Crochet Jellyfish",
        price: 100,
        category: "toys",
        image: "picture/jellyfish.jpg",
        rating: 5,
        badge: "Cute Pick",

        colors: [
            "#f4c8cf",
            "#b9d5ec",
            "#cdb7e9",
            "#ffffff"
        ],

        sizes: [
            "Small"
        ],

        delivery: "Estimated delivery: 3–5 days",

        description:
            "Adorable handmade crochet jellyfish toy."
    }

];


/* =========================================================
   STORAGE
========================================================= */

const STORAGE = {
    cart: "saruCart",
    wishlist: "saruWishlist",
    orders: "saruOrders",
    loggedIn: "saruLoggedIn",
    user: "saruUser",
    pendingAction: "saruPendingAction",
    pendingAuth: "saruPendingAuth",
    tempUser: "saruTempUser",
    darkMode: "saruDarkMode"
};


/* =========================================================
   STATE
========================================================= */

let cart =
    JSON.parse(localStorage.getItem(STORAGE.cart)) || [];

let wishlist =
    JSON.parse(localStorage.getItem(STORAGE.wishlist)) || [];

let currentProduct = null;
let currentQuantity = 1;
let currentImageIndex = 0;
let currentImages = [];

let currentFilter = "all";
let currentSearch = "";


/* =========================================================
   HELPERS
========================================================= */

function $(id) {
    return document.getElementById(id);
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function formatPrice(value) {
    return "₹" + Number(value).toLocaleString("en-IN");
}

function showToast(message) {

    const toast = $("toast");
    const text = $("toastMessage");

    if (!toast || !text) return;

    text.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================================================
   MODALS
========================================================= */

function openModal(id) {

    const modal = $(id);

    if (!modal) return;

    closeCart();

    modal.classList.add("active");

    document.body.classList.add("no-scroll");
}

function closeModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.classList.remove("active");

    if (!document.querySelector(".modal.active")) {
        document.body.classList.remove("no-scroll");
    }
}

function closeAllModals() {

    document.querySelectorAll(".modal.active").forEach(modal => {
        modal.classList.remove("active");
    });

    document.body.classList.remove("no-scroll");
}


/* =========================================================
   INTRO
========================================================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        const intro = $("introScreen");

        if (intro) {
            intro.style.display = "none";
        }

    }, 2900);

});


/* =========================================================
   PRODUCT RENDER
========================================================= */

function renderProducts() {

    const grid = $("productGrid");
    const noProducts = $("noProducts");

    if (!grid) return;

    let list = [...products];

    if (currentFilter !== "all") {

        list = list.filter(
            product =>
                product.category === currentFilter
        );
    }

    if (currentSearch.trim()) {

        const search = currentSearch
            .toLowerCase()
            .trim();

        list = list.filter(product =>
            product.name
                .toLowerCase()
                .includes(search)
        );
    }


    const sort = $("sortProducts")?.value;

    if (sort === "low") {

        list.sort((a, b) => a.price - b.price);

    } else if (sort === "high") {

        list.sort((a, b) => b.price - a.price);

    } else if (sort === "name") {

        list.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }


    grid.innerHTML = "";


    if (!list.length) {

        if (noProducts) {
            noProducts.style.display = "block";
        }

        return;
    }


    if (noProducts) {
        noProducts.style.display = "none";
    }


    list.forEach(product => {

        const isWishlisted =
            wishlist.includes(product.id);

        const stars =
            "★".repeat(product.rating) +
            "☆".repeat(5 - product.rating);


        const card =
            document.createElement("article");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image-wrap">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.src='picture/Logo.jpg'"
                >

                <div class="product-badges">
                    <span class="product-badge">
                        ${product.badge}
                    </span>
                </div>

                <button
                    class="product-wishlist ${isWishlisted ? "active" : ""}"
                    data-wishlist="${product.id}"
                    aria-label="Wishlist"
                >
                    <i class="${isWishlisted ? "fa-solid" : "fa-regular"} fa-heart"></i>
                </button>

            </div>


            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>

                <h3>${product.name}</h3>

                <div class="rating">
                    ${stars}
                </div>

                <div class="product-bottom">

                    <div class="product-price">
                        ${formatPrice(product.price)}
                    </div>

                    <button
                        class="add-cart"
                        data-cart="${product.id}"
                        aria-label="Add to cart"
                    >
                        <i class="fa-solid fa-plus"></i>
                    </button>

                </div>

            </div>

        `;


        card.addEventListener("click", event => {

            if (
                event.target.closest("[data-wishlist]") ||
                event.target.closest("[data-cart]")
            ) {
                return;
            }

            openProduct(product.id);
        });


        grid.appendChild(card);
    });


    grid.querySelectorAll("[data-wishlist]")
        .forEach(button => {

            button.addEventListener("click", event => {

                event.stopPropagation();

                toggleWishlist(
                    Number(button.dataset.wishlist)
                );
            });

        });


    grid.querySelectorAll("[data-cart]")
        .forEach(button => {

            button.addEventListener("click", event => {

                event.stopPropagation();

                addToCart(
                    Number(button.dataset.cart)
                );
            });

        });

}


/* =========================================================
   SEARCH
========================================================= */

function performSearch(value) {

    currentSearch = value;

    renderProducts();
}

$("searchInput")?.addEventListener(
    "input",
    event => {
        performSearch(event.target.value);
    }
);

$("shopSearchInput")?.addEventListener(
    "input",
    event => {
        performSearch(event.target.value);
    }
);


/* =========================================================
   SEARCH TOGGLE
========================================================= */

$("searchToggle")?.addEventListener(
    "click",
    () => {

        $("searchArea")?.classList.toggle("active");

        if ($("searchArea")?.classList.contains("active")) {
            $("searchInput")?.focus();
        }
    }
);


$("closeSearch")?.addEventListener(
    "click",
    () => {
        $("searchArea")?.classList.remove("active");
    }
);


/* =========================================================
   FILTER
========================================================= */

document.querySelectorAll(".filter-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            currentFilter =
                button.dataset.filter || "all";


            document
                .querySelectorAll(".filter-btn")
                .forEach(btn =>
                    btn.classList.remove("active")
                );


            button.classList.add("active");

            renderProducts();

            document
                .getElementById("shop")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        });

    });


/* =========================================================
   CATEGORY CARDS
========================================================= */

document.querySelectorAll(".category-card")
    .forEach(card => {

        card.addEventListener("click", () => {

            const category =
                card.dataset.category;

            currentFilter = category;

            document
                .querySelectorAll(".filter-btn")
                .forEach(button => {

                    button.classList.toggle(
                        "active",
                        button.dataset.filter === category
                    );

                });

            renderProducts();

            document
                .getElementById("shop")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        });

    });


/* =========================================================
   SORT
========================================================= */

$("sortProducts")?.addEventListener(
    "change",
    renderProducts
);


/* =========================================================
   PRODUCT MODAL
========================================================= */

function openProduct(id) {

    const product =
        products.find(item => item.id === id);

    if (!product) return;

    currentProduct = product;

    currentQuantity = 1;

    currentImageIndex = 0;

    currentImages = [product.image];


    $("modalProductName").textContent =
        product.name;

    $("modalProductCategory").textContent =
        product.category;

    $("modalPrice").textContent =
        formatPrice(product.price);

    $("modalDescription").textContent =
        product.description;

    $("modalDelivery").textContent =
        product.delivery;

    $("modalQuantity").textContent =
        currentQuantity;

    $("modalStars").textContent =
        "★".repeat(product.rating) +
        "☆".repeat(5 - product.rating);

    $("modalRating").textContent =
        `${product.rating}.0 / 5`;


    renderColors(product);

    renderSizes(product);

    renderGallery();

    $("customizationText").value = "";


    openModal("productModal");
}


/* =========================================================
   COLORS
========================================================= */

function renderColors(product) {

    const container = $("colorOptions");

    if (!container) return;

    container.innerHTML = "";

    const colors = product.colors || [];

    if (!colors.length) {

        $("colorOptionGroup").style.display = "none";

        return;
    }

    $("colorOptionGroup").style.display = "block";


    colors.forEach((color, index) => {

        const button =
            document.createElement("button");

        button.className =
            "color-option" +
            (index === 0 ? " active" : "");

        button.style.backgroundColor = color;

        button.dataset.color = color;

        button.type = "button";


        button.addEventListener("click", () => {

            container
                .querySelectorAll(".color-option")
                .forEach(item =>
                    item.classList.remove("active")
                );

            button.classList.add("active");

            $("selectedColor").textContent =
                color;

        });


        container.appendChild(button);

    });


    $("selectedColor").textContent =
        colors[0];
}


/* =========================================================
   SIZES
========================================================= */

function renderSizes(product) {

    const container = $("sizeOptions");

    if (!container) return;

    container.innerHTML = "";

    const sizes = product.sizes || [];

    if (!sizes.length) {

        $("sizeOptionGroup").style.display = "none";

        return;
    }

    $("sizeOptionGroup").style.display = "block";


    sizes.forEach((size, index) => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "size-option" +
            (index === 0 ? " active" : "");

        button.textContent = size;

        button.dataset.size = size;


        button.addEventListener("click", () => {

            container
                .querySelectorAll(".size-option")
                .forEach(item =>
                    item.classList.remove("active")
                );

            button.classList.add("active");

            $("selectedSize").textContent =
                size;
        });


        container.appendChild(button);

    });


    $("selectedSize").textContent =
        sizes[0];
}


/* =========================================================
   GALLERY
========================================================= */

function renderGallery() {

    const mainImage = $("modalMainImage");
    const thumbnails = $("thumbnailContainer");

    if (!mainImage || !thumbnails) return;

    const image =
        currentImages[currentImageIndex];

    mainImage.src = image;

    mainImage.alt =
        currentProduct?.name || "Product";


    $("imageCounter").textContent =
        `${currentImageIndex + 1} / ${currentImages.length}`;


    thumbnails.innerHTML = "";


    currentImages.forEach((src, index) => {

        const img =
            document.createElement("img");

        img.src = src;

        img.alt =
            `${currentProduct?.name || "Product"} image ${index + 1}`;

        img.className =
            index === currentImageIndex
                ? "active"
                : "";


        img.addEventListener("click", () => {

            currentImageIndex = index;

            renderGallery();
        });


        thumbnails.appendChild(img);

    });

}


$("prevImage")?.addEventListener(
    "click",
    () => {

        if (currentImages.length <= 1) return;

        currentImageIndex =
            (currentImageIndex - 1 + currentImages.length) %
            currentImages.length;

        renderGallery();
    }
);


$("nextImage")?.addEventListener(
    "click",
    () => {

        if (currentImages.length <= 1) return;

        currentImageIndex =
            (currentImageIndex + 1) %
            currentImages.length;

        renderGallery();
    }
);


/* =========================================================
   QUANTITY
========================================================= */

$("modalQtyMinus")?.addEventListener(
    "click",
    () => {

        if (currentQuantity > 1) {
            currentQuantity--;
            $("modalQuantity").textContent =
                currentQuantity;
        }
    }
);


$("modalQtyPlus")?.addEventListener(
    "click",
    () => {

        if (currentQuantity < 20) {
            currentQuantity++;
            $("modalQuantity").textContent =
                currentQuantity;
        }
    }
);


/* =========================================================
   CART
========================================================= */

function addToCart(id, quantity = 1) {

    const product =
        products.find(item => item.id === id);

    if (!product) return;


    const existing =
        cart.find(item =>
            item.id === id &&
            !item.customization
        );


    if (existing) {

        existing.quantity += quantity;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });

    }


    saveData(STORAGE.cart, cart);

    updateCartUI();

    showToast(
        `${product.name} added to cart 🛒`
    );
}


function addCurrentProductToCart() {

    if (!currentProduct) return;


    const selectedColor =
        document
            .querySelector("#colorOptions .color-option.active")
            ?.dataset.color || "";


    const selectedSize =
        document
            .querySelector("#sizeOptions .size-option.active")
            ?.dataset.size || "";


    const customization =
        $("customizationText")?.value.trim() || "";


    cart.push({

        id: currentProduct.id,

        name: currentProduct.name,

        price: currentProduct.price,

        image: currentProduct.image,

        quantity: currentQuantity,

        color: selectedColor,

        size: selectedSize,

        customization: customization

    });


    saveData(STORAGE.cart, cart);

    updateCartUI();

    closeModal("productModal");

    showToast(
        `${currentProduct.name} added to cart 🛒`
    );
}


$("modalAddToCart")?.addEventListener(
    "click",
    addCurrentProductToCart
);


/* =========================================================
   CART CALCULATIONS
========================================================= */

function getCartCount() {

    return cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );
}


function getCartTotal() {

    return cart.reduce(
        (total, item) =>
            total +
            Number(item.price || 0) *
            Number(item.quantity || 0),
        0
    );
}


/* =========================================================
   CART UI
========================================================= */

function updateCartUI() {

    const container = $("cartItems");

    if (!container) return;

    container.innerHTML = "";


    const count = getCartCount();

    const total = getCartTotal();


    $("cartCount").textContent = count;

    $("bottomCartCount").textContent = count;

    $("cartSubtotal").textContent =
        formatPrice(total);

    $("cartTotal").textContent =
        formatPrice(total);


    $("emptyCart").style.display =
        cart.length ? "none" : "block";


    $("cartFooter").style.display =
        cart.length ? "block" : "none";


    cart.forEach((item, index) => {

        const element =
            document.createElement("div");

        element.className = "cart-item";


        element.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
                onerror="this.src='picture/Logo.jpg'"
            >

            <div>

                <h4>${item.name}</h4>

                ${
                    item.color
                        ? `<small>Color: ${item.color}</small>`
                        : ""
                }

                ${
                    item.size
                        ? `<small>Size: ${item.size}</small>`
                        : ""
                }

                <p>
                    ${formatPrice(item.price)}
                </p>

                <div class="quantity-box">

                    <button
                        data-minus="${index}"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        data-plus="${index}"
                    >
                        +
                    </button>

                </div>

            </div>


            <button
                class="cart-remove"
                data-remove="${index}"
                aria-label="Remove"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

        `;


        container.appendChild(element);
    });


    container
        .querySelectorAll("[data-minus]")
        .forEach(button => {

            button.addEventListener("click", () => {

                changeCartQuantity(
                    Number(button.dataset.minus),
                    -1
                );

            });

        });


    container
        .querySelectorAll("[data-plus]")
        .forEach(button => {

            button.addEventListener("click", () => {

                changeCartQuantity(
                    Number(button.dataset.plus),
                    1
                );

            });

        });


    container
        .querySelectorAll("[data-remove]")
        .forEach(button => {

            button.addEventListener("click", () => {

                removeFromCart(
                    Number(button.dataset.remove)
                );

            });

        });


    updateDeliveryProgress();

}


function changeCartQuantity(index, change) {

    if (!cart[index]) return;

    cart[index].quantity += change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);
    }


    saveData(STORAGE.cart, cart);

    updateCartUI();
}


function removeFromCart(index) {

    if (!cart[index]) return;

    const name = cart[index].name;

    cart.splice(index, 1);

    saveData(STORAGE.cart, cart);

    updateCartUI();

    showToast(`${name} removed from cart.`);
}


/* =========================================================
   DELIVERY
========================================================= */

function updateDeliveryProgress() {

    const total = getCartTotal();

    const progress =
        Math.min(
            (total / FREE_DELIVERY_LIMIT) * 100,
            100
        );


    $("deliveryProgress").style.width =
        `${progress}%`;


    if (total >= FREE_DELIVERY_LIMIT) {

        $("deliveryMessage").textContent =
            "🎉 You qualify for FREE delivery!";

        $("cartDelivery").textContent =
            "FREE";

    } else {

        const remaining =
            FREE_DELIVERY_LIMIT - total;

        $("deliveryMessage").textContent =
            `Add ${formatPrice(remaining)} more for free delivery.`;

        $("cartDelivery").textContent =
            "FREE";
    }

}


/* =========================================================
   CART OPEN/CLOSE
========================================================= */

function openCart() {

    $("cartSidebar").classList.add("active");

    $("cartOverlay").classList.add("active");

    document.body.classList.add("no-scroll");
}


function closeCart() {

    $("cartSidebar")?.classList.remove("active");

    $("cartOverlay")?.classList.remove("active");

    if (!document.querySelector(".modal.active")) {
        document.body.classList.remove("no-scroll");
    }
}


$("cartBtn")?.addEventListener(
    "click",
    openCart
);

$("closeCart")?.addEventListener(
    "click",
    closeCart
);

$("cartOverlay")?.addEventListener(
    "click",
    closeCart
);

$("continueShopping")?.addEventListener(
    "click",
    closeCart
);


/* =========================================================
   CHECKOUT
========================================================= */

function isLoggedIn() {

    return (
        localStorage.getItem(
            STORAGE.loggedIn
        ) === "true"
    );
}


function openCheckout() {

    if (!cart.length) {

        showToast("Your cart is empty! 🛒");

        return;
    }


    if (!isLoggedIn()) {

        localStorage.setItem(
            STORAGE.pendingAction,
            "checkout"
        );

        closeCart();

        openModal("loginModal");

        showToast(
            "Please login to continue."
        );

        return;
    }


    renderCheckoutSummary();

    closeCart();

    openModal("checkoutModal");
}


$("checkoutBtn")?.addEventListener(
    "click",
    openCheckout
);


/* =========================================================
   CHECKOUT SUMMARY
========================================================= */

function renderCheckoutSummary() {

    const container = $("checkoutItems");

    if (!container) return;

    container.innerHTML = "";


    cart.forEach(item => {

        const div =
            document.createElement("div");

        div.className = "checkout-item";


        div.innerHTML = `

            <span>
                ${item.name}
                × ${item.quantity}
            </span>

            <strong>
                ${formatPrice(
                    item.price * item.quantity
                )}
            </strong>

        `;


        container.appendChild(div);
    });


    $("checkoutTotal").textContent =
        formatPrice(getCartTotal());


    const user =
        JSON.parse(
            localStorage.getItem(STORAGE.user) || "null"
        );


    if (user) {

        if (user.name) {
            $("customerName").value = user.name;
        }

        if (user.phone) {
            $("customerPhone").value = user.phone;
        }

    }

}


/* =========================================================
   WHATSAPP ORDER
========================================================= */

function placeOrderToWhatsApp(event) {

    event.preventDefault();


    if (!cart.length) {

        showToast("Your cart is empty! 🛒");

        return;
    }


    const customerName =
        $("customerName").value.trim();

    const customerPhone =
        $("customerPhone").value.trim();

    const customerAddress =
        $("customerAddress").value.trim();


    const payment =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        )?.value || "Cash on Delivery";


    if (
        !customerName ||
        !customerPhone ||
        !customerAddress
    ) {

        showToast(
            "Please fill all required details."
        );

        return;
    }


    const total = getCartTotal();


    let message =
        `🧶 *SARU_CRAFTS_WORLD - NEW ORDER* ❤️\n\n`;

    message +=
        `👤 *Customer:* ${customerName}\n`;

    message +=
        `📱 *Phone:* ${customerPhone}\n`;

    message +=
        `📍 *Address:* ${customerAddress}\n`;

    message +=
        `💳 *Payment:* ${payment}\n\n`;

    message +=
        `━━━━━━━━━━━━━━\n`;

    message +=
        `🛍️ *ORDER DETAILS*\n`;

    message +=
        `━━━━━━━━━━━━━━\n`;


    cart.forEach((item, index) => {

        message +=
            `\n${index + 1}. *${item.name}*\n`;

        message +=
            `Quantity: ${item.quantity}\n`;

        message +=
            `Price: ${formatPrice(item.price)}\n`;

        if (item.color) {
            message +=
                `Color: ${item.color}\n`;
        }

        if (item.size) {
            message +=
                `Size: ${item.size}\n`;
        }

        if (item.customization) {
            message +=
                `Customization: ${item.customization}\n`;
        }

        message +=
            `Subtotal: ${formatPrice(
                item.price * item.quantity
            )}\n`;
    });


    message +=
        `\n━━━━━━━━━━━━━━\n`;

    message +=
        `💰 *TOTAL: ${formatPrice(total)}*\n`;

    message +=
        `━━━━━━━━━━━━━━\n\n`;

    message +=
        `Thank you for choosing Saru_Crafts_World! 🧶❤️`;


    const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);


    /*
       WhatsApp തുറക്കാൻ ശ്രമിക്കുന്നു.
       Popup blocked ആണെങ്കിൽ current window ഉപയോഗിക്കും.
    */

    const whatsappWindow =
        window.open(
            whatsappURL,
            "_blank"
        );


    if (!whatsappWindow) {
        window.location.href =
            whatsappURL;
    }


    /* Save local order */

    const orders =
        JSON.parse(
            localStorage.getItem(
                STORAGE.orders
            ) || "[]"
        );


    orders.push({

        id:
            "ORD-" +
            Date.now(),

        date:
            new Date().toISOString(),

        customerName,
        customerPhone,
        customerAddress,
        payment,

        items: [...cart],

        total

    });


    saveData(
        STORAGE.orders,
        orders
    );


    /* Clear cart */

    cart = [];

    saveData(
        STORAGE.cart,
        cart
    );

    updateCartUI();

    $("checkoutForm").reset();

    closeModal("checkoutModal");


    setTimeout(() => {

        openModal("successModal");

    }, 600);

}


$("checkoutForm")?.addEventListener(
    "submit",
    placeOrderToWhatsApp
);


/* =========================================================
   WISHLIST
========================================================= */

function toggleWishlist(id) {

    const product =
        products.find(item => item.id === id);

    if (!product) return;


    const index =
        wishlist.indexOf(id);


    if (index === -1) {

        wishlist.push(id);

        showToast(
            `${product.name} added to wishlist ❤️`
        );

    } else {

        wishlist.splice(index, 1);

        showToast(
            `${product.name} removed from wishlist.`
        );
    }


    saveData(
        STORAGE.wishlist,
        wishlist
    );


    updateWishlistCount();

    renderProducts();
}


function updateWishlistCount() {

    const count =
        wishlist.length;

    $("wishlistCount").textContent =
        count;

    $("bottomWishlistCount").textContent =
        count;
}


function renderWishlist() {

    const container = $("wishlistItems");

    if (!container) return;

    container.innerHTML = "";


    $("emptyWishlist").style.display =
        wishlist.length ? "none" : "block";


    wishlist.forEach(id => {

        const product =
            products.find(item => item.id === id);

        if (!product) return;


        const item =
            document.createElement("div");

        item.className = "wishlist-item";


        item.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
                onerror="this.src='picture/Logo.jpg'"
            >

            <div class="wishlist-item-info">

                <h3>${product.name}</h3>

                <strong>
                    ${formatPrice(product.price)}
                </strong>

                <div class="wishlist-actions">

                    <button
                        class="btn btn-primary"
                        data-wish-cart="${product.id}"
                    >
                        Add to Cart
                    </button>

                    <button
                        class="btn btn-outline"
                        data-wish-remove="${product.id}"
                    >
                        Remove
                    </button>

                </div>

            </div>

        `;


        container.appendChild(item);
    });


    container
        .querySelectorAll("[data-wish-cart]")
        .forEach(button => {

            button.addEventListener("click", () => {

                addToCart(
                    Number(button.dataset.wishCart)
                );

            });

        });


    container
        .querySelectorAll("[data-wish-remove]")
        .forEach(button => {

            button.addEventListener("click", () => {

                toggleWishlist(
                    Number(button.dataset.wishRemove)
                );

                renderWishlist();
            });

        });

}


function openWishlist() {

    renderWishlist();

    openModal("wishlistModal");
}


$("wishlistBtn")?.addEventListener(
    "click",
    openWishlist
);

$("bottomWishlist")?.addEventListener(
    "click",
    openWishlist
);


/* =========================================================
   MODAL PRODUCT WISHLIST
========================================================= */

$("modalWishlist")?.addEventListener(
    "click",
    () => {

        if (!currentProduct) return;

        toggleWishlist(
            currentProduct.id
        );

        renderProducts();

    }
);


/* =========================================================
   BUY NOW
========================================================= */

$("modalBuyNow")?.addEventListener(
    "click",
    () => {

        if (!currentProduct) return;


        if (!isLoggedIn()) {

            localStorage.setItem(
                STORAGE.pendingAction,
                "buyNow"
            );

            closeModal("productModal");

            openModal("loginModal");

            showToast(
                "Please login to continue."
            );

            return;
        }


        const selectedColor =
            document
                .querySelector(
                    "#colorOptions .color-option.active"
                )
                ?.dataset.color || "";


        const selectedSize =
            document
                .querySelector(
                    "#sizeOptions .size-option.active"
                )
                ?.dataset.size || "";


        const customization =
            $("customizationText")
                ?.value.trim() || "";


        cart = [{

            id: currentProduct.id,

            name: currentProduct.name,

            price: currentProduct.price,

            image: currentProduct.image,

            quantity: currentQuantity,

            color: selectedColor,

            size: selectedSize,

            customization

        }];


        saveData(
            STORAGE.cart,
            cart
        );


        updateCartUI();

        closeModal("productModal");

        renderCheckoutSummary();

        openModal("checkoutModal");

    }
);


/* =========================================================
   ACCOUNT
========================================================= */

function openAccount() {

    if (isLoggedIn()) {

        const user =
            JSON.parse(
                localStorage.getItem(
                    STORAGE.user
                ) || "{}"
            );


        $("accountWelcome").textContent =
            user.name
                ? `Welcome, ${user.name}!`
                : "You are logged in.";

    } else {

        $("accountWelcome").textContent =
            "Login or create your account.";
    }


    openModal("accountModal");
}


$("accountBtn")?.addEventListener(
    "click",
    openAccount
);

$("bottomAccount")?.addEventListener(
    "click",
    openAccount
);

$("mobileAccountBtn")?.addEventListener(
    "click",
    () => {

        $("mobileMenu").classList.remove("active");

        openAccount();
    }
);


/* =========================================================
   LOGIN / REGISTER OPEN
========================================================= */

$("openLogin")?.addEventListener(
    "click",
    () => {

        closeModal("accountModal");

        openModal("loginModal");
    }
);


$("openRegister")?.addEventListener(
    "click",
    () => {

        closeModal("accountModal");

        openModal("registerModal");
    }
);


/* =========================================================
   AUTH METHOD
========================================================= */

function setAuthMethod(
    method,
    formType
) {

    if (formType === "login") {

        const label =
            $("loginContactLabel");

        const input =
            $("loginContact");

        if (method === "phone") {

            label.textContent = "Phone";

            input.type = "tel";

            input.placeholder =
                "Enter your phone number";

            $("loginPasswordGroup")
                .style.display = "none";

        } else {

            label.textContent = "Email";

            input.type = "email";

            input.placeholder =
                "Enter your email";

            $("loginPasswordGroup")
                .style.display = "block";
        }

    }


    if (formType === "register") {

        const label =
            $("registerContactLabel");

        const input =
            $("registerContact");


        if (method === "phone") {

            label.textContent = "Phone";

            input.type = "tel";

            input.placeholder =
                "Enter your phone number";

        } else {

            label.textContent = "Email";

            input.type = "email";

            input.placeholder =
                "Enter your email";
        }

    }


    document
        .querySelectorAll(
            `.auth-method[data-form="${formType}"]`
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.method === method
            );

        });
}


document
    .querySelectorAll(".auth-method")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                setAuthMethod(
                    button.dataset.method,
                    button.dataset.form
                );

            }
        );

    });


/* =========================================================
   REGISTER
========================================================= */

$("registerForm")?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            $("registerName")
                .value.trim();

        const contact =
            $("registerContact")
                .value.trim();

        const password =
            $("registerPassword")
                .value;


        if (!name || !contact || !password) {

            showToast(
                "Please fill all fields."
            );

            return;
        }


        if (password.length < 6) {

            showToast(
                "Password must contain at least 6 characters."
            );

            return;
        }


        const tempUser = {

            name,
            contact,
            password

        };


        saveData(
            STORAGE.tempUser,
            tempUser
        );


        localStorage.setItem(
            STORAGE.pendingAuth,
            "register"
        );


        $("otpDestination").textContent =
            contact;


        closeModal("registerModal");

        openModal("otpModal");


        showToast(
            "Demo OTP: enter any 6 digits."
        );

    }
);


/* =========================================================
   LOGIN
========================================================= */

$("loginForm")?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const contact =
            $("loginContact")
                .value.trim();


        if (!contact) {

            showToast(
                "Please enter your contact."
            );

            return;
        }


        localStorage.setItem(
            STORAGE.pendingAuth,
            "login"
        );


        saveData(
            STORAGE.tempUser,
            {
                contact
            }
        );


        $("otpDestination").textContent =
            contact;


        closeModal("loginModal");

        openModal("otpModal");


        showToast(
            "Demo OTP: enter any 6 digits."
        );

    }
);


/* =========================================================
   SWITCH AUTH
========================================================= */

$("switchToRegister")?.addEventListener(
    "click",
    () => {

        closeModal("loginModal");

        openModal("registerModal");

    }
);


$("switchToLogin")?.addEventListener(
    "click",
    () => {

        closeModal("registerModal");

        openModal("loginModal");

    }
);


/* =========================================================
   OTP
========================================================= */

function verifyOTP(event) {

    event.preventDefault();


    const inputs =
        document.querySelectorAll(
            ".otp-input"
        );


    const otp =
        Array.from(inputs)
            .map(input => input.value)
            .join("");


    if (!/^\d{6}$/.test(otp)) {

        showToast(
            "Please enter all 6 digits."
        );

        return;
    }


    const pendingAuth =
        localStorage.getItem(
            STORAGE.pendingAuth
        );


    const tempUser =
        JSON.parse(
            localStorage.getItem(
                STORAGE.tempUser
            ) || "{}"
        );


    if (pendingAuth === "register") {

        saveData(
            STORAGE.user,
            {
                name: tempUser.name || "Customer",
                email:
                    tempUser.contact?.includes("@")
                        ? tempUser.contact
                        : "",
                phone:
                    tempUser.contact?.includes("@")
                        ? ""
                        : tempUser.contact
            }
        );

    } else {

        const oldUser =
            JSON.parse(
                localStorage.getItem(
                    STORAGE.user
                ) || "{}"
            );


        if (!oldUser.name) {
            oldUser.name = "Customer";
        }


        if (tempUser.contact?.includes("@")) {
            oldUser.email = tempUser.contact;
        } else {
            oldUser.phone = tempUser.contact;
        }


        saveData(
            STORAGE.user,
            oldUser
        );
    }


    localStorage.setItem(
        STORAGE.loggedIn,
        "true"
    );


    localStorage.removeItem(
        STORAGE.pendingAuth
    );


    localStorage.removeItem(
        STORAGE.tempUser
    );


    inputs.forEach(input => {
        input.value = "";
    });


    closeModal("otpModal");


    const pendingAction =
        localStorage.getItem(
            STORAGE.pendingAction
        );


    localStorage.removeItem(
        STORAGE.pendingAction
    );


    showToast(
        "Login successful! 🎉"
    );


    if (
        pendingAction === "checkout" ||
        pendingAction === "buyNow"
    ) {

        setTimeout(() => {

            renderCheckoutSummary();

            openModal("checkoutModal");

        }, 400);
    }

}


$("otpForm")?.addEventListener(
    "submit",
    verifyOTP
);


/* =========================================================
   OTP INPUT
========================================================= */

document
    .querySelectorAll(".otp-input")
    .forEach((input, index, inputs) => {

        input.addEventListener(
            "input",
            () => {

                input.value =
                    input.value.replace(
                        /\D/g,
                        ""
                    ).slice(0,1);


                if (
                    input.value &&
                    index < inputs.length - 1
                ) {

                    inputs[index + 1].focus();
                }

            }
        );


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Backspace" &&
                    !input.value &&
                    index > 0
                ) {

                    inputs[index - 1].focus();
                }

            }
        );

    });


$("resendOtp")?.addEventListener(
    "click",
    () => {

        showToast(
            "Demo OTP: enter any 6 digits."
        );

    }
);


/* =========================================================
   CUSTOM ORDER
========================================================= */

$("customOrderBtn")?.addEventListener(
    "click",
    () => {

        openModal("customOrderModal");

    }
);


$("customOrderForm")?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            $("customName")
                .value.trim();

        const phone =
            $("customPhone")
                .value.trim();

        const request =
            $("customRequest")
                .value.trim();


        if (!name || !phone || !request) {

            showToast(
                "Please fill all fields."
            );

            return;
        }


        let message =
            `🧶 *SARU_CRAFTS_WORLD - CUSTOM ORDER* ❤️\n\n`;

        message +=
            `👤 Customer: ${name}\n`;

        message +=
            `📱 Phone: ${phone}\n\n`;

        message +=
            `📝 Request:\n${request}`;


        const url =
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            encodeURIComponent(message);


        const whatsappWindow =
            window.open(url, "_blank");


        if (!whatsappWindow) {
            window.location.href = url;
        }


        $("customOrderForm").reset();

        closeModal("customOrderModal");

    }
);


/* =========================================================
   ZOOM
========================================================= */

$("zoomImage")?.addEventListener(
    "click",
    () => {

        if (!currentProduct) return;

        $("zoomedImage").src =
            currentImages[currentImageIndex];

        $("zoomedImage").alt =
            currentProduct.name;

        openModal("zoomModal");

    }
);


/* =========================================================
   ACCORDION
========================================================= */

document.addEventListener(
    "click",
    event => {

        const title =
            event.target.closest(
                ".accordion-title"
            );

        if (!title) return;

        const item =
            title.closest(
                ".accordion-item"
            );

        item.classList.toggle("open");

    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

$("mobileMenuBtn")?.addEventListener(
    "click",
    () => {

        $("mobileMenu")
            .classList.add("active");

    }
);


$("mobileMenuClose")?.addEventListener(
    "click",
    () => {

        $("mobileMenu")
            .classList.remove("active");

    }
);


document
    .querySelectorAll("#mobileMenu a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                $("mobileMenu")
                    .classList.remove("active");

            }
        );

    });


/* =========================================================
   DARK MODE
========================================================= */

function applyDarkMode() {

    const enabled =
        localStorage.getItem(
            STORAGE.darkMode
        ) === "true";


    document.body.classList.toggle(
        "dark",
        enabled
    );


    const icon =
        $("darkModeBtn")?.querySelector("i");


    if (icon) {

        icon.className =
            enabled
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";
    }


    const mobileIcon =
        $("mobileDarkModeBtn")
            ?.querySelector("i");


    if (mobileIcon) {

        mobileIcon.className =
            enabled
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";
    }

}


function toggleDarkMode() {

    const enabled =
        document.body.classList.toggle(
            "dark"
        );


    localStorage.setItem(
        STORAGE.darkMode,
        enabled
    );


    applyDarkMode();

}


$("darkModeBtn")?.addEventListener(
    "click",
    toggleDarkMode
);

$("mobileDarkModeBtn")?.addEventListener(
    "click",
    toggleDarkMode
);


/* =========================================================
   CONTACT LINKS
========================================================= */

function openWhatsApp() {

    const url =
        "https://wa.me/" +
        WHATSAPP_NUMBER;


    window.open(
        url,
        "_blank"
    );

}


[
    "whatsappLink",
    "footerWhatsapp",
    "floatingWhatsapp"
]
.forEach(id => {

    $(id)?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            openWhatsApp();

        }
    );

});


const instagramURL =
    `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;


$("instagramLink").href =
    instagramURL;

$("footerInstagram").href =
    instagramURL;


$("emailLink").href =
    `mailto:${EMAIL_ADDRESS}`;


/* =========================================================
   FOOTER LOGIN / REGISTER
========================================================= */

$("footerLogin")?.addEventListener(
    "click",
    event => {

        event.preventDefault();

        openModal("loginModal");

    }
);


$("footerRegister")?.addEventListener(
    "click",
    event => {

        event.preventDefault();

        openModal("registerModal");

    }
);


$("footerWishlist")?.addEventListener(
    "click",
    event => {

        event.preventDefault();

        openWishlist();

    }
);


$("footerOrders")?.addEventListener(
    "click",
    event => {

        event.preventDefault();


        const orders =
            JSON.parse(
                localStorage.getItem(
                    STORAGE.orders
                ) || "[]"
            );


        if (!orders.length) {

            showToast(
                "You don't have any saved orders yet."
            );

            return;
        }


        showToast(
            `You have ${orders.length} saved order(s) on this device.`
        );

    }
);


/* =========================================================
   BOTTOM NAV
========================================================= */

$("bottomCart")?.addEventListener(
    "click",
    openCart
);


/* =========================================================
   CLOSE MODALS
========================================================= */

document.addEventListener(
    "click",
    event => {

        const closeButton =
            event.target.closest(
                "[data-close]"
            );


        if (!closeButton) return;


        const id =
            closeButton.dataset.close;


        if (id === "cartSidebar") {

            closeCart();

        } else {

            closeModal(id);

        }

    }
);


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") return;

        closeAllModals();

        closeCart();

        $("mobileMenu")
            ?.classList.remove("active");

    }
);


/* =========================================================
   BACK TO TOP
========================================================= */

function createBackToTop() {

    if ($(".back-to-top")) return;

    const button =
        document.createElement("button");

    button.className =
        "back-to-top";

    button.innerHTML =
        `<i class="fa-solid fa-arrow-up"></i>`;

    button.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    document.body.appendChild(button);


    window.addEventListener(
        "scroll",
        () => {

            button.classList.toggle(
                "show",
                window.scrollY > 500
            );

        }
    );

}


/* =========================================================
   ACTIVE MOBILE NAV
========================================================= */

function setupMobileActiveNav() {

    const links =
        document.querySelectorAll(
            ".mobile-bottom-nav a"
        );


    links.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                links.forEach(item =>
                    item.classList.remove("active")
                );

                link.classList.add("active");

            }
        );

    });

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderProducts();

        updateCartUI();

        updateWishlistCount();

        applyDarkMode();

        createBackToTop();

        setupMobileActiveNav();

    }
);


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.addToCart =
    addToCart;

window.openProduct =
    openProduct;

window.toggleWishlist =
    toggleWishlist;

window.openCart =
    openCart;

window.closeCart =
    closeCart;

window.openWishlist =
    openWishlist;

window.openCheckout =
    openCheckout;

window.openAccount =
    openAccount;

window.openModal =
    openModal;

window.closeModal =
    closeModal;
