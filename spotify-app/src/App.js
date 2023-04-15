import { useState } from "react";
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AuthAgent from "./components/AuthAgent";
import Search from './components/Search';
import Player from './components/Player';
import {FiLogOut} from 'react-icons/fi';


import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const code = new URLSearchParams(window.location.search).get('code');

function App() {

  const [playingTrack, setPlayingTrack] = useState();

  const chooseTrack = (track) =>{
    setPlayingTrack(track);
    console.log(playingTrack);
  }

  let accessToken = '';
  
  const Logout = (e)=>{
    e.preventDefault();
    localStorage.removeItem('code');
    console.log(localStorage.getItem('code'));
    window.location.reload();
  };


  if(code) {
    localStorage.setItem('code', code);
  }

  if(localStorage.getItem('code')){
    accessToken = AuthAgent(localStorage.getItem('code'));
  }

  

  return (
    (localStorage.getItem('code')) ? 
      <div className="App container">
      <Router>
        <nav className="navbar navbar-expand-lg bg-dark text-white border border-5 border-success mb-2">
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
                    <Link className="nav-link text-white fs-4 text-wrap" to="/Dashboard"> Dashboard </Link>
                </li>
                <li className="nav-item active">
                  <Link className="nav-link text-white fs-4 text-wrap" to="/Search"> Search </Link>
                </li>
                <li className="nav-item active">
                  <Link className="nav-link text-white fs-4 text-wrap" to="/About"> About </Link>
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
        <nav class="navbar fixed-bottom bg-dark border-top border-3 border-success">
            <Player accessToken={accessToken} trackUri={playingTrack?.uri}/>
        </nav>

        <Routes>

          <Route
            path="/Search"
            element={<Search accessToken={accessToken} ChooseTrack = {chooseTrack}></Search>}
          />

          <Route
            path="/Dashboard"
            element={<Dashboard accessToken={accessToken}></Dashboard>}
          />

        </Routes>
      </Router>
    </div>
    
    : <Login></Login>
  );
}

export default App;
