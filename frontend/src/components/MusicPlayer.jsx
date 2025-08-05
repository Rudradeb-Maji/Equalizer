import { useContext, useEffect, useState } from "react";
import { SongContext } from "../context/SongContext";

const MusicPlayer = () => {
  const {
    songURL,
    song,
    audioRef,
    audioContext,
    isPlaying,
    togglePlayback,
    loading,
  } = useContext(SongContext);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    }
    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, [songURL]);
  // useEffect(() => {
  //   if (!audioRef.current) return;

  //   const source = audioContext.createMediaElementSource(audioRef.current);
  //   source.connect(audioContext.destination);

  //   return () => {
  //     source.disconnect(); // Clean up
  //   };
  // }, [audioRef]);

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex justify-center flex-col items-center ">
      
      <audio
        crossOrigin="anonymous"
        src={songURL}
        ref={audioRef}
        controls
        className="w-1/2 hidden"
        onPlay={() => {
          if (audioContext.state === "suspended") {
            audioContext.resume();
          }
        }}
      >
        <source src={songURL} type="audio/mpeg" />
      </audio>
      {songURL&&!duration && (
        <div className="text-amber-500 animate-bounce">Loading...</div>
      )}
      {duration>0 && (
        <>
          <div className="flex items-center justify-center flex-col gap-3 mt-2 w-100">
            <p className="text-amber-500 tracking-tighter">{song}</p>
            <div className="flex justify-center items-center w-full flex-col">
              <div className="rounded-md border border-amber-500 h-2 w-full">
                <div
                  className={`h-full bg-white relative`}
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                >
                  <div className="text-white text-4xl absolute -top-5.5 -right-1">
                    ●
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-white w-full text-right">
                {formatTime(currentTime)}/{formatTime(duration)}
              </p>
            </div>
          </div>

          <button
            onClick={togglePlayback}
            className="bg-white px-3 py-1 cursor-pointer rounded-sm "
          >
            {isPlaying ? (
              <i className="ri-pause-large-fill font-bold "></i>
            ) : (
              <i class="ri-play-large-fill"></i>
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default MusicPlayer;
