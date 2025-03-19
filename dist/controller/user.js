"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.upload = exports.logout = exports.login = exports.register = void 0;
const firebase_1 = __importDefault(require("../config/firebase"));
const auth_1 = require("firebase/auth");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_1 = __importDefault(require("../config/aws"));
//import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
const register = async (req, res) => {
    const { email, password, username } = req.body;
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
        key: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});
const uploadFile = async (req, res) => {
    if (req.file) {
        const file = req.file;
        console.log(file.location);
        res.status(200).json({ file: req.file });
    }
    else {
        res.status(400).send('No file uploaded');
    }
};
exports.uploadFile = uploadFile;
//# sourceMappingURL=user.js.map