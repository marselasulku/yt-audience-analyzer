import { useEffect, useState } from 'react';

import './App.css';

function App() {  
  const [client, setClient] = useState(null);
  function handleSignInResponse(response) {
    console.log("response ", response);
    // use access token to make requests
  };

  useEffect(() => {
    /* global google */
    const c = google.accounts.oauth2.initTokenClient({
      client_id: '88893072292-5nurm0kr7lnfcp27vm4a2ge86e6fff5p.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/youtube.readonly \
      https://www.googleapis.com/auth/yt-analytics.readonly',
      callback: handleSignInResponse,
    });

    setClient(c);
  }, []);


  return (
    <div className="App">

      { client ? 
        <button type="button" class="login-with-google-btn" onClick={() => client.requestAccessToken()}>Sign in with Google</button> :
        null 
      }
    </div> 
  );
}

export default App;
