import React, { useState, useContext, useEffect, useRef } from 'react'
import { UserContext } from '../UserContext'
import "./Chat.css"
import {useParams} from 'react-router-dom'
import RecordPopup from './RecordPopup';
import Image from 'react-bootstrap/Image'
import defaultProfilePic from "../ProfilePics/photo6.jpg";
// import Picker from 'emoji-picker-react'
import { Modal } from 'react-bootstrap'

function Chat() {

  const [roomName, setRoomName] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [messages, setMessages] = useState([]);
  const [stoppedRecording, setStoppedRecording] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [input, setInput]= useState({inputField: ''});
  const [showRecord, setShowRecord] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const [record, setRecord] = useState('');
  var [currentChat, setCurrentChat] = useState(null);
  // const [showEmojis, setShowEmojis] = useState(false);
  const [cursorPos, setCursorPos] = useState();
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  
  const submitRef = useRef(null);
  const fileRef = useRef(null);
  const inputRef = React.createRef();

  // create the user holder of current user
	const {user, setUser} = useContext(UserContext);
  
  // access the parameters of the current route.
  const { roomId } = useParams();

  
  // const handleShowEmojis = () => {
  //   setShowEmojis(!showEmojis);
  //   inputRef.current.focus();
  // }
  
  // const pickEmoji = (e, {emoji}) => {
  //   const ref = inputRef.current;
  //   ref.focus();
  //   const start = input.inputField.substring(0, ref.selectionStart);
  //   const end = input.inputField.substring(ref.selectionStart);
  //   const fullText = start + emoji + end;
  //   setInput({inputField: fullText});
  //   setCursorPos(start.length + emoji.length);
  // }

	const handleSubmit = () => {
    // if(showEmojis){
    //   setShowEmojis(!showEmojis);
    // }
    if(input.inputField){
      var today = new Date();
      var time = String(today.getHours()).padStart(2, "0") + ":" + String(today.getMinutes()).padStart(2, "0");
      messages.push({name: user.userName, timestamp: time, content: input.inputField, reciver: false});
      setIsSubmited(true);
      setInput({inputField: ''});
      setLastSeen("Last seen at: " + messages.at(-1).timestamp);
    }
    setUser({...user,});
	}

  
  const handleRecord = () => {
    setShowRecord(!showRecord);
  }

  
  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }

  
  const handleUploadFile = () => {
    fileRef.current.click();
  }

  
	const handleChange = (e) => {
    // setLastSeen("Typing...");
		const {name, value} = e.target;
		setInput({...input, [name]: value});
	}

  
  const fileChange = (e) => {
    if (isFileAImg(e.target.files[0].name)) {
      setInput({...input, inputField: <img src={URL.createObjectURL(e.target.files[0])} alt="image" className="image-message" id="img" controls />});
       submitRef.current.click();
      setIsUploaded(true);
    } else if(isFileAVideo(e.target.files[0].name)) {
      setInput({...input, inputField: <video src={URL.createObjectURL(e.target.files[0])} alt="video" className="video-message" id="video" controls />});
       submitRef.current.click();
      setIsUploaded(true);
    } else {
       alert("Error! Only images and videos are valid");
    }
  }
  const isFileAVideo = (fileName) => {
    var dotPos = fileName.lastIndexOf(".") + 1;
    var fileType = fileName.substr(dotPos, fileName.length).toLowerCase();
    return (fileType === "mp4" || fileType === "mvk" || fileType === "avi");
  }

  const isFileAImg = (fileName) => {
    var dotPos = fileName.lastIndexOf(".") + 1;
    var fileType = fileName.substr(dotPos, fileName.length).toLowerCase();
    return (fileType === "jpeg" || fileType === "jpg" || fileType === "png");
  }

  useEffect(() => {
    inputRef.current.selectionEnd = cursorPos;
  }, [cursorPos]);
  
  useEffect(() => {
    if(record !== "") {
      setStoppedRecording(true);
      setInput({...input, inputField: <audio src={record} controls />});
      setRecord("");
    }
  }, [record]);

  
  useEffect(() => {
    setUser({...user,});
    if ((input.inputField !== "") && (stoppedRecording)){
      submitRef.current.click();
      setStoppedRecording(false);
    }
    
    if ((input.inputField !== "") && (isUploaded)){
      submitRef.current.click();
      setIsUploaded(false);
    }
  }, [input]);

  // useEffect(() => {
  //   if ((input.inputField == "") && messages.at(-1)){
  //     setLastSeen("Last seen at: " + messages.at(-1).timestamp);
  //   }
  // }, [input]);

  async function getContacts(){
    let userContacts = [];
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`},
    }

    await fetch('https://localhost:7201/api/Contacts', requestOptions)
      .then(async response => await response.json())
      .then(responseJson => {userContacts = responseJson})
      .catch((error) => {userContacts = []});

      console.log(userContacts);
      // setChatsList(userContacts);
      setUser(user);
}

async function getContactInfo(){
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`},
  }

  console.log(roomId);
  await fetch('https://localhost:7201/api/Contacts/' + roomId , requestOptions)
    .then(async response => setCurrentChat(await response.json()))
    .catch((error) => {setCurrentChat(null)});
}

