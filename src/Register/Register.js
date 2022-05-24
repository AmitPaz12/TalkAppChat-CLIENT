import React, {useState, useEffect, useContext} from 'react';
import { Link } from "react-router-dom";
import "./Register.css";
import userProfilePic from "../ProfilePics/photo1.png";
import { UserContext } from '../UserContext'

function Register() {


	const [fieldData, setFieldData] = useState({userField: '', passwordField: '', verifyPasswordField: '', nicknameField: '', photoField: null});

  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  
	const {user, setUser} = useContext(UserContext);

  const handleEnter = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleSubmit();
    }
  }
  
  // handle submiting, click on Register
	const handleSubmit = async () => {
    setIsSubmit(true);
    setFieldErrors(await validate(fieldData));
	}

  	// This function handles changing of the current photo.
	const imageChange = (e) => {
		 if (e.target.files && e.target.files[0]) {
			 setFieldData({...fieldData, photoField: URL.createObjectURL(e.target.files[0])});
		 }
	}
  
  // function for handling the changed of the data when enterd the username & password
	const handleChange = (e) => {
    if (fieldErrors !== ""){
      setFieldErrors({});
      setIsSubmit(false);
    }
		const {name, value} = e.target;
		setFieldData({...fieldData, [name]: value});
	}


  async function VerifyUser() {
    let user = null;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: fieldData.userField, password: fieldData.passwordField, displayName: fieldData.nicknameField, profilePic: fieldData.photoField})
    };

  
    await fetch('https://localhost:7201/api/Users/register', requestOptions)
          .then(async response => {
            if (await response.status === 200){
              const userTokenObject = await response.json();
              const JWTtoken = userTokenObject.token;
              user = userTokenObject.user;
              console.log(user);
              localStorage.setItem("jwt_token", JWTtoken);
              console.log("return user");
            } else {
              setFieldErrors({userExists: "you are already in! click Sign in"});
            }
          })

    return user;
  }

  useEffect(() => {
    if(Object.keys(fieldErrors).length === 0 && isSubmit){
      async function fetchData(){
        const userFromDB = await VerifyUser();
        console.log(userFromDB);
        if(userFromDB == null)
          return;
          userFromDB.profilePic = userProfilePic;
          console.log("before setUser");
        setUser(userFromDB)
      }
      fetchData();
    }
  },[fieldErrors])



async function validate(values) {
  const errors = {}
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
  if (!values.userField){
    errors.userField = "Username is required!";
  }
  if (!values.passwordField){
    errors.passwordField = "Password is required!";
  } else if (!regex.test(values.passwordField)) {
    errors.passwordField = "Password must contain minimum five characters, at least one letter and one number."
  }
  if (!values.verifyPasswordField){
    errors.verifyPasswordField = "Verify password is required!";
  } else if (values.verifyPasswordField !== values.passwordField) {
    errors.verifyPasswordField = "Passwords are incompatible!"
  }

  if (!values.nicknameField){
    errors.nicknameField = "Nickname is required!";
  }
  if (!values.photoField){
    errors.photoField = "Photo is required!";
  }
  
  return errors;
}

  
  return (
    <div className="register">
      <div className="register-container">
          <h6>Sign up to talk with your friends.</h6>
          
          <div className="register-connect">
            <input placeholder="USERNAME" name="userField" onKeyPress={handleEnter} type="text" value={fieldData.userField} onChange={handleChange}/>
          </div>

        <p>{fieldErrors.userField}</p>
          
          <div className="register-connect">
            <input placeholder="PASSWORD" name="passwordField" onKeyPress={handleEnter} type="password" value={fieldData.passwordField} onChange={handleChange} />
          </div>

        <p>{fieldErrors.passwordField}</p>

        <div className="register-connect">
            <input placeholder="VERIFY-PASSWORD" name="verifyPasswordField" onKeyPress={handleEnter} type="password" value={fieldData.verifyPasswordField} onChange={handleChange} />
          </div>
        <p>{fieldErrors.verifyPasswordField}</p>
          
          <div className="register-connect">
            <input placeholder="DISPLAY NAME" name="nicknameField" onKeyPress={handleEnter} type="text" value={fieldData.nicknameField} onChange={handleChange} />
          </div>

        <p>{fieldErrors.nicknameField}</p>
          
          <div className="register-connect">
              <input placeholder="PHOTO" onKeyPress={handleEnter} type="file" name="photoField" id="photo" accept="image/*" multiple = "false" onChange={imageChange} />
          </div>
          
        <p>{fieldErrors.photoField}</p>
          
          <button onClick={handleSubmit}>Register</button>

        <h1>{fieldErrors.userExists}</h1>
        
          <div class="K-1uj hKTMS">
            <div class="s311c"></div>
            <div class="_0tv-g">OR</div>
            <div class="s311c"></div>
          </div>
          
          <div className="register-signIn">
            <h5>Have an account? </h5>
              <Link to="/login">
                <div className="link-signUp">Sign in</div>
              </Link>
          </div>
        
      </div>
    </div>
        
  )
}

export default Register
