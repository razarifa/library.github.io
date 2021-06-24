// FirebaseUI config.\
var uiConfig = {
 signInSuccessUrl: "https://razarifa.github.io/library.github.io/",
 signInOptions: [
  // Leave the lines as is for the providers you want to offer your users.
  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
 ],
 // tosUrl and privacyPolicyUrl accept either url string or a callback
 // function.
 // Terms of service url/callback.
};
let userVar = false;
// Initialize the FirebaseUI Widget using Firebase.
// The start method will wait until the DOM is loaded.
initApp = function () {
 firebase.auth().onAuthStateChanged(
  function (user) {
   if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var uid = user.uid;
    var phoneNumber = user.phoneNumber;
    var providerData = user.providerData;
    user.getIdToken().then(function (accessToken) {
     userVar = true;
     console.log(userVar);
     document.getElementById(
      "info"
     ).innerHTML = `<img width="35px" height="35px" style="border-radius: 50%" src="${photoURL}"/>     <span>${displayName}</span><div onclick="signOut()" class="signOutBtn">Sign out</div>`;
     document.getElementById("info").classList.add("info");
     // document.getElementById("account-details").innerHTML = JSON.stringify(
     //  {
     //   providerData: providerData,
     //  },
     //  null,
     //  "  "
     // );
    });
   } else {
    // User is signed out.
    document.getElementById("account-details").textContent = "";
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
    document.getElementById("info").classList.remove("info");
    document.getElementById("info").innerHTML = "";
    userVar = false;
   }
  },
  function (error) {
   console.log(error);
   userVar = false;
  }
 );
};

window.addEventListener("load", function () {
 initApp();
});
//sign out
function signOut() {
 firebase
  .auth()
  .signOut()
  .then(() => {
   console.log("signed out finally");
  })
  .catch((error) => {
   console.log("error");
  });
}
