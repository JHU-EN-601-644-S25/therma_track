# therma_track

## Opening web and android app

[clone the main branch]

Web App:

1. run node -v, ensure the current version of node.js >= 20
2. npm create vite@latest [app name]
3. when being prompted the framework, choose React + Typescript
4. cd [app name]
5. npm install
6. cp [dir for React/web_app/*] src/
7. npm install react-router-dom recharts (router is used for navigating between different pages, recharts is used for char display)
8. npm run dev


Android App (Pure React Native, uses Android Studio Emulator):

1. npx @react-native-community/cli@latest init <app_name>
2. cd <app_name>
3. npm install @react-navigation/native @react-navigation/native-stack (for navigation)
4. npm install react-native-screens react-native-safe-area-context (dependencies for navigation)
5. npm install react-native-chart-kit (for patient temperature data visualization)
6. npm install react-native-svg (dependencies for char kit)
7. cp [dir for React/android_app/*] .
8. **IMPORTANT** Before starting, use "ipconfig" command to check the laptop networks's currently assigned ip address and change the API_BASE_URL in config_constants.ts. Otherwise the app will not be able to fetch the data!!
9. open Android Studio and run VM device (Recommend Android version 15)
10. npm run android


Flask backend (Local version of app, used for functionality test):

1. cd flask-server
2. python init_db.py --> initialize the database with default values
3. python app.py --> start the server

Flask cloud backend (Mainly used):

1. cd flask-cloud-server
2. Create .env file in the flask-cloud-server/
3. pip install requirements.txt
4. python app.py 
