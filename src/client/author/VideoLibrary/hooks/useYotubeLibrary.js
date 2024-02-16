import { useCallback, useEffect, useMemo, useRef } from 'react'
import { throttle } from 'lodash'
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

  const loaderRefYTLibrary = useRef(null)
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

  /** Append YouTube videos - Youtube Pagination Starts */
  const handleFetchVideos = useMemo(() => {
    return throttle(
      async (append) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        await fetchVideos(append)
      },
      { trailing: true }
    )
  }, [fetchVideos])

  const handleIntersectOnYoutubeList = useCallback(
    (entries) => {
      const [entry] = entries
      if (
        !isLoading &&
        entry.isIntersecting &&
        currentTab === vqConst.vqTabs.YOUTUBE
      ) {
        handleFetchVideos(true)
      }
    },
    [loaderRefYTLibrary, searchString, ytNextPageToken, currentTab]
  )

  useEffect(() => {
    if (!loaderRefYTLibrary?.current) return
    const observer = new IntersectionObserver(handleIntersectOnYoutubeList, {
      root: null,
      threshold: 0,
    })

    observer.observe(loaderRefYTLibrary.current)

    return () => {
      if (loaderRefYTLibrary?.current) {
        return observer.disconnect()
      }
    }
  }, [currentTab, loaderRefYTLibrary, searchString, ytNextPageToken])
  /** Append YouTube videos - Youtube Pagination Ends */

  return {
    loaderRefYTLibrary,
    handleVideoSelect,
    hasError,
    fetchVideos,
  }
}

export default useYoutubeLibrary
