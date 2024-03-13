import { parseISO8601Duration } from '../AssessmentCreate/components/CreateVideoQuiz/utils'
import { formateSecondsToMMSS } from '../AssessmentPage/VideoQuiz/utils/videoPreviewHelpers'
import { getTestAuthorName } from '../dataUtils'

export const mapListDataFromVideoList = (videoList = []) => {
  return videoList.map(({ videoDetails = {} }) => {
    const { id = '', contentDetails = {}, snippet = {} } = videoDetails
    const { title = '', thumbnails = {}, channelTitle = '' } = snippet
    const { medium: { url = '' } = {} } = thumbnails
    const { duration = '' } = contentDetails

    return {
      id,
      duration: parseISO8601Duration(duration),
      title,
      subTitle: channelTitle,
      thumbnailUrl: url,
    }
  })
}

export const mapListDataFromTestList = (tests = []) => {
  return tests.map((test = {}) => {
    const { _id, thumbnail, title, summary, videoDuration = 0 } = test
    const { totalQuestions = '' } = summary
    const authorName = getTestAuthorName(test)

    return {
      id: _id,
      title,
      subTitle: authorName,
      thumbnailUrl: thumbnail,
      totalQuestions,
      duration: videoDuration > 0 ? formateSecondsToMMSS(videoDuration) : '',
    }
  })
}
