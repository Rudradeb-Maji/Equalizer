import React from "react";
import Bands from "./components/Bands";
import UploadSong from "./components/UploadSong";
import MusicPlayer from "./components/MusicPlayer";
import Presets from "./components/Presets";

const App = () => {
  return (
    <div className="bg-zinc-900 h-screen">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center space-x-8 ">
          <Bands />
          <Presets />
        </div>
        <UploadSong />
        <MusicPlayer />
      </div>
    </div>
  );
};

export default App;
