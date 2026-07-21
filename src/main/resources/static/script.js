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

            $$('.page-section').forEach(s => {
                s.classList.remove('active-section');
                s.style.display = 'none';
            });

            const target = link.getAttribute('data-target');
            const targetSection = $(`#${target}`);
            if (targetSection) {
                targetSection.classList.add('active-section');
                targetSection.style.display = 'block';
            }
        });
    });
}

function initApp() {
    if (currentUser) {
        const authPage = $('#page-auth');
        if (authPage) {
            authPage.style.display = 'none';
            authPage.classList.remove('active-section');
        }

        const navMenu = $('#nav-menu') || $('.nav-menu');
        if (navMenu) navMenu.style.display = 'flex';

        const userDisplay = $('#user-display');
        if (userDisplay) userDisplay.textContent = currentUser.firstName;

        const userBalance = $('#user-balance');
        if (userBalance) {
            const balanceVal = currentUser.accountBalance ?? currentUser.balance ?? 0;
            userBalance.textContent = Number(balanceVal).toFixed(2);
        }

        const booksPage = $('#page-books');
        if (booksPage) {
            booksPage.style.display = 'block';
            booksPage.classList.add('active-section');
        }

        if ($('#page-cart')) $('#page-cart').style.display = 'none';
        if ($('#page-rented')) $('#page-rented').style.display = 'none';

        getBooks();
        getFieldsAndRented();
    } else {
        const authPage = $('#page-auth');
        if (authPage) {
            authPage.style.display = 'flex';
            authPage.classList.add('active-section');
        }

        const navMenu = $('#nav-menu') || $('.nav-menu');
        if (navMenu) navMenu.style.display = 'none';

        if ($('#page-books')) $('#page-books').style.display = 'none';
        if ($('#page-cart')) $('#page-cart').style.display = 'none';
        if ($('#page-rented')) $('#page-rented').style.display = 'none';
    }
}

//DEPOSIT
function toggleDepositForm(forceState = null) {
    const popover = $('#deposit-popover');
    if (!popover) return;

    if (forceState !== null) {
        popover.style.display = forceState ? 'block' : 'none';
    } else {
        popover.style.display = (popover.style.display === 'none' || !popover.style.display) ? 'block' : 'none';
    }
}

async function submitDeposit(event) {
    if (event) event.preventDefault();

    const amountInput = $('#deposit-amount');
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Wprowadź poprawną kwotę większą od 0 PLN.");
        return;
    }

    if (!currentUser || !currentUser.id) {
        alert("Musisz być zalogowany, aby doładować konto!");
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/rentals/deposit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: currentUser.id,
                amount: amount
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || "Konto zostało pomyślnie doładowane!");

            currentUser.accountBalance = data.newBalance;
            localStorage.setItem('user', JSON.stringify(currentUser));

            const userBalance = $('#user-balance');
            if (userBalance) {
                userBalance.textContent = Number(data.newBalance).toFixed(2);
            }

            amountInput.value = '';
            toggleDepositForm(false);
        } else {
            alert(data.message || "Błąd podczas doładowywania konta.");
        }
    } catch (error) {
        console.error("Błąd połączenia:", error);
        alert("Wystąpił błąd podczas połączenia z serwerem.");
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
            <td><span class="badge badge-info">${book.price ? book.price.toFixed(2) : '5.00'} PLN</span></td>
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
    if (!cart || cart.length === 0) {
        alert("Twój koszyk jest pusty!");
        return;
    }

    if (!currentUser || !currentUser.id) {
        alert("Musisz się zalogować, aby wypożyczyć książki!");
        return;
    }

    const payload = {
        userId: currentUser.id,
        bookIds: cart.map(book => book.id)
    };

    try {
        const response = await fetch('http://localhost:8080/api/rentals/borrow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || "Pomyślnie wypożyczono książki!");

            if (data.newBalance !== undefined) {
                currentUser.accountBalance = data.newBalance;
                localStorage.setItem('user', JSON.stringify(currentUser));

                const userBalanceSpan = $('#user-balance');
                if (userBalanceSpan) {
                    userBalanceSpan.textContent = Number(data.newBalance).toFixed(2);
                }
            }

            cart = [];
            if (typeof updateCartUI === 'function') updateCartUI();

            if (typeof getFieldsAndRented === 'function') getFieldsAndRented();

            const rentedTab = document.querySelector('[data-target="page-rented"]');
            if (rentedTab) rentedTab.click();

        } else {
            alert("⚠️ " + (data.message || "Błąd podczas wypożyczania."));
        }

    } catch (error) {
        console.error("Błąd połączenia z serwerem:", error);
        alert("Błąd połączenia z serwerem.");
    }
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