set -e

cd ~/edulastic-poc
yarn install --frozen-lockfile --silent --non-interactive --ignore-optional

if [ $? -ne 0 ]
 then
  echo "Yarn install failed...exiting script"
  exit 1
fi
yarn format
if [[ -z "${SKIP_PRETTIER_CHECK}" ]]; then
  yarn run prettier:check

  if [ $? -ne 0 ]
  then
    echo "Prettier check failed...exiting script"
    exit 1
  fi
fi

export NODE_OPTIONS=--max_old_space_size=8096

dir_name=build-$(date +"%d-%m-%y-%H-%M")
sed -i '/PUBLIC_URL/c\'PUBLIC_URL=https://cdnedupoc.snapwiz.net/JS/edulasticv2-development/dist/"$dir_name"'' .env
yarn build
if [ $? -ne 0 ]
 then
  echo "Build failed...exiting script"
  exit 1
fi
#uploading assets to cloudfront/s3 cdn with different public path and directory
aws s3 sync ~/edulastic-poc/build s3://edupoc/JS/edulasticv2-development/dist/$dir_name --cache-control public,max-age=604800,immutable --delete
cp -r ~/edulastic-poc/build/* ~/poc_dist/
