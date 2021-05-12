import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import {
  FlexContainer,
  EduButton,
  AnswerContext,
  ScrollContext,
  ItemLevelContext as HideScoringBlockContext,
  notification,
} from '@edulastic/common'
import { TitleWrapper } from '@edulastic/common/src/components/MainHeader'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { greyThemeDark2, greyThemeDark4 } from '@edulastic/colors'
import { round, get, omit } from 'lodash'
import { Modal, Popover } from 'antd'
import { roleuser } from '@edulastic/constants'
import { IconTestBank, IconClockCircularOutline } from '@edulastic/icons'
import { testItemsApi, testsApi } from '@edulastic/api'
import { EDIT } from '../../constants/constantsForQuestions'
import {
  setEditingItemIdAction,
  setCurrentStudentIdAction,
  setQuestionDataAction,
  toggleQuestionEditModalAction,
} from '../../../author/src/actions/question'
import {
  changeCurrentQuestionAction,
  getCurrentQuestionSelector,
  deleteQuestionAction,
} from '../../../author/sharedDucks/questions'
import {
  correctItemUpdateProgressAction,
  replaceOriginalItemAction,
  updateCorrectTestItemAction,
} from '../../../author/src/actions/classBoard'
import {
  getAdditionalDataSelector,
  getIsDocBasedTestSelector,
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
import Explanation from './Explanation'
import RegradeProgressModal from '../../../author/Regrade/RegradeProgressModal'

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
  t,
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
  permissionToEdit,
  toggleQuestionModal,
  openQuestionModal,
  showCorrectItem,
  studentId,
  openQuestionMoal,
  setEditingItemId,
  editItemId,
  currentStudentId,
  setCurrentStudentId,
  isQuestionView,
  isExpressGrader,
  isGrade,
  isPrintPreview,
  previewTab,
  isLCBView,
  isDocBasedTest,
  replaceOriginalItem,
  updating,
  correctItemUpdateProgress,
  ...questionProps
}) => {
  // const [openQuestionModal, setOpenQuestionModal] = useState(false)
  const [itemloading, setItemLoading] = useState(false)
  const [hideScoring, setHideScoring] = useState(false)
  const [notifyRegradeProgress, setNotifyRegradeProgress] = useState(false)
  const [isPublishedChanges, setIsPublishedChanges] = useState(false)

  const [showExplanation, updateShowExplanation] = useState(isGrade)

  const onClickShowSolutionHandler = (e) => {
    e.stopPropagation()
    updateShowExplanation(true)
  }

  const onCloseQuestionModal = () => {
    setCurrentQuestion('')
    removeQuestion(item.id)
    toggleQuestionModal(false)
    correctItemUpdateProgress(false)
  }

  const onSaveAndPublish = () => {
    // for now this component will be visible in 3 views for calling the respectve api we need a reference in which author viewing this component.
    let lcbView = 'student-report'
    if (updating) {
      return
    }
    if (isExpressGrader) {
      lcbView = 'express-grader'
    }
    if (isQuestionView) {
      lcbView = 'question-view'
    }
    const payload = {
      studentId,
      assignmentId: match?.params?.assignmentId,
      testId: additionalData?.testId,
      testItemId: editItemId,
      groupId: match?.params?.classId || item?.activity?.groupId,
      testActivityId:
        item?.activity?.testActivityId || match?.params?.testActivityId,
      question: questionData,
      proceedRegrade: false,
      lcbView,
      isUnscored: item?.validation?.unscored,
      callBack: onCloseQuestionModal,
    }
    updateCorrectItem(payload)
  }

  const showQuestionModal = async () => {
    setItemLoading(true)
    try {
      const latestTest = await testsApi.getById(additionalData?.testId, {
        data: true,
        requestLatest: true,
        editAndRegrade: true,
      })
      if (latestTest.isInEditAndRegrade && latestTest.status === 'draft') {
        setItemLoading(false)
        return setNotifyRegradeProgress(true)
      }
      if (
        latestTest._id !== additionalData.testId &&
        latestTest.status === 'published'
      ) {
        setIsPublishedChanges(true)
        setItemLoading(false)
        return setNotifyRegradeProgress(true)
      }
    } catch (e) {
      setItemLoading(false)
      return notification({
        msg: e?.response?.data?.message || 'Unable to retrieve test info.',
      })
    }
    try {
      const testItem = await testItemsApi.getById(item.testItemId)
      const question = testItem.data.questions.find((q) => q.id === item.id)
      setHideScoring(
        question?.scoringDisabled ||
          (testItem.itemLevelScoring && testItem.data.questions.length > 1)
      )
      replaceOriginalItem(testItem)
      setQuestionData(question)
      setCurrentQuestion(question.id)
      setCurrentStudentId(studentId)
      setEditingItemId(testItem._id)
    } catch (e) {
      setQuestionData(omit(item, 'activity'))
      setCurrentQuestion(item.id)
      setEditingItemId(item.testItemId)
    } finally {
      toggleQuestionModal(true)
      setItemLoading(false)
    }
  }

  const onCloseRegardeProgressModal = () => {
    setNotifyRegradeProgress(false)
    setIsPublishedChanges(false)
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
            loading={
              loadingComponents.includes('saveAndPublishItem') || updating
            }
            disabled={updating}
            onClick={onSaveAndPublish}
          >
            SAVE
          </EduButton>
        </FlexContainer>
      </FlexContainer>
    )
  }, [questionData, item, updating])

  const [isDisableCorrectItem, disableCorrectItemText] = useMemo(() => {
    const hasDynamicVariables = item.variable?.enabled
    const {
      allowDuplicate,
      isDisableEdit,
      isDisableDuplicate,
    } = permissionToEdit
    const isDisable = isDisableEdit || hasDynamicVariables || isDisableDuplicate

    if (!showCorrectItem) {
      return [true, 'Edit permission is restricted by the author']
    }
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
      Edit / Regrade
    </CorrectButton>
  )

  const { sampleAnswer } = item

  const isSolutionVisible =
    (isLCBView || isExpressGrader || previewTab === 'show') &&
    !isPrintPreview &&
    !(
      !sampleAnswer ||
      ['passage', 'passageWithQuestions', 'video', 'resource', 'text'].includes(
        item.type
      )
    )
  return (
    <>
      {notifyRegradeProgress && (
        <RegradeProgressModal
          isPublishedChanges={isPublishedChanges}
          visible={notifyRegradeProgress}
          onCloseRegardeProgressModal={onCloseRegardeProgressModal}
        />
      )}
      <BottomActionWrapper className={isStudentReport ? 'student-report' : ''}>
        {isSolutionVisible && !showExplanation && (
          <EduButton
            width="110px"
            height="30px"
            isGhost
            onClick={onClickShowSolutionHandler}
          >
            Show solution
          </EduButton>
        )}
        <div>
          {!hasDrawingResponse && isShowStudentWork && (
            <ShowUserWork onClick={onClickHandler} loading={loading} />
          )}
        </div>
        <RightWrapper>
          {showCorrectItem &&
            item &&
            !isStudentReport &&
            !isDocBasedTest &&
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
          {!!timeSpent && <TimeSpent time={timeSpent} />}
        </RightWrapper>
      </BottomActionWrapper>
      {isSolutionVisible && (
        <Explanation
          isStudentReport={isStudentReport}
          question={item}
          show={showExplanation}
        />
      )}
      {!isStudentReport &&
        openQuestionModal &&
        QuestionComp &&
        questionData &&
        questionData?.id === item?.id &&
        currentStudentId === studentId && (
          <QuestionPreviewModal
            width="1080px"
            footer={null}
            style={{ top: 10 }}
            title={modalTitle}
            visible={openQuestionModal}
            wrapClassName="edit-regrade-modal"
            onCancel={onCloseQuestionModal}
          >
            <ScrollContext.Provider
              value={{
                getScrollElement: () =>
                  document.getElementsByClassName('edit-regrade-modal')[0],
              }}
            >
              <AnswerContext.Provider value={{ isAnswerModifiable: true }}>
                <HideScoringBlockContext.Provider value={hideScoring}>
                  <QuestionComp
                    {...questionProps}
                    t={t}
                    item={questionData}
                    view={EDIT}
                    disableResponse={false}
                  />
                </HideScoringBlockContext.Provider>
              </AnswerContext.Provider>
            </ScrollContext.Provider>
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
  isQuestionView: PropTypes.bool,
}

QuestionBottomAction.defaultProps = {
  loading: false,
  isStudentReport: false,
  item: null,
  isQuestionView: false,
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
      openQuestionModal: get(state, ['authorUi', 'questionEditModalOpen']),
      questionData: getCurrentQuestionSelector(state),
      additionalData: getAdditionalDataSelector(state),
      permissionToEdit: getPermissionToEdit(state, ownProps),
      showCorrectItem: getShowCorrectItemButton(state),
      editItemId: get(state, ['authorUi', 'editItemId']),
      currentStudentId: get(state, ['authorUi', 'currentStudentId']),
      isDocBasedTest: getIsDocBasedTestSelector(state),
      updating: get(state, ['classResponse', 'updating'], false),
    }),
    {
      setQuestionData: setQuestionDataAction,
      setCurrentQuestion: changeCurrentQuestionAction,
      updateCorrectItem: updateCorrectTestItemAction,
      removeQuestion: deleteQuestionAction,
      toggleQuestionModal: toggleQuestionEditModalAction,
      setEditingItemId: setEditingItemIdAction,
      setCurrentStudentId: setCurrentStudentIdAction,
      replaceOriginalItem: replaceOriginalItemAction,
      correctItemUpdateProgress: correctItemUpdateProgressAction,
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
  .ant-select-dropdown,
  .ant-dropdown {
    z-index: 1003; /* modal has higher z index*/
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
