set -e

cd ~/edulastic-poc
yarn install --frozen-lockfile --silent --non-interactive
if [ $? -ne 0 ]
 then
  echo "Yarn install failed...exiting script"
  exit 1
fi

dir_name=build-$(date +"%d-%m-%y-%H-%M")
sed -i '/PUBLIC_URL/c\'PUBLIC_URL=https://cdnedupoc.snapwiz.net/edulasticv2-development/JS/dist/"$dir_name"'' .env
DESTINATION=~/poc_cdn_tmp yarn build
if [ $? -ne 0 ]
 then
  echo "Build failed...exiting script"
  exit 1
fi
#uploading assets to cloudfront/s3 cdn with different public path and directory
aws s3 sync ~/poc_cdn_tmp s3://edupoc/edulasticv2-development/JS/dist/$dir_name
cp ~/poc_cdn_tmp/*.html ~/poc_dist/
cp -r ~/poc_cdn_tmp/guidelines ~/poc_dist/
