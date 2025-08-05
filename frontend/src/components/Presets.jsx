import React, { useContext, useState } from "react";
import { presetList } from "./presetList";
import { SongContext } from "../context/SongContext";
import setupAudioFilters from "./useAudioFilter";

const Presets = () => {
  const [current, setCurrent] = useState(-1);
  const {
    frequencies,
    setFrequencies,
    setGains,
    audioContext,
    sourceRef,
    analyser,
    audioRef,
    filtersRef,
  } = useContext(SongContext);

  const [originalFreq, setOriginalFreq] = useState(frequencies); // Backup for reset

  const handlePresetClick = async (preset, index) => {
    const newFreq = [...preset.frequencies];
    const newGains = newFreq.map(() => 0);

    setCurrent(index);
    setFrequencies(newFreq);
    setGains(newGains);

    if (sourceRef.current && filtersRef.current) {
      // Disconnect old filters
      filtersRef.current.forEach((filter) => filter.disconnect());

      // Create new filters with new frequencies
      filtersRef.current = await setupAudioFilters(
        audioContext,
        sourceRef.current,
        analyser.current,
        newFreq
      );

      filtersRef.current.forEach((filter) => (filter.gain.value = 0));

      // Final connection
      analyser.current.connect(audioContext.destination);
    }
  };

  const handleReset = async () => {
    const resetFreq = [...originalFreq];
    const resetGains = resetFreq.map(() => 0);

    setCurrent(-1);
    setFrequencies(resetFreq);
    setGains(resetGains);

    if (sourceRef.current && filtersRef.current) {
      // Disconnect all existing filters
      filtersRef.current.forEach((filter) => filter.disconnect());

      // Recreate filters based on resetFreq
      filtersRef.current = await setupAudioFilters(
        audioContext,
        sourceRef.current,
        analyser.current,
        resetFreq
      );

      filtersRef.current.forEach((filter) => (filter.gain.value = 0));

      // Final connection
      analyser.current.connect(audioContext.destination);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h2 className="text-2xl text-amber-500">Presets</h2>

      {presetList.map((preset, index) => (
        <div
          key={index}
          onClick={() => handlePresetClick(preset, index)}
          className={`px-1 py-1 w-30 cursor-pointer rounded-sm text-center transition-colors ${
            current === index ? "bg-amber-400" : "bg-white hover:bg-amber-400"
          }`}
        >
          {preset.name}
        </div>
      ))}

      <div
        onClick={handleReset}
        className="bg-white px-1 py-1 w-30 cursor-pointer rounded-sm text-center hover:bg-amber-400"
      >
        Reset
      </div>
    </div>
  );
};

export default Presets;
