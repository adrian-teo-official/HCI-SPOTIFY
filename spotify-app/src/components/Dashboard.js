import { React, useState, useEffect } from "react";
import AuthAgent from "./AuthAgent";
import Search from "./Search";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const Dashboard = ({ code }) => {
  const accessToken = AuthAgent(code);

  return (
    <div className="App container">
      <Router>
        <nav className="navbar navbar-expand-lg navbar bg-dark text-white border border-success-subtle mb-2">
          <Link className="navbar-brand" to="/">
            HCI Spotify
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="nav-item active">
              <Link className="nav-link " to="/Search">
                Search
              </Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route
            path="/Search"
            element={<Search accessToken={accessToken}></Search>}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default Dashboard;
