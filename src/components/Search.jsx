import React, { useContext, useState } from 'react'
import { collection, doc, getDocs, getDoc, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import {db} from "../firebase";
import {AuthContext} from "../context/AuthContext";
import { ChatContext } from '../context/ChatContext';

const Search = () => {
  
  const [username, setUsername] = useState();
  const [user, setUser] = useState();
  const [err, setErr] = useState();

  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext)

  const handleSearch = async () => {
    const citiesRef = collection(db, "users");

    const q = query(citiesRef, where("displayName", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          setUser(doc.data());
      });
    } catch(e) {
      setErr(true);
    }
  }

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch(); 
  }

  const handleSelect = async () => {
    if(currentUser.uid != user.uid){
      // check whether the group (caht is firestore) exist, if not create
      const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid
      try {
        const res = await getDoc(doc(db, "chats", combinedId));
        
        if(!res.exists()) {
          // create a chat in chats collection 
          await setDoc(doc(db, "chats", combinedId), {messages: []});

          //create user chat
          await updateDoc(doc(db, "userChats", currentUser.uid), {
            [combinedId+".userInfo"]: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL 
            },
            [combinedId+".date"]: serverTimestamp()
          })

          await updateDoc(doc(db, "userChats", user.uid), {
            [combinedId+".userInfo"]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL 
            },
            [combinedId+".date"]: serverTimestamp()
          })
        } 

        dispatch({type: "CHANGE_USER", payload: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL 

        }});
      }catch(e) {}
    }

    setUser(null);
    setUsername("");
  }

  return (
    <div className='search'>
        <div className="searchForm">
            <input 
              type="text" 
              placeholder='Find a user' 
              onChange={e => setUsername(e.target.value.toLowerCase())} 
              onKeyDown={handleKey} 
              value={username}
            />
        </div>
        {err && <span>User not Found</span> }
        {
          user && <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
              <span>{user.displayName}</span>
          </div>
      </div>
        }
    </div>
  )
}

export default Search