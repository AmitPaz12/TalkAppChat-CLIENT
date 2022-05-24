import React from 'react'
import './SidebarChat.css'
import defaultProfilePic from "../ProfilePics/photo6.jpg";
import ContactItem from './ContactItem';


function SidebarChat({chatsList}) {
  var contactList = [];
  console.log(chatsList);
  if(chatsList != null){
    contactList = chatsList.map((contact, key) => {
      console.log(contact.last)
      return <ContactItem id={contact.id} profilePic={defaultProfilePic} name={contact.name} lastMessage={contact.last} icon={""} time={contact.lastdate} key={key}/>
      // if (contact.lastdate !== "Active Now") {
        
      //   if(contact.messages.at(-1).content.type === 'img' ){
      //       return <ContactItem id={contact.id} profilePic={defaultProfilePic} name={contact.name} lastMessage={"image"} icon={<i class="bi bi-camera-fill"></i>} time={contact.lastdate} key={key}/>
      //     } else if(contact.messages.at(-1).content.type === 'audio' ){
      //         return <ContactItem id={contact.id} profilePic={defaultProfilePic} name={contact.name} lastMessage={"sent a voice message"} icon={<i class="bi bi-mic-fill"></i>} time={contact.lastdate} key={key}/>
      //     } else if(contact.messages.at(-1).content.type === 'video' ){
      //         return <ContactItem id={contact.id} profilePic={defaultProfilePic} name={contact.name} lastMessage={" video"} icon={<i class="bi bi-camera-reels-fill"></i>} time={contact.lastdate} key={key}/>
      //     } else if(contact.messages){
              
        
      // } else {
      //       return <ContactItem id={contact.id} profilePic={defaultProfilePic} name={contact.name} lastMessage={contact.last} icon={""} time={contact.lastdate} key={key}/>;
      // }
  });
}
  
  return(
    <div className="sidebarChat">
      {contactList}
    </div>
  )
}

export default SidebarChat
