import React from 'react'
import { Link } from "react-router-dom";
import './ContactItem.css'
import Image from 'react-bootstrap/Image'


function ContactItem({id, profilePic, name, lastMessage, icon, time}) {
  console.log(profilePic);
  
  return (
    <Link to={`/rooms/${id}`} style={{ textDecoration: 'none' }}>
    <div className="ContactItem">
      <Image bsPrefix="img" src={profilePic} roundedCircle={true}></Image>
      <div className="ContactItem-info">
        <h1>{ name }</h1>
        <h2>{ icon } { lastMessage }</h2>
        <p>{ time }</p>
      </div>
    </div>
    </Link>
  )
}

export default ContactItem
