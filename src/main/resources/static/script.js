const $ = (elem) => document.getElementById(elem);

async function getBooks() {
    const booksTable = $("books-table-body");
    try {
        const response = await fetch("http://localhost:8080/api/books");
        const books = await response.json();

        booksTable.innerHTML = '';

        books.forEach(book => {
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>`;

            booksTable.appendChild(row);
        });

    } catch (error) {
        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded', getBooks);