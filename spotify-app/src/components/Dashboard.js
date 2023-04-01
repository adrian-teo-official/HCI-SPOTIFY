import React from "react";
import AuthAgent from "./AuthAgent";

const Dashboard = ({ code }) => {

    const accessToken = AuthAgent(code);
    return (
        <div> {code} </div>
    );
};

export default Dashboard;