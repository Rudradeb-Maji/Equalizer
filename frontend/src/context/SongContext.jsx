// src/context/SongContext.js
import React, { createContext, useRef, useState } from "react";
import axios from "axios";
// Create the context
export const SongContext = createContext();

// Context Provider component
export const SongProvider = ({ children }) => {
  const audioContext = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  ).current;
  const audioRef = useRef(null);
  const [song, setSong] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songURL, setSongURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [frequencies, setFrequencies] = useState([
    32, 64, 120, 250, 500, 1000, 2000, 4000, 8000, 16000,
  ]);
  const [gains, setGains] = useState(frequencies.map(() => 0));
  const sourceRef = useRef(null);
  const filtersRef = useRef([]);
  const analyser = useRef(audioContext.createAnalyser());
  const uploadTheSong = (file) => {
    if (file) {
      setSong(file);
      setSongURL(URL.createObjectURL(file));
      setIsPlaying(false);
    }
  };
  const getAudio = async (link) => {
    // try {
    //   setLoading(true);
    //   console.log(link);
    //   fetchVideoInfo(link);
    //   const res = await axios.post(
    //     "http://localhost:5000/api/download-and-upload",
    //     { url: link }
    //   );
    //   console.log(res.data);

    //   const { cloudinaryUrl, public_id } = res.data;
    //   setSongURL(cloudinaryUrl);
    //   setPublicId(public_id);
    //   // toast.success("Audio uploaded successfully!");
    // } catch (error) {
    //   console.error(error);
    //   // toast.error("Failed to download and upload.");
    // } finally {
    //   setLoading(false);
    // }
    fetchVideoInfo(link);
    const encodedURL = encodeURIComponent(link);
    setSongURL(`http://localhost:5000/api/audio?url=${encodedURL}`);
  };
  const fetchVideoInfo = async (link) => {
    // e.preventDefault();
    // if (!link) return toast.error("Please enter a YouTube URL.");
    // setLoading(true);

    try {
      const res = await axios.get(
        "http://localhost:5000/api/video-info?url=" + encodeURIComponent(link),
      );
console.log(res.data);

      const { title, thumbnail } = res.data;
      setSong(title);
      setThumbnail(thumbnail);
      // setInfoFetched(true);
      // toast.success("Video info fetched!");
    } catch (error) {
      console.error(error);
      // toast.error("Failed to fetch video info.");
    } finally {
      // setLoading(false);
    }
  };

  // const deleteDownload = async () => {
  //   if (!publicId) return;
  //   try {
  //     await axios.delete(
  //       `http://localhost:5000/api/delete/${encodeURIComponent(publicId)}`
  //     );
  //     // toast.success("Audio deleted from cloud");
  //     setSongURL("");
  //     setPublicId("");
  //     // setThumbnail("");
  //     setSong("");
  //     // setInfoFetched(false);
  //   } catch (err) {
  //     console.log(err);
  //     // toast.error("Failed to delete from cloud.");
  //   }
  // };
  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  return (
    <SongContext.Provider
      value={{
        song,
        songURL,
        uploadTheSong,
        frequencies,
        audioRef,
        audioContext,
        setFrequencies,
        gains,
        setGains,
        isPlaying,
        setIsPlaying,
        togglePlayback,
        sourceRef,
        filtersRef,
        analyser,
        getAudio,
        loading,
        thumbnail
      }}
    >
      {children}
    </SongContext.Provider>
  );
};
