
set -e
cd ~/edulastic-poc
pm2 restart webpack-devserver.js
pm2 restart start-server.js
