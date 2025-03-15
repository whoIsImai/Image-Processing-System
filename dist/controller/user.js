"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const firebase_1 = __importDefault(require("../config/firebase"));
const auth_1 = require("firebase/auth");
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
//# sourceMappingURL=user.js.map