# Campfire [![](https://circleci.com/gh/844196/campfire.svg?style=shield&circle-token=c69ad222831db1371c3c02e4d18819664a3e3ccd)](https://circleci.com/gh/844196/campfire)

## Setup

1. Create Firebase project
2. Check config

   ```js
   var config = {
     apiKey: "<API_KEY>",
     authDomain: "<PROJECT_ID>.firebaseapp.com",
     databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
     projectId: "<PROJECT_ID>",
     storageBucket: "<BUCKET>.appspot.com",
     messagingSenderId: "<SENDER_ID>",
   };
   ```

   See: <https://firebase.google.com/docs/web/setup#add_firebase_to_your_app>

3. Edit `.env`

   ```console
   $ cp .env.sample .env
   $ vim .env
   ```

4. Run development server

   ```console
   $ docker build -t campfire .
   $ docker run --rm -it -p 8080:8080 campfire yarn run serve
   ```

## Continuous Deploy

See [`.circleci/config.yml`](https://github.com/844196/campfire/blob/master/.circleci/config.yml) .
