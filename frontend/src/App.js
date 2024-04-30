
import Content from './Components/Content/Content';
import './App.css';
import LoginForm from './Components/LoginForm/LoginForm';
import SideBar from './Components/SideBar/SideBar';
import Profile from './Components/Profile/Profile';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/Home' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div className='dashboard'>
      <SideBar />
      <div className='dashboard--content'>
        <Content />
        {/* <Profile /> */}
      </div>
    </div>
  );
}

export default App;

