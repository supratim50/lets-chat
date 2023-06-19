import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({message, key}) => {
  
  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    console.log(message)
    ref.current?.scrollIntoView({behavior: "smooth"});
  }, [message])

  return (
    <div ref={ref} key={key} className={`message ${message.senderid === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img src={message.senderid === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {
          message.img && <img src={message.img} alt="" />
        }
      </div>
    </div>
  )
}

export default Message