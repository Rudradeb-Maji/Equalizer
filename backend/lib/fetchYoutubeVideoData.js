import axios from "axios";

export async function fetchYoutubeVideoData(videoId) {
  try {
    const playerUrl = `https://www.youtube.com/youtubei/v1/player?prettyPrint=false`;

    const payload = {
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20210721.00.00",
        },
      },
      videoId,
    };

    const headers = {
      "Content-Type": "application/json",
      "X-YouTube-Client-Name": "1",
      "X-YouTube-Client-Version": "2.20210721.00.00",
    };

    const res = await axios.post(playerUrl, payload, { headers });
    console.log(res.data.videoDetails); 
    
    if (!res.data || !res.data.videoDetails) {
      console.error("❌ No videoDetails found in YT response for", videoId);
      return null;
    }

    const videoDetails = res.data.videoDetails;

    return {
      title: videoDetails.title,
      thumbnail: videoDetails.thumbnail.thumbnails.at(-1).url,
      author: videoDetails.author,
      duration: videoDetails.lengthSeconds,
    };
  } catch (error) {
    console.error("❌ YT API Error:", error.message);
    return null;
  }
}
