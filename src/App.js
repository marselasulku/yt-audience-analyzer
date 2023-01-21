import './css/App.css';
import { useEffect, useState } from 'react';
import loadGAPIScript from './utils/loadGapiScript';
import loadGSIScript from './utils/loadGSIScript';
import GoogleSignInButton from './components/GoogleSignInButton';
import getStats from './utils/getStats';
import ResultsTable from './components/ResultsTable';

function App() {  
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);


  /* handles valid sign in */ 
  const signInCallback = async (response) => {
    setIsSignedIn(true);
    /* TODO: what if sign in fails?? what if they dont have a YT channel */
  };


  const fetchYTStats = async () => {
    setLoading(true);

    /* TODO: add ui options for stats */
    const data = await getStats({});

    setResults(data);
    setLoading(false);
  }

  return (
    <div className="App">
      { !isSignedIn ? 
        <div>
          <div> Sign in to get your stats! </div>
          <GoogleSignInButton signInCallback={signInCallback} />
        </div> :
        null
      }


      { isSignedIn && !results ? 
        <div> 
          Signed In Flow
          <button onClick={fetchYTStats}> Fetch YT Stats </button>
        </div> : 
        null
      } 


      {
        loading ? 
        <div> Loading.... </div> :
        null
      }

      {
        results ? 
        <div> Showing some results
          <ResultsTable data={results} />  
        </div> :
        null
      }

    </div> 
  );
}

export default App;
