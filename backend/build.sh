#!/usr/bin/env bash

# Download yt-dlp to the project root
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp

# Make it executable
chmod +x yt-dlp

curl -o cookies.txt https://www.dropbox.com/scl/fi/vjrmxhh1807iw9dt6mz83/cookies.txt?rlkey=2sclec7ytg1g6s77pa8m4u4sn&st=cbyg9gz3&dl=0