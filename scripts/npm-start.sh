
set -e
cd ~/edulastic-poc
pm2 stop server.js
pm2 start server.js
