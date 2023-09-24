import Corestore from 'corestore'
import goodbye from 'graceful-goodbye'
import Hyperbee from 'hyperbee'
import Hyperswarm from 'hyperswarm'
import readline from "readline";
import reader from '../../roles/reader.mjs';
import writer, { getPublicKey } from '../../roles/writer.mjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let userName, userStorage, readerStorage, writerStorage, store, swarm, core;

async function initializeUser(userName) {

    console.log(`\n\n${userStorage}\n\n${readerStorage}\n\n${writerStorage}\n\n`)

    // create a corestore instance with the given location
    store = new Corestore(userStorage)

    swarm = new Hyperswarm()
    goodbye(() => swarm.destroy())

    // replication of corestore instance
    swarm.on('connection', conn => store.replicate(conn))

    // creation of Hypercore instance (if not already created)
    core = store.get({ name: userName })

    // creation of Hyperbee instance using the core instance 
    const userBee = new Hyperbee(core, {
    keyEncoding: 'utf-8',
    valueEncoding: 'utf-8'
    })

    // wait till all the properties of the hypercore are initialized
    await core.ready()
    await writer(writerStorage)
}

// function startReader() {
//     rl.question(`Enter Key: `, (publicKey) => {
//         console.log("\nKEY: ", publicKey);
//         reader(publicKey, readerStorage);
//         rl.close();
//     });
     
// }

export function startReader(userName, publicKey){ 
    userStorage = `./chat-storage/${userName}-storage`; 
    readerStorage = `${userStorage}/reader-storage`;
    reader(publicKey, readerStorage);
}

export async function startWriter(userName) {
    userStorage = `./chat-storage/${userName}-storage`; 
    writerStorage = `${userStorage}/writer-storage`;
    await initializeUser(userName);
} 

export default async (uName) => {
    userName = uName;

    userStorage = `./chat-storage/${userName}-storage`; 
    readerStorage = `${userStorage}/reader-storage`;
    writerStorage = `${userStorage}/writer-storage`;
    
    let key = await initializeUser(userName);
    //startReader();
    // return key;
}
