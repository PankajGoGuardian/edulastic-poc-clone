/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled, { ThemeProvider, css } from 'styled-components'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import { Row, Col, Button, Spin } from 'antd'
import { withRouter } from 'react-router-dom'
import { get, isEmpty } from 'lodash'
import { EduButton, FlexContainer, withKeyboard } from '@edulastic/common'
import { IconPhotoCamera, IconSend } from '@edulastic/icons'
import { test as testTypes } from '@edulastic/constants'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  largeDesktopWidth,
  desktopWidth,
  smallDesktopWidth,
  tabletWidth,
  mobileWidthLarge,
  mainBgColor,
  lightGrey9,
} from '@edulastic/colors'
import { themes } from '../../../theme'
import { attemptSummarySelector } from '../ducks'
import { getAssignmentsSelector } from '../../Assignments/ducks'
import { loadTestAction } from '../../../assessment/actions/test'
import { testLoadingSelector } from '../../../assessment/selectors/test'
import FilesView from '../../../assessment/widgets/UploadFile/components/FilesView'
import { saveUserWorkAction } from '../../../assessment/actions/userWork'
import { getTestLevelUserWorkSelector } from '../../sharedDucks/TestItem'
import TestAttachementsModal from '../../../author/StudentView/Modals/TestAttachementsModal'
import { getUser } from '../../../author/src/selectors/user'

