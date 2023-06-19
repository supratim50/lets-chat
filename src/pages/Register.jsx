import React, { useState } from 'react';
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import {auth, storage, db} from "../firebase";
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {

  const [err, setErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSumbit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const displayName = e.target[0].value.toLowerCase();
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log(res)
      const storageRef = ref(storage, `${displayName}-${Math.floor(Math.random() * 999999)}`);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
          (snapshot) => {const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
          setErr(true);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL
            })
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL
            })

            await setDoc(doc(db, "userChats", res.user.uid), {})
            navigate("/");
          });
        }
      );

    } catch(err) {
        setErr(true);
    } 
    
  }


  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Let's Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSumbit}>
          <input type="text" placeholder='Enter your first name' />
          <input type="email" placeholder='email' />
          <input type="password" placeholder='password' />
          <input style={{display: 'none'}} type="file" id='file' />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an Aavatar</span>
          </label>
          <button>{isLoading ? "Creating User..." : "Sign Up"}</button>
          
          {err && <span>Somthing went wrong</span> }
        </form>
        <p>You do have an account? <Link to={"/login"}>Login</Link></p>
      </div>
    </div>
  )
}

export default Register