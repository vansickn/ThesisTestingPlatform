const functions = require("firebase-functions");

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// firebase notes
// triggers = db events, auth event, storage events, analytics events
// http triggers = endpoint request, callable : call functions directly

// http callable function - in order to send response do return
exports.sayHello = functions.https.onCall((data, context) => {
  return "hello";
});
