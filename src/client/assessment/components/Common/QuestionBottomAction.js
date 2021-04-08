import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { FlexContainer, EduButton, AnswerContext } from '@edulastic/common'
import { TitleWrapper } from '@edulastic/common/src/components/MainHeader'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { greyThemeDark2, greyThemeDark4 } from '@edulastic/colors'
import { round, get, omit } from 'lodash'
import { Modal, Popover } from 'antd'
import { IconTestBank, IconClockCircularOutline } from '@edulastic/icons'
import { testItemsApi } from '@edulastic/api'
import { EDIT } from '../../constants/constantsForQuestions'
import { setQuestionDataAction } from '../../../author/src/actions/question'
import {
  changeCurrentQuestionAction,
  getCurrentQuestionSelector,
  deleteQuestionAction,
} from '../../../author/sharedDucks/questions'
import { updateCorrectTestItemAction } from '../../../author/src/actions/classBoard'
import { getAdditionalDataSelector } from '../../../author/ClassBoard/ducks'

export const ShowUserWork = ({ onClick, loading }) => (
  <EduButton
    data-cy="showStudentWork"
    isGhost
    height="24px"
    type="primary"
    fontSize="10px"
    onClick={onClick}
    loading={loading}
  >
    Show student work
  </EduButton>
)

export const TimeSpent = ({ time }) => {
  return (
    <div>
      <IconClockCircularOutline />
      {round(time / 1000, 1)}s
    </div>
  )
}

const QuestionBottomAction = ({
  item,
  loading,
  isStudentReport,
  isShowStudentWork,
  onClickHandler,
  timeSpent,
  hasDrawingResponse,
  loadingComponents,
  QuestionComp,
  setQuestionData,
  setCurrentQuestion,
  questionData,
  removeQuestion,
  updateCorrectItem,
  additionalData,
  match,
  t,
  ...questionProps
}) => {
  const [openQuestionMoal, setOpenQuestionModal] = useState(false)
  const [itemloading, setItemLoading] = useState(false)

  const onCloseQuestionModal = () => {
    setCurrentQuestion('')
    removeQuestion(item.id)
    setOpenQuestionModal(false)
  }

  const onSaveAndPublish = () => {
    updateCorrectItem({
      assignmentId: match?.params?.assignmentId,
      testId: additionalData?.testId,
      testItemId: item?.activity?.testItemId,
      groupId: item?.activity?.groupId,
      testActivityId: item?.activity?.testActivityId,
      studentId: item?.activity?.userId,
      question: questionData,
      proceedRegrade: false,
      callBack: onCloseQuestionModal,
    })
  }
  const showQuestionModal = async () => {
    setItemLoading(true)
    try {
      const testItem = await testItemsApi.getById(item?.activity?.testItemId)
      const question = testItem.data.questions.find((q) => q.id === item.id)
      setQuestionData(question)
      setCurrentQuestion(question.id)
    } catch (e) {
      setQuestionData(omit(item, 'activity'))
      setCurrentQuestion(item.id)
    } finally {
      setOpenQuestionModal(true)
      setItemLoading(false)
    }
  }

  const modalTitle = useMemo(() => {
    if (!QuestionComp || !questionData) {
      return null
    }
    const { title } = questionData
    return (
      <FlexContainer
        justifyContent="space-between"
        data-cy="header-wrapper"
        alignItems="center"
      >
        <FlexContainer justifyContent="flex-start" alignItems="center">
          <IconTestBank className="question-bank-icon" />
          <FlexContainer marginLeft="18px" flexDirection="column">
            <TitleWrapper noEllipsis>{title}</TitleWrapper>
            <QuestionReference>Reference 1821347432</QuestionReference>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer justifyContent="flex-end">
          <EduButton
            isBlue
            isGhost
            onClick={onCloseQuestionModal}
            width="115px"
          >
            CANCEL
          </EduButton>
          <EduButton
            isBlue
            width="115px"
            data-cy="saveAndPublishItem"
            loading={loadingComponents.includes('saveAndPublishItem')}
            onClick={onSaveAndPublish}
          >
            SAVE
          </EduButton>
        </FlexContainer>
      </FlexContainer>
    )
  }, [questionData, item])

  const hasDynamicVariables = item?.variable?.enabled

  const correctItemBtn = (
    <CorrectButton
      isGhost
      height="24px"
      type="primary"
      fontSize="10px"
      mr="8px"
      onClick={showQuestionModal}
      loading={loading || itemloading}
      disabled={hasDynamicVariables}
    >
      Correct Item
    </CorrectButton>
  )

  return (
    <>
      <BottomActionWrapper className={isStudentReport ? 'student-report' : ''}>
        <div>
          {!hasDrawingResponse && isShowStudentWork && (
            <ShowUserWork onClick={onClickHandler} loading={loading} />
          )}
        </div>
        <RightWrapper>
          {item &&
            !isStudentReport &&
            (hasDynamicVariables ? (
              <Popover
                content={
                  <DisabledHelperText>
                    {t('component.correctItemNotAllowDynamic')}
                  </DisabledHelperText>
                }
              >
                <div>{correctItemBtn}</div>
              </Popover>
            ) : (
              correctItemBtn
            ))}
          {timeSpent && <TimeSpent time={timeSpent} />}
        </RightWrapper>
      </BottomActionWrapper>
      {!isStudentReport && openQuestionMoal && QuestionComp && questionData && (
        <QuestionPreviewModal
          visible={openQuestionMoal}
          onCancel={onCloseQuestionModal}
          title={modalTitle}
          footer={null}
          width="1080px"
          style={{ top: 10 }}
        >
          <AnswerContext.Provider value={{ isAnswerModifiable: true }}>
            <QuestionComp
              {...questionProps}
              t={t}
              item={questionData}
              view={EDIT}
              disableResponse={false}
            />
          </AnswerContext.Provider>
        </QuestionPreviewModal>
      )}
    </>
  )
}

