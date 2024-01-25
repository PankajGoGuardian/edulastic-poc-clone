import React from 'react'

import { EduElse, EduIf, EduThen, FlexContainer } from '@edulastic/common'

import { Form, Spin, Switch, Tooltip } from 'antd'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import IconDailyMotion from '@edulastic/icons/src/IconDailyMotion'
import IconYoutube from '@edulastic/icons/src/IconYoutube'
import IconVimeo from '@edulastic/icons/src/IconVimeo'
import IconTwitch from '@edulastic/icons/src/IconTwitch'

import {
  getYoutubeThumbnailSelector,
  getYoutubeThumbnailAction,
  setYoutubeThumbnailAction,
  isYtLoadingSelector,
} from '../../../TestPage/ducks'

import {
  getInterestedGradesSelector,
  getInterestedSubjectsSelector,
  isRedirectToAddOnSelector,
  isVideoQuizAndAIEnabledSelector,
  showVQCountSelector,
  vqQuotaForDistrictSelector,
  vqUsageCountSelector,
} from '../../../src/selectors/user'

import useVideoAssessmentUtils from './hooks/useVideoAssessmentUtils'
import VideoList from './Components/VideoList'
import {
  SearchBoxBody,
  SearchBoxFooter,
  FooterText,
  FooterWrapper,
  SafeSearchText,
  SearchBoxContainer,
  SearchBoxWrapper,
  SearchInput,
  StyledSwitchText,
  FormItem,
} from './styledComponents/searchBox'
import {
  VideoListWrapper,
  SubHeader,
  LightSubHeader,
  SpinLoader,
} from './styledComponents/videoList'
import { getAssessmentCreatingSelector } from '../../ducks'
import { trimTextToGivenLength } from './utils'
import {
  CommonInlineWrapper,
  MainWrapper,
  StyledIcon,
} from './styledComponents/common'
import { StyledBetaTag } from '../../../AssessmentPage/VideoQuiz/styled-components/QuestionForm'
import VideoQuizUsageBanner from './Components/VideoQuizUsageBanner'

