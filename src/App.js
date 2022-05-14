import './App.css';
import Sidebar from './Main/Sidebar';
import Chat from './Main/Chat';
import Login from './Login/Login';
import Register from './Register/Register';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {UserContext} from './UserContext'
import EmptyChat from './Main/EmptyChat'

function App() {

    // create the element user to hold the current user
    const [user,setUser] = useState(null);
    
    return (
      // wrap all app with the provider to use the Context
      <UserContext.Provider value={{user, setUser}}>
      <div className="App">
        <Router>
        {!user ? (
          <Routes>
            <Route path="*" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        ) : (
        <div className="App-body"> 
          <Routes>
            <Route path="/rooms/:roomId" element={[<Sidebar />, <Chat />]} />
            <Route path="*" element={[<Sidebar />, <EmptyChat />]} />
          </Routes>
        </div>
        )}
        </Router>
      </div>
      </UserContext.Provider>
    );
  }
  
  export default App;
