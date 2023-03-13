import { tabletWidth, white, themeColor } from '@edulastic/colors'
import { MainHeader, EduButton, notification } from '@edulastic/common'
import { roleuser, test as testConstants } from '@edulastic/constants'
import {
  IconAddItems,
  IconCopy,
  IconDescription,
  IconDiskette,
  IconPencilEdit,
  IconPrint,
  IconReview,
  IconTick,
  IconSend,
  IconSettings,
  IconShare,
  IconTestBank,
  IconTrashAlt,
  IconItemGroup,
} from '@edulastic/icons'
import PropTypes from 'prop-types'
import React, { memo, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { Modal } from 'antd'
import { AUDIO_RESPONSE } from '@edulastic/constants/const/questionType'
import {
  getUserFeatures,
  getUserId,
  getUserRole,
  toggleAdminAlertModalAction,
  toggleVerifyEmailModalAction,
  getEmailVerified,
  getVerificationTS,
  isDefaultDASelector,
  isDemoPlaygroundUser,
} from '../../../../student/Login/ducks'
import ConfirmCancelTestEditModal from '../../../src/components/common/ConfirmCancelTestEditModal'
import FilterToggleBtn from '../../../src/components/common/FilterToggleBtn'
import { getStatus } from '../../../src/utils/getStatus'
import {
  publishForRegradeAction,
  getTestsCreatingSelector,
  shouldDisableSelector,
  getTestItemsSelector,
  getShowRegradeConfirmPopupSelector,
  setShowRegradeConfirmPopupAction,
  getRegradeFirebaseDocIdSelector,
  getShowUpgradePopupSelector,
  getQuestionTypesInTestSelector,
  getIsAudioResponseQuestionEnabled,
} from '../../ducks'
import { fetchAssignmentsAction, getAssignmentsSelector } from '../Assign/ducks'
import TestPageNav from '../TestPageNav/TestPageNav'
import {
  MobileHeaderFilterIcon,
  RightFlexContainer,
  RightWrapper,
  ShareIcon,
  TestStatus,
} from './styled'
import PrintTestModal from '../../../src/components/common/PrintTestModal'
import {
  getIsCurator,
  isFreeAdminSelector,
  isSAWithoutSchoolsSelector,
} from '../../../src/selectors/user'
import { validateQuestionsForDocBased } from '../../../../common/utils/helpers'
import AuthorCompleteSignupButton from '../../../../common/components/AuthorCompleteSignupButton'
import RegradeNotificationListener from '../../../Regrade/RegradeNotificationListener'
import ConfirmRegradeModal from '../../../Regrade/ConfirmRegradeModal'
import Upgrade from '../../../Regrade/Upgrade'
import { DeleteItemModal } from '../../../TestList/components/DeleteItemModal/deleteItemModal'
import { LARGE_DESKTOP_WIDTH } from '../../../../assessment/constants/others'
import { deletePlaylistRequestAction } from '../../../CurriculumSequence/ducks'

/**
 *
 * @param {string} id
 * @param {string} title
 * @param {Function} deletePlaylist
 */
function handleConfirmForDeletePlaylist(id, title, deletePlaylist) {
  Modal.confirm({
    title: 'Do you want to delete ?',
    content: `Are you sure you want to Delete the Playlist "${title}"?`,
    onOk: () => {
      deletePlaylist(id)
      Modal.destroyAll()
    },
    okText: 'Continue',
    centered: true,
    width: 500,
    okButtonProps: {
      style: { background: themeColor, outline: 'none' },
    },
  })
}

const {
  statusConstants,
  testContentVisibility: testContentVisibilityOptions,
  testCategoryTypes,
} = testConstants

export const navButtonsTest = [
  {
    icon: <IconDescription color={white} width={16} height={16} />,
    value: 'description',
    text: 'Description',
  },
  {
    icon: <IconAddItems color={white} width={16} height={16} />,
    value: 'addItems',
    text: 'Add Items',
  },
  {
    icon: <IconTick color={white} width={16} height={16} />,
    value: 'review',
    text: 'Review',
  },
  {
    icon: <IconSettings color={white} width={16} height={16} />,
    value: 'settings',
    text: 'Settings',
  },
]
export const playlistNavButtons = [
  {
    icon: <IconDescription color={white} width={16} height={16} />,
    value: 'summary',
    text: 'Summary',
  },
  {
    icon: <IconReview color={white} width={24} height={24} />,
    value: 'review',
    text: 'Manage Content',
  },
  {
    icon: <IconSettings color={white} width={16} height={16} />,
    value: 'settings',
    text: 'Settings',
  },
]
export const docBasedButtons = [
  {
    icon: <IconDescription color={white} width={16} height={16} />,
    value: 'description',
    text: 'Description',
  },
  {
    icon: <IconAddItems color={white} width={16} height={16} />,
    value: 'worksheet',
    text: 'Worksheet',
  },
  {
    icon: <IconReview color={white} width={16} height={16} />,
    value: 'review',
    text: 'Review',
  },
  {
    icon: <IconSettings color={white} width={16} height={16} />,
    value: 'settings',
    text: 'Settings',
  },
]
export const navButtonsDynamicTest = [
  {
    icon: <IconDescription color={white} width={16} height={16} />,
    value: 'description',
    text: 'Description',
  },
  {
    icon: <IconItemGroup color={white} width={16} height={16} />,
    value: 'addSections',
    text: 'Add Sections',
  },
  {
    icon: <IconTick color={white} width={16} height={16} />,
    value: 'review',
    text: 'Review',
  },
  {
    icon: <IconSettings color={white} width={16} height={16} />,
    value: 'settings',
    text: 'Settings',
  },
]
// TODO mobile look
const TestPageHeader = ({
  onChangeNav,
  current,
  onSave,
  buttons,
  isDocBased = false,
  title,
  onShare,
  isUsed = false,
  onPublish,
  showEditButton = false,
  editEnable = false,
  windowWidth,
  onEnableEdit,
  showPublishButton,
  hasTestId,
  testStatus,
  isPlaylist,
  owner,
  onAssign,
  history,
  publishForRegrade,
  test,
  updated,
  toggleFilter,
  isShowFilter,
  fetchAssignments,
  testAssignments,
  match,
  showDuplicateButton,
  handleDuplicateTest,
  showCancelButton,
  features,
  userId,
  onCuratorApproveOrReject,
  userRole,
  creating,
  isLoadingData,
  playlistStatus,
  testItems,
  isTestLoading,
  validateTest,
  setDisableAlert,
  playlistHasDraftTests,
  isCurator,
  hasCollectionAccess,
  authorQuestionsById,
  isUpdatingTestForRegrade,
  isFreeAdmin,
  isSAWithoutSchools,
  toggleAdminAlertModal,
  emailVerified,
  verificationTS,
  isDefaultDA,
  toggleVerifyEmailModal,
  showRegradeConfirmPopup,
  setShowRegradeConfirmPopup,
  regradeFirebaseDocId,
  showUpgradePopup,
  isDemoPlayground = false,
  deletePlaylist,
  questionTypesInTest,
  enableAudioResponseQuestion,
}) => {
  let navButtons =
    buttons ||
    (isPlaylist
      ? [...playlistNavButtons]
      : isDocBased
      ? [...docBasedButtons]
      : test?.testCategory === testCategoryTypes.DYNAMIC_TEST
      ? [...navButtonsDynamicTest]
      : [...navButtonsTest])
  const [showCancelPopup, setShowCancelPopup] = useState(false)
  const [showPrintOptionPopup, setShowPrintOptionPopup] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const isPublishers = !!(features.isCurator || features.isPublisherAuthor)
  const isEdulasticCurator = userRole === roleuser.EDULASTIC_CURATOR
  const playlistId = match?.params?.id

  useEffect(() => {
    // TODO: As this component used also in playlist page, please call below api conditionally if no purpose of calling assignments list.
    if (!creating && match?.params?.oldId) {
      fetchAssignments({
        testId: match?.params?.oldId,
        regradeAssignments: true,
      })
    } else if (!creating && test?._id) {
      const testId =
        (test.status === 'draft' && test.isUsed) || showUpgradePopup
          ? test.previousTestId
          : test._id
      fetchAssignments({ testId, regradeAssignments: true })
    }
  }, [test?._id, match?.params?.oldId])

  const onRegradeConfirm = () => {
    if (validateTest(test)) {
      if (test.isDocBased) {
        const assessmentQuestions = Object.values(authorQuestionsById || {})
        if (!validateQuestionsForDocBased(assessmentQuestions, false)) {
          return
        }
      }
      publishForRegrade(test._id)
    }
  }

  const onCancelRegrade = () => {
    setShowRegradeConfirmPopup(false)
    notification({
      type: 'warn',
      msg:
        'Assignment Regrade has been cancelled and changes have not been published.',
    })
  }

  const handlePublish = () => {
    if (isPlaylist && playlistHasDraftTests()) {
      Modal.confirm({
        title: 'Do you want to Publish ?',
        content:
          'Playlist has some draft Test. Publishing the playlist will not display the draft test to users until they are published.',
        onOk: () => {
          onPublish()
          Modal.destroyAll()
        },
        okText: 'Yes, Publish',
        centered: true,
        width: 500,
        okButtonProps: {
          style: { background: themeColor, outline: 'none' },
        },
      })
      return
    }
    if (
      isUsed &&
      (updated || test.status !== statusConstants.PUBLISHED) &&
      testAssignments?.length > 0
    ) {
      onRegradeConfirm()
      return
    }

    onPublish()
  }

  const isNotRegradable = () => {
    const isTeacher = userRole === roleuser.TEACHER
    const isAuthorsTest =
      test.itemGroups.some((group) => group.type === 'AUTOSELECT') ||
      test.itemGroups.length > 1
    return isTeacher && isAuthorsTest
  }

  const handleRegrade = () => {
    if (isNotRegradable()) {
      // For time being block teacher regrading a authors test is blocked here
      notification({ type: 'warn', messageKey: 'teacherCantRegrade' })
      return onPublish()
    }
    setDisableAlert(true)
    onRegradeConfirm()
    return true
  }

  const handleAssign = () => {
    if (isFreeAdmin || isSAWithoutSchools) return toggleAdminAlertModal()
    if (!emailVerified && verificationTS && !isDefaultDA) {
      const existingVerificationTS = new Date(verificationTS)
      const expiryDate = new Date(
        existingVerificationTS.setDate(existingVerificationTS.getDate() + 14)
      ).getTime()
      if (expiryDate < Date.now()) {
        history.push(userRole === 'teacher' ? '/' : '/author/items')
        return toggleVerifyEmailModal(true)
      }
    }
    const containsAudioResponseTypeQuestion = questionTypesInTest.includes(
      AUDIO_RESPONSE
    )
    const audioResponseQuestionDisabledByDA = !enableAudioResponseQuestion
    const cannotAssignAudioResponseQuestion = [
      containsAudioResponseTypeQuestion,
      audioResponseQuestionDisabledByDA,
    ].every((o) => !!o)

    if (cannotAssignAudioResponseQuestion) {
      notification({ messageKey: 'testContainsAudioResponseTypeQuestion' })
      return
    }
    onAssign()
  }

  const setCancelState = (val) => {
    setShowCancelPopup(val)
  }

  const handleCancelEdit = () => {
    setCancelState(false)
  }

  const confirmCancel = () => {
    if (history.location.state?.editTestFlow) {
      return history.push('/author/tests')
    }
    history.push('/author/assignments')
  }

  if (!owner) {
    navButtons = navButtons.slice(2)
  }

  let isDirectOwner = owner
  const { authors } = test
  if (features.isCurator && authors && !authors.find((o) => o._id === userId)) {
    isDirectOwner = false
  }

  const onClickCuratorApprove = () => {
    const { collections = [], _id: testId } = test
    onCuratorApproveOrReject({ testId, status: 'published', collections })
  }

  const onClickCuratorReject = () => {
    const { _id: testId } = test
    onCuratorApproveOrReject({ testId, status: 'rejected' })
  }

  const handlePrintTest = () => {
    const isAdmin =
      userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN
    if (
      !isAdmin &&
      (test?.testContentVisibility === testContentVisibilityOptions.HIDDEN ||
        test?.testContentVisibility === testContentVisibilityOptions.GRADING)
    ) {
      return notification({
        type: 'warn',
        messageKey: 'viewOfItemsRestricted',
      })
    }
    setShowPrintOptionPopup(true)
  }

  const handleOnClickPrintCancel = () => setShowPrintOptionPopup(false)

  const handleOnClickPrintConfirm = (params) => {
    const { type, customValue, showAnswers } = params
    handleOnClickPrintCancel()
    window.open(
      `/author/printAssessment/${test?._id}?type=${type}&qs=${customValue}&showAnswers=${showAnswers}`,
      '_blank'
    )
  }

  const onDelete = (id, _title, _deletePlaylist) => {
    if (isPlaylist) {
      handleConfirmForDeletePlaylist(id, _title, _deletePlaylist)
    } else {
      setIsDeleteModalOpen(true)
    }
  }

  const onDeleteModelCancel = () => {
    setIsDeleteModalOpen(false)
  }

  const headingSubContent = (
    <TestStatus
      data-cy="status"
      className={
        (isPlaylist || editEnable) && !isEdulasticCurator && !isCurator
          ? 'draft'
          : isPlaylist
          ? playlistStatus
          : testStatus
      }
    >
      {(isPlaylist || editEnable) && !isEdulasticCurator && !isCurator
        ? 'DRAFT'
        : getStatus(isPlaylist ? playlistStatus : testStatus)}
    </TestStatus>
  )

  const isRegradeFlow =
    test.isUsed &&
    !!testAssignments.length &&
    !isEdulasticCurator &&
    !isCurator &&
    (testStatus === 'draft' || editEnable)
  // if edit assigned there should be assignments to enable the buttons
  const disableButtons =
    isLoadingData ||
    (history.location.state?.editAssigned &&
      !testAssignments.length &&
      !test.isInEditAndRegrade)

  const isTestContainsDraftItem = testItems.some(
    (i) => i.status === statusConstants.DRAFT
  )

  const showPublishForEC =
    test.status === statusConstants.PUBLISHED &&
    isTestContainsDraftItem &&
    (isEdulasticCurator || isCurator) &&
    !isPlaylist

  const headerTitleWidth =
    windowWidth >= LARGE_DESKTOP_WIDTH
      ? '450px'
      : isPlaylist
      ? '290px'
      : '250px'
  return (
    <>
      <Upgrade />
      <ConfirmRegradeModal
        visible={showRegradeConfirmPopup}
        onCancel={onCancelRegrade}
      />
      <ConfirmCancelTestEditModal
        showCancelPopup={showCancelPopup}
        onCancel={handleCancelEdit}
        onOk={confirmCancel}
        onClose={() => setCancelState(false)}
      />
      {isDeleteModalOpen ? (
        <DeleteItemModal
          isVisible={isDeleteModalOpen}
          onCancel={onDeleteModelCancel}
          testId={test._id}
          test={test}
          view="testReview"
        />
      ) : null}
      {showPrintOptionPopup && (
        <PrintTestModal
          onProceed={handleOnClickPrintConfirm}
          onCancel={handleOnClickPrintCancel}
          currentTestId={test?._id}
          showAnswerCheckbox
        />
      )}
      {windowWidth >= parseInt(tabletWidth, 10) ? (
        <MainHeader
          headingText={
            title || (isPlaylist ? 'Untitled Playlist' : 'Untitled Test')
          }
          Icon={IconTestBank}
          headingSubContent={headingSubContent}
          titleMarginTop="10px"
          flexDirection="row"
          alignItems="center"
          titleMaxWidth={headerTitleWidth}
          headerLeftClassName="headerLeftWrapper"
          containerClassName="tabAlignment"
          hasTestId={hasTestId}
        >
          <TestPageNav
            onChange={onChangeNav}
            current={current}
            buttons={navButtons}
            owner={owner}
            showPublishButton={!hasTestId || showPublishButton}
          />

          <RightFlexContainer
            childMarginRight="5"
            justifyContent="flex-end"
            mt="12px"
            width={isPlaylist ? '100%' : 'auto'}
          >
            {hasTestId && !isPlaylist && !isDocBased && !test?.isDocBased && (
              <EduButton
                title="Print"
                isBlue
                isGhost
                IconBtn
                data-cy="printTest"
                disabled={isTestLoading}
                onClick={handlePrintTest}
              >
                <IconPrint />
              </EduButton>
            )}
            {hasTestId && (owner || features.isCurator) && !isEdulasticCurator && (
              <EduButton
                isBlue
                isGhost
                IconBtn
                title={
                  isDemoPlayground
                    ? 'This feature is not available in demo account.'
                    : 'Share'
                }
                data-cy="share"
                onClick={onShare}
                disabled={disableButtons || isDemoPlayground}
              >
                <IconShare />
              </EduButton>
            )}
            {hasTestId && owner && test.status === 'draft' && (
              <EduButton
                isBlue
                isGhost
                IconBtn
                title={
                  isDemoPlayground
                    ? 'This feature is not available in demo account.'
                    : 'Delete'
                }
                data-cy="delete-test"
                onClick={() => onDelete(playlistId, title, deletePlaylist)}
                disabled={disableButtons || isDemoPlayground}
              >
                <IconTrashAlt />
              </EduButton>
            )}
            {hasTestId && owner && showPublishButton && !showPublishForEC && (
              <EduButton
                isBlue
                isGhost
                IconBtn
                title="Save as Draft"
                data-cy="save"
                onClick={onSave}
                disabled={disableButtons}
              >
                <IconDiskette />
              </EduButton>
            )}
            {hasTestId &&
            owner &&
            showPublishButton &&
            !isEdulasticCurator &&
            isDirectOwner ? (
              isPlaylist ? (
                <EduButton
                  isBlue
                  title="Publish Playlist"
                  data-cy="publish"
                  onClick={handlePublish}
                  disabled={disableButtons}
                >
                  PUBLISH
                </EduButton>
              ) : (
                !editEnable &&
                !isRegradeFlow && (
                  <EduButton
                    isBlue
                    isGhost
                    IconBtn={!isPublishers}
                    title="Publish and Assign later"
                    data-cy="publish"
                    onClick={handlePublish}
                    disabled={disableButtons}
                  >
                    <IconSend />
                    {isPublishers && 'Publish'}
                  </EduButton>
                )
              )
            ) : null}
            {features.isCurator &&
              testStatus === 'inreview' &&
              hasCollectionAccess && (
                <EduButton
                  isBlue
                  title={isPlaylist ? 'Reject Playlist' : 'Reject Test'}
                  data-cy="publish"
                  onClick={onClickCuratorReject}
                  disabled={disableButtons}
                >
                  REJECT
                </EduButton>
              )}

            {features.isCurator &&
              (testStatus === 'inreview' || testStatus === 'rejected') &&
              hasCollectionAccess && (
                <EduButton
                  isBlue
                  title={isPlaylist ? 'Approve Playlist' : 'Approve Playlist'}
                  data-cy="approve"
                  onClick={onClickCuratorApprove}
                  disabled={disableButtons}
                >
                  APPROVE
                </EduButton>
              )}
            {showEditButton && (
              <EduButton
                isBlue
                isGhost
                IconBtn
                title="Edit Test"
                disabled={editEnable || disableButtons}
                data-cy="edit-test"
                onClick={() => {
                  onEnableEdit(false, true)
                }}
              >
                <IconPencilEdit />
              </EduButton>
            )}
            {showDuplicateButton && !isEdulasticCurator && (
              <EduButton
                isBlue
                isGhost
                IconBtn
                title={
                  isDemoPlayground
                    ? 'This feature is not available in demo account.'
                    : 'Duplicate Test'
                }
                disabled={editEnable || disableButtons || isDemoPlayground}
                data-cy="duplicate"
                onClick={() => handleDuplicateTest()}
              >
                <IconCopy />
              </EduButton>
            )}
            {showCancelButton && (
              <EduButton
                isBlue
                data-cy="assign"
                onClick={() => setCancelState(true)}
              >
                CANCEL
              </EduButton>
            )}
            {hasTestId &&
              owner &&
              ((showPublishButton && !isEdulasticCurator) ||
                showPublishForEC) &&
              !isPlaylist &&
              editEnable &&
              ((isCurator && testStatus !== statusConstants.PUBLISHED) ||
                !isCurator ||
                showPublishForEC) &&
              !isRegradeFlow && (
                <EduButton
                  isBlue
                  title="Publish Test"
                  data-cy="publish"
                  onClick={handlePublish}
                  disabled={disableButtons}
                >
                  PUBLISH
                </EduButton>
              )}
            {!showUpgradePopup &&
              hasTestId &&
              (owner || testStatus === 'published') &&
              !isPlaylist &&
              !showCancelButton &&
              !isPublishers &&
              !isEdulasticCurator && (
                <AuthorCompleteSignupButton
                  renderButton={(handleClick) => (
                    <EduButton
                      isBlue
                      data-cy="assign"
                      disabled={disableButtons}
                      onClick={handleClick}
                    >
                      ASSIGN
                    </EduButton>
                  )}
                  onClick={handleAssign}
                />
              )}
            {isRegradeFlow &&
              !showEditButton &&
              !showDuplicateButton &&
              !isPlaylist && (
                <EduButton
                  isBlue
                  title="Publish"
                  data-cy="publish"
                  onClick={handleRegrade}
                  disabled={disableButtons || isUpdatingTestForRegrade}
                >
                  PUBLISH
                </EduButton>
              )}
          </RightFlexContainer>
        </MainHeader>
      ) : (
        <MainHeader
          headingText={title}
          mobileHeaderHeight={120}
          justifyContent="flex-start"
        >
          <RightWrapper>
            {current === 'addItems' && (
              <MobileHeaderFilterIcon>
                <FilterToggleBtn
                  header="true"
                  isShowFilter={isShowFilter}
                  toggleFilter={toggleFilter}
                />
              </MobileHeaderFilterIcon>
            )}
            {(owner || features.isCurator) && !isEdulasticCurator && (
              <EduButton
                isBlue
                isGhost
                IconBtn
                data-cy="share"
                disabled={disableButtons || isDemoPlayground}
                onClick={onShare}
                title={
                  isDemoPlayground
                    ? 'This feature is not available in demo account.'
                    : 'Share'
                }
              >
                <ShareIcon />
              </EduButton>
            )}
            {hasTestId && owner && test.status === 'draft' && (
              <EduButton
                isBlue
                isGhost
                IconBtn
                title={
                  isDemoPlayground
                    ? 'This feature is not available in demo account.'
                    : 'Delete'
                }
                data-cy="delete-test"
                onClick={onDelete}
                disabled={disableButtons || isDemoPlayground}
              >
                <IconTrashAlt />
              </EduButton>
            )}
            {owner && !showPublishForEC && (
              <EduButton
                isBlue
                isGhost
                IconBtn
                title="Save as Draft"
                data-cy="save"
                onClick={onSave}
                disabled={disableButtons}
              >
                <IconDiskette />
              </EduButton>
            )}
            {hasTestId &&
            owner &&
            showPublishButton &&
            !isEdulasticCurator &&
            isDirectOwner ? (
              isPlaylist ? (
                <EduButton
                  isBlue
                  title="Publish Playlist"
                  data-cy="publish"
                  onClick={handlePublish}
                  disabled={disableButtons}
                >
                  PUBLISH
                </EduButton>
              ) : (
                <EduButton
                  isBlue
                  isGhost
                  IconBtn
                  title="Publish Test"
                  data-cy="publish"
                  onClick={handlePublish}
                  disabled={disableButtons}
                >
                  <IconSend />
                </EduButton>
              )
            ) : null}
            {features.isCurator && testStatus === 'inreview' && (
              <EduButton
                isBlue
                title={isPlaylist ? 'Reject Playlist' : 'Reject Test'}
                data-cy="publish"
                onClick={onClickCuratorReject}
                disabled={disableButtons}
              >
                REJECT
              </EduButton>
            )}
            {features.isCurator &&
              (testStatus === 'inreview' || testStatus === 'rejected') && (
                <EduButton
                  isBlue
                  title={isPlaylist ? 'Approve Playlist' : 'Approve Playlist'}
                  data-cy="approve"
                  onClick={onClickCuratorApprove}
                  disabled={disableButtons}
                >
                  APPROVE
                </EduButton>
              )}
            {!showUpgradePopup &&
              hasTestId &&
              (owner || testStatus === 'published') &&
              !isPlaylist &&
              !showCancelButton &&
              !isPublishers &&
              !isEdulasticCurator && (
                <AuthorCompleteSignupButton
                  renderButton={(handleClick) => (
                    <EduButton
                      isBlue
                      disabled={disableButtons}
                      data-cy="assign"
                      onClick={handleClick}
                    >
                      ASSIGN
                    </EduButton>
                  )}
                  onClick={handleAssign}
                />
              )}
          </RightWrapper>
          <TestPageNav
            owner={owner}
            onChange={onChangeNav}
            current={current}
            buttons={navButtons}
          />
        </MainHeader>
      )}
      {regradeFirebaseDocId && <RegradeNotificationListener />}
    </>
  )
}

TestPageHeader.propTypes = {
  onChangeNav: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onShare: PropTypes.func.isRequired,
  onEnableEdit: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  editEnable: PropTypes.bool.isRequired,
  onAssign: PropTypes.func.isRequired,
  setDisableAlert: PropTypes.func,
}

TestPageHeader.defaultProps = {
  setDisableAlert: () => {},
}

const enhance = compose(
  memo,
  withRouter,
  connect(
    (state) => ({
      test: state.tests.entity,
      testAssignments: getAssignmentsSelector(state),
      features: getUserFeatures(state),
      userId: getUserId(state),
      userRole: getUserRole(state),
      creating: getTestsCreatingSelector(state),
      isLoadingData: shouldDisableSelector(state),
      testItems: getTestItemsSelector(state),
      isCurator: getIsCurator(state),
      authorQuestionsById: state.authorQuestions.byId,
      isUpdatingTestForRegrade: state.tests.updatingTestForRegrade,
      emailVerified: getEmailVerified(state),
      verificationTS: getVerificationTS(state),
      isDefaultDA: isDefaultDASelector(state),
      isFreeAdmin: isFreeAdminSelector(state),
      isSAWithoutSchools: isSAWithoutSchoolsSelector(state),
      showRegradeConfirmPopup: getShowRegradeConfirmPopupSelector(state),
      regradeFirebaseDocId: getRegradeFirebaseDocIdSelector(state),
      showUpgradePopup: getShowUpgradePopupSelector(state),
      isDemoPlayground: isDemoPlaygroundUser(state),
      questionTypesInTest: getQuestionTypesInTestSelector(state),
      enableAudioResponseQuestion: getIsAudioResponseQuestionEnabled(state),
    }),
    {
      publishForRegrade: publishForRegradeAction,
      fetchAssignments: fetchAssignmentsAction,
      toggleAdminAlertModal: toggleAdminAlertModalAction,
      toggleVerifyEmailModal: toggleVerifyEmailModalAction,
      setShowRegradeConfirmPopup: setShowRegradeConfirmPopupAction,
      deletePlaylist: deletePlaylistRequestAction,
    }
  )
)
export default enhance(TestPageHeader)
