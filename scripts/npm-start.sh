
set -e
cd ~/edulastic-poc
pm2 stop scripts/serve.js
pm2 start scripts/serve.js
