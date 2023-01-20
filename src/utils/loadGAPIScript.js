const loadGAPIScript = (setGAPILoaded) => {
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js';
  script.id = 'gapi';
  document.body.appendChild(script);
  script.onload = () => {
    console.log('GAPI loaded')
    setGAPILoaded(true);
  };
}

module.exports = loadGAPIScript;
