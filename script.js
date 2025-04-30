const headingTitle = document.querySelector('#heading-title');
headingTitle.addEventListener('click', () => sortTable(0));

const headingAuthor = document.querySelector('#heading-author');
headingAuthor.addEventListener('click', () => sortTable(1));

const headingPublished = document.querySelector('#heading-published');
headingPublished.addEventListener('click', () => sortTable(2));

const headingStartDate = document.querySelector('#heading-start-date');
headingStartDate.addEventListener('click', () => sortTable(3));

const headingEndDate = document.querySelector('#heading-end-date');
headingEndDate.addEventListener('click', () => sortTable(4));

const headingStatus = document.querySelector('#heading-status');
headingStatus.addEventListener('click', () => sortTable(5));

const buttonResetTable = document.querySelector('#button-reset-table');
buttonResetTable.addEventListener('click', () => resetTable());

const inputSearch = document.querySelector('#input-search');
inputSearch.addEventListener('keyup', (event) => handleInputSearch(event.target.value.toLowerCase()));

let initialTable = [];

window.onload = function() {
    loadBooks();
};

async function loadBooks() {
    try {
        const response = await fetch('./books.json');
        if (!response.ok) {
            throw new Error('Could not fetch data:' + response.statusText);
        }

        const books = await response.json();
        const tbody = document.querySelector('#table-book tbody');
        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.published}</td>
                <td>${book.start}</td>
                <td>${book.end}</td>
                <td>${book.status}</td>
            `;
            tbody.appendChild(row);
        });

        const rows = document.querySelectorAll('#table-book tbody tr');
        initialTable = Array.from(rows);

    } catch (error) {
        console.error("Error fetching data:", error);
    };
};

function sortTable(columnIndex) {
    const table = document.getElementById('table-book');
    const rows = Array.from(table.rows).slice(1); // skip the header row
    const isAscending = table.getAttribute('data-sort-order') === 'asc'; // returns true/false

    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].innerText;
        const cellB = b.cells[columnIndex].innerText;

        if (isNaN(cellA) || isNaN(cellB)) {
            return cellA.localeCompare(cellB); // for string comparison
        } else {
            return cellA - cellB; // for numeric comparison
        };
    });

    if (isAscending) {
        rows.reverse();
    };

    const tbody = table.tBodies[0]; // we're using tBodies in case I use more than one table body in the main table in the future
    rows.forEach(row => tbody.appendChild(row));
    table.setAttribute('data-sort-order', isAscending ? 'desc' : 'asc');
};

function resetTable() {
    const tbody = document.getElementById('table-book').tBodies[0];
    initialTable.forEach(row => tbody.appendChild(row));
    document.getElementById('table-book').removeAttribute('data-sort-order');
};

function handleInputSearch(input) {
    const table = document.querySelector('#table-book');
    const rows = Array.from(table.querySelectorAll('tr')).slice(1); // skip the header row
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let rowIsVisible = false;

        Array.from(cells).forEach(cell => {
            if (cell.innerText.toLowerCase().includes(input)) {
                rowIsVisible = true;
            }
        });

        row.style.display = rowIsVisible ? '' : 'none';
    });
};