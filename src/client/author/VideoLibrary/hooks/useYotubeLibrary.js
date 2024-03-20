import { useEffect } from 'react'

import {
  extractVideoId,
  isValidVideoUrl,
} from '../../AssessmentPage/VideoQuiz/utils/videoPreviewHelpers'
import { isURL } from '../../AssessmentCreate/components/CreateVideoQuiz/utils'
import { vqConst } from '../const'
import appConfig from '../../../../app-config'

const { vqLibraryQueryParams } = appConfig
const useYoutubeLibrary = ({
  createVQAssessment,
  searchString,
  isLoading,
  ytSearchRequest,
  ytNextPageToken,
  currentTab,
  isInvalidUrl,
}) => {
  // const videoDetailsFromTests = getVideoDetailsFromTests(testList, currentTab)

  const textIsUrl = isURL(searchString)
  const hasError = textIsUrl ? !isValidVideoUrl(searchString) : false
  /** As soon as we enter the Valid URL we start creating assessment */
  useEffect(() => {
    const _searchString = searchString?.trim()
    const ableToCreateTestFromUrl =
      textIsUrl &&
      isValidVideoUrl(_searchString) &&
      !isLoading &&
      !!_searchString.length &&
      !isInvalidUrl &&
      !hasError

    if (!ableToCreateTestFromUrl) return

    const youtubeVideoId = extractVideoId(_searchString)

    if (youtubeVideoId) {
      createVQAssessment({
        youtubeVideoId,
        validVideoUrl: _searchString,
        searchParam: vqLibraryQueryParams,
      })
      return
    }

    createVQAssessment({
      validVideoUrl: _searchString,
      searchParam: vqLibraryQueryParams,
    })
  }, [searchString, hasError, isInvalidUrl, isLoading, textIsUrl])

  const handleVideoSelect = (youtubeVideoId, selectedVideoTitle) => {
    if (!youtubeVideoId) return
    createVQAssessment({
      youtubeVideoId,
      selectedVideoTitle,
      searchParam: vqLibraryQueryParams,
    })
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
