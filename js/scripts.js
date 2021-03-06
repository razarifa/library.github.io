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
 books.push({
  title: formTitle,
  author: formAuthor,
  pages: formPages,
  readStatus: formReadStatus,
 });

 firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
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
     return data;
    })
    .catch((error) => {
     console.log("Storing Error", error);
    });
  } else {
   localStorage.setItem("books", JSON.stringify(books));
  }
 });
 render();
 this.reset();
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
     return fetchedData;
    })
    .catch((error) => {
     console.log("Fetching Error", error);
    });
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
 //delete from localstorage
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

 //delete from firebase
 firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
   let response = await firebase
    .database()
    .ref("users")
    .child(user.uid)
    .once("value")
    .then((data) => {
     let fetchedData = data.val();
     return fetchedData;
    })
    .catch((error) => {
     console.log("Fetching Error", error);
    });
   if (response != null) {
    for (res in response) {
     if (
      res ===
      e.parentElement.parentElement.parentElement.getAttribute("data-index")
     ) {
      await firebase
       .database()
       .ref(`users/${user.uid}/${res}`)
       .remove()
       .then(() => {});
     }
    }
   }
  } else {
   localStorage.setItem("books", JSON.stringify(books));
  }
 });
}
function changeStatus(e) {
 firebase.auth().onAuthStateChanged(async function (user) {
  if (user) {
   let response = await firebase
    .database()
    .ref("users")
    .child(user.uid)
    .once("value")
    .then((data) => {
     let fetchedData = data.val();
     return fetchedData;
    })
    .catch((error) => {
     console.log("Fetching Error", error);
    });
   if (response != null) {
    for (res in response) {
     if (res === e.parentElement.getAttribute("data-index")) {
      let updates = {};
      updates[`/users/${user.uid}/${res}`] = {
       title: response[res].title,
       author: response[res].author,
       pages: response[res].pages,
       readStatus: e.options[e.options.selectedIndex].value,
      };
      await firebase.database().ref().update(updates);
      render();
     }
    }
   }
  } else {
   books.map((book) => {
    if (
     e.parentElement.children[1].innerText.substr(6).toString() === book.title
    ) {
     book.readStatus = e.options[e.options.selectedIndex].value;
     localStorage.setItem("books", JSON.stringify(books));
     render();
    }
   });
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
