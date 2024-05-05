import { WebSocketServer } from 'ws'
import Message from './app/models/Message.js'

function handleOnlinePeople(wss,connection,req){
    const clientProtocol = req.headers['sec-websocket-protocol'];
    connection.userId = clientProtocol.split(', ')[1]
    connection.username = clientProtocol.split(', ')[2]
    console.log([...wss.clients].map(c => c.username));

    [...wss.clients].forEach(client => {
        client.send(JSON.stringify({
            online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username }))
        }))
    })
}

async function handleSendMessage(message,wss,connection){
    const messageData = JSON.parse(message.toString())
    const {recipient,text} = messageData
    if (recipient && text) {
        console.log('connection.userId is : ',connection.userId);
        const messageDoc = await Message.create({
            sender: connection.userId,
            recipient,
            text
        });
        console.log('create done');
        [...wss.clients].filter(client => client.userId == recipient)
        .forEach(c => c.send(JSON.stringify({
            text,
            sender: connection.userId,
            recipient,
            _id: messageDoc._id
          })));
    }
    console.log('recipient and text are : ',recipient,' ',text);
}


function runServerChat(serverApp) {
    console.log('server chat run');
    const wss = new WebSocketServer({ server: serverApp })

    wss.on('connection', (connection, req) => {
        console.log('+1 connection');

        handleOnlinePeople(wss,connection,req)

        connection.on('message',(message) => handleSendMessage(message,wss,connection) )


    })

    
}

export default runServerChat