import React, { useState,useEffect } from "react";;


function AuthAgent( code ) {

    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [expiresIn, setExpiresIn] = useState("");


    useEffect (() => {
        console.log("In");
        // fetch('http://localhost:3001/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         code: code
        //     })
        // })
        // .then(response => response.json())
        // .then(data => console.log(data))
        // .catch(error => console.error(error)) 

        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: code })
        })
        .then(response => response.json())
        .then(data => {
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            setExpiresIn(data.expiresIn);
            console.log(data);
            window.history.pushState({},null,"/");
        })
        .catch(error => {})

    }, [code]);

    console.log(accessToken);

    return accessToken;

}

export default AuthAgent;