const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

let availableBooks = [];
let cart = [];
let rentedBooks = [];

function setupNavigation() {
    $$('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Usuń klasę 'active' ze wszystkich linków i dodaj do klikniętego
            $$('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Ukryj wszystkie sekcje stron
            $$('.page-section').forEach(section => section.classList.remove('active-section'));

            // Pokaż sekcję docelową pobraną z atrybutu 'data-target'
            const targetId = link.getAttribute('data-target');
            $(`#${targetId}`).classList.add('active-section');
        });
    });
}

async function getBooks() {
    const booksTable = $("#books-table-body");
    try {
        const response = await fetch("http://localhost:8080/api/books");
        availableBooks = await response.json();
        renderAvailableBooks();
    } catch (error) {
        console.error("Problem ze Springiem, ładuję dane demonstracyjne:", error);
        availableBooks = [
            {id: 1, title: "Wiedźmin: Ostatnie życzenie", author: "Andrzej Sapkowski"},
            {id: 2, title: "Clean Code", author: "Robert C. Martin"},
            {id: 3, title: "Hobbit", author: "J.R.R. Tolkien"}
        ];
        renderAvailableBooks();
    }
}

function renderAvailableBooks() {
    const booksTable = $("#books-table-body");
    booksTable.innerHTML = '';

    availableBooks.forEach(book => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td><button class="btn-add" onclick="addToCart(${book.id})">+</button></td>
        `;
        booksTable.appendChild(row);
    });
}


window.addToCart = function(id) {
    const book = availableBooks.find(b => b.id === id);
    if (book && !cart.some(item => item.id === id)) {
        cart.push(book);
        updateCart();
    }
}

window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCart() {
    const cartList = $("#cart-list");
    const checkoutBtn = $("#checkout-btn");
    const cartCount = $("#cart-count");

    cartList.innerHTML = '';
    cartCount.textContent = `(${cart.length})`;

    if (cart.length === 0) {
        cartList.innerHTML = '<li class="empty-cart">Koszyk jest pusty</li>';
        checkoutBtn.disabled = true;
        return;
    }

    cart.forEach(book => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${book.title} - <em>${book.author}</em></span>
            <button class="btn-remove" onclick="removeFromCart(${book.id})">&times;</button>
        `;
        cartList.appendChild(li);
    });

    checkoutBtn.disabled = false;
}

function checkout() {
    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 14);

    const formattedToday = today.toLocaleDateString('pl-PL');
    const formattedReturn = returnDate.toLocaleDateString('pl-PL');

    cart.forEach(book => {
        rentedBooks.push({
            title: book.title,
            author: book.author,
            rentDate: formattedToday,
            dueDate: formattedReturn
        });
    });

    cart = [];
    updateCart();
    renderRentedBooks();


    $('[data-target="page-rented"]').click();
}

function renderRentedBooks() {
    const rentedTable = $("#rented-table-body");
    rentedTable.innerHTML = '';

    if (rentedBooks.length === 0) {
        rentedTable.innerHTML = `<tr><td colspan="4" class="text-center">Brak wypożyczonych książek</td></tr>`;
        return;
    }

    rentedBooks.forEach(book => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td><span class="badge badge-info">${book.rentDate}</span></td>
            <td><span class="badge badge-warning">${book.dueDate}</span></td>
        `;
        rentedTable.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    getBooks();
    $("#checkout-btn").addEventListener('click', checkout);
});