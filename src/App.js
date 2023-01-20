import './App.css';
import { useEffect, useState } from 'react';

function App() {  
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [gapiInit, setGapiInit] = useState(false);


  // may want to move this to localstorage or cookie, same-site cookie 
  // const [accessToken, setAccessToken] = useState(null);
  

  const handleSignInResponse = async (response) => {
    console.log("response ", response);
    console.log('what in the worlds')
    console.log('fetching yt analytics', gapiLoaded, gsiLoaded, authClient);

    if (gapiLoaded && gsiLoaded && gapiInit) {
      console.log('all true');

      /* global gapi */
      const data = await gapi.client.youtubeAnalytics.reports.query({
        dimensions: "video",
        endDate: "2023-01-17",
        ids: "channel==MINE",
        maxResults: 130,
        metrics: "estimatedMinutesWatched,views,likes,subscribersGained",
        sort: "-estimatedMinutesWatched",
        startDate: "2022-12-01"
      })
      
      console.log('data', data)
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.id = 'gapi';
    document.body.appendChild(script);
    script.onload = () => {
      console.log('gapi loaded')
      setGapiLoaded(true);
    };
  }, []);


  useEffect(() => {
    const initGapiClient = async () => {
      await new Promise((resolve, reject) => {
        // NOTE: the 'auth2' module is no longer loaded.
        gapi.load('client', {callback: resolve, onerror: reject});
      });
      await gapi.client.init({
        // NOTE: OAuth2 'scope' and 'client_id' parameters have moved to initTokenClient().
      })
      .then(function() {  // Load the Calendar API discovery document.
        console.log('gapi loading youtube analytics')
        gapi.client.load('https://youtubeanalytics.googleapis.com/$discovery/rest?version=v2');
        setGapiInit(true);
      });

    };

    if (gapiLoaded) {
      console.log('initing gapi')
      initGapiClient();
    }
  }, [gapiLoaded]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.id = 'gsi';
    document.body.appendChild(script);
    script.onload = () => {
      console.log('gsi loaded')
      setGsiLoaded(true);
    };
  }, []);

  
  // init GSI client
  useEffect(() => {
    if(gsiLoaded) {
      /* global google */
      const c = google.accounts.oauth2.initTokenClient({
        client_id: '88893072292-5nurm0kr7lnfcp27vm4a2ge86e6fff5p.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/youtube.readonly \
        https://www.googleapis.com/auth/yt-analytics.readonly',
        callback: handleSignInResponse,
      });

      console.log('setting auth client', c)
      setAuthClient(c);
    }
  }, [gsiLoaded]);



  // useEffect(() => {
  //   console.log('fetching yt analytics', accessToken);
  //   if (gapiLoaded && gsiLoaded && authClient) {
  //     console.log('all true');

  //     gapi.client.youtubeAnalytics.reports.query({
  //       dimensions: "video",
  //       endDate: "2023-01-17",
  //       ids: "channel==MINE",
  //       maxResults: 130,
  //       metrics: "estimatedMinutesWatched,views,likes,subscribersGained",
  //       sort: "-estimatedMinutesWatched",
  //       startDate: "2022-12-01"
  //     }).then((res) => {
  //       console.log('youtube api returned', res.data);
  //       // Handle the results here (response.result has the parsed body).
  //       // console.log("Response", response);
  //     }, (err) => { console.error("Execute error", err); });
  //   }
    
  //   // async function fetchData () { 
  //   //   const youtubeAnalytics = ytAnalytics({ version: "v2", accessToken });
      
  //   //   console.log('fetching videos');
    
  //   //   const allVideos = await youtubeAnalytics.reports
  //   //     .query({
  //   //       dimensions: "video",
  //   //       endDate: "2023-01-17",
  //   //       ids: "channel==MINE",
  //   //       maxResults: 130,
  //   //       metrics: "estimatedMinutesWatched,views,likes,subscribersGained",
  //   //       sort: "-estimatedMinutesWatched",
  //   //       startDate: "2022-12-01"
  //   //     })
  //   //     .then(data => { return data.data; })
  //   //     .catch(error => console.log("The API returned an error: ", error.errors));
    
  //   //   console.log(`fetched ${allVideos.rows.length} videos`);
  //   //   console.log(`videos ${allVideos}`)
  //   // }

  //   // fetchData()
 
  // }, [accessToken, gapiLoaded, gsiLoaded]);


  return (
    <div className="App">
      { authClient ? 
        <button type="button" className="login-with-google-btn" onClick={() => authClient.requestAccessToken()}>Sign in with Google</button> :
        null 
      }

    </div> 
  );
}

export default App;