const { ASSESSMENT, PRACTICE, TESTLET } = testTypes.type
class SummaryTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buttonIdx: null,
      showAttachmentsModal: false,
      attachmentIndexForPreview: null,
    }
  }

  componentDidMount() {
    const { loadTest, history, match, questionList } = this.props
    const { utaId: testActivityId, id: testId, assessmentType } = match.params
    if (
      assessmentType === ASSESSMENT ||
      assessmentType === PRACTICE ||
      assessmentType === TESTLET
    ) {
      const { allQids } = questionList
      if (allQids.length === 0) {
        loadTest({ testId, testActivityId, groupId: match.params.groupId })
      }
      sessionStorage.setItem('testAttemptReviewVistedId', testActivityId)
    } else {
      history.push('/home/assignments')
    }
  }

  handlerButton = (buttonIdx) => {
    this.setState({ buttonIdx })
  }

  goToQuestion = (testId, testActivityId, q) => () => {
    const { history, items, match, test, submitingResponse } = this.props
    if (submitingResponse) {
      return
    }
    const { assessmentType, groupId } = match.params
    let targetItemIndex = items.reduce((acc, item, index) => {
      if (item.data.questions.some(({ id }) => id === q)) acc = index
      return acc
    }, null)

    // src/client/student/TestAttemptReview/ducks.js:26
    if (targetItemIndex === null && q.includes('no_question_')) {
      targetItemIndex = q.split('no_question_')[1]
    }

    if (test.testType !== TESTLET) {
      history.push(
        `/student/${assessmentType}/${testId}/class/${groupId}/uta/${testActivityId}/itemId/${items[targetItemIndex]._id}`,
        {
          fromSummary: true,
          question: q,
          ...history.location.state,
        }
      )
    } else {
      history.push(
        `/student/${assessmentType}/${testId}/class/${groupId}/uta/${testActivityId}`,
        {
          fromSummary: true,
          question: q,
          ...history.location.state,
        }
      )
    }
  }

  deleteAttachment = (attachmentIndex) => {
    const { userWork, saveUserWork } = this.props
    const attachments = [...(userWork || [])]
    attachments.splice(attachmentIndex, 1)
    saveUserWork({ attachments })
  }

  toggleAttachmentsModal = (index) => {
    this.setState((prevState) => ({
      showAttachmentsModal: !prevState.showAttachmentsModal,
      attachmentIndexForPreview: index,
    }))
  }

  render() {
    const {
      questionList: questionsAndOrder,
      t,
      test,
      finishTest,
      savingResponse,
      testLoading,
      blockNavigationToAnsweredQuestions,
      openUserWorkUploadModal,
      userWork,
      studentData,
    } = this.props
    const { isDocBased, items } = test
    const isDocBasedFlag = (!isDocBased && items.length === 0) || isDocBased
    const { blocks: questionList, itemWiseQids = [] } = questionsAndOrder
    const itemIds = Object.keys(itemWiseQids)
    const {
      buttonIdx,
      showAttachmentsModal,
      attachmentIndexForPreview,
    } = this.state
    if (testLoading) {
      return <Spin />
    }
    return (
      <ThemeProvider theme={themes.default}>
        <AssignmentContentWrapperSummary>
          <Container>
            <Header>
              <Title>{t('common.headingText')}</Title>
              <TitleDescription>{t('common.message')}</TitleDescription>
            </Header>
            <MainContent>
              <ColorDescription>
                <ColorDescriptionRow gutter={32}>
                  <FlexCol lg={8} md={24}>
                    <MarkedAnswered />
                    <SpaceLeft>
                      <Description>
                        {t('common.markedQuestionLineOne')}
                      </Description>
                    </SpaceLeft>
                  </FlexCol>
                  <FlexCol lg={8} md={24}>
                    <MarkedSkipped />
                    <SpaceLeft>
                      <Description>{t('common.skippedQues')}</Description>
                    </SpaceLeft>
                  </FlexCol>
                  <FlexCol lg={8} md={24}>
                    <MarkedForReview />
                    <SpaceLeft>
                      <Description>{t('common.markedForReview')}</Description>
                    </SpaceLeft>
                  </FlexCol>
                </ColorDescriptionRow>
              </ColorDescription>
              <Questions>
                <Row>
                  <QuestionText lg={8} md={24}>
                    {t('common.questionsLabel')}
                  </QuestionText>
                  <Col lg={16} md={24}>
                    <AnsweredTypeButtonContainer>
                      <StyledButton
                        data-cy="all"
                        onClick={() => this.handlerButton(null)}
                        enabled={buttonIdx === null}
                      >
                        {t('default:all')}
                      </StyledButton>
                      {!isDocBasedFlag && (
                        <StyledButton
                          data-cy="bookmarked"
                          onClick={() => this.handlerButton(2)}
                          enabled={buttonIdx === 2}
                        >
                          {t('default:bookmarked')}
                        </StyledButton>
                      )}
                      <StyledButton
                        data-cy="skipped"
                        onClick={() => this.handlerButton(0)}
                        enabled={buttonIdx === 0}
                      >
                        {t('default:skipped')}
                      </StyledButton>
                    </AnsweredTypeButtonContainer>
                  </Col>
                </Row>
                <QuestionBlock>
                  {/* loop through TestItems */}
                  {itemIds.map((item, index) => {
                    const questionBlock = []
                    // loop through questions associated with TestItems
                    itemWiseQids[item]?.forEach((q, qIndex) => {
                      const qInd = isDocBased ? qIndex + 1 : index + 1

                      // 0: Skipped, 1: Attempt, 2: Bookmarked
                      const type = questionList[q]

                      /**
                       * 1. to show only one question block per item, irrespective of item level scoring on/off.
                       * 2. comparing  if questionBlock[0].prop.type is less than current type (by type 2,1,0).
                       * 3. Based on #2 we can take the first question block (with the largest value of type) to show on UI.
                       * ref: issue: https://snapwiz.atlassian.net/browse/EV-13029
                       *
                       * 4. Doc based will have only one TestItem but it can have one or more quetions
                       * 5. For doc based questions we need segregate the questions in separate block
                       */
                      if (
                        !questionBlock[0] ||
                        questionBlock[0]?.props?.type < type ||
                        isDocBased
                      ) {
                        // in doc based each question has own label
                        questionBlock[isDocBased ? qIndex : 0] = (
                          <QuestionColorBlock
                            data-cy={`Q${qInd}`}
                            key={index * 100 + qIndex}
                            type={type}
                            isVisible={buttonIdx === null || buttonIdx === type}
                            onClick={
                              blockNavigationToAnsweredQuestions
                                ? () => {}
                                : this.goToQuestion(
                                    test?.testId,
                                    test?.testActivityId,
                                    q
                                  )
                            }
                            cursor={
                              blockNavigationToAnsweredQuestions
                                ? 'not-allowed'
                                : 'pointer'
                            }
                          >
                            <span> {qInd} </span>
                          </QuestionColorBlock>
                        )
                      }
                    })
                    return questionBlock
                  })}
                </QuestionBlock>
              </Questions>
              {!isEmpty(userWork) && (
                <FlexContainer flexDirection="column" mt="40px">
                  <QuestionText lg={8} md={24}>
                    {t('default:Attachments')}
                  </QuestionText>
                  <PerfectScrollbar>
                    <FilesView
                      cols={3}
                      mt="12px"
                      onDelete={this.deleteAttachment}
                      files={userWork}
                      openAttachmentViewModal={this.toggleAttachmentsModal}
                      disableLink
                    />
                  </PerfectScrollbar>
                </FlexContainer>
              )}
            </MainContent>
            <Footer>
              <ShortDescription>{t('common.nextStep')}</ShortDescription>
              <UploadPaperWorkBtn
                data-cy="uploadTestAttachments"
                isGhost
                onClick={openUserWorkUploadModal}
              >
                <IconPhotoCamera />{' '}
                <span>{t('default:UPLOAD PAPER WORK')}</span>
              </UploadPaperWorkBtn>
              <SubmitButton
                type="primary"
                onClick={finishTest}
                loading={savingResponse}
              >
                <IconSend /> <span>{t('default:SUBMIT')}</span>
              </SubmitButton>
            </Footer>
          </Container>
        </AssignmentContentWrapperSummary>
        {showAttachmentsModal && (
          <TestAttachementsModal
            toggleAttachmentsModal={this.toggleAttachmentsModal}
            showAttachmentsModal={showAttachmentsModal}
            attachmentsList={userWork}
            title="All Attachments"
            utaId={test?.testActivityId}
            studentData={studentData}
            attachmentIndexForPreview={attachmentIndexForPreview || 0}
          />
        )}
      </ThemeProvider>
    )
  }
}

