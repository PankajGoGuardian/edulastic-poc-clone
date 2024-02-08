import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'
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
  isVideoQuizAndAIEnabledSelector,
  showVQCountSelector,
  vqQuotaForDistrictSelector,
  vqUsageCountSelector,
} from '../../../src/selectors/user'
import { getAssessmentCreatingSelector } from '../../../AssessmentCreate/ducks'
import {
  getTestsLoadingSelector,
  getTestsSelector,
  receiveTestsAction,
} from '../../../TestList/ducks'

const VideoLibrary = ({
  onValidUrl,
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
}) => {
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
  } = useVideoQuizLibrary({
    setYoutubeThumbnail,
    ytThumbnail,
    isVideoQuizAndAIEnabled,
    getYoutubeThumbnail,
    onValidUrl,
    history,
    interestedGrades,
    interestedSubjects,
    scrollerRef,
    allowedToCreateVideoQuiz,
    receiveTestsRequest,
    testList,
    isTestLibraryLoading,
  })

  const errorMessage = () => {
    if (linkValue && hasError) {
      return `This link can't be played.`
    }
  }

  const showNoData = !isLoading && linkValue && !textIsUrl && !videos.length
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
    }),
    {
      getYoutubeThumbnail: getYoutubeThumbnailAction,
      setYoutubeThumbnail: setYoutubeThumbnailAction,
      receiveTestsRequest: receiveTestsAction,
    }
  )
)

export default enhance(VideoLibrary)
