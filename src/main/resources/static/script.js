//Naprawic buggy

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

let availableBooks = [];
let cart = [];
let currentUser = JSON.parse(localStorage.getItem('user')) || null;

// LOGIN - REGISTRATION
window.toggleAuthBoxes = function(showLogin) {
    $('#login-box').style.display = showLogin ? 'block' : 'none';
    $('#register-box').style.display = showLogin ? 'none' : 'block';
}

window.login = async function() {
    const email = $('#login-email').value;
    try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email })
        });
        if (!response.ok) throw new Error("Błędny email!");

        currentUser = await response.json();
        localStorage.setItem('user', JSON.stringify(currentUser));
        initApp();
    } catch (err) { alert(err.message); }
}

window.register = async function() {
    const firstName = $('#reg-name').value;
    const lastName = $('#reg-surname').value;
    const email = $('#reg-email').value;

    try {
        const response = await fetch("http://localhost:8080/api/auth/register", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ firstName, lastName, email })
        });
        if (!response.ok) throw new Error("Błąd rejestracji!");

        currentUser = await response.json();
        localStorage.setItem('user', JSON.stringify(currentUser));
        initApp();
    } catch (err) { alert(err.message); }
}

window.logout = function() {
    localStorage.removeItem('user');
    currentUser = null;
    location.reload();
}

// NAVIGATION AND INITIALIZATION
function setupNavigation() {
    $$('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.id === 'btn-logout') return;
            e.preventDefault();

            $$('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            $$('.page-section').forEach(s => s.classList.remove('active-section'));

            const target = link.getAttribute('data-target');
            $(`#${target}`).classList.add('active-section');
        });
    });
}

function initApp() {
    if (currentUser) {
        $('#page-auth').classList.remove('active-section');
        const navMenu = $('#nav-menu');
        if (navMenu) navMenu.style.display = 'flex';

        const userDisplay = $('#user-display');
        if (userDisplay) userDisplay.textContent = currentUser.firstName;

        $('#page-books').classList.add('active-section');

        getBooks();
        getFieldsAndRented();
    } else {
        $('#page-auth').classList.add('active-section');
        const navMenu = $('.nav-menu');
        if(navMenu) navMenu.style.display = 'none';

        // Ukrywamy pozostałe strony jeśli użytkownik nie jest zalogowany
        $('#page-books').classList.remove('active-section');
        $('#page-cart').classList.remove('active-section');
        $('#page-rented').classList.remove('active-section');
    }
}

// LOGIC
async function getBooks() {
    try {
        const response = await fetch("http://localhost:8080/api/books");
        availableBooks = await response.json();
        renderAvailableBooks();
    } catch (error) {
        console.error("Błąd pobierania książek:", error);
    }
}

function renderAvailableBooks() {
    const booksTable = $("#books-table-body");
    if (!booksTable) return;
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
    if(!cartList) return;

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

            $$('.nav-link').forEach(l => l.classList.remove('active'));
            $('[data-target="page-rented"]').classList.add('active');
            $$('.page-section').forEach(s => s.classList.remove('active-section'));
            $('#page-rented').classList.add('active-section');
        }
    } catch (error) { console.error(error); }
}

async function getFieldsAndRented() {
    const rentedTable = $("#rented-table-body");
    if(!rentedTable) return;
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

    const checkoutBtn = $("#checkout-btn");
    const btnLogout = $("#btn-logout");

    if(checkoutBtn) checkoutBtn.addEventListener('click', checkout);
    if(btnLogout) btnLogout.addEventListener('click', window.logout);
});