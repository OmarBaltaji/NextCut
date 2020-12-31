import React from 'react';
import firebaseConfig from './FirebaseConfig';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebaseui';
import api from '../api';

export default function LoginFirebase() {

    // const request = {
    //     "Firebasetoken": "your-firebase-auth-credential-token"
    // }


    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app(); // if already initialized
    }

    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    ui.start('#firebaseui-auth-container', {
        signInOptions: [
            {
                provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
            }
        ],
        // Other config options...
      });

    // Is there an email link sign-in?
    if (ui.isPendingRedirect()) {
        ui.start('#firebaseui-auth-container', uiConfig);
    }
    // This can also be done via:
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        ui.start('#firebaseui-auth-container', uiConfig);
    }

    firebase.auth().onAuthStateChanged(user => {

        user.getIdToken().then(function(accessToken) {
          // I personally store this token using Vuex
          // so i can watch it and detect its change to act accordingly.
        })

      });

    var uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            authResult.user.getIdToken().then(function(accessToken) {
                console.log(accessToken);
                api.firebaseLogin(accessToken)
                .then(response => {
                    console.log(response.data);
                })
            })

            return false;
            // return true;
          },
          uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
          }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: 'home',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        // Terms of service url.
        tosUrl: '<your-tos-url>',
        // Privacy policy url.
        privacyPolicyUrl: '<your-privacy-policy-url>'
      };

    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);

    return (
        <>
            <h1>Welcome to My Awesome App</h1>
            <div id="firebaseui-auth-container"></div>
            <div id="loader">Loading...</div>
        </>
    );
}
