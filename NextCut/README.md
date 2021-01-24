<p>
    1. Install laravel: Please check the official laravel installation guide for server requirements before you start. (https://laravel.com/docs/8.x/installation)
    2. Clone the repository: git clone https://github.com/OmarBaltaji/NextCut.git
    3. Go to the project directory: composer install
    4. Copy the example env file and make the required configuration changes in the .env file:
    Run the command in the terminal: cp .env.example .env
    Create a new database <database-name> and edit the below in the .env accordingly:
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=<database-name> 
    DB_USERNAME=<mysql-username>
    DB_PASSWORD= <mysql-password>
    5. Run command in terminal: php artisan migrate (to deploy the database)
    6. php artisan passport:install
    7. php artisan passport:client --personal 
    Name the personal access token: “Personal Access Token” 
    For more details on Laravel passport, check the official documentation:
    (Laravel Passport - Laravel - The PHP Framework For Web Artisans)
    8.  php artisan storage:link
    This creates a symbolic link from public/storage to storage/app/public
    9. Create a Firebase project:
     - Go to Authentication and enable authentication with email and password get the Firebase Credentials file (json file)
     - From Firebase navigate to Project settings -> Service accounts -> Generate a new private key -> Generate Key.
     - Open the downloaded file and copy and paste it to the firebase credentials file (json file) in the project
     The file should look like:
        {  
        "type": "",
        "project_id": "",
        "private_key_id": "",
        "private_key": "",
        "client_id": "",
        "auth_uri": "",
        "token_uri": "",
        "auth_provider_x509_cert_url": "",
        "client_x509_cert_url": ""
        }
    10. php artisan ui react
    11. npm install 
    12. From Firebase navigate to Project settings -> General -> Your apps -> Copy the following:
        apiKey: "API_KEY",
        authDomain: "PROJECT_ID.firebaseapp.com",
        databaseURL: "https://PROJECT_ID.firebaseio.com",
        projectId: "PROJECT_ID",
        storageBucket: "PROJECT_ID.appspot.com",
        messagingSenderId: "SENDER_ID",
        appId: "APP_ID",
        measurementId: "G-MEASUREMENT_ID",
    Then paste it to the Firebase Configuration file (Javascript file)
    13. In the public folder, you should insert the GSM sender id in the  manifest.json file. This can be obtained from <br/>Firebase: Project settings -> Cloud Messaging -> Project credentials -> Sender ID.
    Manifest.json should contain:
    {
        "Gsm_sender_id":"sender-id"
    }
    Be sure to also include your Firebase Configuration to the firebase-message-sw.js file (which can also be found in the <br/>public folder)
    14. Firebase Rules:
    In order to have Firebase fully functioning, slight modifications in the rules are needed:
    Firestore:
    Firebase Firestore rules: (to ensure only authenticated users can access the collections)
    rules_version = '2';
    service cloud.firestore {
        match /databases/{database}/documents {
            match /{document=**} {
                allow read, write: if true && request.auth != null;
            }
        }
    }
    Storage:
    Firebase Storage rules: (to ensure only authenticated users can access the collections)
    rules_version = '2';
    service firebase.storage {
        match /b/{bucket}/o {
            match /{allPaths=**} {
                allow read: if true && request.auth != null;
                allow write: if true && request.auth != null && request.resource.contentType.matches('image/.*');
            }
        }
    }
    15. Head to resources/js/Firebase
    Inside Init-fcm.js, paste the vapid key in the following line: 
    messaging.usePublicVapidKey(“Vapidkey”)
    16. Finally, Run command in terminal: php artisan serve (to access the website)
</p>
