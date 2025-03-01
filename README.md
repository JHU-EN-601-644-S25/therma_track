# therma_track

## Opening web and android app
[Same App with Slack Back End]

web app:

frontend:
1. run node -v, ensure the current version of node.js >= 20
2. npm create vite@latest [app name]
3. when being prompted the framework, choose React + Typescript
4. cd [app name]
5. npm install
6. cp [dir for React/web_app/*] src/
7. npm install react-router-dom recharts (router is used for navigating between different pages, recharts is used for char display)
8. npm run dev

backend:
1. cd BackEnd or cp [dir for React/Webapp/BackEnd/*] [dir for your backend folder/]
2. pip install -r requirements.txt
3. python run.py

android app:

1. npx create-expo-app [app name] --template blank-typescript
2. cd [app name]
3. cp [dir for React/android_app/*] .
4. npm install react-native-chart-kit
5. npm install @react-navigation/native
6. npm install react-native-screens react-native-safe-area-context
7. npm install @react-navigation/stack
8. npx expo start


