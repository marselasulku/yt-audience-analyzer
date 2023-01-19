import './App.css';
import { useEffect, useState } from 'react';

// const ytAnalytics = require('@googleapis/youtubeanalytics')

function App() {  
  const [client, setClient] = useState(null);

  // may want to move this to localstorage or cookie, same-site cookie 
  const [accessToken, setAccessToken] = useState(null);


  function handleSignInResponse(response) {
    console.log("response ", response);
    setAccessToken(accessToken);
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

  // useEffect(() => {
    
  //   async function fetchData () { 
  //     const youtubeAnalytics = ytAnalytics({ version: "v2", accessToken });
      
  //     console.log('fetching videos');
    
  //     const allVideos = await youtubeAnalytics.reports
  //       .query({
  //         dimensions: "video",
  //         endDate: "2023-01-17",
  //         ids: "channel==MINE",
  //         maxResults: 130,
  //         metrics: "estimatedMinutesWatched,views,likes,subscribersGained",
  //         sort: "-estimatedMinutesWatched",
  //         startDate: "2022-12-01"
  //       })
  //       .then(data => { return data.data; })
  //       .catch(error => console.log("The API returned an error: ", error.errors));
    
  //     console.log(`fetched ${allVideos.rows.length} videos`);
  //     console.log(`videos ${allVideos}`)
  //   }

  //   fetchData()
 
  // }, [accessToken]);


  return (
    <div className="App">

      { client ? 
        <button type="button" className="login-with-google-btn" onClick={() => client.requestAccessToken()}>Sign in with Google</button> :
        null 
      }
    </div> 
  );
}

export default App;
