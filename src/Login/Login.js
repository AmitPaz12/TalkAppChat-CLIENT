import React, {useState, useEffect, useContext} from 'react';
import "./Login.css";
import { Link } from "react-router-dom";
import defaultProfilePic from "../ProfilePics/photo6.jpg";
import { UserContext } from '../UserContext'

function Login() {
	
  // will hold the data of the user
	const [fieldData, setFieldData] = useState({userField: '', passwordField: ''});

  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  
  // create the uset holder
	const {user, setUser} = useContext(UserContext);


  async function VerifyUser() {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: fieldData.userField, password: fieldData.passwordField })
    };
    await fetch('https://localhost:7201/api/Users/login', requestOptions)
    .then(async response => {
      if(response.status === 200){
        const userTokenObject = await response.json();
        const JWTtoken = userTokenObject.token;
        const user = userTokenObject.user;
        localStorage.setItem("jwt_token", JWTtoken);
        console.log(user);
        user.profilePic = defaultProfilePic;
        setUser(user);
        return "Ok";
      }
      return response.text();
    })
    .then(text => {
      if(text === "Wrong password")
      setFieldErrors({wrongPassword: "Sorry, your password was incorrect. Please double-check your password."});
    if(text === "User does not exists")
      setFieldErrors({wrongUserName: "Username or password is wrong! Try again"});
    });
  }


  // function for handling the changed of the data when enterd the username & password
	const handleChange = (e) => {
    if (fieldErrors !== {}){
      setFieldErrors({});
      setIsSubmit(false);
    }
		const {name, value} = e.target;
		setFieldData({...fieldData, [name]: value});
	}

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }
  
  // handle submiting, click on Login
	const handleSubmit = () => {
    setFieldErrors(validate(fieldData));
    setIsSubmit(true);
	}

  // login useeffect.
  useEffect(() => {
    if(Object.keys(fieldErrors).length === 0 && isSubmit){
      async function fetchData(){
        await VerifyUser();
      }
      fetchData();
    }
  },[fieldErrors])
  
  const validate = (values) => {
    const errors = {}
    if(!values.userField || !values.passwordField){
      if (!values.userField){
        errors.userField = "Username is required!";
      }
      if (!values.passwordField){
        errors.passwordField = "Password is required!";
      }
    }
    return errors;
  }

  return (
    <div className="login">
      <div className="login-container">
        <img src="https://zeevector.com/wp-content/uploads/pink-whatsapp-icon_png__Zeevector.com_.png" alt=""/>
        <div className="login-text">
            <h1>Welcome to TalkApp</h1>
        </div>
        
        <div className="login-connect">
            <input placeholder="USERNAME" onKeyPress={handleEnter} name="userField" type="text" value={fieldData.userField} onChange={handleChange}/>
      </div>
        
      <p>{fieldErrors.userField}</p>
        
      <div className="login-connect">
        <input placeholder="PASSWORD" onKeyPress={handleEnter} name="passwordField" type="password" value={fieldData.passwordField} onChange={handleChange} />
      </div>
        
      <p>{fieldErrors.passwordField}</p>
      <h1>{fieldErrors.wrongPassword}</h1>
      <h1>{fieldErrors.wrongUserName}</h1>
        
        <button onClick={handleSubmit}> Login </button>
        <div class="K-1uj hKTMS">
          <div class="s311c"></div>
          <div class="_0tv-g">OR</div>
          <div class="s311c"></div>
        </div>
        
        <div className="login-signUp">
            <h5>Don't have an account? </h5>
            <Link to="/register">
              <div className="link-signUp">Sign up</div>
            </Link>
        </div>
      </div>
      
    </div>
  )
}

export default Login
