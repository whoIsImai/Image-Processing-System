"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});
exports.default = s3Client;
//# sourceMappingURL=aws.js.map