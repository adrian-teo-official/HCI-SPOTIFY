import { useState } from "react";
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AuthAgent from "./components/AuthAgent";
import Search from './components/Search';
import Player from './components/Player';


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
        <nav className="navbar navbar-expand-lg bg-dark text-white border border-5 border-success mb-2 rounded">
          <div className="container-fluid">
            <Link className="navbar-brand text-white fs-2 fw-bold fst-italic" to="/"> HCI-Spotify </Link>
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
            <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
              <ul className="navbar-nav d-flex align-items-center">
                <li className="nav-item active">
                    <Link className="nav-link text-white fs-5 text-wrap" to="/Dashboard"> Dashboard </Link>
                </li>
                <li className="nav-item active">
                  <Link className="nav-link text-white fs-5 text-wrap" to="/Search"> Search </Link>
                </li>
                <li className="nav-item active">
                  <Link className="nav-link text-white fs-5 text-wrap" to="/About"> About </Link>
                </li>
                <li className="nav-item active">
                  <button className="btn btn-outline-primary" onClick={Logout}> Logout </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <nav class="navbar fixed-bottom navbar-dark bg-dark">
          
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
