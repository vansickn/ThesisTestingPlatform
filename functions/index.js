const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// firebase notes
// triggers = db events, auth event, storage events, analytics events
// http triggers = endpoint request, callable : call functions directly

// if the votes > sample size, deleted from Active Tests
// if not, ActiveTest included
exports.onTestWrite = functions.firestore
    .document("CreatedTests/{ID}")
    .onWrite((change, context) => {
      admin.firestore().collection("CreatedTests").doc(context.params.ID)
          .get().then((doc) => {
            const data = doc.data();
            if (data.totalVotes<data.sampleSize) {
              admin.firestore().collection("ActiveTests")
                  .doc(context.params.ID).set(data);
            } else {
              admin.firestore().collection("ActiveTests")
                  .doc(context.params.ID).delete();
            }
          });
      return "Success!";
    });

exports.onTestDelete = functions.firestore
    .document("CreatedTests/{ID}")
    .onDelete((snapshot, context) => {
      admin.firestore().collection("ActiveTests").doc(context.params.ID)
          .delete()
          .then(() => {
            console.log("Successfully Deleted Document in Active Tests");
          })
          .catch((err) => {
            console.log(err);
          });
      return "Test Delete Function has Completed";
    });
