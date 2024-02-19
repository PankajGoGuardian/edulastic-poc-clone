import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import produce from 'immer'
import VideoLibraryHeader from './Header'
import VideoLibrarySearchBox from './SearchBox'
import VideoLibrarySubHeader from './SubHeader'
import VideoLibraryTabs from './Tabs'

import {
  getYoutubeThumbnailAction,
  setYoutubeThumbnailAction,
} from '../../../TestPage/ducks'
import {
  allowedToCreateVideoQuizSelector,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector,
  isVideoQuizAndAIEnabledSelector,
  showVQCountSelector,
} from '../../../src/selectors/user'

import {
  getTestsCountSelector,
  getTestsFilterSelector,
  getTestsSelector,
  receiveTestsAction,
  updateAllTestSearchFilterAction,
} from '../../../TestList/ducks'

import { videoQuizActions } from '../../ducks'
import useYoutubeLibrary from '../../hooks/useYotubeLibrary'
import { videoQuizSelector } from '../../ducks/selectors'

import useTestLibrary from '../../hooks/useTestLibrary'

import useVQLibraryCommon from '../../hooks/useVQLibraryCommon'
import { vqConst } from '../../const'
import { getDefaultInterests } from '../../../dataUtils'

const { YOUTUBE, COMMUNITY, MY_CONTENT } = vqConst.vqTabs

const VideoLibrary = ({
  testSearchRequest,
  testListSearchFilters,
  videoQuizLibrary,
  createVQAssessment,
  ytSearchRequest,
  vqUpdateCurrentTab,
  updateSearchString,
  updateAllTestSearchFilter,
  history,
  resetVQLibrary,
  interestedGrades,
  interestedSubjects,
  isVideoQuizAndAIEnabled,
}) => {
  const {
    testList = [],
    videoList = [],
    currentTab = '',
    isLoading = false,
    ytNextPageToken = '',
    searchString = '',
    ytTotalResult = 1,
  } = videoQuizLibrary

  const vqListData = currentTab === YOUTUBE ? videoList : testList

  /** Selected grades and subjects */
  const {
    subject: prevSubject = interestedSubjects,
    grades: prevGrades = interestedGrades || [],
  } = getDefaultInterests()
  const { subject, grades, status: filterStatus } = testListSearchFilters
  const filterSubjects = subject.length ? subject : prevSubject
  const filterGrades = grades.length ? grades : prevGrades

  const handleOnChange = (userInput) => {
    updateSearchString(userInput)
  }

  const handleTabSelect = (selectedTab) => {
    vqUpdateCurrentTab(selectedTab)
  }

  useVQLibraryCommon({ resetVQLibrary })

  const {
    loaderRefYTLibrary,
    handleVideoSelect,
    fetchVideos,
    hasError,
  } = useYoutubeLibrary({
    createVQAssessment,
    searchString,
    isLoading,
    ytSearchRequest,
    ytNextPageToken,
    currentTab,
  })

  const {
    loaderRefTestLibrary,
    fetchTestByFilters,
    handleTestSelect,
  } = useTestLibrary({
    testSearchRequest,
    testListSearchFilters,
    searchString,
    history,
    currentTab,
    vqListData,
    isLoading,
    isVideoQuizAndAIEnabled,
  })

  /** Handle press enter event triggers Test library search or Youtube search */
  const handleOnSearch = () => {
    const fn = {
      [YOUTUBE]: () => fetchVideos(false),
      [COMMUNITY]: () => fetchTestByFilters({ append: false }),
      [MY_CONTENT]: () => fetchTestByFilters({ append: false }),
    }
    fn[currentTab]()
  }

  const handleCardSelect = (uniqueId) => {
    const fn = {
      [YOUTUBE]: () => handleVideoSelect(uniqueId),
      [COMMUNITY]: () => handleTestSelect(uniqueId),
      [MY_CONTENT]: () => handleTestSelect(uniqueId),
    }
    fn[currentTab]()
  }

  const handleFilterChanges = ({ key, value }) => {
    const newSearch = produce(testListSearchFilters, (draft) => {
      draft[key] = value
    })
    const sort = vqConst.sort[currentTab]
    updateAllTestSearchFilter({ search: newSearch, sort })
  }

  const showNoData = !isLoading && !vqListData?.length
  const ytSearchNoResult = searchString && !ytTotalResult && !isLoading
  const disableSearchInput = isLoading

  const searchBoxProps = {
    handleOnSearch,
    handleOnChange,
    searchString,
    hasError,
    disableSearchInput,
  }

  const videoLibraryTabsProps = {
    loaderRefTestLibrary,
    loaderRefYTLibrary,
    handleCardSelect,
    handleFilterChanges,
    vqListData,
    handleTabSelect,
    currentTab,
    filterGrades,
    filterStatus,
    filterSubjects,
    showNoData,
    isLoading,
    ytSearchNoResult,
  }

  return (
    <>
      <VideoLibraryHeader />
      <VideoLibrarySearchBox {...searchBoxProps} />
      <VideoLibrarySubHeader />
      <VideoLibraryTabs {...videoLibraryTabsProps} />
    </>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      isVideoQuizAndAIEnabled: isVideoQuizAndAIEnabledSelector(state),
      interestedGrades: getInterestedGradesSelector(state),
      interestedSubjects: getInterestedSubjectsSelector(state),
      showVQCount: showVQCountSelector(state),
      testList: getTestsSelector(state),
      videoQuizLibrary: videoQuizSelector(state),
      testListSearchFilters: getTestsFilterSelector(state),
      testsCount: getTestsCountSelector(state),
      allowedToCreateVideoQuiz: allowedToCreateVideoQuizSelector(state),
    }),
    {
      getYoutubeThumbnail: getYoutubeThumbnailAction,
      setYoutubeThumbnail: setYoutubeThumbnailAction,
      receiveTestsRequest: receiveTestsAction,
      createVQAssessment: videoQuizActions.createVQAssessmentRequest,
      updateSearchString: videoQuizActions.updateSearchString,
      ytSearchRequest: videoQuizActions.ytSearchRequest,
      vqUpdateCurrentTab: videoQuizActions.updateCurrentTab,
      testSearchRequest: videoQuizActions.testSearchRequest,
      resetVQLibrary: videoQuizActions.resetVQState,
      updateAllTestSearchFilter: updateAllTestSearchFilterAction,
    }
  )
)

export default enhance(VideoLibrary)
