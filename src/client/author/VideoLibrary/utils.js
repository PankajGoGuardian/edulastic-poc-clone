import { parseISO8601Duration } from '../AssessmentCreate/components/CreateVideoQuiz/utils'
import { getTestAuthorName } from '../dataUtils'

export const mapListDataFromVideoList = (videoList = []) => {
  return videoList.map((video = {}) => {
    const { snippet = {}, videoDetails = {} } = video
    const {
      id,
      contentDetails: { duration = '' },
    } = videoDetails
    const { title = '', thumbnails = {}, channelTitle = '' } = snippet
    const {
      medium: { url = '' },
    } = thumbnails
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
    const { _id, thumbnail, duration = '', title, summary } = test
    const { totalQuestions = '' } = summary
    const authorName = getTestAuthorName(test)

    return {
      id: _id,
      duration: parseISO8601Duration(duration),
      title,
      subTitle: authorName,
      thumbnailUrl: thumbnail,
      totalQuestions,
    }
  })
}
