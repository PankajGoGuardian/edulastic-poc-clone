import { useEffect } from 'react'

import {
  extractVideoId,
  isValidVideoUrl,
} from '../../AssessmentPage/VideoQuiz/utils/videoPreviewHelpers'
import { isURL } from '../../AssessmentCreate/components/CreateVideoQuiz/utils'

const useYoutubeLibrary = ({
  createVQAssessment,
  searchString,
  isLoading,
  ytSearchRequest,
  ytNextPageToken,
}) => {
  // const videoDetailsFromTests = getVideoDetailsFromTests(testList, currentTab)

  const textIsUrl = isURL(searchString)
  const hasError = textIsUrl ? !isValidVideoUrl(searchString) : false
  /** As soon as we enter the Valid URL we start creating assessment */
  useEffect(() => {
    const youtubeVideoId = extractVideoId(searchString)
    if (!hasError && !isLoading && youtubeVideoId) {
      createVQAssessment({ youtubeVideoId, validVideoUrl: searchString })
    }
  }, [searchString, hasError, isLoading])

  const handleVideoSelect = (youtubeVideoId) => {
    if (!youtubeVideoId) return
    createVQAssessment({ youtubeVideoId })
  }

  /** Load/Append YouTube videos - result from YouTube APIs  */
  const fetchVideos = async (append = false) => {
    if (isValidVideoUrl(searchString)) return null
    ytSearchRequest({
      searchString,
      nextPageToken: ytNextPageToken,
      append,
    })
  }

  return {
    handleVideoSelect,
    hasError,
    fetchVideos,
  }
}

export default useYoutubeLibrary
