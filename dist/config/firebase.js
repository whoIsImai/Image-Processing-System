"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebase = void 0;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
require("dotenv/config");
const Config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};
exports.firebase = (0, app_1.initializeApp)(Config);
const auth = (0, auth_1.getAuth)(exports.firebase);
exports.default = auth;
//# sourceMappingURL=firebase.js.map