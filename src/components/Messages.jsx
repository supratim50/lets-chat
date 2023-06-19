import React, { useContext, useEffect, useState } from 'react';
import Message from "./Message";
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase';


const Messages = () => {
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const {data} = useContext(ChatContext);

  useEffect(() => {
    console.log(data.chatId)

    if(data.chatId) {
      const unsub = onSnapshot(doc(db, 'chats', data.chatId), doc => {
        console.log("messages : ", doc.data());
        setMessages(doc.data().messages);
      })

      return () => unsub();
    }

  }, [data.chatId]);

  return (
    <div className='messages'>
      {
        messages.length > 0
        ? messages.map(msg => (
          <Message message={msg} key={msg.id} />
          // console.log(msg)
        ))
        : (
          <div className='empty_msg'>
            <p>Don't have any Conversation with {data.user.displayName}</p>
          </div>
        )
      }
    </div>
  )
}

export default Messages