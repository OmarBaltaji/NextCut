importScripts('https://www.gstatic.com/firebasejs/6.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.6.2/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyClC2KR_u0spVxP3o5GYmWx4KaPozTu0ew",
    authDomain: "nextcut-636e9.firebaseapp.com",
    databaseURL: "https://nextcut-636e9-default-rtdb.firebaseio.com",
    projectId: "nextcut-636e9",
    storageBucket: "nextcut-636e9.appspot.com",
    messagingSenderId: "306622715186",
    appId: "1:306622715186:web:9ca034409897fdeae8f32b",
    measurementId: "G-0FHXHRF2NV"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    const promiseChain = clients
         .matchAll({
              type: "window",
              includeUncontrolled: true,
         })
         .then((windowClients) => {
              for (let i = 0; i < windowClients.length; i++) {
                   const windowClient = windowClients[i];
                   windowClient.postMessage(payload);
              }
         })
         .then(() => {
              return registration.showNotification("my notification title");
         });
    return promiseChain;
});
self.addEventListener("notificationclick", function(event) {
    console.log(event);
});
