import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'
import VideoLibraryHeader from './Header'
import VideoLibrarySearchBox from './SearchBox'
import VideoLibrarySubHeader from './SubHeader'
import VideoLibraryTabs from './Tabs'
import useVideoQuizLibrary from '../../hooks/useVideoQuizLibrary'
import {
  getYoutubeThumbnailAction,
  getYoutubeThumbnailSelector,
  isYtLoadingSelector,
  setYoutubeThumbnailAction,
} from '../../../TestPage/ducks'
import {
  allowedToCreateVideoQuizSelector,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector,
  getUserOrgId,
  isVideoQuizAndAIEnabledSelector,
  showVQCountSelector,
  vqQuotaForDistrictSelector,
  vqUsageCountSelector,
} from '../../../src/selectors/user'
import {
  createAssessmentRequestAction,
  getAssessmentCreatingSelector,
} from '../../../AssessmentCreate/ducks'
import {
  getTestsLoadingSelector,
  getTestsSelector,
  receiveTestsAction,
  updateAllTestSearchFilterAction,
} from '../../../TestList/ducks'
import { getDefaultInterests } from '../../../dataUtils'

const VideoLibrary = ({
  ytThumbnail,
  getYoutubeThumbnail,
  setYoutubeThumbnail,
  isVideoQuizAndAIEnabled,
  history,
  interestedGrades,
  interestedSubjects,
  isThumbnailLoading,
  creatingAssessment,
  scrollerRef,
  allowedToCreateVideoQuiz,
  receiveTestsRequest,
  testList,
  isTestLibraryLoading,
  location,
  createAssessment,
  userId,
  districtId,
  updateAllTestFilters,
}) => {
  const {
    subject: prevSubject = interestedSubjects,
    grades: prevGrades = interestedGrades || [],
  } = getDefaultInterests()

  const {
    linkValue,
    setLinkValue,
    textIsUrl,
    videos,
    isLoading,
    handleOnSearch,
    handleOnChange,
    loaderRef,
    hasError,
    currentTab,
    setCurrentTab,
    setFilterGrades,
    setFilterSubjects,
    filterGrades,
    filterSubjects,
    filterStatus,
    setFilterStatus,
  } = useVideoQuizLibrary({
    setYoutubeThumbnail,
    ytThumbnail,
    isVideoQuizAndAIEnabled,
    getYoutubeThumbnail,
    history,
    interestedGrades,
    interestedSubjects,
    scrollerRef,
    allowedToCreateVideoQuiz,
    receiveTestsRequest,
    testList,
    isTestLibraryLoading,
    location,
    createAssessment,
    userId,
    districtId,
    updateAllTestFilters,
    prevSubject,
    prevGrades,
  })

  const errorMessage = () => {
    if (linkValue && hasError) {
      return `This link can't be played.`
    }
  }

  const showNoData = !isLoading && !isTestLibraryLoading && !videos.length

  const hasSearchedText = linkValue && !textIsUrl

  const disableSearchInput = isThumbnailLoading || creatingAssessment

  const showLoaderButton = isLoading
  const showSpinnerVideoList = isThumbnailLoading || creatingAssessment

  const searchBoxProps = {
    hasError,
    handleOnChange,
    handleOnSearch,
    disableSearchInput,
    errorMessage,
    linkValue,
  }

  const videoLibraryTabsProps = {
    showSpinnerVideoList,
    videos,
    setLinkValue,
    showNoData,
    loaderRef,
    showLoaderButton,
    isLoading,
    currentTab,
    setCurrentTab,
    isTestLibraryLoading,
    setFilterGrades,
    setFilterSubjects,
    filterGrades,
    filterSubjects,
    filterStatus,
    setFilterStatus,
    hasSearchedText,
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
      ytThumbnail: getYoutubeThumbnailSelector(state),
      isVideoQuizAndAIEnabled: isVideoQuizAndAIEnabledSelector(state),
      interestedGrades: getInterestedGradesSelector(state),
      interestedSubjects: getInterestedSubjectsSelector(state),
      creatingAssessment: getAssessmentCreatingSelector(state),
      isThumbnailLoading: isYtLoadingSelector(state),

      showVQCount: showVQCountSelector(state),
      vqQuotaForDistrict: vqQuotaForDistrictSelector(state),
      vqUsageCount: vqUsageCountSelector(state),
      allowedToCreateVideoQuiz: allowedToCreateVideoQuizSelector(state),
      testList: getTestsSelector(state),
      isTestLibraryLoading: getTestsLoadingSelector(state),
      userId: get(state, 'user.user._id', false),
      districtId: getUserOrgId(state),
    }),
    {
      getYoutubeThumbnail: getYoutubeThumbnailAction,
      setYoutubeThumbnail: setYoutubeThumbnailAction,
      receiveTestsRequest: receiveTestsAction,
      createAssessment: createAssessmentRequestAction,
      updateAllTestFilters: updateAllTestSearchFilterAction,
    }
  )
)

export default enhance(VideoLibrary)
