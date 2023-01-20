import '../css/GoogleSignInButton.css';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import loadGAPIScript from '../utils/loadGapiScript';
import loadGSIScript from '../utils/loadGSIScript';

function GoogleSignInButton({ signInCallback }) {  
  const [GAPILoaded, setGAPILoaded] = useState(false);
  const [GSILoaded, setGSILoaded] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [GAPIInit, setGAPIInit] = useState(false);

  /* load google identity and google client apis scripts */
  useEffect(() => {
    loadGSIScript(setGSILoaded);
    loadGAPIScript(setGAPILoaded);
  }, []);

  /* init gapi and load yt analytics client library */
  useEffect(() => {
    const initGapiClient = async () => {
      await new Promise((resolve, reject) => {
        gapi.load('client', {callback: resolve, onerror: reject});
      });
      
      await gapi.client.init({})
      .then(function() { 
        console.log('loading gapi youtube analytics')
        gapi.client.load('https://youtubeanalytics.googleapis.com/$discovery/rest?version=v2');
        setGAPIInit(true);
      });
    };

    if (GAPILoaded) {
      console.log('initing gapi')
      initGapiClient();
    }
  }, [GAPILoaded]);

  
   /* init gsi client */
   useEffect(() => {
    console.log('initi GSI client');

    if(GSILoaded) {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: '88893072292-5nurm0kr7lnfcp27vm4a2ge86e6fff5p.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/youtube.readonly \
        https://www.googleapis.com/auth/yt-analytics.readonly',
        callback: signInCallback,
      });

      setAuthClient(client);
    }
  }, [GSILoaded]);

  return (
    <div className="GoogleSignInButton">
      { authClient && GAPIInit ? 
        <button type="button" className="login-with-google-btn" onClick={() => authClient.requestAccessToken()}>Sign in with Google</button> :
        null 
      }

    </div> 
  );
}

GoogleSignInButton.propTypes = {
  signInCallback: PropTypes.func.isRequired,
};

export default GoogleSignInButton;