SummaryTest.propTypes = {
  finishTest: PropTypes.func.isRequired,
  questionList: PropTypes.array,
  items: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  test: PropTypes.object.isRequired,
}

SummaryTest.defaultProps = {
  questionList: [],
}

const enhance = compose(
  withNamespaces(['summary', 'default']),
  withRouter,
  connect(
    (state) => ({
      questionList: attemptSummarySelector(state),
      assignments: getAssignmentsSelector(state),
      test: state.test,
      items: state.test.items,
      submitingResponse: state.test.savingResponse,
      assignmentId: get(
        state,
        'author_classboard_testActivity.assignmentId',
        ''
      ),
      userWork: getTestLevelUserWorkSelector(state),
      classId: get(state, 'author_classboard_testActivity.classId', ''),
      savingResponse: state?.test?.savingResponse,
      testLoading: testLoadingSelector(state),
      blockNavigationToAnsweredQuestions:
        state.test?.settings?.blockNavigationToAnsweredQuestions,
      studentData: getUser(state),
    }),
    {
      loadTest: loadTestAction,
      saveUserWork: saveUserWorkAction,
    }
  )
)

export default enhance(SummaryTest)

const ShareWrapperCss = css`
  border-radius: 10px;
  padding: 0px 80px;
  background: ${(props) => props.theme.assignment.cardContainerBgColor};
`
const AssignmentContentWrapper = styled.div`
  ${ShareWrapperCss};
  position: absolute;
  bottom: 20px !important;
  @media (max-width: 767px) {
    padding: 0px 15px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    margin: 30px 34px;
    padding: 0px 45px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    padding: 0px 25px;
    margin: 15px 15px;
  }
`

const AssignmentContentWrapperSummary = styled(AssignmentContentWrapper)`
  ${ShareWrapperCss};
  margin: 24px 43px;
  @media (max-width: ${desktopWidth}) {
    margin: 15px 26px;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Header = styled(Container)`
  max-width: 531px;
  margin-top: 50px;
  @media (max-width: ${tabletWidth}) {
    margin-top: 20px;
  }
`

const Title = styled.div`
  font-size: ${(props) => props.theme.attemptReview.headingTextSize};
  color: ${(props) => props.theme.attemptReview.headingColor};
  font-weight: bold;
  letter-spacing: -1px;
  text-align: center;
  @media (min-width: ${smallDesktopWidth}) {
    font-size: ${(props) => props.theme.titleSectionFontSize};
  }
`

const TitleDescription = styled.div`
  font-size: ${(props) => props.theme.attemptReview.titleDescriptionTextSize};
  color: ${lightGrey9};
  margin-top: 13px;
  font-weight: 600;
  text-align: center;
  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${(props) => props.theme.linkFontSize};
  }
`

const MainContent = styled.div`
  margin-top: 22.5px;
  width: 100%;
  padding-top: 38px;
  @media (max-width: ${tabletWidth}) {
    padding-top: 20px;
  }
`

const ColorDescription = styled.div`
  display: flex;
  justify-content: center;
`

const Markers = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 2px;
  flex-shrink: 0;
`
const MarkedAnswered = styled(Markers)`
  background-color: ${(props) =>
    props.theme.attemptReview.markedAnswerBoxColor};
`

const MarkedSkipped = styled(Markers)`
  background-color: ${(props) =>
    props.theme.attemptReview.markedSkippedBoxColor};
`

const MarkedForReview = styled(Markers)`
  background-color: ${(props) =>
    props.theme.attemptReview.markedForReviewBoxColor};
`

const Description = styled.div`
  font-size: ${(props) => props.theme.attemptReview.descriptionTextSize};
  color: ${(props) => props.theme.attemptReview.descriptionTextColor};
  font-weight: 600;
  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${(props) => props.theme.linkFontSize};
  }
`

