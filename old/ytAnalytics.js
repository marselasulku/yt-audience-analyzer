/**
 * Sample Node.js code for youtubeAnalytics.reports.query
 * See instructions for running these code samples locally:
 * https://developers.google.com/explorer-help/code-samples#nodejs
 */

 const fs = require("fs");
 const readline = require("readline");
 const { google } = require("googleapis");

 const tempData = require('./temp');
// const { youtube } = require("googleapis/build/src/apis/youtube");
 
 const scope = ["https://www.googleapis.com/auth/youtube.readonly"];
 
//  // Load client secrets from a local file.
    //  fs.readFile("ytAnalyticsMainAccSecret.json", (err, content) => {
    //    if (err) {
    //      return console.log("Cannot load client secret file:", err);
    //    }
    
    //    // Authorize a client with credentials, then make API call.
    //    const credentials = JSON.parse(content);
    //    const { client_secret, client_id, redirect_uris } = credentials.installed;
    //    const oAuth2Client = new google.auth.OAuth2(
    //        client_id,
    //        client_secret,     
    //        redirect_uris[0]
    //    );
    
    //    const authUrl = oAuth2Client.generateAuthUrl({
    //      access_type: "offline",
    //      scope: scope
    //    });
    //    console.log("Visit this URL to authorize this app:", authUrl);
    
    //    const rl = readline.createInterface({
    //      input: process.stdin,
    //      output: process.stdout
    //    });
    //    rl.question("Enter the auth code from that URL: ", code => {
    //      rl.close();
    //      oAuth2Client.getToken(code, (err, token) => {
    //        if (err) return callApi(err);
    //        oAuth2Client.setCredentials(token);
    //        callApi(oAuth2Client);
    //      });
    //    });
    //  });
 
//  /**
//   * Define and execute the API request.
//   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//   */
 var callApi = async (auth) => {
   const youtubeAnalytics = google.youtubeAnalytics({ version: "v2", auth });
   const youtube = google.youtube('v3');

  
  console.log('fetching videos');

  const allVideos = await youtubeAnalytics.reports
   .query({
     dimensions: "video",
     endDate: "2022-12-01",
     ids: "channel==MINE",
     maxResults: 130,
     metrics: "estimatedMinutesWatched,views,likes,subscribersGained",
     sort: "-estimatedMinutesWatched",
     startDate: "2020-01-01"
   })
   .then(data => { return data.data; })
   .catch(error => console.log("The API returned an error: ", error.errors));

  console.log(`fetched ${allVideos.rows.length} videos`);

  const videos = tempData;

  
  // const videos = {}; 

  // for (var i = 0; i < allVideos.rows.length; i++) {
  //   videos[allVideos.rows[i][0]] = { 
  //     videoId: allVideos.rows[i][0],
  //     estimatedMinutesWatched: allVideos.rows[i][1],
  //     views: allVideos.rows[i][2],
  //     subscribersGained: allVideos.rows[i][4],
  //   }
  // }
  
  // console.log('fetching gender and geo data'); 

  // for(const vidId of Object.keys(videos)) {
  //   // gender breakdown 
  //   console.log(`fetching gender and geo data for id ${vidId}`); 

  //   const fetchGender = youtubeAnalytics.reports
  //     .query({
  //       dimensions: "gender",
  //       endDate: "2022-12-14", 
  //       filters: `video==${vidId}`,
  //       ids: "channel==MINE",
  //       metrics: "viewerPercentage",
  //       sort: "gender",
  //       startDate: "2020-01-01"
  //     })
  //     .then(data => {
  //       const rows = data.data.rows; 

  //       for (const row of rows) {
  //         videos[vidId][row[0]] = row[1];
  //       }
  //     })
  //     .catch(error => console.log("Error in fetching gender: ", error.errors));


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



  for(const vidId of Object.keys(videos)) {
    // gender breakdown 
    console.log(`fetching title and posted date for vidid ${vidId}`); 

    await youtube.videos.list({
      auth: auth,
      part: 'snippet',
      id: [ vidId ]
    }, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }

      var vids = response.data.items;
      if (vids.length == 0) {
        console.log('No videos found.');
      } else {
        videos[vidId].title = vids[0].snippet.title;
        videos[vidId].publishedAt = vids[0].snippet.publishedAt;
      }
    });
    
    console.log(`done fetching title and posted date for id ${vidId}`); 

    console.log('waiting 30s');
    await new Promise(resolve => setTimeout(resolve, 15000))
    console.log('done');
  }

  fs.writeFile('analytics2.json', JSON.stringify(videos, null, 2), (error) => {
    if (error) throw error;
  });

};



// var transformData = () => {
//   const newData = Object.values(tempData);
  
//   fs.writeFile('analytics3.json', JSON.stringify(newData, null, 2), (error) => {
//     if (error) throw error;
//   });
// }

// transformData();