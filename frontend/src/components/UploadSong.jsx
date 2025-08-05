import React, { useContext, useRef, useState } from "react";
import { SongContext } from "../context/SongContext";

const UploadSong = () => {
  const [ytLink, setYtLink] = useState("");
  const uploadRef = useRef(null);
  const { uploadTheSong, getAudio ,thumbnail} = useContext(SongContext);

  const handleSongUpload = (e) => {
    const file = e.target.files[0];
    uploadTheSong(file);
  };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* <div
        className="bg-white rounded-sm py-1 px-3 text-center cursor-pointer hover:bg-gray-300 transition duration-300 ease-in-out"
        onClick={() => uploadRef.current.click()}
      >
        <i className="ri-upload-cloud-2-fill "></i>
        <input
          ref={uploadRef}
          className="hidden"
          type="file"
          accept="audio/*"
          onChange={handleSongUpload} // ✅ handle file input
        />
      </div> */}
      <div className="space-x-2 flex items-center justify-center">
        <input
          type="text"
          value={ytLink}
          onChange={(e) => setYtLink(e.target.value)}
          placeholder="Enter youtube link"
          className="w-90 px-2 py-1 outline-0 border-1 border-amber-500 text-white shadow-sm shadow-amber-500 rounded-sm"
        />
        <button
          onClick={() => {getAudio(ytLink); setYtLink("");}}
          className="bg-white rounded-sm px-2 py-1 cursor-pointer"
        >
          Play
        </button>
      </div>
      <div className="w-60 rounded-lg relative">
        <img src={thumbnail} alt="" className="w-full object-cover rounded-lg"/>
      </div>
    </div>
  );
};

export default UploadSong;
