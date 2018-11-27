set -e

cd ~/edulastic-poc
yarn install --no-lockfile --production=false
yarn build