QuestionBottomAction.propTypes = {
  onClickHandler: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  setCurrentQuestion: PropTypes.func.isRequired,
  updateCorrectItem: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  isShowStudentWork: PropTypes.bool.isRequired,
  loadingComponents: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  item: PropTypes.object,
  isStudentReport: PropTypes.bool,
}

QuestionBottomAction.defaultProps = {
  loading: false,
  isStudentReport: false,
  item: null,
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      loading: state.scratchpad.loading,
      loadingComponents: get(state, ['authorUi', 'currentlyLoading'], []),
      questionData: getCurrentQuestionSelector(state),
      additionalData: getAdditionalDataSelector(state),
    }),
    {
      setQuestionData: setQuestionDataAction,
      setCurrentQuestion: changeCurrentQuestionAction,
      updateCorrectItem: updateCorrectTestItemAction,
      removeQuestion: deleteQuestionAction,
    }
  )
)
export default enhance(QuestionBottomAction)

export const BottomActionWrapper = styled.div`
  font-size: 19px;
  color: ${greyThemeDark2};
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  align-items: center;
  margin: ${({ margin }) => margin || '24px 0px 16px'};

  &.student-report {
    position: absolute;
    top: 25px;
    right: 0px;
    background: #f3f3f3;
    padding: 10px 15px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    svg {
      margin-right: 10px;
      fill: #6a737f;
    }
  }
  svg {
    margin-right: 8px;
    fill: ${greyThemeDark2};
  }
`

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
`

const QuestionPreviewModal = styled(Modal)`
  .ant-modal-header {
    padding: 8px 30px 8px 24px;

    .question-bank-icon {
      width: 16px;
      height: 19px;
    }
  }
  .ant-modal-close-x {
    display: none;
  }
`

const QuestionReference = styled.div`
  font-size: 13px;
  color: ${greyThemeDark4};
`

const DisabledHelperText = styled.div`
  max-width: 290px;
`
const CorrectButton = styled(EduButton)`
  padding: 5px 29px;
  .anticon-loading {
    position: absolute;
    left: 22px;
    top: 4px;
  }
`
