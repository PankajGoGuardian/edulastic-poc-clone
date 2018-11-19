
set -e
cd ~/edulastic-poc
pm2 stop start.js
pm2 start start.js
