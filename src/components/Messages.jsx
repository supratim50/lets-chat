import React, { useContext, useEffect, useState } from 'react';
import Message from "./Message";
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';


const Messages = () => {
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const {data} = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
        onSnapshot(doc(db, "chats", data.chatId), doc => {
        if(doc.exists()) {
          setMessages(doc.data().messages)
        }
        setLoading(false);
      })
    }

    return () => {
      if(data.chatId) {
        getChats();
        console.log(messages)
      }
    }
  }, [data.chatId]);

  return (
    <div className='messages'>
      {
        data.chatId
        && messages.map(message => (
          <Message message={message} key={message.id} />
      ))
      }
    </div>
  )
}

export default Messages