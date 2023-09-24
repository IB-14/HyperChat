import Corestore from 'corestore'
import user from '../user/user.mjs';
import process from "process";


const userName = process.argv[2];

const store = new Corestore(`./chat-storage`);
//chatCore


// process.stdin.on('data', publicKey => {
//     console.log("DATA PKEY",publicKey.byteLength, publicKey);
//     user(userName, userCore, publicKey);
// })

// rl.question(`Enter Key: `, (key) => {
    user(userName);
//     rl.close();
//   });