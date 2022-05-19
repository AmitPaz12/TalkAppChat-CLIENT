import { useNavigate } from "react-router-dom"
import React, {useState, useContext, useRef, useEffect} from 'react'
import { UserContext } from '../UserContext'
import { Modal } from 'react-bootstrap'
import './Sidebar.css'
import SidebarChat from './SidebarChat'
import Image from 'react-bootstrap/Image'

function Sidebar() {

	const {user, setUser} = useContext(UserContext);
  const [addFieldError, setAddFieldError] = useState({});
  const [removeContactFieldError, setRemoveContactFieldError] = useState('');
  const [input, setInput] = useState({inputField:""});
  const [fieldData, setFieldData] = useState({idField: '', nameField: '', serverField: ''});
  const [isClosed, setIsClosed] = useState(false);
  const [addChat, setAddChat] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isRemoveContact, setIsRemoveContact] = useState(false);
  const searchBox = useRef(null);
  var [chatsList, setChatsList] = useState(null);
  var [contacts, setContacts] = useState(null);
  let navigate = useNavigate();


/**
 * Post request to server, create new contact
 */
async function postNewContact() {
  console.log("ffff");
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("jwt_token")}`},
    body: JSON.stringify({ Id: fieldData.idField, Name: fieldData.nameField, Server: fieldData.serverField})
  }

  await fetch('https://localhost:7201/api/Contacts', requestOptions)
  .then(async response => {
    console.log(response.status);
    if (response.status === 201){
      return;
    } else if (response.status === 400){
      setAddFieldError({contactExists: "You already have this contact. Please choose another"});
    }
  });
}

async function inviteNewContact() {
  let res = null;
  console.log("invite contact");
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ From: user.userName, To: fieldData.nameField, Server: fieldData.serverField})
  }

  await fetch(fieldData.serverField + '/api/Invitations', requestOptions)
  .then(async response => {
    console.log(response.status);
    if(response.status === 201){
      return "Ok";
    }
    return await response.text();
  })
  .then(text => {res = text});

  console.log(res);
  return res;
}


function checkResponse(response) {
  if(response === "Ok")
    return 1;
  if(response === "User does not exists")
    return 0;
  if(response === "Contact already exists")
    return -1;
}

/**
 * this function executes every time the client adding new chat after enter "Add"
 */
useEffect(() => {
   console.log("entered useeffect");
   if(fieldData.idField === '' && fieldData.nameField === '' && fieldData.serverField === ''){
      console.log("All fields are empty");
      return;
   }
   console.log("All fields are NOT empty");
   async function fetchData(){
    const response = await inviteNewContact();
    console.log(response);
    const res = checkResponse(response);
    if (res === 1)
      await postNewContact();
    else
      setAddFieldError({contactExists: response});
    console.log(addFieldError)
  }
  fetchData();
  handleClose();

},[addChat])



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
      setChatsList(userContacts);
      setContacts(userContacts);
      setUser(user);
}

/**
 * this function executes every time the client close the addNewChat button, after handling close.
 */
useEffect(() => {
  console.log(isClosed);
  async function fetchData(){
    await getContacts();
  }
  fetchData();
},[isClosed, isRemoveContact])

// check validation of new contact's data
const validate = (values) => {
  const errors = {}
  if(!values.idField || !values.nameField || !values.serverField){
    if (!values.idField){
      errors.idField = "This field is required!";
    }
    if (!values.nameField){
      errors.nameField = "This field is required!";
    }
    if (!values.serverField)
      errors.serverField = "This field is required!";
  }
  console.log(errors);
  return errors;
}
  
  /**
  *  this function executes every time the client client add new chat
  */
  const handleAdd = async () => {
    setAddFieldError(validate(fieldData));
    console.log(addFieldError);
    if(Object.keys(validate(fieldData)).length === 0){
      setAddChat(!addChat);
    }
  }

  // handle enter for adding a new client
  const handleEnterAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  }

  // handle enter for Opening new chat with a client
  const handleEnterRemoveContact = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      removeContact();
    }
  }

  // handle close of adding contact popup 
  const handleClose = () => {
    console.log("Entered handleClose")
    console.log(isClosed)
    console.log(addFieldError)
    if(addFieldError === {} && isClosed === false){
      
    }

    setIsClosed(!isClosed);
      setFieldData({idField: '', nameField: '', serverField: ''});
      setAddFieldError({});
  }

  // handle when client is logging out 
  const handleLogout = () => {
      setIsLogout(!isLogout);
  }

  // handle when field data of new contact changes
  const handleAddChange = (e) => {
    if ((Object.keys(addFieldError).length !== 0)){
      setAddFieldError({});
    }
    const {name,value} = e.target;
    setFieldData({...fieldData,[name]:value});
  }

  // handle openin new chat
  const handleRemoveContact = () => {
    if(removeContactFieldError === ""){
      setIsRemoveContact(!isRemoveContact);
      setRemoveContactFieldError("");
      setInput({inputField: ''});
    }
    
  }

  // handle when field data of open chat with contact changes
  const handleRemoveContactChange = (e) => {
    if (removeContactFieldError !== ""){
      setRemoveContactFieldError("");
    }
    const {name,value} = e.target;
    setInput({...input,[name]:value});
  }

  // handle log out and removing user from current user
  const Logout = () => {
    console.log("log out");
    localStorage.removeItem('jwt_token');
    setUser(null);
    navigate("../login", { replace: true });
  }

  async function removeContactFromDB(){
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`},
    }

    await fetch('https://localhost:7201/api/Contacts/' + input.inputField , requestOptions)
      .then(async response => {
        if(response.status === 404)
          return;
      })
}


  // open new chat with existed contact
  const removeContact = () => {
    const obj = checkIfExists();
    console.log(obj);
    if (input.inputField === "") {
      setRemoveContactFieldError("This field is required!");
    } else if(input.inputField !== ""){
      if (obj === null || typeof obj === "undefined" ) {
        setRemoveContactFieldError("You don't have a contact with this name. Please choose one of your contacts.");
      } else {
        // navigate("../rooms/" + obj.id, { replace: true });
        async function fetchData(){
          await removeContactFromDB();
        }
        fetchData();
        setInput({inputField: ''});
        handleRemoveContact();
      }
    }
  }

  const doSearch = function(q) {
    console.log(contacts);
    setChatsList(contacts.filter((contact) => contact.name.includes(q)));
  }

  const search = function() {
    doSearch(searchBox.current.value);
  }
  
  const checkIfExists = () => {
    console.log(chatsList);
    if(chatsList.length !== 0){
      return chatsList.find((element) => {
        return (element.name === input.inputField);
      })
    } else { return null;}
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
              <input value={fieldData.idField} onKeyPress={handleEnterAdd} onChange={handleAddChange} placeholder="Contact's display-name" name="idField" type="text" autocomplete="off"/> 
              <p>{addFieldError.idField}</p>
              <input value={fieldData.nameField} onKeyPress={handleEnterAdd} onChange={handleAddChange} placeholder="Contact's name" name="nameField" type="text" autocomplete="off"/>
              <p>{addFieldError.nameField}</p>
              <input value={fieldData.serverField} onKeyPress={handleEnterAdd} onChange={handleAddChange} placeholder="Contact's server" name="serverField" type="text" autocomplete="off"/>
              <p>{addFieldError.serverField}</p>
            </Modal.Body>
            <Modal.Footer>
            <p>{addFieldError.contactExists}</p>
              <button onClick={handleAdd} type="button" class="btn btn-outline-primary">Add</button>
              <button onClick={handleClose} type="button" class="btn btn-outline-dark">Close</button>
            </Modal.Footer>
          </Modal>
          
        <button type="button" onClick={handleRemoveContact} class="btn btn-outline-secondary btn-sm"><i class="bi bi-person-x"></i>
</button>

          <Modal show={isRemoveContact} onHide={handleRemoveContact && removeContact}>
            <Modal.Header>Are you sure you want to remove this contact?</Modal.Header>
            <Modal.Body>
              <input value={input.inputField} onKeyPress={handleEnterRemoveContact} onChange={handleRemoveContactChange} placeholder="Contact's displayName" name="inputField" type="text" autocomplete="off"/> 
              <p>{removeContactFieldError}</p>
            </Modal.Body>
            <Modal.Footer>
        
              <button onClick={removeContact} type="button" class="btn btn-outline-primary">Remove contact</button>
          
              <button onClick={handleRemoveContact} type="button" class="btn btn-outline-dark">Close</button>
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
