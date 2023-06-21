import React, { useContext, useState } from 'react';
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import {v4 as uuid} from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const handleSend = async () => {
    if(img === null && text === "") {
      return;
    }
  
    setLoading(true);
    
      if(img) {
        const storageRef = ref(storage, uuid());
  
        const uploadTask = uploadBytesResumable(storageRef, img);
        uploadTask.on('state_changed',
            (snapshot) => {const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
          }, 
          (error) => {
            setErr(true);
          }, 
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderid: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL
                })
              })
            });
          }
        );
      setLoading(false);
      }else {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderid: currentUser.uid,
            date: Timestamp.now()
          })
        })
        setLoading(false);
      }
      
    setImg(null);
    setText("");

    
    let lastMsg = img ? "img-social-chat" : text;
    // current user 
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text: lastMsg
      },
      [data.chatId+".date"]: serverTimestamp()
    })
    // user 
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text: lastMsg
      },
      [data.chatId+".date"]: serverTimestamp()
    })
  }

  return (
    <div className='input'>
      <input type="text" placeholder='Type Something...' onChange={e => setText(e.target.value)} value={text} />
      <div className="send">
        <img src={Attach} alt="" />
        <input type="file" style={{display: "none"}} id='file' onChange={e => setImg(e.target.files[0])} />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>{loading ? "loading..." : "send"}</button>
      </div>
    </div>
  )
}

export default Input