
export default firebase.auth().onAuthStateChanged(user => {

    user.getIdToken().then(function(accessToken) {
      // I personally store this token using Vuex
      // so i can watch it and detect its change to act accordingly.
    })

  });
