import express from 'express';
import http from 'http';
import {} from 'dotenv/config'
import cors from 'cors';

import chat from './modules/chat/index.js';

const PORT= 8000; 

const app=express();
const server=http.createServer(app);
app.use(express.json()) 
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use("/chat",chat);



server.listen(PORT,()=>console.log(`Server has started on port ${PORT}`));