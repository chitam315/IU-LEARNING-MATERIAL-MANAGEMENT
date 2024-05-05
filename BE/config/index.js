import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const PORT = process.env.port || 5000;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || null;
const JWT_SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY || null;
const JWT_EXPIRES_ACCESS = process.env.JWT_EXPIRES_ACCESS || '5m';
const JWT_EXPIRES_REFRESH = process.env.JWT_EXPIRES_REFRESH || '5m';

const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY
const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION


export {PORT,JWT_SECRET_REFRESH_KEY,JWT_SECRET_KEY, JWT_EXPIRES_ACCESS, JWT_EXPIRES_REFRESH, S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY, S3_BUCKET_REGION}