import { useNavigate } from "react-router-dom"
import defaultProfilePic from "../ProfilePics/photo6.jpg";
import React, {useState, useContext, useRef, useEffect} from 'react'
import { UserContext } from '../UserContext'
import { Modal } from 'react-bootstrap'
import './Sidebar.css'
import SidebarChat from './SidebarChat'
import Image from 'react-bootstrap/Image'

function Sidebar() {

	const {user, setUser} = useContext(UserContext);
  const [addFieldError, setAddFieldError] = useState('');
  const [openChatFieldError, setOpenChatFieldError] = useState('');
  const [input, setInput] = useState({inputField:""});
  const [isClosed, setIsClosed] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isOpenChat, setIsOpenChat] = useState(false);
  var [chatsList, setChatsList] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    async function fetchData(){
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`},
      }
      let response = await fetch('https://localhost:7201/api/Contacts', requestOptions);
      let userContacts = response.json();
      if (userContacts != null){
        setChatsList(userContacts);
        setUser({...user, contacts:[...chatsList,]});
        console.log(chatsList);
      }
    }
    fetchData();
  })

  
  const doSearch = function(q) {
    setChatsList(user.contacts.filter((contact) => contact.name.includes(q)));
  }

  const search = function() {
    doSearch(searchBox.current.value);
  }
  
  const searchBox = useRef(null);

  const checkIfExists = () => {
    return user.contacts.find((element) => {
			return (element.name === input.inputField);
    });
  }
  
  const handleAdd = () => {
    if (input.inputField === "") {
      setAddFieldError("This field is required!");
    } else if(input.inputField !== ""){
      if (checkIfExists()) {
        setAddFieldError("You already have a contact with this name. Please choose another name");
      } else {
        var obj = {id: chatsList.length +1, name: input.inputField, profilePic: defaultProfilePic, lastSeen: "", messages: []};
        chatsList.unshift(obj);
        setChatsList([...chatsList,])
        setUser({...user, contacts:[...chatsList,]});
        setInput({inputField: ''});
        handleClose();
      }
    }
  }

  const handleEnterAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  }

  const handleEnterOpenChat = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      openChat();
    }
  }

  const handleClose = () => {
      setIsClosed(!isClosed);
  }

  const handleLogout = () => {
      setIsLogout(!isLogout);
  }

  const handleAddChange = (e) => {
    if (addFieldError !== ""){
      setAddFieldError("");
    }
    const {name,value} = e.target;
    setInput({...input,[name]:value});
  }

  const Logout = () => {
    localStorage.removeItem('jwt_token');
    navigate("../login", { replace: true });
    setUser(null);
  }

  const openChat = () => {
    const obj = user.contacts.find((element) => {
			 return (element.name === input.inputField)
    });
    if (input.inputField === "") {
      setOpenChatFieldError("This field is required!");
    } else if(input.inputField !== ""){
      if (!checkIfExists()) {
        setOpenChatFieldError("You don't have a contact with this name. Please choose one of your contacts.");
      } else {
        navigate("../rooms/" + obj.id, { replace: true });
        setInput({inputField: ''});
        handleOpenChat();
      }
    }
  }

  const handleOpenChat = () => {
    setIsOpenChat(!isOpenChat);
  }
  
  const handleOpenChatChange = (e) => {
    if (openChatFieldError !== ""){
      setOpenChatFieldError("");
    }
    const {name,value} = e.target;
    setInput({...input,[name]:value});
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Image bsPrefix="img" src={user.profilePic} roundedCircle={true}></Image>
        <div className="user-name"><h6>{ user.displayName }</h6></div>
        <div className="sidebar-headerRight">
          
        <button onClick={handleClose} type="button" class="btn btn-outline-secondary btn-sm"><i class="bi bi-person-plus-fill"></i></button>
          
          <Modal show={isClosed} onHide={handleClose && handleAdd}>
            <Modal.Header>Add new Contact</Modal.Header>
            <Modal.Body>
              <input value={input.inputField} onKeyPress={handleEnterAdd} onChange={handleAddChange} placeholder="Contact's nickname" name="inputField" type="text" autocomplete="off"/> 
              <p>{addFieldError}</p>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={handleAdd} type="button" class="btn btn-outline-primary">Add</button>
              <button onClick={handleClose} type="button" class="btn btn-outline-dark">Close</button>
            </Modal.Footer>
          </Modal>
          
        <button type="button" onClick={handleOpenChat} class="btn btn-outline-secondary btn-sm"><i class="bi bi-chat-left-dots"></i></button>

          
          <Modal show={isOpenChat} onHide={handleOpenChat && openChat}>
            <Modal.Header>Open chat with one of your Contacts</Modal.Header>
            <Modal.Body>
              <input value={input.inputField} onKeyPress={handleEnterOpenChat} onChange={handleOpenChatChange} placeholder="Contact's nickname" name="inputField" type="text" autocomplete="off"/> 
              <p>{openChatFieldError}</p>
            </Modal.Body>
            <Modal.Footer>
        
              <button onClick={openChat} type="button" class="btn btn-outline-primary">Open Chat</button>
          
              <button onClick={handleOpenChat} type="button" class="btn btn-outline-dark">Close</button>
            </Modal.Footer>
          </Modal>
          
        <button type="button" onClick={handleLogout} class="btn btn-outline-secondary btn-sm"><i class="bi bi-x-octagon-fill"></i></button>
          
          <Modal show={isLogout} onHide={handleLogout && Logout}>
            <div class="modal-header">
              <h5>Are you sure you want to Log-out?</h5>
              <button type="button" onClick={handleLogout} class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <Modal.Body>
              <button onClick={Logout} type="button" class="btn btn-outline-danger">Log me out</button>
            </Modal.Body>
          </Modal>
          
        </div>
      </div>
      

      <div className="sidebar-search">

          <div className="sidebar-searchContainer">
              <i class="bi bi-search"></i>
              <input ref={searchBox} onKeyUp={search} placeholder="Search or start new chat" type="text" autocomplete="off"/>
          </div>

      </div>
      
      <div className="sidebar-chats">
        <SidebarChat chatsList={chatsList} />
      </div>
    </div>
  )
}

export default Sidebar
