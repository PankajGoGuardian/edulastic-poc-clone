import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { throttle } from 'lodash'

import { youtubeSearchApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import {
  extractVideoId,
  isValidVideoUrl,
} from '../../../../AssessmentPage/VideoQuiz/utils/videoPreviewHelpers'
import { navigationState } from '../../../../src/constants/navigation'
import { isURL } from '../utils'

const useVideoAssessmentUtils = ({
  createVQAssessment,
  history,
  scrollerRef,
  allowedToCreateVideoQuiz,
  setYoutubeThumbnail,
}) => {
  const [linkValue, setLinkValue] = useState('')
  const [isModerateRestriction, setIsModerateRestriction] = useState(false)
  const [videos, setVideos] = useState([])
  const [nextPageToken, setNextPageToken] = useState('')
  const [searchedText, setSearchedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [videoNotFound, setVideoNotFound] = useState(false)
  const textIsUrl = isURL(linkValue)
  const loaderRef = useRef(null)

  const hasError = textIsUrl ? !isValidVideoUrl(linkValue) : false

  useEffect(() => {
    setYoutubeThumbnail('')
    return () => {
      setYoutubeThumbnail('')
    }
  }, [])

  useEffect(() => {
    if (!allowedToCreateVideoQuiz) {
      history.push({
        pathname: '/author/subscription',
        state: { view: navigationState.SUBSCRIPTION.view.ADDON },
      })
    }
  }, [allowedToCreateVideoQuiz])

  const fetchVideos = async (append = false, userInput = '') => {
    try {
      const searchString = userInput?.trim()

      if (isURL(searchString)) return

      setIsLoading(true)
      if (searchString) {
        const {
          items = [],
          nextPageToken: _nextPageToken = '',
        } = await youtubeSearchApi.fetchYoutubeVideos({
          query: searchString,
          safeSearch: isModerateRestriction ? 'moderate' : 'none',
          nextPageToken,
        })
        if (items.length) {
          setVideoNotFound(false)
          setSearchedText(searchString)
          setNextPageToken(_nextPageToken)
          if (append) {
            setVideos((prevState) => [...prevState, ...items])
          } else {
            setVideos(() => [...items])
            const listInnerElement = scrollerRef?.current
            if (listInnerElement) listInnerElement?.scrollTo({ top: 0 })
          }
        } else if (!append) {
          setVideoNotFound(true)
          setSearchedText(searchString)
          setVideos([])
          setNextPageToken('')
        }
      }
      setIsLoading(false)
    } catch (error) {
      notification({
        messageKey: 'youtubeSearchApiError',
      })
      setIsLoading(false)
      setVideoNotFound(true)
    }
  }

  const handleFetchVideos = useMemo(() => {
    return throttle(
      async (append, userInput) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        await fetchVideos(append, userInput)
      },
      { trailing: true }
    )
  }, [fetchVideos])

  useEffect(() => {
    if (textIsUrl && !hasError && linkValue.length > 0) {
      const youtubeVideoId = extractVideoId(linkValue)
      if (youtubeVideoId) {
        createVQAssessment({ youtubeVideoId })
      } else {
        notification({
          type: 'info',
          messageKey: 'creatingTestForSelectedVideo',
        })
        createVQAssessment({ validVideoUrl: linkValue })
      }
    }
  }, [linkValue, hasError, textIsUrl])

  const handleOnSearch = (value) => {
    if (value) {
      handleFetchVideos(false, value)
    }
  }

  useEffect(() => {
    handleFetchVideos(false, searchedText)
  }, [isModerateRestriction])

  // Removing default search
  // useEffect(() => {
  //   const defaultValue = getDefaultSearchString(
  //     interestedSubjects,
  //     interestedGrades
  //   )

  //   setLinkValue(defaultValue)
  //   handleFetchVideos(false, defaultValue)
  // }, [interestedSubjects, interestedGrades])

  const handleOnChange = (e) => {
    const searchString = e.target.value
    setLinkValue(searchString)
  }

  const handleIntersect = useCallback(
    (entries) => {
      const [entry] = entries
      if (!isLoading && entry.isIntersecting && videos.length && searchedText) {
        handleFetchVideos(true, searchedText)
      }
    },
    [videos, searchedText, isLoading, nextPageToken, isModerateRestriction]
  )

  useEffect(() => {
    if (!loaderRef?.current) return
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      threshold: 0,
    })
    observer.observe(loaderRef.current)

    return () => {
      if (loaderRef?.current) {
        return observer.unobserve(loaderRef.current)
      }
    }
  }, [
    loaderRef,
    videos,
    searchedText,
    isLoading,
    nextPageToken,
    isModerateRestriction,
  ])

  const handleVideoSelect = (youtubeVideoId, selectedVideoTitle) => {
    if (!youtubeVideoId) return
    createVQAssessment({ youtubeVideoId, selectedVideoTitle })
  }

  return {
    setLinkValue,
    linkValue,
    hasError,
    videos,
    nextPageToken,
    textIsUrl,
    isModerateRestriction,
    setIsModerateRestriction,
    searchedText,
    isLoading,
    videoNotFound,
    handleOnSearch,
    handleOnChange,
    loaderRef,
    handleVideoSelect,
  }
}

export default useVideoAssessmentUtils
