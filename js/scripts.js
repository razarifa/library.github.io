//variables
let myLibrary = [
 {
  status: "willRead",
  books: [
   {
    title: "Bulbulu Oldurmek",
    author: "Filankes",
    pages: 500,
    readStatus: "willRead",
   },
  ],
 },
 {
  status: "isReading",
  books: [
   {
    title: "Bulbulu Oldurmek",
    author: "Filankes",
    pages: 500,
    readStatus: "willRead",
   },
  ],
 },
 {
  status: "haveRead",
  books: [
   {
    title: "Bulbulu Oldurmek",
    author: "Filankes",
    pages: 500,
    readStatus: "willRead",
   },
  ],
 },
];
const add = document.querySelector("#add");

//constructors
function Book(title, author, pages, readStatus) {
 this.title = title;
 this.author = author;
 this.pages = pages;
 this.readStatus = readStatus;
 this.info = function () {
  return `${this.title} by ${this.author}, ${this.pages}, ${readStatus} `;
 };
}
//functions
function addBookToLibrary(book) {
 myLibrary.forEach((lib) => {
  if (lib.status === book.readStatus) {
   lib.books.push(book);
   localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
   location.reload();
  }
 });
}

add.addEventListener("click", () => {
 let formTitle = document.querySelector("#title").value;
 let formAuthor = document.querySelector("#author").value;
 let formPages = document.querySelector("#pages").value;
 let formReadStatus = document.querySelector("#readingStatus").value;
 addBookToLibrary(new Book(formTitle, formAuthor, formPages, formReadStatus));
});

if (localStorage.getItem("myLibrary") !== null) {
 myLibrary = JSON.parse(localStorage.getItem("myLibrary"));

 myLibrary.forEach((lib) => {
  if (
   lib.status === document.querySelector(`#${lib.status}`).getAttribute("id")
  ) {
   lib.books.forEach((book) => {
    let card = document.createElement("div");
    card.classList.add("card");
    document.querySelector(`#${lib.status}`).appendChild(card);
    card.innerHTML = `
     <p><b>Title:</b>${book.title}</p>
     <p><b>Author: </b>${book.author}</p>
     <p><b>Page Count:</b> ${book.pages}</p>
     <div class="button-container">
      <button class="delete">Delete</button>
     `;
   });
  }
 });
}
[...document.querySelectorAll(".delete")].forEach((del) => {
 del.addEventListener("click", () => {
  let attribute =
   del.parentElement.parentElement.parentElement.getAttribute("id");
  del.parentElement.parentElement.parentElement.removeChild(
   del.parentElement.parentElement
  );
  myLibrary.forEach((lib) => {
   if (lib.status === attribute) {
    lib.books.pop();
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
   }
  });
 });
});
