const functions = require("firebase-functions");
const {google} = require("googleapis");
const admin = require("firebase-admin");

let id = "887536811640-9n7276g4oafevop5adma6l7pqu2612c1";
id += ".apps.googleusercontent.com";

const oauth2Client = new google.auth.OAuth2(
    id,
    "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",
    "http://localhost:3000/account"
);
const scopes = [
  "https://www.googleapis.com/auth/yt-analytics.readonly",
];

exports.youtubeSignIn = functions.https.onCall((data, context) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: 'consent',
    });

    return url;
});

exports.saveTokens = functions.https.onCall(async (data, context) => {
    const code = data.code;
    const userID = data.userID.uid;
    console.log(code);
    console.log(userID);

    const { tokens } = await oauth2Client.getToken(code);
    const { refresh_token, access_token } = tokens;

    // oauth2Client.setCredentials(tokens); //Set this when calling function on the youtubeAPI

    // token is being set, but the title of the document is [object Object], probs need to convert to string or something, not really sure what the deal is since it's not printing out
    await admin.firestore().collection('tokens').doc(userID).set({ refresh_token });

    return "success";

});

exports.onYTAuth = functions.https.onRequest(async (request, response) => {

    const code = request.body.code;
    const userID = request.body.userID;
    console.log(code);
    console.log(userID);

    // let code = request.url.split("code=")[1];
    // code = code.toString().split("&")[0];
    // console.log(code);

    // const { tokens } = await oauth2Client.getToken(code);
    // const { refresh_token, access_token } = tokens;

    // oauth2Client.setCredentials(tokens);

    // Here I want to save the token to the correct place in the database, EG: firestore.doc('tokens/{someUserID}).set({refresh_token})
    // Need to send the accesscode back to the frontend 

    // oauth2Client.on('tokens', (tokens) => {
    //     if (tokens.refresh_token) {
    //         // store the refresh_token in my database!
    //         console.log(tokens.refresh_token);
    //     }
    //     console.log(tokens.access_token);
    // });

//   // error handling do here
//   console.log("YT AUTH FUNCTION");
//   response.redirect("http://localhost:3000/account");
});
