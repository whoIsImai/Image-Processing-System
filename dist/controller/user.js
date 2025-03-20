"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFile = exports.getUploads = exports.uploadFile = exports.upload = exports.logout = exports.login = exports.register = void 0;
const firebase_1 = __importStar(require("../config/firebase"));
const auth_1 = require("firebase/auth");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_1 = __importDefault(require("../config/aws"));
const firestore_1 = require("firebase/firestore");
const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredentials = await (0, auth_1.createUserWithEmailAndPassword)(firebase_1.default, email, password);
        const user = userCredentials.user;
        res.status(201).send(user);
    }
    catch (error) {
        res.json({ error: error });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredentials = await (0, auth_1.signInWithEmailAndPassword)(firebase_1.default, email, password);
        const user = userCredentials.user;
        res.status(200).send(user);
    }
    catch (error) {
        res.json({ error: error });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        await (0, auth_1.signOut)(firebase_1.default);
        res.status(200).json({ message: 'logout successful' });
    }
    catch (error) {
        res.json({ error: error });
    }
};
exports.logout = logout;
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: aws_1.default,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});
const uploadFile = async (req, res) => {
    const user = firebase_1.default.currentUser;
    if (!user)
        return res.status(401).json({ message: 'Unauthorized' });
    if (req.file) {
        const file = req.file;
        const fileLocation = file.location;
        const db = (0, firestore_1.getFirestore)(firebase_1.firebase);
        const userRef = (0, firestore_1.doc)(db, 'users', user.email);
        try {
            await (0, firestore_1.updateDoc)(userRef, {
                links: (0, firestore_1.arrayUnion)(fileLocation),
                email: user.email
            });
            res.status(201).json({ message: 'File uploaded successfully' });
        }
        catch (error) {
            if (error.code === 'not-found') {
                //incase the user is not in the db we set the user
                await (0, firestore_1.setDoc)(userRef, {
                    links: (0, firestore_1.arrayUnion)(fileLocation),
                    email: user.email
                }, { merge: true });
                return res.status(201).json({ message: 'File uploaded successfully' });
            }
            else {
                return res.status(500).json({ error: error });
            }
        }
    }
    else {
        res.status(400).send('No file uploaded');
    }
};
exports.uploadFile = uploadFile;
const getUploads = async (req, res) => {
    const user = firebase_1.default.currentUser;
    if (!user)
        return res.status(401).json({ message: 'Unauthorized' });
    const db = (0, firestore_1.getFirestore)(firebase_1.firebase);
    const fileRef = (0, firestore_1.collection)(db, 'users');
    const q = (0, firestore_1.query)(fileRef, (0, firestore_1.where)('email', '==', user.email));
    try {
        const querySnapshot = await (0, firestore_1.getDocs)(q);
        const fileLinks = querySnapshot.docs.map(doc => doc.data().links);
        return res.status(200).json({ links: fileLinks });
    }
    catch (error) {
        res.json({ error: error });
    }
};
exports.getUploads = getUploads;
const removeFile = async (req, res) => {
    const { link } = req.query;
    const user = firebase_1.default.currentUser;
    if (!user)
        return res.status(401).json({ message: 'Unauthorized' });
    const db = (0, firestore_1.getFirestore)(firebase_1.firebase);
    const userRef = (0, firestore_1.doc)(db, "users", user.email);
    try {
        await (0, firestore_1.updateDoc)(userRef, {
            links: (0, firestore_1.arrayRemove)(link)
        });
        res.status(200).json({ message: "File deleted." });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.removeFile = removeFile;
//# sourceMappingURL=user.js.map