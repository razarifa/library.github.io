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

async function addBookToLibrary(e) {
 e.preventDefault();
 let formTitle = document.querySelector("#title").value;
 let formAuthor = document.querySelector("#author").value;
 let formPages = document.querySelector("#pages").value;
 let formReadStatus = document.querySelector("#readingStatus").value;
 console.log(books);
 books.push({
  title: formTitle,
  author: formAuthor,
  pages: formPages,
  readStatus: formReadStatus,
 });
 console.log(books);

 firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
   console.log(m);
   await firebase
    .database()
    .ref("users")
    .child(user.uid)
    .push({
     title: formTitle,
     author: formAuthor,
     pages: formPages,
     readStatus: formReadStatus,
    })
    .then((data) => {
     console.log("Saved Data", data);
    })
    .catch((error) => {
     console.log("Storing Error", error);
    });
  } else {
   localStorage.setItem("books", JSON.stringify(books));
   console.log("stored to localstorage");
  }
 });
 render();
 this.reset();
}

function setBook(data) {
 books = data;
}
async function render() {
 document.querySelector(`#willRead`).innerHTML = "";
 document.querySelector(`#isReading`).innerHTML = "";
 document.querySelector(`#haveRead`).innerHTML = "";
 firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
   let response = await firebase
    .database()
    .ref("users")
    .child(user.uid)
    .once("value")
    .then((data) => {
     let fetchedData = data.val();
     console.log("Fetched Data", fetchedData);
     return fetchedData;
    })
    .catch((error) => {
     console.log("Fetching Error", error);
    });
   console.log(response);
   console.table(response);

   if (response != null) {
    for (res in response) {
     let book = response[res];
     if (
      book.readStatus ===
      document.querySelector(`#${book.readStatus}`).getAttribute("id")
     ) {
      let card = document.createElement("div");
      card.classList.add("card");
      card.setAttribute("data-index", res);
      document.querySelector(`#${book.readStatus}`).appendChild(card);
      card.innerHTML = `
      <div class="button-container">
       <button><i class="fa fa-trash delete"></i> </button>
      </div>
      <p><b>Title:</b>${book.title}</p>
      <p><b>Author: </b>${book.author}</p>
      <select name="readingStatus" class="statusSelect" >
      <option value="willRead" class="choice">Want to read</option>
      <option value="isReading" class="choice">In Progress</option>
      <option value="haveRead" class="choice">I have already read</option>
      </select>
      `;
      [...card.querySelector(".statusSelect")].forEach((s) => {
       if (s.value === book.readStatus) {
        s.setAttribute("selected", "selected");
       }
      });
     }
    }
   }
  } else {
   if (localStorage.getItem("books") !== null) {
    books = JSON.parse(localStorage.getItem("books"));
   }
   books.forEach((book, index) => {
    if (
     book.readStatus ===
     document.querySelector(`#${book.readStatus}`).getAttribute("id")
    ) {
     let card = document.createElement("div");
     card.classList.add("card");
     document.querySelector(`#${book.readStatus}`).appendChild(card);
     card.innerHTML = `
     <div class="button-container">
           <button><i class="fa fa-trash delete"></i> </button>
           </div>
          <p><b>Title:</b>${book.title}</p>
          <p><b>Author: </b>${book.author}</p>
           <select name="readingStatus" class="statusSelect" >
           <option value="willRead" class="choice">Want to read</option>
           <option value="isReading" class="choice">In Progress</option>
           <option value="haveRead" class="choice">I have already read</option>
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
 });
}

function removeCard(e) {
 //delete from array
 books.map((book) => {
  if (
   e.parentElement.parentElement.parentElement.children[1].innerText
    .substr(6)
    .toString() === book.title
  ) {
   books.splice(books.indexOf(book), 1);
  }
 });
 //delete from dom
 e.parentElement.parentElement.parentElement.parentElement.removeChild(
  e.parentElement.parentElement.parentElement
 );
 firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
   console.log("delete data");
  } else {
   localStorage.setItem("books", JSON.stringify(books));
  }
 });
 //delete from firebase
}
function changeStatus(e) {
 books.map((book) => {
  if (
   e.parentElement.children[1].innerText.substr(6).toString() === book.title
  ) {
   book.readStatus = e.options[e.options.selectedIndex].value;

   firebase.auth().onAuthStateChanged(async function (user) {
    if (user) {
     console.log("update write");
    } else {
     localStorage.setItem("books", JSON.stringify(books));
    }
   });
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
