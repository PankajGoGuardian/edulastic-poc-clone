import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import produce from 'immer'
import { EduIf, EduThen } from '@edulastic/common'
import VideoLibraryHeader from './Header'
import VideoLibrarySearchBox from './SearchBox'
import VideoLibraryTabs from './Tabs'

import {
  allowedToCreateVideoQuizSelector,
  isVideoQuizAndAIEnabledSelector,
} from '../../../src/selectors/user'

import { videoQuizActions } from '../../ducks'
import useYoutubeLibrary from '../../hooks/useYotubeLibrary'
import { videoQuizSelector } from '../../ducks/selectors'

import useTestLibrary from '../../hooks/useTestLibrary'

import useVQLibraryCommon from '../../hooks/useVQLibraryCommon'
import { vqConst } from '../../const'

const { YOUTUBE, COMMUNITY, MY_CONTENT } = vqConst.vqTabs

const VideoLibrary = ({
  testSearchRequest,
  videoQuizLibrary,
  createVQAssessment,
  ytSearchRequest,
  vqUpdateCurrentTab,
  updateSearchString,
  setVQFilters,
  history,
  resetVQLibrary,
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
    vqFilters = {},
    vqCount = 0,
  } = videoQuizLibrary

  const vqListData = currentTab === YOUTUBE ? videoList : testList

  /** Selected grades and subjects */

  const {
    subject: filterSubjects,
    grades: filterGrades,
    status: filterStatus,
  } = vqFilters

  const handleOnChange = (userInput) => {
    updateSearchString(userInput)
  }

  const handleTabSelect = (selectedTab) => {
    vqUpdateCurrentTab(selectedTab)
  }

  const { fetchTestByFilters, handleTestSelect } = useTestLibrary({
    testSearchRequest,
    vqFilters,
    searchString,
    history,
    currentTab,
    vqListData,
    isLoading,
    isVideoQuizAndAIEnabled,
  })

  const { handleVideoSelect, fetchVideos, hasError } = useYoutubeLibrary({
    createVQAssessment,
    searchString,
    isLoading,
    ytSearchRequest,
    ytNextPageToken,
    currentTab,
  })

  const { infiniteLoaderRef } = useVQLibraryCommon({
    resetVQLibrary,
    fetchVideos,
    fetchTestByFilters,
    testList,
    ytNextPageToken,
    currentTab,
    vqCount,
  })

  /** Handle press enter event triggers Test library search or Youtube search */
  const handleOnSearch = () => {
    const fn = {
      [YOUTUBE]: () => fetchVideos({ append: false }),
      [COMMUNITY]: () => fetchTestByFilters({ append: false }),
      [MY_CONTENT]: () => fetchTestByFilters({ append: false }),
    }
    fn[currentTab]()
  }

  const handleOnClear = () => {
    updateSearchString('')
    if (currentTab !== YOUTUBE) {
      fetchTestByFilters({
        append: false,
        useEmptySearchString: true,
      })
    }
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
    const newSearch = produce(vqFilters, (draft) => {
      draft[key] = value
    })

    const sort = vqConst.sort[currentTab]
    setVQFilters({ search: newSearch, sort })
  }

  const showNoData = !isLoading && !vqListData?.length
  const ytSearchNoResult = searchString && !ytTotalResult && !isLoading
  const disableSearchInput = isLoading

  const searchBoxProps = {
    handleOnSearch,
    handleOnChange,
    handleOnClear,
    searchString,
    hasError,
    disableSearchInput,
  }

  const videoLibraryTabsProps = {
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
      <br />
      <VideoLibraryTabs {...videoLibraryTabsProps} />
      <EduIf condition={!isLoading}>
        <EduThen>
          <div ref={infiniteLoaderRef} />
        </EduThen>
      </EduIf>
    </>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      isVideoQuizAndAIEnabled: isVideoQuizAndAIEnabledSelector(state),
      videoQuizLibrary: videoQuizSelector(state),
      allowedToCreateVideoQuiz: allowedToCreateVideoQuizSelector(state),
    }),
    {
      createVQAssessment: videoQuizActions.createVQAssessmentRequest,
      updateSearchString: videoQuizActions.updateSearchString,
      ytSearchRequest: videoQuizActions.ytSearchRequest,
      vqUpdateCurrentTab: videoQuizActions.updateCurrentTab,
      testSearchRequest: videoQuizActions.testSearchRequest,
      resetVQLibrary: videoQuizActions.resetVQState,
      setVQFilters: videoQuizActions.setVQFilters,
    }
  )
)

export default enhance(VideoLibrary)
