"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controller/user");
const router = (0, express_1.Router)();
router.post('/register', user_1.register);
router.post('/login', user_1.login);
router.post('/upload', user_1.upload.single('file'), user_1.uploadFile);
router.post('/logout', user_1.logout);
router.get('/uploads', user_1.getUploads);
router.delete('/delete', user_1.removeFile);
exports.default = router;
//# sourceMappingURL=router.js.map