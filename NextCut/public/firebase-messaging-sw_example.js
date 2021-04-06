importScripts('https://www.gstatic.com/firebasejs/6.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.6.2/firebase-messaging.js');

const firebaseConfig = {
     apiKey: "",
     authDomain: "",
     databaseURL: "",
     projectId: "",
     storageBucket: "",
     messagingSenderId: "",
     appId: "",
     measurementId: ""
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