const ColorDescriptionRow = styled(Row)`
  width: 100%;
`

const FlexCol = styled(Col)`
  display: flex;
  align-items: center;
  @media (max-width: ${smallDesktopWidth}) {
    padding: 0 !important;
  }
  @media (max-width: ${desktopWidth}) {
    margin-top: 10px;
  }
`

const SpaceLeft = styled.div`
  margin-left: 22px;
  @media (max-width: ${smallDesktopWidth}) {
    margin-left: 10px;
  }
`

const Questions = styled.div`
  margin-top: 50px;
  @media (max-width: ${smallDesktopWidth}) {
    margin-top: 40px;
  }
  @media (max-width: ${tabletWidth}) {
    margin-top: 20px;
  }
`

const QuestionText = styled(Col)`
  font-size: ${(props) => props.theme.attemptReview.questiontextSize};
  color: ${(props) => props.theme.attemptReview.titleDescriptionTextColor};
  font-weight: bold;
  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${(props) => props.theme.questionTextnormalFontSize};
  }
`

const AnsweredTypeButtonContainer = styled.div`
  @media (min-width: ${desktopWidth}) {
    float: right;
    padding-left: 20px;
  }
  @media (max-width: ${tabletWidth}) {
    display: flex;
  }
`

const EnabeldButtonStyle = css`
  color: ${(props) => props.theme.headerFilters.headerFilterTextHoverColor};
  background: ${(props) => props.theme.headerFilters.headerFilterBgHoverColor};
`

const StyledButton = styled(Button)`
  height: 24px;
  width: auto;
  padding: 5px 32px;
  color: ${(props) => props.theme.headerFilters.headerFilterTextColor};
  border: 1px solid
    ${(props) => props.theme.headerFilters.headerFilterBgBorderColor};
  border-radius: 4px;
  margin-left: 20px;
  min-width: 85px;
  font-size: ${(props) => props.theme.headerFilters.headerFilterTextSize};
  &:focus,
  &:active,
  &:hover {
    ${EnabeldButtonStyle}
  }
  ${(props) => props.enabled && EnabeldButtonStyle}

  span {
    font-weight: 600;
  }

  @media (max-width: ${largeDesktopWidth}) {
    margin-left: 10px;
    min-width: 85px;
  }

  @media (max-width: ${desktopWidth}) {
    margin: 5px 10px 0px 0px;
    min-width: auto;
  }
  @media (max-width: ${mobileWidthLarge}) {
    margin: 5px 5px 0px 0px;
    padding: 5px 15px;
  }
`

const QuestionBlock = styled.div`
  display: flex;
  flex-flow: wrap;
  margin-top: 31px;
  @media (max-width: ${smallDesktopWidth}) {
    margin-top: 20px;
  }
  @media (max-width: ${tabletWidth}) {
    margin-top: 20px;
  }
`

const QuestionColorBlock = withKeyboard(styled.div`
  width: 60px;
  height: 40px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.type === 2
      ? props.theme.attemptReview.markedForReviewBoxColor
      : props.type === 1
      ? props.theme.attemptReview.markedAnswerBoxColor
      : props.theme.attemptReview.markedSkippedBoxColor};
  margin-right: 23px;
  display: ${(props) => (props.isVisible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  cursor: ${({ cursor }) => cursor || 'pointer'};
  &:hover {
    box-shadow: 4px 6px 11px 0px rgba(0, 0, 0, 0.2);
  }

  span {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 0.3px;
    @media (max-width: ${smallDesktopWidth}) {
      font-size: ${(props) => props.theme.smallFontSize};
    }
  }
  @media (max-width: ${tabletWidth}) {
    margin-right: 20px;
  }
`)

const Footer = styled(Container)`
  margin-top: 121px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: ${smallDesktopWidth}) {
    margin-top: 43px;
  }
  @media (max-width: ${tabletWidth}) {
    margin-top: 20px;
  }
`

const ShortDescription = styled.div`
  font-size: 12px;
  color: #1e1e1e;
  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${(props) => props.theme.linkFontSize};
  }
`

const SubmitButton = styled(Button)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: fixed !important;
  right: 20px;
  top: 10px;
  height: 32px;
  border-radius: 4px;
  background-color: #1a73e8;
  font-size: 10px;
  font-weight: 600;
  svg {
    fill: ${mainBgColor};
    margin-right: 10px;
  }
`

const UploadPaperWorkBtn = styled(EduButton)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: fixed !important;
  right: 125px;
  top: 10px;
  height: 32px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
`
