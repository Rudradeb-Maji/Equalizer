import React, { useContext, useEffect } from "react";
import { SongContext } from "../context/SongContext";
import setupAudioFilters from "./useAudioFilter"; // Renamed to a helper function
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
const Bands = () => {
  const {
    frequencies,
    songURL,
    audioRef,
    audioContext,
    setFrequencies,
    gains,
    setGains,
    filtersRef,
    sourceRef,
    analyser,
  } = useContext(SongContext);
  // const [inputValues, setInputValues] = useState(frequencies.map(() => ""));

  // const [tempFrequency, setTempFrequency] = useState(freq);

  // Connect filters once audioRef is mounted and songURL is ready
  useEffect(() => {
    if (!audioRef.current || !songURL) return;

    if (!sourceRef.current) {
      sourceRef.current = audioContext.createMediaElementSource(
        audioRef.current
      );
      filtersRef.current = setupAudioFilters(
        audioContext,
        sourceRef.current,
        analyser.current,
        frequencies
      );

      // Final connection
      analyser.current.connect(audioContext.destination);
    }

    // Load the new audio
    audioRef.current.load();
  }, [audioRef, songURL]);

  useEffect(() => {
    if (!filtersRef.current) return;

    frequencies.forEach((freq, i) => {
      const filter = filtersRef.current[i];
      if (filter) {
        filter.frequency.value = freq;
      }
    });
  }, [frequencies]);
  const handleSliderChange = (index, value) => {
    const parsed = parseFloat(value);
    const updatedGains = [...gains];
    updatedGains[index] = parsed;
    setGains(updatedGains);
    if (filtersRef.current[index]) {
      filtersRef.current[index].gain.value = parsed;
    }
  };
  const updateFrequency = (index, value) => {
    setFrequencies((prev) => {
      const updated = [...prev];
      updated[index] = prev[index] + value;
      return updated;
    });
  };

  return (
    <div className="flex justify-center pt-5 pb-4 flex-col items-center gap-5">
      <h1 className="text-5xl ml-40 font-semibold text-amber-500">
        10 Band Equalizer
      </h1>

      <div className="flex space-x-6">
        {frequencies.map((freq, index) => (
          <div key={index} className="flex flex-col items-center group">
            {/* <div className="text-white my-2 bg-amber-500 w-10 text-center px-1 rounded-sm opacity-0 transition-all group-hover:opacity-100">
              {gains[index]}
            </div> */}
            <Stack sx={{ height: 300 }} spacing={1} direction="row">
              <Slider
                sx={{
                  color: "white",
                  "& .MuiSlider-rail": {
                    backgroundColor: "orange",
                    width: 10,
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "white",
                    width: 10,
                  },
                  "& .MuiSlider-thumb": {
                    color: "orange",
                  },
                }}
                orientation="vertical"
                // getAriaValueText={getAriaValueText}
                valueLabelDisplay="auto"
                min={-40}
                max={40}
                step={0.5}
                value={gains[index]} // Controlled by state
                onChange={(e, value) => handleSliderChange(index, value)}
              />
            </Stack>

            {/* <input
              type="range"
              className="slider h-60 w-5 cursor-pointer opacity-100"
              id={`slider-${freq}Hz`}
              min={-30}
              max={30}
              step={0.5}
              value={gains[index]}
              onChange={(e) => handleSliderChange(index, e.target.value)}
            /> */}
            <label htmlFor={`slider-${freq}Hz`} className="text-white mt-1">
              {freq}Hz
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => updateFrequency(index, 1)}
                className="w-6 bg-amber-500 text-white outline-0 rounded-md px-1 cursor-pointer"
              >
                <i class="ri-add-line"></i>
              </button>
              <button
                onClick={() => updateFrequency(index, -1)}
                className="w-6 bg-white text-black outline-0 rounded-md px-1 cursor-pointer"
              >
                <i class="ri-subtract-line"></i>
              </button>
            </div>

            {/* <input
              type="number"
              className="w-15 text-white border outline-0 rounded-md px-1"
              value={inputValues[index]}
              onChange={(e) => {
                updateFrequency(index, e.target.value);
              }}
            /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bands;
