import { thumbnailData } from '../constants'

const cdnURL = process.env.REACT_APP_THUMBNAIL_CDN_MANAGE_CLASS
export const getThumbnail = () => {
  if (!cdnURL) return 'https://fakeimg.pl/1000x500/'
  let thumbnailDataArr
  let randomThumbnail
  let thumbnail
  thumbnailDataArr = thumbnailData.fileNames
  if (thumbnailDataArr.length != null) {
    randomThumbnail =
      thumbnailDataArr[Math.floor(Math.random() * thumbnailDataArr.length)]
    thumbnail = cdnURL + randomThumbnail
  }
  return thumbnail
}
