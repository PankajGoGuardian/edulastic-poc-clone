set -e

cd ~/edulastic-poc
yarn install
yarn build
#uploading assets to cloudfront/s3 cdn with different public path and directory
aws s3 rm --recursive s3://edupoc
aws s3 sync . s3://edupoc
