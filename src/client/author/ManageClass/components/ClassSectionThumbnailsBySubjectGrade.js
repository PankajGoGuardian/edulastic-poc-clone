import { thumbnailData } from "../constants";
const cdnURL = process.env.POI_APP_THUMBNAIL_CDN_MANAGE_CLASS;
export const getThumbnail = () => {
  let thumbnailDataArr, randomThumbnail, thumbnail;
  thumbnailDataArr = thumbnailData["fileNames"];
  if (thumbnailDataArr.length != null) {
    randomThumbnail = thumbnailDataArr[Math.floor(Math.random() * thumbnailDataArr.length)];
    thumbnail = cdnURL + randomThumbnail;
  }
  return thumbnail;
};
