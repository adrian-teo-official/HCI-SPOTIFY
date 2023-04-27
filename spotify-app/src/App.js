import React, { useState, useEffect } from "react";
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AuthAgent from "./components/AuthAgent";
import Explore from './components/Explore';
import Player from './components/Player';
import ListeningHabit from "./components/ListeningHabit";
import {FiLogOut} from 'react-icons/fi';
import "./components/Navbar.css";
import Playlist from "./components/Playlist";

import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";

const code = new URLSearchParams(window.location.search).get('code');
//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


function App() {



  console.log(code);
  let accessToken = null;

  const Logout = ()=>{
    sessionStorage.removeItem('code');
    sessionStorage.removeItem('access_token');
    accessToken = null;
    window.location.reload();
  };


  if(code) {
    sessionStorage.setItem('code', code);
  }

  if(sessionStorage.getItem('code')){
    let tempCode = AuthAgent(sessionStorage.getItem('code'));
    if(tempCode)
    {
      accessToken = tempCode;
      sessionStorage.setItem('access_token', tempCode);
    }
    else{
      accessToken = sessionStorage.getItem('access_token');
    }
    console.log(accessToken);
  }

  const [playingTrack, setPlayingTrack] = useState();
  const [activeLink, setActiveLink] = useState('Home');


  const chooseTrack = (track) =>{
    setPlayingTrack(track);
    console.log(playingTrack);
  }

  

  return (
    (sessionStorage.getItem('code')) ? 
      <div className="App container">
        <Router>
          <nav className="navbar navbar-expand-lg text-white border border-3 mb-2">
            <div className="container-fluid">
              <Link className="navbar-brand text-white fs-2 fw-bold fst-italic me-3" to="/"> HCI-Spotify </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon bg-white"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav d-flex align-items-center">
                  <li className="nav-item active">
                    <Link className={`nav-link fs-4 text-wrap ${activeLink === 'Home' ? 'active-link' : 'text-white'}`} to="/" onClick={() => setActiveLink('Home')}> Home </Link>
                  </li>
                  <li className="nav-item active">
                    <Link className={`nav-link fs-4 text-wrap ${activeLink === 'Playlist' ? 'active-link' : 'text-white'}`} to="/Playlist" onClick={() => setActiveLink('Playlist')}> Playlist </Link>
                  </li>
                  <li className="nav-item active">
                    <Link className={`nav-link fs-4 text-wrap ${activeLink === 'Explore' ? 'active-link' : 'text-white'}`} to="/Explore" onClick={() => setActiveLink('Explore')}> Explore </Link>
                  </li>
                  <li className="nav-item active">
                    <Link className={`nav-link fs-4 text-wrap ${activeLink === 'Listening-Habit' ? 'active-link' : 'text-white'}`} to="/Listening-Habit" onClick={() => setActiveLink('Listening-Habit')}> Listening Habit </Link>
                  </li>
                  <li className="nav-item active">
                    <Link className={`nav-link fs-4 text-wrap ${activeLink === 'About' ? 'active-link' : 'text-white'}`} to="/About" onClick={() => setActiveLink('About')}> About </Link>
                  </li>
    
                </ul>
                <div className="nav-item active ms-auto d-flex align-items-center">
                    <button className="btn" onClick={Logout} style={{ fontSize: "30px", color: "white", marginBottom: "7px", border: "none", outline: "none", boxShadow: "none" }}> 
                    <FiLogOut />
                    </button>
                </div>
              </div>
            </div>
          </nav>
          <nav className="navbar fixed-bottom bg-white border-top border-3 border-success">
              <Player accessToken={accessToken} trackUri={playingTrack?.uri}/>
          </nav>

          <Routes>

            <Route
              path="/Playlist"
              element={<Playlist accessToken={accessToken} ChooseTrack = {chooseTrack}></Playlist>}
            />

            <Route
              path="/Listening-Habit"
              element={<ListeningHabit accessToken={accessToken} ChooseTrack = {chooseTrack}></ListeningHabit>}
            />

            <Route
              path="/Explore"
              element={<Explore accessToken={accessToken} ChooseTrack = {chooseTrack}></Explore>}
            />

            <Route
              path="/"
              element={<Dashboard accessToken={accessToken} ChooseTrack = {chooseTrack}></Dashboard>}
            />

          </Routes>
        </Router>
        
      </div>
    
    : <Login></Login>
  );
}

export default App;
