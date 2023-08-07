import './App.css';
import Navbar from './components/Navbar';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Services from './components/pages/Services';
import Chat from './components/pages/Chat';
import SignUp from './components/pages/SignUp';
import Protected from './components/pages/Protected';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
         <Route path='/dashboard' element={<Home />}/>
         <Route path='/dashboard/notes' element={<Services />}/>
         <Route path='/dashboard/chat' element={<Chat />}/>
        </Routes>
        {/* <Footer /> */}
      </Router>
    </>
  );
}

export default App;
