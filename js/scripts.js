//variables
let books = [];
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
//events
document.querySelector("form").addEventListener("submit", addBookToLibrary);

//functions
function addBookToLibrary(e) {
 e.preventDefault();
 let formTitle = document.querySelector("#title").value;
 let formAuthor = document.querySelector("#author").value;
 let formPages = document.querySelector("#pages").value;
 let formReadStatus = document.querySelector("#readingStatus").value;
 const book = new Book(formTitle, formAuthor, formPages, formReadStatus);
 books.push(book);
 localStorage.setItem("books", JSON.stringify(books));
 render();
 this.reset();
}

function render() {
 if (localStorage.getItem("books") !== null) {
  books = JSON.parse(localStorage.getItem("books"));
 }
 document.querySelector(`#willRead`).innerHTML = "";
 document.querySelector(`#isReading`).innerHTML = "";
 document.querySelector(`#haveRead`).innerHTML = "";
 books.forEach((book, index) => {
  if (
   book.readStatus ===
   document.querySelector(`#${book.readStatus}`).getAttribute("id")
  ) {
   let card = document.createElement("div");
   card.classList.add("card");
   document.querySelector(`#${book.readStatus}`).appendChild(card);
   card.innerHTML = `
        <p><b>Title:</b>${book.title}</p>
        <p><b>Author: </b>${book.author}</p>
        <p><b>Page Count:</b> ${book.pages}</p>
        <div class="button-container">
         <button class="delete">Delete</button>
         </div>
         <select name="readingStatus" class="statusSelect" >
         <option value="willRead" class="choice">Want to read</option>
         <option value="isReading" class="choice">Reading</option>
         <option value="haveRead" class="choice">Have read</option>
        </select>
        `;
   [...card.querySelector(".statusSelect")].forEach((s) => {
    if (s.value === book.readStatus) {
     s.setAttribute("selected", "selected");
    }
   });
  }
 });
}

function removeCard(e) {
 //delete from array
 books.map((book) => {
  if (
   e.parentElement.parentElement.children[0].innerText.substr(6).toString() ===
   book.title
  ) {
   books.splice(books.indexOf(book), 1);
  }
 });
 //delete from dom
 e.parentElement.parentElement.parentElement.removeChild(
  e.parentElement.parentElement
 );

 localStorage.setItem("books", JSON.stringify(books));
}
function changeStatus(e) {
 books.map((book) => {
  if (
   e.parentElement.children[0].innerText.substr(6).toString() === book.title
  ) {
   book.readStatus = e.options[e.options.selectedIndex].value;
   localStorage.setItem("books", JSON.stringify(books));
   render();
  }
 });
}
[...document.querySelectorAll(".list")].forEach((list) => {
 list.addEventListener("click", (e) => {
  if (e.target.matches(".delete")) {
   removeCard(e.target);
  }
 });
});
[...document.querySelectorAll(".list")].forEach((list) => {
 list.addEventListener("change", (e) => {
  if (e.target.matches(".statusSelect")) {
   changeStatus(e.target);
  }
 });
});
render();
