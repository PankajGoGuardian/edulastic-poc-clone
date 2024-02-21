import { useEffect } from 'react'

import {
  extractVideoId,
  isValidVideoUrl,
} from '../../AssessmentPage/VideoQuiz/utils/videoPreviewHelpers'
import { isURL } from '../../AssessmentCreate/components/CreateVideoQuiz/utils'
import { vqConst } from '../const'

const useYoutubeLibrary = ({
  createVQAssessment,
  searchString,
  isLoading,
  ytSearchRequest,
  ytNextPageToken,
  currentTab,
}) => {
  // const videoDetailsFromTests = getVideoDetailsFromTests(testList, currentTab)

  const textIsUrl = isURL(searchString)
  const hasError = textIsUrl ? !isValidVideoUrl(searchString) : false
  /** As soon as we enter the Valid URL we start creating assessment */
  useEffect(() => {
    const _searchString = searchString?.trim()

    const ableToCreateTestFromUrl =
      textIsUrl &&
      !isValidVideoUrl(hasError) &&
      !isLoading &&
      !!_searchString.length

    if (!ableToCreateTestFromUrl) return

    const youtubeVideoId = extractVideoId(_searchString)

    if (youtubeVideoId) {
      createVQAssessment({ youtubeVideoId, validVideoUrl: _searchString })
      return
    }

    createVQAssessment({ validVideoUrl: _searchString })
  }, [searchString, hasError, isLoading, textIsUrl])

  const handleVideoSelect = (youtubeVideoId) => {
    if (!youtubeVideoId) return
    createVQAssessment({ youtubeVideoId })
  }

  /** Load/Append YouTube videos - result from YouTube APIs  */
  const fetchVideos = async ({ append = false }) => {
    const _searchString = searchString?.trim() || ''

    if (isValidVideoUrl(_searchString)) return null

    if (_searchString.length)
      ytSearchRequest({
        searchString: _searchString,
        nextPageToken: ytNextPageToken,
        append,
      })
  }

  useEffect(() => {
    if (currentTab === vqConst.vqTabs.YOUTUBE) {
      fetchVideos({
        append: false,
      })
    }
  }, [currentTab])

  return {
    handleVideoSelect,
    hasError,
    fetchVideos,
  }
}

export default useYoutubeLibrary
