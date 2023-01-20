const loadGSIScript = (setGSILoaded) => {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.id = 'gsi';
  document.body.appendChild(script);
  script.onload = () => {
    console.log('GSI loaded')
    setGSILoaded(true);
  };
}

module.exports = loadGSIScript;
