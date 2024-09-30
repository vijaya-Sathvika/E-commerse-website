const productsContainer = document.getElementById('products');
const cartCount = document.getElementById('cart-count');
const cartLink = document.querySelector('#cart a');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

let cart = [];
let allProducts = [];
let likedProducts = new Set(); 
fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(products => {
        allProducts = products;
        displayProducts('all');
    })
    .catch(error => console.log('Error fetching products:', error));

    const sliderSection = document.getElementById('slider-section');
function showSlider() {
    sliderSection.style.display = 'block'; 
}
function hideSlider() {
    sliderSection.style.display = 'none';
}

function displayProducts(category) {
    productsContainer.innerHTML = '';

    const filteredProducts = category === 'all' 
        ? allProducts 
        : allProducts.filter(product => {
            if (category === 'men') return product.category === "men's clothing";
            if (category === 'women') return product.category === "women's clothing";
            if (category === 'accessories') return product.category === 'jewelery';
            if (category === 'electronics') return product.category === 'electronics';
            return false;
        });

    filteredProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const isLiked = likedProducts.has(product.id) ? 'liked' : '';

        productDiv.innerHTML = `
            <div class="product-header">
                <button class="like-button ${isLiked}" data-id="${product.id}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="share-button" data-id="${product.id}">
                    <i class="fas fa-share"></i>
                </button>
            </div>
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button class="add-to-cart">Add to Cart</button>
        `;
        const likeButton = productDiv.querySelector('.like-button');
        likeButton.addEventListener('click', () => {
            if (likedProducts.has(product.id)) {
                likedProducts.delete(product.id);
                likeButton.classList.remove('liked');
                alert(`You unliked ${product.title}`);
            } else {
                likedProducts.add(product.id);
                likeButton.classList.add('liked');
                alert(`You liked ${product.title}`);
            }
        });
        const shareButton = productDiv.querySelector('.share-button');
        shareButton.addEventListener('click', () => {
            alert(`You shared ${product.title}`);
        });

        const addToCartBtn = productDiv.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', () => {
            cart.push(product);
            cartCount.textContent = cart.length;
            alert(`${product.title} added to cart!`);
        });

        productsContainer.appendChild(productDiv);
    });
}
function showCart() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    let cartItems = "Items in your cart:\n";
    cart.forEach(`item => {
        cartItems += ${item.title} - $${item.price}\n;
    }`);
    alert(cartItems);
}
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const searchResults = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
    );

    productsContainer.innerHTML = '';

    searchResults.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button class="add-to-cart">Add to Cart</button>
        `;

        const addToCartBtn = productDiv.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', () => {
            cart.push(product);
            cartCount.textContent = cart.length;
            alert(`${product.title} added to cart!`);
        });

        productsContainer.appendChild(productDiv);
    });
});
const categoryFilters = document.querySelectorAll('.filter');
categoryFilters.forEach(filter => {
    filter.addEventListener('click', (e) => {
        const category = e.target.getAttribute('data-category');
        displayProducts(category);
    });
});
cartLink.addEventListener('click', (e) => {
    e.preventDefault(); 
    showCart(); 
});
