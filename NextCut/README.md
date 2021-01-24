<p>
    1. Install laravel: Please check the official laravel installation guide for server requirements before you start. (https://laravel.com/docs/8.x/installation) <br/> <br/>
    2. Clone the repository: git clone https://github.com/OmarBaltaji/NextCut.git  <br/><br/>
    3. Go to the project directory: composer install  <br/><br/>
    4. Copy the example env file and make the required configuration changes in the .env file.  <br/>
    You can run the command in the terminal: cp .env.example .env (to copy the file) <br/>
    Create a new database "database-name" and edit the below in the .env accordingly:  <br/>
    <pre>
        DB_CONNECTION=mysql
        DB_HOST=127.0.0.1
        DB_PORT=3306
        DB_DATABASE="database-name" 
        DB_USERNAME="mysql-username"
        DB_PASSWORD= "mysql-password"</pre><br/>
    5. Run command in terminal: php artisan migrate (to deploy the database)<br/><br/>
    6. php artisan passport:install<br/><br/>
    7. php artisan passport:client --personal <br/>
    Name the personal access token: “Personal Access Token” <br/>
    For more details on Laravel passport, check the official documentation:<br/>
    (Laravel Passport - Laravel - The PHP Framework For Web Artisans)<br/><br/>
    8.  php artisan storage:link<br/>
    This creates a symbolic link from public/storage to storage/app/public<br/><br/>
    9. Create a Firebase project:<br/>
        - Go to Authentication and enable authentication with email and password get the Firebase Credentials file (json file)<br/>
        - From Firebase navigate to Project settings -> Service accounts -> Generate a new private key -> Generate Key.<br/>
        - Open the downloaded file and copy and paste it to the firebase credentials file (json file) in the project<br/>
     The file should look like:<br/>
     <pre>
        {  <br/>
            "type": "",<br/>
            "project_id": "",<br/>
            "private_key_id": "",<br/>
            "private_key": "",<br/>
            "client_id": "",<br/>
            "auth_uri": "",<br/>
            "token_uri": "",<br/>
            "auth_provider_x509_cert_url": "",<br/>
            "client_x509_cert_url": ""<br/>
        }</pre><br/>
    10. php artisan ui react<br/><br/>
    11. npm install <br/><br/>
    12. From Firebase navigate to Project settings -> General -> Your apps -> Copy the following:<br/>
    <pre>
        apiKey: "API_KEY",
        authDomain: "PROJECT_ID.firebaseapp.com",
        databaseURL: "https://PROJECT_ID.firebaseio.com",
        projectId: "PROJECT_ID",
        storageBucket: "PROJECT_ID.appspot.com",
        messagingSenderId: "SENDER_ID",
        appId: "APP_ID",
        measurementId: "G-MEASUREMENT_ID",</pre>
    Then paste it to the Firebase Configuration file (Javascript file)<br/><br/>
    13. In the public folder, you should insert the GSM sender id in the  manifest.json file. This can be obtained from Firebase:<br/> Project settings -> Cloud Messaging -> Project credentials -> Sender ID.<br/>
    Manifest.json should contain:<br/>
    <pre>
    {
        "Gsm_sender_id":"sender-id"
    }</pre>
    Be sure to also include your Firebase Configuration to the firebase-message-sw.js file (which can also be found in the public folder)<br/><br/>
    14. Firebase Rules:<br/>
    In order to have Firebase fully functioning, slight modifications in the rules are needed:<br/><br/>
    Firebase Firestore rules: (to ensure only authenticated users can access the collections)<br/>
    <pre>
    rules_version = '2';
    service cloud.firestore {
        match /databases/{database}/documents {
            match /{document=**} {
                allow read, write: if true && request.auth != null;
            }
        }
    }</pre> <br/>
    Firebase Storage rules: (to ensure only authenticated users can access the collections)<br/>
    <pre>
    rules_version = '2';
    service firebase.storage {
        match /b/{bucket}/o {
            match /{allPaths=**} {
                allow read: if true && request.auth != null;
                allow write: if true && request.auth != null && request.resource.contentType.matches('image/.*');
            }
        }
    }</pre><br/>
    15. Finally, Run command in terminal: php artisan serve (to access the website)<br/>
</p>
