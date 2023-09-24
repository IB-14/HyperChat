import Corestore from 'corestore'
import b4a from 'b4a'
import goodbye from 'graceful-goodbye'
import Hyperswarm from 'hyperswarm'

export default async (publicKey, readerStorage) => {
    // pass the key as a command line argument
    const key = b4a.from(publicKey, 'hex')

    // creation of a Corestore instance
    const store = new Corestore(readerStorage)

    const swarm = new Hyperswarm()
    goodbye(() => swarm.destroy())

    // replication of corestore instance on every connection
    swarm.on('connection', conn => store.replicate(conn))

    // creation/getting of a hypercore instance using the key passed
    const core = store.get({ key, valueEncoding: 'json' })
    // wait till all the properties of the hypercore instance are initialized
    await core.ready()

    const foundPeers = store.findingPeers()
    // join a topic
    swarm.join(core.discoveryKey)
    swarm.flush().then(() => foundPeers())

    // update the meta-data of the hypercore instance
    await core.update()
    
    console.log("\n\nIN reader\n\n",readerStorage, core);

    if (core.length === 0) {
    console.log('Could not connect to the writer peer')
    process.exit(1)
    }

    // getting cores using the keys stored in the first block of main core
    const { otherKeys } = await core.get(0)
    for (const key of otherKeys) {
    const core = store.get({ key: b4a.from(key, 'hex') })
    // on every append to the hypercore, 
    // download the latest block of the core and log it to the console
    core.on('append', () => {
        const seq = core.length - 1
        core.get(seq).then(block => {
        console.log(`Block ${seq} in Core ${key}: ${block}`) 
        })
    })
    }
}