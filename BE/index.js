// const express = require("express");
import express from "express";
import { createServer } from 'http'
import cors from 'cors'
import fs from 'fs'
import https from 'https'

import router from "./routes/index.js";
import Mongo from "./config/db/index.js";
import { PORT } from "./config/index.js"
import { catchError } from './app/middlewares/error.js'
import runServerChat from "./serverChat.js";

const app = express();

const serverHttp = createServer(app);
const server = https.createServer({
  key: fs.readFileSync("server2.key"),
  cert: fs.readFileSync("server2.crt"),
},
app)


app.use(cors());

app.enable('trust proxy');

// app.use(express.text());
app.use(express.json());

Mongo.connect()

router(app);
app.use(catchError)
runServerChat(serverHttp)

// server.listen(4000, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

serverHttp.listen(PORT, () => {
  console.log(`ServerHttp is running on port ${PORT}`);
});