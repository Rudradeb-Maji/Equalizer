#!/usr/bin/env bash

# Download yt-dlp to the project root
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp

# Make it executable
chmod +x yt-dlp

curl -o cookies.txt https://www.dropbox.com/scl/fi/nrevfgfzxscfmajjvg8g3/cookies.txt?rlkey=tt2jghsjhugkcm9c6an1m8nuj&st=uksfh186&dl=0