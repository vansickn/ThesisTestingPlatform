import { createStore } from 'vuex';

import firebase from 'firebase'





export default createStore({
  state: {
    user: {
      loggedIn: false,
      data: null
    }
  },
  getters: {
    user(state){
      return state.user
    },
    numCoins(state) {
      return state.user.coins
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    // Need to await the data here because the data is returning a promise from the getCoins function, which is an asynchronous function
    async SET_USER(state, data) {
      state.user.data = await data;
    }
  },
  actions: {
    async fetchUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
          coins: await getCoins(user.uid)
        });
      } else {
        commit("SET_USER", null);
      }
    },
  }
})

async function getCoins(uid) {
    return await firebase.firestore().collection("users").doc(uid).get().then((doc) => {
            if (doc.exists) {
                console.log("Coins:", doc.data().coins);
                return doc.data().coins
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
    })
}

