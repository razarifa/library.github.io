const db = firebase.firestore();
db
 .collection("books")
 .get()
 .then((snapshot) => {
  snapshot.docs.forEach((doc) => {});
 });
