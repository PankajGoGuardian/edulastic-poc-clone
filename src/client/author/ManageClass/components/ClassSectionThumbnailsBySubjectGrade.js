import { thumbnailData } from '../constants'
import AppConfig from '../../../../app-config'

const cdnURL = `${AppConfig.cdnURI}/images/classThumbnails/`
export const getThumbnail = () => {
  if (!cdnURL) return 'https://fakeimg.pl/1000x500/'
  let randomThumbnail
  let thumbnail
  const thumbnailDataArr = thumbnailData.fileNames
  if (thumbnailDataArr.length != null) {
    randomThumbnail =
      thumbnailDataArr[Math.floor(Math.random() * thumbnailDataArr.length)]
    thumbnail = cdnURL + randomThumbnail
  }
  return thumbnail
}
