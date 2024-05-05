import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../components/AuthContext'
import ContactCard from '../components/ContactCard/ContactCard'
import { useFetch } from '../hooks/useFetch'
// import {messageService} from '../services/message.service'
import { uniqBy } from "lodash";
import { AUTHENTICATION_API, MESSAGE_API, api, CHAT_SERVER } from '../config/api'


const ChatPage = () => {
  const { user } = useAuth()
  const [ws, setWs] = useState(null)
  const [newMessageText, setNewMessageText] = useState('')
  const [onlinePeople, setOnlinePeople] = useState({})
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [messages, setMessages] = useState([])
  const [offlinePeople, setOfflinePeople] = useState({})
  const divUnderMessage = useRef()
  useEffect(() => {
    // connectToWs()
    connectToWs()
  }, [selectedUserId])
  function connectToWs() {
    console.log('connect to server');
    const ws = new WebSocket(CHAT_SERVER, ['draft', `${user.id}`, `${user.username}`])
    setWs(ws);
    // ws.onclose(() => {console.log('server chat close');})
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', () => {
      console.log('server chat close');
      setTimeout(() => {
        console.log('Disconnected. Trying to reconnect');
        connectToWs()
      }, 1000);
    })

    // return () => {
    //   if (ws.readyState === 1) { // <-- This is important
    //     ws.close();
    //   }
    // }
  }


  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data)
    if ('online' in messageData) {
      showOnlinePeople(messageData.online)
    } else {
      if (messageData.sender == selectedUserId) {
        setMessages(prev => ([...prev, { ...messageData }]));
      }
      // setMessages(prev => ([...prev, {...messageData}]))
    }
  }

  function showOnlinePeople(peopleArr) {
    const people = {}
    peopleArr.forEach(({ userId, username, role }) => {
      people[userId] = username
    });
    setOnlinePeople(people);
  }

  const sendMessage = (ev) => {
    ev.preventDefault()
    ws.send(JSON.stringify({
      recipient: selectedUserId,
      text: newMessageText,
    }));
    setNewMessageText('')

    setMessages(prev => ([...prev, {
      text: newMessageText,
      sender: user.id,
      recipient: selectedUserId,
      _id: Date.now(),
    }]));
  }

  useEffect(() => {
    const div = divUnderMessage.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    api.get(`${AUTHENTICATION_API}/people`).then(res => {
      const offlinePeopleArr = res.people
        .filter(p => p._id !== user.id)
        .filter(p => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach(p => {
        offlinePeople[p._id] = p.username;
      });
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);

  useEffect(() => {
    if (selectedUserId) {
      api.get(`${MESSAGE_API}/${selectedUserId}`).then(res => {
        setMessages(res.messages)
      })
    }
  }, [selectedUserId])

  const onlinePeopleExclOurUser = { ...onlinePeople }
  delete onlinePeopleExclOurUser[user.id]

  const messagesWithoutDupes = uniqBy(messages, '_id');

  return (
    <div className="flex" style={{ height: 'calc(100vh - 70px)' }}>
      <div className="bg-white w-1/5 flex flex-col">
        <div className="flex-grow">
          {
            user.role == 'admin' && (
              <>
                {Object.keys(onlinePeopleExclOurUser).map(userId => (
                  <ContactCard
                    key={userId}
                    id={userId}
                    online={true}
                    username={onlinePeopleExclOurUser[userId]}
                    onClick={() => setSelectedUserId(userId)}
                    selected={userId === selectedUserId} />
                ))}
                {Object.keys(offlinePeople).map(userId => (
                  <ContactCard
                    key={userId}
                    id={userId}
                    online={false}
                    username={offlinePeople[userId]}
                    onClick={() => setSelectedUserId(userId)}
                    selected={userId === selectedUserId} />
                ))}
              </>
            )
          }
          {
            user.role != 'admin' && <ContactCard
              key={'65a28033180b8085a1eb9f69'}
              id={'65a28033180b8085a1eb9f69'}
              online={Object.keys(onlinePeople).some(onlPerId => onlPerId == '65a28033180b8085a1eb9f69')}
              username={'ADMIN123'}
              onClick={() => { setSelectedUserId('65a28033180b8085a1eb9f69') }}
              selected={selectedUserId == '65a28033180b8085a1eb9f69'}
            />
          }

        </div>
      </div>
      <div className="flex flex-col bg-blue-50 w-4/5 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="text-gray-300">&larr; Select a person from the sidebar</div>
            </div>
          )}
          {/* ---------------------------- CHAT WINDOW ---------------------------- */}
          {/* {!!selectedUserId && <ChatWindow key={messages} divUnderMessage={divUnderMessage} selectedUserId={selectedUserId} messages={messages} setMessage={setMessages} />} */}
          {!!selectedUserId && (
            <div className="relative h-full">
              <div className='overflow-y-scroll absolute top-0 left-0 right-0 bottom-2'>
                {
                  messagesWithoutDupes.map(message => (
                    <div key={message._id} className={(message.sender == user.id ? 'text-right' : 'text-left')}>
                      <div className={"p-2 text-left my-2 rounded-md text-sm inline-block " + (message.sender == user.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500')}> {message.text}</div>
                    </div>
                  ))
                }
                <div ref={divUnderMessage}></div>
              </div>
            </div>
          )}
          {/* ---------------------------- END CHAT WINDOW ---------------------------- */}

        </div>
        {/* ---------------------------- CHAT INPUT ---------------------------- */}
        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={(ev) => sendMessage(ev)}>
            <input type="text"
              value={newMessageText}
              onChange={ev => { setNewMessageText(ev.target.value); }}
              placeholder="Type your message here"
              className="bg-white flex-grow border rounded-sm p-2" />
            <button onClick={(ev) => sendMessage(ev)} type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>

          </form>
        )}
        {/* ---------------------------- END CHAT INPUT ---------------------------- */}
      </div>
    </div>
  );
}

export default ChatPage