const CreateVideoQuiz = ({
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
  isRedirectToAddOn,
  showVQCount,
  vqQuotaForDistrict,
  vqUsageCount,
}) => {
  const {
    linkValue,
    setLinkValue,
    textIsUrl,
    videos,
    isModerateRestriction,
    setIsModerateRestriction,
    searchedText,
    isLoading,
    handleOnSearch,
    handleOnChange,
    loaderRef,
    hasError,
  } = useVideoAssessmentUtils({
    setYoutubeThumbnail,
    ytThumbnail,
    isVideoQuizAndAIEnabled,
    getYoutubeThumbnail,
    onValidUrl,
    history,
    interestedGrades,
    interestedSubjects,
    scrollerRef,
    isRedirectToAddOn,
    vqQuotaForDistrict,
    vqUsageCount,
  })

  if (isRedirectToAddOn) {
    return null
  }
  const errorMessage = () => {
    if (linkValue && hasError) {
      return `This link can't be played.`
    }
  }
  const showSpinnerVideoList = isThumbnailLoading || creatingAssessment

  const showNoData = !isLoading && linkValue && !textIsUrl && !videos.length

  const disableSearchInput = isThumbnailLoading || creatingAssessment

  const disableSafeSearchSwitch =
    isLoading || isThumbnailLoading || creatingAssessment

  const showLoaderButton = isLoading

  return (
    <FlexContainer width="100%" justifyContent="center">
      <MainWrapper>
        <SearchBoxWrapper flexDirection="column" alignItems="center">
          <EduIf condition={!isVideoQuizAndAIEnabled && showVQCount}>
            <VideoQuizUsageBanner />
          </EduIf>
          <SearchBoxContainer>
            <SearchBoxBody>
              <FlexContainer
                justifyContent="flex-start"
                alignItems="center"
                height="100%"
              >
                <CommonInlineWrapper padding="0 0 0 4rem" width="45%">
                  <Form colon={false}>
                    <SubHeader mb="0.5rem">
                      Search YouTube/ Paste Video URL{' '}
                      <sub>
                        <StyledBetaTag>BETA</StyledBetaTag>
                      </sub>
                    </SubHeader>
                    <FormItem
                      validateStatus={hasError ? 'error' : 'success'}
                      help={errorMessage()}
                    >
                      <SearchInput
                        allowClear
                        data-cy="videolink"
                        onChange={handleOnChange}
                        onSearch={(value) => handleOnSearch(value)}
                        value={linkValue}
                        placeholder="SEARCH YOUTUBE OR ENTER URL"
                        disabled={disableSearchInput}
                        prefix={
                          <StyledIcon
                            fontSize="24px"
                            type="youtube"
                            theme="filled"
                          />
                        }
                        enterButton
                      />
                    </FormItem>
                  </Form>
                </CommonInlineWrapper>
              </FlexContainer>
            </SearchBoxBody>
            <SearchBoxFooter justifyContent="flex-start">
              <FooterWrapper>
                <FlexContainer mr="0.5rem" alignItems="center">
                  <FooterText>Video URLs supported from</FooterText>
                </FlexContainer>
                <FlexContainer mr="0.5rem" alignItems="center">
                  <IconYoutube />
                </FlexContainer>
                <FlexContainer mr="0.5rem" alignItems="center">
                  <IconVimeo />
                </FlexContainer>
                <FlexContainer mr="0.5rem" alignItems="center">
                  <IconTwitch />
                </FlexContainer>
                <FlexContainer mr="0.5rem" alignItems="center">
                  <IconDailyMotion />
                </FlexContainer>
              </FooterWrapper>
            </SearchBoxFooter>
          </SearchBoxContainer>

          <EduIf condition={searchedText}>
            <FlexContainer
              padding="20px 0px"
              width="100%"
              justifyContent="center"
            >
              <FlexContainer width="90%" justifyContent="space-between">
                <FlexContainer justifyContent="flex-start">
                  <LightSubHeader>
                    Showing Search Results for&nbsp;
                  </LightSubHeader>
                  <Tooltip
                    title={`${searchedText}`}
                    mouseEnterDelay={1}
                    mouseLeaveDelay={1}
                    placement="bottom"
                  >
                    <SubHeader maxWidth="100%">
                      {`"${trimTextToGivenLength(searchedText, 50)}"`}
                    </SubHeader>
                  </Tooltip>
                </FlexContainer>
                <span>
                  <SafeSearchText>Safe Search&nbsp;</SafeSearchText>
                  <Tooltip
                    title={
                      isModerateRestriction
                        ? 'Restricted mode: None'
                        : 'Restricted mode: Moderate'
                    }
                    placement="bottom"
                    mouseEnterDelay={1}
                    mouseLeaveDelay={1}
                  >
                    <Switch
                      checked={isModerateRestriction}
                      onChange={(checked) => setIsModerateRestriction(checked)}
                      disabled={disableSafeSearchSwitch}
                    />
                  </Tooltip>
                  &nbsp;
                  <StyledSwitchText>
                    {isModerateRestriction ? 'On' : 'Off'}
                  </StyledSwitchText>
                </span>
              </FlexContainer>
            </FlexContainer>
          </EduIf>
        </SearchBoxWrapper>

        <SpinLoader spinning={showSpinnerVideoList}>
          <div>
            <EduIf condition={videos.length}>
              <EduThen>
                <VideoListWrapper justifyContent="center">
                  <VideoList videos={videos} setLinkValue={setLinkValue} />
                </VideoListWrapper>
              </EduThen>
              <EduElse>
                <EduIf condition={showNoData}>
                  {/* <NoDataNotification heading="No results found" /> */}
                </EduIf>
              </EduElse>
            </EduIf>
          </div>
        </SpinLoader>
        <FlexContainer justifyContent="center" mt="20px" ref={loaderRef}>
          <EduIf condition={showLoaderButton}>
            <Spin spinning={isLoading} />
          </EduIf>
        </FlexContainer>
      </MainWrapper>
    </FlexContainer>
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
      isRedirectToAddOn: isRedirectToAddOnSelector(state),
      showVQCount: showVQCountSelector(state),
      vqQuotaForDistrict: vqQuotaForDistrictSelector(state),
      vqUsageCount: vqUsageCountSelector(state),
    }),
    {
      getYoutubeThumbnail: getYoutubeThumbnailAction,
      setYoutubeThumbnail: setYoutubeThumbnailAction,
    }
  )
)
export default enhance(CreateVideoQuiz)
