const functions = require("firebase-functions");
const admin = require("firebase-admin");
const ytauth = require("./ytAuth");
admin.initializeApp();

exports.youtubeSignIn = ytauth.youtubeSignIn;
exports.onYTAuth = ytauth.onYTAuth;
exports.saveTokens = ytauth.saveTokens;

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

exports.onTestActivation = functions
    .runWith({
      minInstances: 1,
    })
    .https.onCall((data, context) => {
      const testid = data.testid;
      const sampletype = data.sampletype;
      if (sampletype == "Fans") {
        admin.firestore().collection("CreatedTests").doc(testid)
            .get().then((doc) => {
              const docdata = doc.data();
              admin.firestore().collection("fanSampleTests").doc(testid)
                  .set(docdata);
              return "Success";
            }).catch((err) => {
              console.log(err);
              return err;
            });
      }
      if (sampletype == "Random") {
        admin.firestore().collection("CreatedTests").doc(testid)
            .get().then((doc) => {
              const docdata = doc.data();
              admin.firestore().collection("randomSampleTests").doc(testid)
                  .set(docdata);
              return "Success";
            }).catch((err) => {
              console.log(err);
              return err;
            });
      }
    });

exports.onTestDeActivation = functions
    .runWith({
      minInstances: 1,
    })
    .https.onCall((data, context) => {
      const testid = data.testid;
      const sampletype = data.sampletype;
      if (sampletype == "Fans") {
        admin.firestore().collection("fanSampleTests").doc(testid)
            .get().then((doc) => {
              const docdata = doc.data();
              admin.firestore().collection("CreatedTests").doc(testid)
                  .set(docdata);
              admin.firestore().collection("fanSampleTests").doc(testid)
                  .delete()
                  .then(() => {
                    console.log("successfully deactivated Fan Sample Test");
                  });
              return "Success";
            }).catch((err) => {
              console.log(err);
              return err;
            });
      }
      if (sampletype == "Random") {
        admin.firestore().collection("randomSampleTests").doc(testid)
            .get().then((doc) => {
              const docdata = doc.data();
              admin.firestore().collection("CreatedTests").doc(testid)
                  .set(docdata);
              admin.firestore().collection("randomSampleTests").doc(testid)
                  .delete()
                  .then(() => {
                    console.log("successfully deactivated Random Sample Test");
                  });
              return "Success";
            }).catch((err) => {
              console.log(err);
              return err;
            });
      }
    });
