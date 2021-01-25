<p>
    1. Install laravel: Please check the official laravel installation guide for server requirements before you start. (https://laravel.com/docs/8.x/installation) <br/> <br/>
    2. Clone the repository: git clone https://github.com/OmarBaltaji/NextCut.git  <br/><br/>
    3. Go to the project directory: composer install  <br/><br/>
    4. Copy the .env.example file and make the required configuration changes in the .env file.  <br/>
    You can run the command in the terminal: cp .env.example .env (to copy the file) <br/>
    Create a new database "database-name" and edit the information below in the .env accordingly:  <br/>
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
    For more details on Laravel passport, check the official documentation: https://laravel.com/docs/8.x/passport<br/><br/>
    8.  php artisan storage:link<br/>
    This creates a symbolic link from public/storage to storage/app/public<br/><br/>
    9. Create a Firebase project:<br/>
        - Go to the Authentication section and enable authentication with email and password. Then get the Firebase Credentials file (json file)<br/>
        - From Firebase navigate to Project settings -> Service accounts -> Generate a new private key -> Generate Key.<br/>
        - Open the downloaded file and copy and paste it to the firebase credentials file (json file) in the project.
        <br/><br/>
     The file should look like:<br/>
        <pre>
            "type": "",
            "project_id": "",
            "private_key_id": "",
            "private_key": "",
            "client_id": "",
            "auth_uri": "",
            "token_uri": "",
            "auth_provider_x509_cert_url": "",
            "client_x509_cert_url": ""</pre><br/>
    10. php artisan ui react<br/><br/>
    11. npm install <br/><br/>
    12. From Firebase navigate to Project settings -> General -> Your apps and Copy the following:<br/>
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
    13. In the public folder, you should insert the GSM sender id in the  manifest.json file. This can be obtained from Firebase:<br/> Project settings -> Cloud Messaging -> Project credentials -> Sender ID.<br/><br/>
    Manifest.json should contain:<br/>
    <pre>"gsm_sender_id":"sender-id"</pre>
    Be sure to also include your Firebase Configuration to the firebase-message-sw.js file (which can also be found in the public folder)<br/><br/>
    14. Firebase Rules:<br/>
    In order to have Firebase fully functioning, slight modifications in the rules are needed: (to ensure only authenticated users can access the collections)<br/><br/>
    Firebase Firestore Rules:<br/>
    <pre>
    rules_version = '2';
    service cloud.firestore {
        match /databases/{database}/documents {
            match /{document=**} {
                allow read, write: if true && request.auth != null;
            }
        }
    }</pre> <br/>
    Firebase Storage Rules:<br/>
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
    15. In order to receive emails on your gmail account after a booking, you need to:<br/>
    &emsp;&emsp;- Go to your Google Account Security Settings<br/>
    &emsp;&emsp;- Ensure that the 2-Step-Verification is disabled<br/>
    &emsp;&emsp;- Turn ON the "Less Secure App" access<br/><br/>
    16. Finally, run this command in the terminal: php artisan serve (to access the website)<br/>
</p>
