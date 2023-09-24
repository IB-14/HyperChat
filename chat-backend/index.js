const express = require('express');
require('dotenv').config()
const cors=require('cors');

const PORT=process.env.PORT || 5000;

const app=express();
const server=http.createServer(app);
app.use(cors());

app.use("/chat",require("./modules/chat/index.js"));



server.listen(PORT,()=>console.log("Server has started"));