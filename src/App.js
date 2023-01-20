import './css/App.css';
import { useEffect, useState } from 'react';
import loadGAPIScript from './utils/loadGapiScript';
import loadGSIScript from './utils/loadGSIScript';
import GoogleSignInButton from './components/GoogleSignInButton';

function App() {  
  const [isSignedIn, setIsSignedIn] = useState(false);


  /* handles valid sign in */ 
  const signInCallback = async (response) => {
    // console.log("response ", response);

    setIsSignedIn(true);

    console.log('calling yt api');

    const data = await gapi.client.youtubeAnalytics.reports.query({
      dimensions: "video",
      endDate: "2023-01-17",
      ids: "channel==MINE",
      maxResults: 130,
      metrics: "estimatedMinutesWatched,views,likes,subscribersGained",
      sort: "-estimatedMinutesWatched",
      startDate: "2022-12-01"
    })
    
    // console.log('data', data)
  };

  return (
    <div className="App">
      <GoogleSignInButton signInCallback={signInCallback} />
    </div> 
  );
}

export default App;
