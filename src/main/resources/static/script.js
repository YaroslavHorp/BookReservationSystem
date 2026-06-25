const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

let availableBooks = [];
let cart = [];
let rentedBooks = [];


// NAVIGATION AND INITIALIZATION
function setupNavigation() {
    $$('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.id === 'btn-logout') return;
                e.preventDefault();

            $$('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            $$('.page-section').forEach(s => s.classList.remove('active-section'));
            $(`#${link.getAttribute('data-target')}`).classList.add('active-section');
        });
    });
}

function initApp() {
    if (currentUser) {
        $('#page-auth').classList.remove('active-section');
        $('#nav-menu').style.display = 'flex';
        $('#user-display').textContent = currentUser.firstName;
        $('#page-books').classList.add('active-section');
        $('[data-target="page-books"]').classList.add('active');

        getBooks();
        getFieldsAndRented();
    } else {
        $('#page-auth').classList.add('active-section');
        $('#nav-menu').style.display = 'none';
    }
}

// LOGIC
async function getBooks() {
    try {
        const response = await fetch("http://localhost:8080/api/books");
        availableBooks = await response.json();
        renderAvailableBooks();
    } catch (error) { console.error(error); }
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
    cartList.innerHTML = '';
    $("#cart-count").textContent = `(${cart.length})`;

    if (cart.length === 0) {
        cartList.innerHTML = '<li class="empty-cart">Koszyk jest pusty</li>';
        $("#checkout-btn").disabled = true;
        return;
    }

    cart.forEach(book => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${book.title}</span>
            <button class="btn-remove" onclick="removeFromCart(${book.id})">&times;</button>
        `;
        cartList.appendChild(li);
    });
    $("#checkout-btn").disabled = false;
}

async function checkout() {
    try {
        const response = await fetch("http://localhost:8080/api/rentals/borrow", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userId: currentUser.id,
                bookIds: cart.map(b => b.id)
            })
        });
        if(response.ok) {
            cart = [];
            updateCart();
            getFieldsAndRented();
            $('[data-target="page-rented"]').click();
        }
    } catch (error) { console.error(error); }
}

async function getFieldsAndRented() {
    const rentedTable = $("#rented-table-body");
    rentedTable.innerHTML = '';
    try {
        const response = await fetch(`http://localhost:8080/api/rentals/user/${currentUser.id}`);
        const rentals = await response.json();

        if(rentals.length === 0) {
            rentedTable.innerHTML = `<tr><td colspan="4" class="text-center">Brak wypożyczeń</td></tr>`;
            return;
        }

        rentals.forEach(r => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><strong>${r.book.title}</strong></td>
                <td>${r.book.author}</td>
                <td><span class="badge badge-info">${r.rentDate}</span></td>
                <td><span class="badge badge-warning">${r.dueDate}</span></td>
            `;
            rentedTable.appendChild(row);
        });
    } catch (err) { console.error(err); }
}

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    initApp();
    $("#checkout-btn").addEventListener('click', checkout);
    $("#btn-logout").addEventListener('click', logout);
});