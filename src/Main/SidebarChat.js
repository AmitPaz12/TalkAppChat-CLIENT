import React from 'react'
import './SidebarChat.css'
import ContactItem from './ContactItem';


function SidebarChat({chatsList}) {
  console.log(chatsList);
  var contactList = [];
  if(chatsList != null){
    contactList = chatsList.map((contact, key) => {
      if (Array.isArray(contact.messages) && contact.messages.at(-1)) {
        if(contact.messages.at(-1).content.type === 'img' ){
            return <ContactItem id={contact.id} profilePic={contact.profilePic} name={contact.name} lastMessage={"image"} icon={<i class="bi bi-camera-fill"></i>} time={contact.messages.at(-1).timestamp} key={key}/>
          } else if(contact.messages.at(-1).content.type === 'audio' ){
              return <ContactItem id={contact.id} profilePic={contact.profilePic} name={contact.name} lastMessage={"sent a voice message"} icon={<i class="bi bi-mic-fill"></i>} time={contact.messages.at(-1).timestamp} key={key}/>
          } else if(contact.messages.at(-1).content.type === 'video' ){
              return <ContactItem id={contact.id} profilePic={contact.profilePic} name={contact.name} lastMessage={" video"} icon={<i class="bi bi-camera-reels-fill"></i>} time={contact.messages.at(-1).timestamp} key={key}/>
          } else if(contact.messages){
              return <ContactItem id={contact.id} profilePic={contact.profilePic} name={contact.name} lastMessage={contact.messages.at(-1).content} icon={""} time={contact.messages.at(-1).timestamp} key={key}/>
        }
      } else {
            return <ContactItem id={contact.id} profilePic={contact.profilePic} name={contact.name} lastMessage={""} icon={""} time={""} key={key}/>;
      }
  });
}
  
  return(
    <div className="sidebarChat">
      {contactList}
    </div>
  )
}

export default SidebarChat
