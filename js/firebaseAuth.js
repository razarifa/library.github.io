// FirebaseUI config.\
var uiConfig = {
 signInSuccessUrl: "https://razarifa.github.io/library.github.io/",
 signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

initApp = function () {
 firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
   // User is signed in.
   var displayName = user.displayName;
   var photoURL = user.photoURL;
   user.getIdToken().then(function (accessToken) {
    document.getElementById(
     "info"
    ).innerHTML = `<img width="35px" height="35px" style="border-radius: 50%" src="${photoURL}"/>     <span>${displayName}</span><div onclick="signOut()" class="signOutBtn">Sign out</div>`;
    document.getElementById("info").classList.add("info");
   });
  } else {
   // User is signed out.
   var ui = new firebaseui.auth.AuthUI(firebase.auth());
   ui.start("#firebaseui-auth-container", uiConfig);
   document.getElementById("info").classList.remove("info");
   document.getElementById("info").innerHTML = "";
   location.reload();
  }
 });
};

window.addEventListener("load", function () {
 initApp();
});
//sign out
function signOut() {
 firebase
  .auth()
  .signOut()
  .then(() => {})
  .catch((error) => {
   console.log("error");
  });
}
