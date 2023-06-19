import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Navbar = () => {

  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);

  const logOut = () => {
    signOut(auth);
    dispatch({type: "REMOVE_USER"});
  }

  return (
    <div className='navbar'>
        <span className="logo">Let's Chat</span>
        <div className="user">
            <img src={currentUser.photoURL} alt="" />
            <span>{currentUser.displayName}</span>
            <button onClick={logOut}>Logout</button>
        </div>
    </div>
  )
}

export default Navbar