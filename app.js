const labels = document.querySelectorAll('.form-control label');

let books = [];

const bookForms = document.getElementById('bookForm');
const completedBooks = document.getElementById('completedBooks');
const uncompletedBooks = document.getElementById('uncompletedBooks');

if (localStorage.getItem('books')) {
  books = JSON.parse(localStorage.getItem('books'));
  renderBooksList();
}

function saveDataToLocalStorage() {
  localStorage.setItem('books', JSON.stringify(books));
}

bookForms.addEventListener('submit', function (event) {
  event.preventDefault();

  const id = +new Date();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const year = parseInt(document.getElementById('year').value);
  const isComplete = document.getElementById('isComplete').checked;

  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  books.push(newBook);
  saveDataToLocalStorage();
  renderBooksList();
  clearInputField();
});

function createListBook(books) {
  const listItem = document.createElement('li');
  listItem.classList.add('book-item');
  listItem.innerHTML = `
      <h3>${books.title}</h3>
      <p>${books.author}</p>
      <p>${books.year}</p>
      <button class="moveButton" onclick="moveBook(${books.id})">Pindah</buttton>
      <button class="editButton" onclick="editBook(${books.id})">Ubah</buttton>
      <button class="deleteButton" onclick="showDeleteModal(${books.id})">Hapus</buttton>
    `;

  if (books.isComplete) {
    completedBooks.appendChild(listItem);
  } else {
    uncompletedBooks.appendChild(listItem);
  }
}

function renderBooksList() {
  uncompletedBooks.innerHTML = '';
  completedBooks.innerHTML = '';

  const searchBar = document
    .getElementById('searchInput')
    .value.trim()
    .toLowerCase();

  books.forEach((book) => {
    if (
      book.title.toLowerCase().includes(searchBar) ||
      book.author.toLowerCase().includes(searchBar)
    ) {
      createListBook(book);
    }
  });

  if (uncompletedBooks.innerHTML === '' && completedBooks.innerHTML === '') {
    uncompletedBooks.innerHTML = '<li>Buku tidak ditemukan</li>';
    completedBooks.innerHTML = '<li>Buku tidak ditemukan</li>';
  }
}

function clearInputField() {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('year').value = '';
  document.getElementById('isComplete').checked = false;
}

function moveBook(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  const book = books[bookIndex];
  book.isComplete = !book.isComplete;
  saveDataToLocalStorage();
  renderBooksList();
}

function editBook(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  const book = books[bookIndex];

  const editTitle = document.getElementById('editTitle');
  const editAuthor = document.getElementById('editAuthor');
  const editYear = document.getElementById('editYear');

  editTitle.value = book.title;
  editAuthor.value = book.author;
  editYear.value = book.year;

  const overlayBg = document.getElementById('editOverlay');
  overlayBg.style.display = 'flex';

  const editBtn = document.getElementById('editBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  cancelBtn.addEventListener('click', function () {
    overlayBg.style.display = 'none';
  });

  editBtn.addEventListener('click', function () {
    book.title = editTitle.value;
    book.author = editAuthor.value;
    book.year = parseInt(editYear.value);
    saveDataToLocalStorage();
    renderBooksList();
    overlayBg.style.display = 'none';
  });
}

function showDeleteModal(bookId) {
  const deleteOverlay = document.getElementById('deleteOverlay');
  deleteOverlay.style.display = 'flex';

  const cancelDelBtn = document.getElementById('cancelDeleteButton');
  const confirmDelBtn = document.getElementById('confirmDeleteButton');

  cancelDelBtn.addEventListener('click', function () {
    deleteOverlay.style.display = 'none';
  });
  confirmDelBtn.addEventListener('click', function () {
    deleteBook(bookId);
    deleteOverlay.style.display = 'none';
  });
}

function deleteBook(bookId) {
  books = books.filter((book) => book.id !== bookId);
  saveDataToLocalStorage();
  renderBooksList();
}

document.getElementById('searchInput').addEventListener('input', function () {
  renderBooksList();
});
document.getElementById('searchBtn').addEventListener('click', function () {
  renderBooksList();
});

labels.forEach((label) => {
  label.innerHTML = label.innerText
    .split('')
    .map(
      (letter, index) =>
        `<span style="transition-delay:${index * 50}ms">${letter}</span>`
    )
    .join('');
});
