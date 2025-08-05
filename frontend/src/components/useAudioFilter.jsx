export default function setupAudioFilters(
  audioContext,
  source,
  analyser,
  frequencies
) {
  const compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.value = -24;
  compressor.knee.value = 30;
  compressor.ratio.value = 12;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.25;
  if (source.filterNodes) {
    source.filterNodes.forEach((filter) => filter.disconnect());
  }

  const filters = frequencies.map((freq) => {
    const filter = audioContext.createBiquadFilter();
    filter.type = "peaking";
    filter.frequency.value = freq;
    filter.Q.value = 4.5;
    filter.gain.value = 0;
    return filter;
  });
  filters.reduce((prev, curr) => {
    prev.connect(curr);
    return curr;
  }, source);
  // Connect filter chain
  source.connect(filters[0]);
  for (let i = 0; i < filters.length - 1; i++) {
    filters[i].connect(filters[i + 1]);
  }

  filters[filters.length - 1].connect(compressor);
  compressor.connect(analyser);

  return filters;
}
