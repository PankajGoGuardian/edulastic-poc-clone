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
import { roleuser } from '@edulastic/constants'
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
import {
  getAdditionalDataSelector,
  getShowCorrectItemButton,
} from '../../../author/ClassBoard/ducks'
import {
  getUserId,
  getUserRole,
  getUserFeatures,
  getCollectionsSelector,
  getWritableCollectionsSelector,
} from '../../../author/src/selectors/user'

import {
  allowDuplicateCheck,
  allowContentEditCheck,
} from '../../../author/src/utils/permissionCheck'

const QuestionBottomAction = ({
  t,
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
  additionalData,
  match,
  permissionToEdit,
  toggleQuestionModal,
  openQuestionModal,
  showCorrectItem,
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
      isUnscored: item?.validation?.unscored,
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

  const [isDisableCorrectItem, disableCorrectItemText] = useMemo(() => {
    const hasDynamicVariables = item.variable?.enabled
    const {
      allowDuplicate,
      isDisableEdit,
      isDisableDuplicate,
    } = permissionToEdit
    const isDisable = isDisableEdit || hasDynamicVariables || isDisableDuplicate

    let disableText = ''
    if (isDisableEdit && !allowDuplicate) {
      disableText = 'Edit of Item is restricted by Publisher'
    } else if ((isDisableEdit && allowDuplicate) || isDisableDuplicate) {
      disableText = 'Edit permission is restricted by the author'
    } else if (hasDynamicVariables) {
      disableText = t('component.correctItemNotAllowDynamic')
    }
    return [isDisable, disableText]
  }, [item.variable?.enabled, permissionToEdit])

  const correctItemBtn = (
    <CorrectButton
      isGhost
      height="24px"
      type="primary"
      fontSize="10px"
      mr="8px"
      onClick={showQuestionModal}
      loading={loading || itemloading}
      disabled={isDisableCorrectItem}
    >
      Correct Item
    </CorrectButton>
  )

  return (
    <>
      <BottomActionWrapper
        className={isStudentReport ? 'student-report' : ''}
        margin={margin}
      >
        <div>
          {isShowStudentWork && (
            <EduButton
              data-cy="showStudentWork"
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
          {showCorrectItem &&
            item &&
            !isStudentReport &&
            (isDisableCorrectItem ? (
              <Popover
                content={
                  <DisabledHelperText>
                    {disableCorrectItemText}
                  </DisabledHelperText>
                }
              >
                <div>{correctItemBtn}</div>
              </Popover>
            ) : (
              correctItemBtn
            ))}
          {timeSpent && (
            <div>
              <IconClockCircularOutline />
              {round(timeSpent / 1000, 1)}s
            </div>
          )}
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

const getPermissionToEdit = (state, props) => {
  const userId = getUserId(state)
  const userRole = getUserRole(state)
  const writableCollections = getWritableCollectionsSelector(state)
  const userFeatures = getUserFeatures(state)
  const collections = getCollectionsSelector(state)
  const testItems = get(state, 'classResponse.data.testItems', [])
  const testItem =
    testItems.find((t) => t._id === props.item?.activity?.testItemId) || {}
  const { authors = [] } = testItem || {}
  const isOwner = authors.some((author) => author._id === userId)
  const hasCollectionAccess = allowContentEditCheck(
    testItem?.collections,
    writableCollections
  )
  const allowDuplicate = allowDuplicateCheck(
    testItem?.collections,
    collections,
    'item'
  )

  const isDisableEdit = !(
    isOwner ||
    userRole === roleuser.EDULASTIC_CURATOR ||
    (hasCollectionAccess && userFeatures.isCurator) ||
    (isOwner && allowDuplicate)
  )

  const isDisableDuplicate = !(
    allowDuplicate && userRole !== roleuser.EDULASTIC_CURATOR
  )

  return { isDisableEdit, allowDuplicate, isDisableDuplicate }
}

const enhance = compose(
  withRouter,
  connect(
    (state, ownProps) => ({
      loading: state.scratchpad.loading,
      loadingComponents: get(state, ['authorUi', 'currentlyLoading'], []),
      questionData: getCurrentQuestionSelector(state),
      additionalData: getAdditionalDataSelector(state),
      permissionToEdit: getPermissionToEdit(state, ownProps),
      showCorrectItem: getShowCorrectItemButton(state),
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

const BottomActionWrapper = styled.div`
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
