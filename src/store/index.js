import firebase from 'firebase'
import { isReactive } from 'vue';
import { createStore } from 'vuex';







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
    userData(state) {
      return state.user.data
    },
    numCoins(state) {
      return state.user.coins
    }
  },
  mutations: {
    async SET_LOGGED_IN(state, value) {
      state.user.loggedIn = await value;
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
          photo: user.providerData[0].photoURL
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

