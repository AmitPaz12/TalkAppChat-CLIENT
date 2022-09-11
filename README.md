# TalkApp Chat - Full Stack React ASP.NET SQL chat client and server application.

TalkApp Chat is an open-source team collaboration Real-Time Ready Chat App written with React, ASP.NET, & SQL Database.

## Stage of development:
- Currently the project is in development state so far a full react client is functional
- APS.NET api and SQL DB will be added 

## Features
- Login
- Register
- Private(1-1) conversations.
- Rich Media Attachments including image, video and voice messages. 
- Read receipts
- Online Presence Indicators
- Message History
- Users & Friends List
- Search by users
- Conversations List
- User management
- Routing (React Router)
- Real-time
  
 ## Technologies
* [React](https://github.com/facebook/react)
* [React-Bootstrap](https://react-bootstrap.github.io/)
* [ASP.NET](https://dotnet.microsoft.com/en-us/apps/aspnet)
* [React Router](https://reactrouter.com/docs/en/v6)


<hr/> 

## Prerequisites

Before git is imported, ensure you have met the specified requirements:

- React `npm install react`

- React ROUTER-DOM `npm install react-router-dom`

- React ROUTE `npm install react-router`

- React Scripts `npm install react-scripts`

- React Bootstrap `npm install react-bootstrap`

- Bootstrap `npm install bootstrap`

___

## Installing TalkApp Chat 

1. Clone repository using `https://github.com/AmitPaz12/TalkAppAPI.git` `https://github.com/yuvalalroy/TalkApp-api.git`

2. Install dependencies by following requirments section.

3. Create new react app from the following repository.
___

## Running the Chat application.

```javascript
  npm start
```
___

## Screens

Login Page:
![reactLogin](https://user-images.githubusercontent.com/92422861/189529865-9f6bf7e9-ae0b-4fea-ba28-c0f1a3e5e2da.png)

Register Page:
![reactRegister](https://user-images.githubusercontent.com/92422861/189529640-3b5211e1-9d9c-4a60-aed1-c030aee8e771.png)

Main Chat:
![HelloChat](https://user-images.githubusercontent.com/92422861/189529666-0bc64b34-8e9b-4d43-8ea0-b404c638aa51.png)

---

## Components:
 ## Registration:
 Registration component will allow registration of a new user, regisration form follows the following rules:
 - username field: user name field should at least have a single letter.
 - password field: password field should follow the following regex `/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/` - meaning a password should have at least one number and letter, also should be at least at the size of eight.
 - image field - user should specify profile image.
 
 if one of the requirment wasn't met a coresponding error will be shown.
 ![image](https://user-images.githubusercontent.com/92247226/165350130-2eacfc6d-f8c8-413a-90b0-bdce64002326.png)
 
  ## Login:
  login component will allow an existing user to login and retrive existing chats.
  login form follows the folloiwing rules:
   - username field: user name field should at least have a single letter.
 - password field: password field should follow the following regex `/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/` - meaning a password should have at least one number and letter, also should be at least at the size of eight.
   if one of the requirment wasn't met a coresponding error will be shown.
![loginError](https://user-images.githubusercontent.com/92422861/189529911-4832b52c-842d-4f43-85cb-d3278a1ab5b8.png)

  ## Recording:
  recording component will show a recording pop up to chat's footer allowing the user to record and upload a voice recording

  ## Media Items:
  media items as Images and videos will be warrped inside a coresponding component allowing on click full screen view

  ## Chat Recipient:
  adding a new chat receipinct is done by a modal component allowing a user to add new receipient for incomming and out going conversations.
  ![AddNewContact](https://user-images.githubusercontent.com/92422861/189529767-9307caf4-1751-4973-9ebd-ddd6eacd7609.png)


---
