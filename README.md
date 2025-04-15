# therma_track

## Opening web and android app

web app:

1. run node -v, ensure the current version of node.js >= 20
2. npm create vite@latest [app name]
3. when being prompted the framework, choose React + Typescript
4. cd [app name]
5. npm install
6. cp [dir for React/web_app/*] src/
7. npm install react-router-dom recharts (router is used for navigating between different pages, recharts is used for char display)
8. npm run dev

android app (Expo):

1. npx create-expo-app [app name] --template blank-typescript
2. cd [app name]
3. cp [dir for React/android_app/*] .
4. npm install react-native-chart-kit axios @react-navigation/stack @react-navigation/native
5. npm install react-native-screens react-native-safe-area-context
6. **IMPORTANT** Before starting, use "ipconfig" command to check the laptop networks's currently assigned ip address and change the API_BASE_URL in config_constants.ts. Otherwise the Expo Go app would not be able to fetch the data!!
7. npx expo start

android app (Pure React Native, uses Android Studio Emulator)

1. npx @react-native-community/cli@latest init <app_name>
2. cd <app_name>
3. npm install @react-navigation/native @react-navigation/native-stack (for navigation)
4. npm install react-native-screens react-native-safe-area-context (dependencies for navigation)
5. npm install react-native-chart-kit (for patient temperature data visualization)
6. npm install react-native-svg (dependencies for char kit)
7. cp [dir for React/android_app/*] .
8. **IMPORTANT** Before starting, use "ipconfig" command to check the laptop networks's currently assigned ip address and change the API_BASE_URL in config_constants.ts. Otherwise the Expo Go app would not be able to fetch the data!!
9. open Android Studio VM device
10. npm run android

node.js backend

1. cd node-sever
2. npm init
3. add in package.json "scripts" session: "start": "node index.js"
4. npm install body-parser cors express sqlite3
5. npm start

flask backend

1. cd flask-server
2. python init_db.py --> initialize the database with default values
3. python app.py --> start the server

flask cloud backend

1. cd flask-cloud-server
2. python app.py
