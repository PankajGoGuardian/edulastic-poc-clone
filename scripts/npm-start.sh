set -e
cd ~/edulastic-poc
pm2 restart start-server.js

cd /home/ec2-user/scripts
./testing_edulastic-poc.sh