import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { throttle } from 'lodash'
import qs from 'qs'
import { youtubeSearchApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { SMART_FILTERS } from '@edulastic/constants/const/filters'
import produce from 'immer'
import { test as testConstants } from '@edulastic/constants'
import { testCategoryTypes } from '@edulastic/constants/const/test'
import { sessionFilters as sessionFilterKeys } from '@edulastic/constants/const/common'
import {
  getSearchBody,
  getVideoDetailsFromTests,
  isURL,
} from '../../AssessmentCreate/components/CreateVideoQuiz/utils'
import {
  extractVideoId,
  isValidVideoUrl,
} from '../../AssessmentPage/VideoQuiz/utils/videoPreviewHelpers'

import appConfig from '../../../../app-config'
import { setFilterInSession } from '../../../common/utils/helpers'
import { setDefaultInterests } from '../../dataUtils'

const { PUBLISHED } = testConstants.statusConstants

const { videoQuizDefaultCollection } = appConfig

const useVideoQuizLibrary = ({
  setYoutubeThumbnail,
  ytThumbnail,
  getYoutubeThumbnail,
  scrollerRef,
  receiveTestsRequest,
  testList,
  isTestLibraryLoading,
  isVideoQuizAndAIEnabled,
  location,
  createAssessment,
  updateAllTestFilters,
  districtId,
  userId,
  prevSubject = [],
  prevGrades = [],
}) => {
  const videoDetailsFromTests = getVideoDetailsFromTests(testList)
  const [linkValue, setLinkValue] = useState('')
  const [isModerateRestriction, setIsModerateRestriction] = useState(false)
  const [videos, setVideos] = useState([])
  const [nextPageToken, setNextPageToken] = useState('')
  const [searchedText, setSearchedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [videoNotFound, setVideoNotFound] = useState(false)
  const [currentTab, setCurrentTab] = useState('1')
  const [testLibrarySearchFilter, setTestLibrarySearchFilter] = useState({})
  const [filterGrades, setFilterGrades] = useState(prevGrades)
  const [filterSubjects, setFilterSubjects] = useState(prevSubject)
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedYoutubeLink, setSelectedYoutubeLink] = useState('')

  const textIsUrl = isURL(linkValue)
  const loaderRef = useRef(null)

  const hasError = textIsUrl ? !isValidVideoUrl(linkValue) : false

  /** Creates new VQ */
  const createVQAssessment = ({ videoUrl, thumbnail }) => {
    const { assessmentId } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    })

    createAssessment({
      videoUrl,
      assessmentId,
      thumbnail,
    })
  }

  /** Appends testList - result from test library */
  useEffect(() => {
    setVideos((prevState) => [...prevState, ...videoDetailsFromTests])
  }, [testList])

  /** Reset state - Todo */
  useEffect(() => {
    setYoutubeThumbnail('')
    setSelectedYoutubeLink('')
    return () => {
      setYoutubeThumbnail('')
      setSelectedYoutubeLink('')
    }
  }, [])

  /** Load/Append YouTube videos - result from YouTube APIs  */
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

  /** Append YouTube videos - Youtube Pagination Starts */
  const handleFetchVideos = useMemo(() => {
    return throttle(
      async (append, userInput) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        await fetchVideos(append, userInput)
      },
      { trailing: true }
    )
  }, [fetchVideos])

  const handleIntersect = useCallback(
    (entries) => {
      const [entry] = entries
      if (
        !isLoading &&
        entry.isIntersecting &&
        videos.length &&
        searchedText &&
        currentTab === '3'
      ) {
        handleFetchVideos(true, searchedText)
      }
    },
    [
      videos,
      searchedText,
      isLoading,
      nextPageToken,
      isModerateRestriction,
      currentTab,
    ]
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
    currentTab,
  ])
  /** Append YouTube videos - Youtube Pagination Ends */

  /** Tests Pagination starts */
  const loadMoreTests = (append = false, searchString) => {
    const newSearchFilter = produce(testLibrarySearchFilter, (draft) => {
      draft.search.subject = filterSubjects
      draft.search.grades = filterGrades
      draft.search.status = filterStatus

      // override search.status as we only show PUBLISHED Tests in Community TAB
      if (currentTab === 1) {
        draft.search.status = PUBLISHED
      }

      // override search string onSearch event, uses existing search string when not provided
      if (typeof searchString === 'string') {
        draft.search.searchString = searchString.length ? [searchString] : []
      }

      if (append) {
        draft.page += 1
      }
    })
    console.log('loading more test page...:', newSearchFilter.page)
    console.log('currentTab', currentTab)

    setTestLibrarySearchFilter(newSearchFilter)
    receiveTestsRequest(newSearchFilter)
  }
  const handleFetchMoreTests = useMemo(() => {
    return throttle(
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        await loadMoreTests(true)
      },
      { trailing: true }
    )
  }, [loadMoreTests])
  const handleIntersect2 = useCallback(
    (entries) => {
      const [entry] = entries

      if (
        (currentTab === '1' || currentTab === '2') &&
        entry.isIntersecting &&
        !isTestLibraryLoading &&
        videos?.length >= 20
      ) {
        handleFetchMoreTests()
      }
    },
    [currentTab, isTestLibraryLoading, testLibrarySearchFilter?.page, videos]
  )
  useEffect(() => {
    if (!loaderRef?.current) return
    const observer = new IntersectionObserver(handleIntersect2, {
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
    currentTab,
    loaderRef,
    isTestLibraryLoading,
    testLibrarySearchFilter?.page,
    videos,
    filterStatus,
    filterSubjects,
    filterGrades,
  ])
  /** Tests Pagination Ends */

  /**
   * Handles any supported URLs for videos
   * textIsUrl: When true provided test is URL
   * hasError: When false provided URL is playable
   * linkValue: Input text/URL on Search bar
   */
  useEffect(() => {
    if (textIsUrl && !hasError && linkValue.length > 0) {
      /** Extracts only youtube videoId to get thumbnail, otherwise using playable video link to create */
      const videoId = extractVideoId(linkValue)
      if (videoId) {
        getYoutubeThumbnail(videoId)
      } else {
        notification({
          type: 'info',
          messageKey: 'creatingTestForSelectedVideo',
        })
        createVQAssessment({ videoUrl: linkValue })
      }
    }
  }, [linkValue, hasError, textIsUrl])

  /** Handle press enter event triggers Test library search or Youtube search */
  const handleOnSearch = (value) => {
    if (value && currentTab === '3') {
      handleFetchVideos(false, value)
    }
    if (['1', '3'].includes(currentTab)) {
      setVideos([])
      loadMoreTests(false, value)
    }
  }

  /** Handle search safe search */
  useEffect(() => {
    handleFetchVideos(false, searchedText)
  }, [isModerateRestriction])

  /** When youtube thumbnail is generated create new assessment */
  useEffect(() => {
    if (selectedYoutubeLink.length && ytThumbnail.length) {
      notification({
        type: 'info',
        messageKey: 'creatingTestForSelectedVideo',
      })
      createVQAssessment({
        videoUrl: selectedYoutubeLink,
        thumbnail: ytThumbnail,
      })
    }
  }, [ytThumbnail, selectedYoutubeLink])

  /** Handle search input changes */
  const handleOnChange = (value) => {
    setLinkValue(value)
  }

  /** VQ Collection  used to fetch Test from test library when user has subscribed the AI suit */
  const vqCollection = isVideoQuizAndAIEnabled
    ? videoQuizDefaultCollection?.collectionId || []
    : []

  /** Test categories used to fetch Test from test library */
  const testCategories = [testCategoryTypes.VIDEO_BASED]

  /** Handle Tab Changes sets search filter values */
  useEffect(() => {
    let search = {}
    setVideos([])

    if (currentTab === '1') {
      search = getSearchBody({
        vqCollection,
        subjects: filterSubjects,
        grades: filterGrades,
        testStatus: PUBLISHED, // We only show PUBLISHED Tests in Community TAB
        filter: SMART_FILTERS.ENTIRE_LIBRARY,
        searchString: linkValue ? [linkValue] : [],
        testCategories,
      })
      const sortState = {
        sortBy: 'popularity',
        sortDir: 'desc',
      }
      setTestLibrarySearchFilter({
        search,
        sort: sortState,
        page: 1,
        limit: 20,
      })
      const searchFilter = {
        search,
        sort: sortState,
        page: 1,
        limit: 20,
      }
      console.log('loads test on first mount', currentTab)

      setTestLibrarySearchFilter({ ...searchFilter })
      receiveTestsRequest(searchFilter)
      updateAllTestFilters({ search, sort: sortState })
    }
    if (currentTab === '2') {
      search = getSearchBody({
        subjects: filterSubjects,
        grades: filterGrades,
        testStatus: filterStatus,
        filter: SMART_FILTERS.AUTHORED_BY_ME,
        searchString: linkValue ? [linkValue] : [],
        vqCollection: [],
        testCategories,
      })
      const sortState = {
        sortBy: 'recency',
        sortDir: 'desc',
      }
      const searchFilter = {
        search,
        sort: sortState,
        page: 1,
        limit: 20,
      }
      console.log('loads test on first mount', currentTab)

      setTestLibrarySearchFilter({ ...searchFilter })
      receiveTestsRequest(searchFilter)

      setFilterInSession({
        key: sessionFilterKeys.TEST_FILTER,
        filter: search,
        districtId,
        userId,
      })
      setFilterInSession({
        key: sessionFilterKeys.TEST_SORT,
        filter: sortState,
        districtId,
        userId,
      })

      // use in test and other library selects searchType
      updateAllTestFilters({ search, sort: sortState })
    }

    if (currentTab === '3' && linkValue) {
      handleOnSearch(linkValue)
    }

    if (Array.isArray(filterGrades)) {
      setDefaultInterests({ grades: filterGrades })
    }
    if (Array.isArray(filterSubjects)) {
      setDefaultInterests({ subject: filterSubjects })
    }
  }, [currentTab, filterStatus, filterSubjects, filterGrades])

  /** handleVideoSelect for youtube videos to create new Test */
  const handleVideoSelect = (selectedYtVideoLink) => {
    // Extract videoId for YouTube link
    const videoId = extractVideoId(selectedYtVideoLink)
    setSelectedYoutubeLink(selectedYtVideoLink)
    if (videoId) {
      getYoutubeThumbnail(videoId)
    }
  }

  return {
    setLinkValue,
    ytThumbnail,
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
    setCurrentTab,
    currentTab,
    // can be clubbed with filter props object
    setFilterGrades,
    setFilterSubjects,
    filterGrades,
    filterSubjects,
    filterStatus,
    setFilterStatus,
    handleVideoSelect,
  }
}

export default useVideoQuizLibrary
