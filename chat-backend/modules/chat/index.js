const express = require('express');
const app=express();
const CoreStore = require('corestore');
const HyperBee = require('hyperbee');
import user from '../user/user.mjs';

const chatOperationsStore = new CoreStore("./chat-operations");
const userDetailsCore= chatOperationsStore.get({ name: 'user-details'});
const chatMessagesCore= chatOperationsStore.get({ name: 'chat-messages'});

const userDetailsDB = new HyperBee(userDetailsCore);
const chatMessagesDB = new HyperBee(chatMessagesCore);

app.post("/enterUser",async (request,response)=>{
    const userName = request.body.userName;
    const publicKey = user(userName);
    await userDetailsDB.put(userName,publicKey).catch(error=>{
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

app.post("/chatUsersHistory",(request,response)=>{
    const userName = request.body.userName;
    const chatDBReadStream = chatMessagesDB.createReadStream();
    console.log("Chat DB Read Stream : "+chatDBReadStream);
})

app.post("/startChat", (request,response)=>{
    const userName = request.body.userName;
    const receiverUserName = request.body.receiver;

    const chatKey = userName+"-"+receiverUserName;

    const userPublicKey = userDetailsDB.get(userName);
    const receiverKey = userDetailsDB.get(receiverUserName);

    startReader(userPublicKey);
    startReader(receiverKey);

    if(chatMessagesDB.get(chatKey)==null) chatMessagesDB.put(chatKey,[]);

    return response.status(200).json({message:"Chat started between "+userName+" and "+receiverUserName});
});

module.exports=app;