import express from 'express';
const app=express();
import cors from 'cors';
import CoreStore from 'corestore';
import HyperBee from 'hyperbee';
import { startWriter } from '../user/user.mjs';
import { startReader } from '../user/user.mjs';
import { getPublicKey } from '../../roles/writer.mjs';

app.use(cors());

const chatOperationsStore = new CoreStore("./chat-operations");
const userDetailsCore= chatOperationsStore.get({ name: 'user-details'});
const chatMessagesCore= chatOperationsStore.get({ name: 'chat-messages'});
 
const userDetailsDB = new HyperBee(userDetailsCore, {
    keyEncoding: 'utf-8',
    valueEncoding: 'utf-8'
});
const chatMessagesDB = new HyperBee(chatMessagesCore);

app.post("/enterUser",async (request,response)=>{
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Access-Control-Allow-Methods', '*');
    const userName = request.body.userName;
    await startWriter(userName);
    const publicKey = await getPublicKey();

    console.log("BK VEGGIE ", userName, publicKey);

    await userDetailsDB.put(userName,publicKey)
    .catch(error=>{
        console.error("Error inserting user into hyperbee "+error);
        return response.status(500).json({message:"Internal Server Error"});
    });
    console.log("Inserted "+userName+" with public key : "+publicKey);
    return response.status(200).json({message:"User details inserted"});
});

app.post("/chatHistory",async (request,response)=>{
    const userName = request.body.userName;
    const receiverUserName = request.body.receiver;

    const chatKey = userName+"-"+receiverUserName;

    const messageHistory = await chatMessagesDB.get(chatKey).catch(error=>{
        console.error("Error in obtaining chat for key : "+chatKey);
        return response.status(500).json({message:"Internal Server Error"});
    });
    console.log("Chat history for "+userName+" and "+receiverUserName+" is : "+messageHistory);
    return response.status(200).json({message:messageHistory});

});

app.post("/chatUsersHistory", (request,response)=>{
    const userName = request.body.userName;
    let users = []
    const chatDBReadStream = chatMessagesDB.createReadStream();
    console.log("Chat DB Read Stream : "+chatDBReadStream);
    chatDBReadStream.on('data', function (data) {
        users.push(data);
    });
    return response.status(200).json({message : users});
})

app.post("/startChat", async (request,response)=>{
    const userName = request.body.userName;
    const receiverUserName = request.body.receiver;

    const chatKey = userName+"-"+receiverUserName;

    const userPublicKey = await userDetailsDB.get(userName); 
    const receiverKey = await userDetailsDB.get(receiverUserName);
 
    console.log('receiver: ', receiverUserName, receiverKey);
    console.log('user: ', userName, userPublicKey);

    // startReader(receiverUserName, userPublicKey.value);
    startReader(userName, receiverKey.value);

    if(chatMessagesDB.get(chatKey)==null) chatMessagesDB.put(chatKey,[]);

    return response.status(200).json({message:"Chat started between "+userName+" and "+receiverUserName});
});

export default app;