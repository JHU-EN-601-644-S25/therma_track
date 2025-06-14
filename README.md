# Therma_track
## Project Overview

Therma Track is a cross-platform temperature monitoring app for patients which aligns to the cybersecurity standards of the FDA Class II medical devices. 
The security of this App is protected via multiple aspects, including data encryption, cloud security, multi-factor authentication, and access control. 
We have conducted systematic security testings based on the FDA requirements, please check [ThermaTrack_InternalTest](https://github.com/JHU-EN-601-644-S25/ThermaTrack_InternalTest) for the reports.

The basic features are:
1. allow patients and authorised clinicians to monitor patient data in real-time through both web and mobile applications;
2. upload patients data to the cloud in real-time;
3. allow patient and clinician registrations.

## Opening the Web and Android app

[Please download the app from the main branch]

Web App (Vite + React + TypeScript):
1. run `node -v`, ensure the current version of Node.js >= 20
2. `npm create vite@latest [app name]`
3. when being prompted the framework, choose React + Typescript
4. `cd [app name]`
5. `npm install`
6. `cp [dir for React/web_app/*] src/`
7. `npm install react-router-dom recharts` (router is used for navigating between different pages, recharts is used for char display)
8. `npm run dev`

Android App (React Native + Android Studio):
1. `npx @react-native-community/cli@latest init [app_name]`
2. `cd [app_name]`
3. `npm install @react-navigation/native @react-navigation/native-stack` (for navigation)
4. `npm install react-native-screens react-native-safe-area-context` (dependencies for navigation)
5. `npm install react-native-chart-kit` (for patient temperature data visualization)
6. `npm install react-native-svg` (dependencies for char kit)
7. `cp [dir for React/android_app/*] .`
8. **IMPORTANT** Before starting, use "ipconfig" command to check the laptop networks's currently assigned ip address and change the API_BASE_URL in config_constants.ts. Otherwise the app will not be able to fetch the data!!
9. open Android Studio and run VM device (Recommend Android version 15)
10. npm run android

Flask backend (Local version of app, used for functionality test):
1. `cd flask-server`
2. `python init_db.py` --> initialize the database with default values
3. `python app.py` --> start the server

Flask cloud backend (Mainly used):
1. `cd flask-cloud-server`
2. `python3 -m venv local`
3. `source local/bin/activate` (note: based on the difference in operaing system, this command line may be different. the line shown here is for linux. For winows try `local/Script/Activate`)
4. use `which python` to check for the current python version, it should be ".....\therma_track\flask-cloud-server\local\...". If it is not, try deactivate and active the environment more times.
5. `python -m pip install -r requirements.txt`
6. `cp .env.temp .env`
4. `python app.py`

**KEY** Alternate between https and http connection
1. if checking on https, first create self-signed certificates used by both front end and back end via `openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes`. When being prompted on country code, location, organization, etc. the response does not really matter. After this process, you should get bot a "key.pem" and a "cert.pem". Make a copy of them both, store one copy inside therma_track/flask_cloud_server/network (if not created, create the folder). Store another copy again inside the folder called network. Store the folder in the web app, at the same level as vite.config.ts.
2. go to therma_track/flask_cloud_server/app.py, flip the constant boolean 'TLS' (True for https, False for http)
3. if using https, add the script below inside vite.config.ts:
```
import fs from 'fs';
...

server: {
    https: {
        key: fs.readFileSync('network/key.pem'),
        cert: fs.readFileSync('network/cert.pem'),
        },
    port: 3000,
    host: true,
 }
```
this will ensure that the front end will use https with the specified certificate

4. check the web app's src/constant_config.ts file to see whether the data is fetched from "http://localhost" or "https://localhost". Modify accordingly.
5. **if when loggining in, there is still Database connecton problem**, try to open the cloud server website (should be https://localhost:4000), and when seeing a page that says the website is insecure, click "advanced" and then "proceed to the page". This will lead to a 404 page, but after that retry the frontend, the connection issue should be resolved.
