import './App.css';
import Navbar from './components/Navbar';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Services from './components/pages/Services';
import Playground from './components/pages/Playground';
import SignUp from './components/pages/SignUp';
import Protected from './components/pages/Protected';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
         <Route path='/dashboard' element={<Home />}/>
         <Route path='/dashboard/services' element={<Services />}/>
         <Route path='/dashboard/playground' element={<Playground />}/>
         <Route path='/dashboard/sign-up' element={<SignUp />}/>
         <Route path='/dashboard/protected' element={<Protected />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
