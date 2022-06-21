const STORAGE_KEY = 'BOOK_DATA';
const SAVED_EVENT = 'saved-book';

function storageExist() {
  if (typeof (Storage) === undefined) {
    alert('Local storage is not supported');
    return false;
  }
  return true;
}

function saveData() {
  if (storageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const submitBook = document.getElementById('inputBook');

  submitBook.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (storageExist()) {
    loadDataFromStorage();
  }
});

const books = [];
const RENDER_EVENT = 'render-book';

function BookIsCompleteCheck() {
  if (document.getElementById('isComplete').checked == true) {
    document.getElementById('bookSubmit').innerHTML = 'Masukkan Buku ke rak <span>Sudah selesai dibaca</span>';
  } else {
    document.getElementById('bookSubmit').innerHTML = 'Masukkan Buku ke rak <span>Belum selesai dibaca</span>';
  }
}

function addBook() {
  const bookTitle = document.getElementById('title').value;
  const bookType = document.getElementById('bookType').value;
  const bookAuthor = document.getElementById('author').value;
  const bookYear = document.getElementById('year').value;
  const isComplete = document.getElementById('isComplete').checked;

  const generateID = generateId();
  const bookObject = generateBookObject(generateID, bookTitle, bookType, bookAuthor, bookYear, isComplete)
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, bookType, author, year, isComplete) {
  return {
    id,
    title,
    bookType,
    author,
    year,
    isComplete
  }
}

function makeBooklist(bookObject) {
  const completeBtn = document.createElement('button');
  completeBtn.innerText = 'Sudah selesai dibaca';
  completeBtn.setAttribute('class', 'green');

  const incompleteBtn = document.createElement('button');
  incompleteBtn.innerText = 'Belum selesai dibaca';
  incompleteBtn.setAttribute('class', 'green');

  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'Hapus buku';
  deleteBtn.setAttribute('class', 'red');

  const btnList = document.createElement('div');
  if (bookObject.isComplete == true) {
    btnList.append(incompleteBtn, deleteBtn);
  } else {
    btnList.append(completeBtn, deleteBtn);
  }
  btnList.setAttribute('class', 'action');

  deleteBtn.addEventListener('click', function () {
    if (confirm('Yakin untuk menghapus buku?')) {
      deleteBook(bookObject.id);
    } else {
      return false;
    }
  })

  completeBtn.addEventListener('click', function () {
    isCompleted(bookObject.id);
  })

  incompleteBtn.addEventListener('click', function () {
    isNotCompleted(bookObject.id);
  })

  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;
  const textBookType = document.createElement('small');
  textBookType.innerText = bookObject.bookType;
  const textAuthor = document.createElement('p');
  textAuthor.innerText = bookObject.author;
  const textYear = document.createElement('p');
  textYear.innerText = bookObject.year;

  const content = document.createElement('article');
  content.append(textTitle, textBookType, textAuthor, textYear, btnList);
  content.setAttribute('id', 'book-$bookObject.id');
  content.setAttribute('class', 'book_item');

  return content;
}

function isCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function isNotCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId)

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function loadDataFromStorage() {
  const getData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(getData);

  if (data != null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

const searchBook = document.querySelector('#searchBookTitle');

searchBook.addEventListener('keyup', function (e) {
  const searchValue = e.target.value.toLowerCase();
  let bookList = document.querySelectorAll('.book_item');

  bookList.forEach((list) => {
    const value = list.firstChild.textContent.toLowerCase();

    if (value.indexOf(searchValue) != -1) {
      list.setAttribute('style', 'display: block');
    } else {
      list.setAttribute('style', 'display: none !important;');
    }
  })
})

document.addEventListener(RENDER_EVENT, function () {
  const incompletedBooks = document.getElementById('incompleteBookshelfList');
  incompletedBooks.innerHTML = '';
  const completedBooks = document.getElementById('completeBookshelfList');
  completedBooks.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBooklist(bookItem);

    if (!bookItem.isComplete) {
      incompletedBooks.append(bookElement);
    } else {
      completedBooks.append(bookElement);
    }
  }
});