useEffect(() => {
  if(currentChat){
    if(currentChat.messages && currentChat.messages.at(-1)){
      setRoomName(currentChat.name);
      setLastSeen("Last seen at: " + currentChat.messages.at(-1).timestamp);
      setMessages(currentChat.messages);
      setProfilePic(defaultProfilePic);
      setInput({inputField: ''});
    } else {
      setRoomName(currentChat.name);
      setLastSeen("Active now");
      setMessages([]);
      setProfilePic(defaultProfilePic);
      setInput({inputField: ''});
    }
  }
}, [currentChat])
  
  useEffect(() => {
    async function fetchData(){
      await getContactInfo();
    }
    fetchData();

		if(currentChat){
      if(currentChat.messages && currentChat.messages.at(-1)){
        setRoomName(currentChat.name);
        setLastSeen("Last seen at: " + currentChat.messages.at(-1).timestamp);
        setMessages(currentChat.messages);
        setProfilePic(defaultProfilePic);
        setInput({inputField: ''});
      } else {
        setRoomName(currentChat.name);
        setLastSeen("Active now");
        setMessages([]);
        setProfilePic(defaultProfilePic);
        setInput({inputField: ''});
      }
		}
  }, [roomId])


  var scroll = false;
  
  window.addEventListener("scroll", function(){
    var s = window.pageYOffset || document.documentElement.scrollTop;
    scroll = true;
  }, false);
  
  function scrollToEnd() {
    if (!scroll){
      const chatBody = document.getElementById("chat-body");
      if (chatBody !== "") {
        scroll = true;
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }
  }
  
  setInterval(scrollToEnd, 30);

  const handleOpenInfo = () => {
    setIsOpenInfo(!isOpenInfo);
  }

  return (
    <div className="chat">
      
      <div className="chat-header">
        <Image bsPrefix="img" src={profilePic} roundedCircle={true}></Image>
        <div className="chat-header-info">
          <h2>{roomName}</h2>
          <p>{lastSeen}</p>
        </div>

        <div className="chat-header-right">
          <input type='file' id='file' ref={fileRef} onChange={fileChange} style={{ display: 'none' }} accept="image/* video/*" multiple="false" />
          <button type="button" onClick={handleUploadFile} class="btn btn-outline-secondary btn-sm"><i class="bi bi-paperclip"></i></button>
          <button type="button" onClick={handleOpenInfo} class="btn btn-outline-secondary btn-sm"><i class="bi bi-three-dots-vertical"></i></button>
        <Modal size="sm" show={isOpenInfo} onHide={handleOpenInfo}>
          <div class="modal-header">
            <button type="button" onClick={handleOpenInfo} class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
            <div className="modal-body-dots">
            <h4>{roomName}'s Info</h4>
            <Image bsPrefix="img" src={profilePic} roundedCircle={true}></Image>
            <p>{lastSeen}</p>
            </div>
        </Modal>

        </div>
      </div>

      <div className="chat-body" id="chat-body">
        
        {messages ? (messages.map((message) => (
          <p className={`chat-message ${(message.name === user.userName) && "chat-reciever"}`}>{message.content}
            <span className="chat-timestamp">{message.timestamp}</span>
          </p>
        ))) : ""}
      </div>

      <div className="chat-footer"> {!showRecord ? (<>
        <button type="button" class="btn btn-outline-secondary btn-sm"><i class="bi bi-emoji-smile-upside-down"></i>
        </button>
          
        <form>
          <input value={input.inputField} onChange={handleChange} onKeyPress={handleEnter} ref={inputRef} placeholder="Type a message" name="inputField" type="text" autocomplete="off" />
          <button type="button" onClick={handleSubmit} ref={submitRef} class="btn btn-outline-secondary btn-sm"><i class="bi bi-cursor-fill"></i></button>
        </form>
        
        <button type="button" onClick={handleRecord} class="btn btn-outline-secondary btn-sm"><i class="bi bi-mic-fill"></i></button> </>) :
        (<div className="recordPopup"><RecordPopup setRecord={setRecord} setRecordMenu={setShowRecord} /> </div> )}
      </div>
    </div>
  )
}

export default Chat
