import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyApVQFB4Eofn-W060CJSQoV4H5HkXNj7QQ",
  authDomain: "glovelife-3a3d3.firebaseapp.com",
  databaseURL: "https://glovelife-3a3d3-default-rtdb.firebaseio.com",
  projectId: "glovelife-3a3d3",
  storageBucket: "glovelife-3a3d3.firebasestorage.app",
  messagingSenderId: "411245424372",
  appId: "1:411245424372:web:865113a29b06417caa78a1",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getDatabase(app);