const formatDataArr = (data) => {
  const formatted = [];
  
  for (var i = 0; i < data.rows.length; i++) {
    formatted.push({ 
      id: data.rows[i][0],
      estimatedMinutesWatched: data.rows[i][1],
      views: data.rows[i][2],
      subscribersGained: data.rows[i][4],
    });
  }

  console.log('formatDataArr return', formatted)
  return formatted;
}


const fetchVideos = async ({ startDate, endDate, maxResults }) => {
  const res = await gapi.client.youtubeAnalytics.reports.query({
    dimensions: "video",
    ids: "channel==MINE",
    maxResults,
    metrics: "estimatedMinutesWatched,views,likes,subscribersGained",
    sort: "-estimatedMinutesWatched",
    startDate,
    endDate,
  });

  const data = JSON.parse(res.body);

  return formatDataArr(data);
}


/* TODO paginate this, takes way too long */ 
const fetchGenderAndGeoData = async (videos, { startDate, endDate }) => {
  const videosWData = [];
 
  const dateBefore = Date.now();

  for(let i = 5; i < videos.length; i++) {
    const vid = videos[i];

    let genderRes = {};
    let geoRes = {};
    const vidWData = { ...vid };

    /* TODO handle error */
    try {
      genderRes = await gapi.client.youtubeAnalytics.reports.query({
        dimensions: "gender",
        filters: `video==${vid.id}`,
        ids: "channel==MINE",
        metrics: "viewerPercentage",
        sort: "gender",
        startDate,
        endDate
      });
    } catch (e) {
      console.log('Error encountered while fetching gender data', e)
      throw e; 
    }

    const genderData = JSON.parse(genderRes.body); 

    if (genderData.rows.length === 2) {
      vidWData[genderData.rows[0][0]] = genderData.rows[0][1];
      vidWData[genderData.rows[1][0]] = genderData.rows[1][1];
    } else {
      vidWData['female'] = '';
      vidWData['male'] = '';
    }

    /* TODO handle error */
    try {
      geoRes = await gapi.client.youtubeAnalytics.reports.query({
        dimensions: "country",
        filters: `video==${vid.id}`,
        ids: "channel==MINE",
        metrics: "views",
        sort: "-views",
        startDate,
        endDate
      })
    } catch (e) {
      console.log('Error encountered while fetching geo data', e)
      throw e; 
    }

    const geoData = JSON.parse(geoRes.body);
    const countries = {}; 

    for(let i = 0; i < geoData.rows.length && i < 10; i++) {
      countries[geoData.rows[i][0]] = geoData.rows[i][1];
    }
    vidWData['countries'] = countries;

    videosWData.push(vidWData)
  }

  const dateAfter = Date.now();
  console.log(`fetching geo and gender data took ${dateAfter-dateBefore} milliseconds`)

  return videosWData;

    // .then(data => {
    //   const rows = data.data.rows; 

    //   for (const row of rows) {
    //     videos[vidId][row[0]] = row[1];
    //   }
    // })
    // .catch(error => console.log("Error in fetching gender: ", error.errors));



  //   // geo breakdown
  //   const fetchGeo = youtubeAnalytics.reports
  //     .query({
  //       dimensions: "country",
  //       endDate: "2022-12-14",
  //       filters: `video==${vidId}`,
  //       ids: "channel==MINE",
  //       metrics: "views",
  //       sort: "-views",
  //       startDate: "2017-01-01"
  //     })
  //     .then(data => {
  //       const rows = data.data.rows;

  //       const countries = {}; 
  //       for(var i = 0; i < 5; i++) {
  //         countries[rows[i][0]] = ((rows[i][1] / videos[vidId].views) * 100).toFixed(1); 
  //       }
  //       videos[vidId]['countries'] = countries;
  //     })
  //     .catch(error => console.log("Error in fetching geo ", error.errors));

  //    await Promise.all([fetchGender, fetchGeo]);
  //    console.log(`done fetching gender and geo data for id ${vidId}`); 

  //   //  console.log(videos[vidId]);

  //    console.log('waiting 30s');
  //    await new Promise(resolve => setTimeout(resolve, 15000))
  //    console.log('done');
  // }
}



const getStats = async ({
  startDate = '2021-01-01',
  endDate = '2023-01-17',
  maxResults = 100,
}) => {

  console.log('calling yt api')
  /* get list of videos */

  const videos = await fetchVideos({ startDate, endDate, maxResults });
  
  const allStats = await fetchGenderAndGeoData(videos, { startDate, endDate, maxResults });

  // console.log('allStats', allStats);

  return allStats; 
}

module.exports = getStats;
