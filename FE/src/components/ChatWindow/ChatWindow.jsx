import React from 'react'
import { useFetch } from '../../hooks/useFetch';
import { messageService } from '../../services/message.service';
import { useAuth } from '../AuthContext';
import { Spin } from 'antd';

const ChatWindow = ({selectedUserId,divUnderMessage,messages,setMessage}) => {
    const {user} = useAuth()
    const { loading: loadingMessage, data: resLoadMessage } = useFetch(() => { return messageService.getMessageWithId(selectedUserId) }, [selectedUserId])

    if (!loadingMessage) {
      console.log(resLoadMessage);
      setMessage(resLoadMessage.messages)
    }
    if (loadingMessage) {
        return <Spin size='large' fullscreen/>
    }
    return (
        <div className="relative h-full">
            <div className='overflow-y-scroll absolute top-0 left-0 right-0 bottom-2'>
                {
                    messages.map(message => (
                        <div key={message._id} className={(message.sender == user.id ? 'text-right' : 'text-left')}>
                            <div className={"p-2 text-left my-2 rounded-md text-sm inline-block " + (message.sender == user.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500')}>{message.sender == user.id && 'ME : '} {message.text}</div>
                        </div>
                    ))
                }
                <div ref={divUnderMessage}></div>
            </div>
        </div>
    )
}

export default ChatWindow