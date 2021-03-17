import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { FlexContainer, EduButton } from '@edulastic/common'
import { TitleWrapper } from '@edulastic/common/src/components/MainHeader'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { greyThemeDark2, greyThemeDark4 } from '@edulastic/colors'
import { round, get, omit } from 'lodash'
import { Modal } from 'antd'
import { IconTestBank, IconClockCircularOutline } from '@edulastic/icons'
import { EDIT } from '../../constants/constantsForQuestions'
import { setQuestionDataAction } from '../../../author/src/actions/question'
import {
  changeCurrentQuestionAction,
  getCurrentQuestionSelector,
  deleteQuestionAction,
} from '../../../author/sharedDucks/questions'
import { updateCorrectTestItemAction } from '../../../author/src/actions/classBoard'

const QuestionBottomAction = ({
  item,
  loading,
  isStudentReport,
  isShowStudentWork,
  onClickHandler,
  timeSpent,
  margin,
  loadingComponents,
  QuestionComp,
  setQuestionData,
  setCurrentQuestion,
  questionData,
  removeQuestion,
  updateCorrectItem,
  ...questionProps
}) => {
  const [openQuestionMoal, setOpenQuestionModal] = useState(false)
  const onSaveAndPublish = () => {
    updateCorrectItem({
      assignmentId: item?.activity?.assignmentId,
      testItemId: item?.activity?.testItemId,
      testId: item?.activity?.testId,
      groupId: item?.activity?.groupId,
      testActivityId: item?.activity?.testActivityId,
      studentId: item?.activity?.userId,
      question: questionData,
    })
    setOpenQuestionModal(false)
  }

  const onCloseQuestionModal = () => {
    setCurrentQuestion('')
    removeQuestion(item.id)
    setOpenQuestionModal(false)
  }

  const showQuestionModal = () => {
    setQuestionData(omit(item, 'activity'))
    setCurrentQuestion(item.id)
    setOpenQuestionModal(true)
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
            PUBLISH
          </EduButton>
        </FlexContainer>
      </FlexContainer>
    )
  }, [questionData, item])

  return (
    <>
      <BottomActionWrapper
        className={isStudentReport ? 'student-report' : ''}
        margin={margin}
      >
        <div>
          {isShowStudentWork && (
            <EduButton
              isGhost
              height="24px"
              type="primary"
              fontSize="10px"
              onClick={onClickHandler}
              loading={loading}
            >
              Show student work
            </EduButton>
          )}
        </div>
        <RightWrapper>
          {item && (
            <EduButton
              isGhost
              height="24px"
              type="primary"
              fontSize="10px"
              mr="8px"
              onClick={showQuestionModal}
              loading={loading}
            >
              Correct Item
            </EduButton>
          )}
          {timeSpent && (
            <div>
              <IconClockCircularOutline />
              {round(timeSpent / 1000, 1)}s
            </div>
          )}
        </RightWrapper>
      </BottomActionWrapper>
      {openQuestionMoal && QuestionComp && questionData && (
        <QuestionPreviewModal
          visible={openQuestionMoal}
          onCancel={onCloseQuestionModal}
          title={modalTitle}
          footer={null}
          width="1080px"
        >
          <QuestionComp
            {...questionProps}
            item={questionData}
            view={EDIT}
            disableResponse={false}
          />
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

const mapStateToProps = (state) => ({
  loading: state.scratchpad.loading,
  loadingComponents: get(state, ['authorUi', 'currentlyLoading'], []),
  questionData: getCurrentQuestionSelector(state),
})

export default connect(mapStateToProps, {
  setQuestionData: setQuestionDataAction,
  setCurrentQuestion: changeCurrentQuestionAction,
  updateCorrectItem: updateCorrectTestItemAction,
  removeQuestion: deleteQuestionAction,
})(QuestionBottomAction)

const BottomActionWrapper = styled.div`
  font-size: 19px;
  color: ${greyThemeDark2};
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  align-items: center;
  margin: ${({ margin }) => margin};

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
