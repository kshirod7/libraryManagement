

let searchInputEl = document.getElementById('searchInput');
let bookContainerEl = document.getElementById('searchResults');
let spinnerEl = document.getElementById('spinner');
let bookHeadingEl = document.getElementById('bookHeading');
let NotFoundEl = document.getElementById('NotFound');

// Container for book cards
let cardsContainer = document.getElementById('cardsContainer');

function clearBookCards() {
    cardsContainer.innerHTML = ''; // remove previous book cards
}

function createAndAppendSearchResult(result) {
    let { author, imageLink, title } = result;

    // Responsive columns: 1 card mobile, 2 medium, 4 large
    let colDiv = document.createElement('div');
    colDiv.classList.add('col-12', 'col-md-6', 'col-lg-3', 'mb-3');

    let bookContainerCard = document.createElement('div');
    bookContainerCard.classList.add('card', 'p-2', 'text-center', 'h-100', 'book-card');

    let image = document.createElement('img');
    image.src = imageLink || 'https://via.placeholder.com/150x220?text=No+Image';
    image.classList.add("cardImage", "img-fluid", "mb-2");
    bookContainerCard.appendChild(image);

    let titleEl = document.createElement('h6');
    titleEl.textContent = title || 'Untitled';
    titleEl.classList.add('font-weight-bold', 'mb-1');
    bookContainerCard.appendChild(titleEl);

    let authorSection = document.createElement('p');
    authorSection.textContent = author || 'Unknown';
    authorSection.classList.add('bookAuthor', 'text-muted');
    bookContainerCard.appendChild(authorSection);

    colDiv.appendChild(bookContainerCard);
    cardsContainer.appendChild(colDiv);
}

function displayBook(results) {
    spinnerEl.classList.add("d-none");
    clearBookCards();

    if (!results || results.length === 0) {
        bookHeadingEl.classList.add('d-none');
        NotFoundEl.classList.remove('d-none');
    } else {
        NotFoundEl.classList.add('d-none');
        bookHeadingEl.classList.remove('d-none');

        for (let result of results) {
            createAndAppendSearchResult(result);
        }
    }
}

function apiCall(url) {
    spinnerEl.classList.remove("d-none");
    clearBookCards(); // remove old results immediately

    fetch(url)
        .then(response => response.json())
        .then(jsonData => {
            let results = jsonData.search_results || [];
            displayBook(results);
        })
        .catch(err => {
            console.error(err);
            spinnerEl.classList.add("d-none");
            bookHeadingEl.classList.add('d-none');
            NotFoundEl.textContent = 'Something went wrong!';
            NotFoundEl.classList.remove('d-none');
        });
}

function inputValue(event) {
    if (event.key === "Enter") {
        bookHeadingEl.classList.add('d-none');
        NotFoundEl.classList.add('d-none');
        spinnerEl.classList.remove("d-none");

        let query = searchInputEl.value.trim();
        if (query === '') {
            spinnerEl.classList.add("d-none");
            NotFoundEl.textContent = 'Please enter a search term.';
            NotFoundEl.classList.remove('d-none');
            return;
        }

        let url = "https://apis.ccbp.in/book-store?title=" + encodeURIComponent(query);
        apiCall(url);
    }
}

searchInputEl.addEventListener('keydown', inputValue);

