import { useState, useEffect } from 'react';
import { redirect } from 'react-router-dom';

function useAuthAgent(code) {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [expiresIn, setExpiresIn] = useState('');


  useEffect(() => {
    if(sessionStorage.getItem('access_token')) return;
    async function fetchLoginData() {
      try {
        const response = await fetch('http://localhost:8888/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: code }),
        });
        const data = await response.json();
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setExpiresIn(data.expiresIn);
        window.history.pushState({}, null, '/');
      } catch (error) {
        console.error(error);
      }
    }
    if (code) {
      fetchLoginData();
    }
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) {
      return;
    }

    async function fetchRefreshToken() {
      try {
        const response = await fetch('http://localhost:8888/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: refreshToken }),
        });
        const data = await response.json();
        setAccessToken(data.accessToken);
        setExpiresIn(data.expiresIn);
        window.history.pushState({}, null, '/');
      } catch (error) {
        redirect('/');
      }
    }

    const interval = setInterval(() => {
      fetchRefreshToken();
    }, (expiresIn - 120) * 1000);

    return () => clearInterval(interval); // clearInterval makes sure the interval is cleared when the component unmounts;
  }, [refreshToken, expiresIn]);

  return accessToken;
}

export default useAuthAgent;
