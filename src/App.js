import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';

import { google } from 'googleapis';

import './App.css';


function App() {  
  const [user, setUser] = useState({});

  function handleSignInResponse(response) {
    console.log("response ", response)
    // let userObject = jwt_decode(response.credential);
    // console.log('user', userObject);
    // setUser(userObject);
  };

  // useEffect(() => {
  //   /* global google */ 
  //   google.accounts.id.initialize({
  //     client_id: '88893072292-5nurm0kr7lnfcp27vm4a2ge86e6fff5p.apps.googleusercontent.com',
  //     callback: handleSignInResponse
  //   });

  //   google.accounts.id.renderButton(
  //     document.getElementById("signInDiv"),
  //     { theme: "outline", size: "large" }
  //   );

  //   google.accounts.id.prompt();
  // }, [])


  useEffect(() => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      callback: handleSignInResponse,
    });
  }, []);

  return (
    <div className="App">
      <div id="signInDiv"></div>
      <button onclick="client.requestAccessToken();">Authorize me</button>
    </div>
  );
}

export default App;
