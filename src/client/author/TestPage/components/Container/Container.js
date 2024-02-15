import React, { PureComponent } from 'react'
import loadable from '@loadable/component'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import produce from 'immer'
import { withRouter } from 'react-router-dom'
import {
  cloneDeep,
  uniq as _uniq,
  isEmpty,
  get,
  without,
  pick,
  isEqual,
  difference,
} from 'lodash'
import uuidv4 from 'uuid/v4'
import {
  withWindowSizes,
  notification,
  Progress,
  CustomPrompt,
  EduIf,
  EduThen,
  EduElse,
  SpinLoader,
} from '@edulastic/common'
import {
  test as testConstants,
  roleuser,
  collections as collectionsConstant,
  signUpState,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { testsApi } from '@edulastic/api'
import { themeColor } from '@edulastic/colors'
import { withNamespaces } from '@edulastic/localization'
import { SUBSCRIPTION_SUB_TYPES } from '@edulastic/constants/const/subscriptions'
import {
  getAllAssignmentsSelector,
  fetchAssignmentsByTestAction,
} from '../../../../publicTest/ducks'

import { Content, ContentBackDrop } from './styled'
import TestPageHeader from '../TestPageHeader/TestPageHeader'
import {
  defaultImage,
  createTestAction,
  receiveTestByIdAction,
  setTestDataAction,
  updateTestAction,
  updateDefaultThumbnailAction,
  setDefaultTestDataAction,
  getTestSelector,
  getTestItemsRowsSelector,
  getTestsCreatingSelector,
  getTestsLoadingSelector,
  publishTestAction,
  getTestStatusSelector,
  setRegradeOldIdAction,
  getTestCreatedItemsSelector,
  getDefaultTestSettingsAction,
  updateDocBasedTestAction,
  duplicateTestRequestAction,
  getReleaseScorePremiumSelector,
  approveOrRejectSingleTestRequestAction,
  updateLastUsedCollectionListAction,
  removeTestEntityAction,
  setEditEnableAction,
  getTestIdFromVersionIdAction,
  getShowUpgradePopupSelector,
  setShowUpgradePopupAction,
  receiveTestByIdSuccess as receiveTestByIdSuccessAction,
  isRegradedByCoAuthor,
  setCurrentTestSettingsIdAction,
  fetchTestSettingsListAction,
  getTestSettingsListSelector,
  setTestSettingsListAction,
  getPenaltyOnUsingHintsSelector,
  NewGroupAutoselect,
  isDynamicTestSelector,
  hasSectionsSelector,
  createNewStaticGroup,
  isDefaultTestSelector,
  setCurrentGroupIndexAction,
} from '../../ducks'
import {
  getItemsSubjectAndGradeAction,
  getItemsSubjectAndGradeSelector,
  resetPageStateAction,
} from '../AddItems/ducks'
import { loadAssignmentsAction, getAssignmentsSelector } from '../Assign/ducks'
import {
  saveCurrentEditingTestIdAction,
  updateItemsDocBasedByIdAction,
  getItemDetailByIdAction,
  proceedPublishingItemAction,
} from '../../../ItemDetail/ducks'
import {
  getUserSelector,
  getUserRole,
  getCollectionsSelector,
  getUserFeatures,
  getCollectionsToAddContent,
  isOrganizationDistrictUserSelector,
  getWritableCollectionsSelector,
  isOrganizationDistrictSelector,
  isPremiumUserSelector,
  getUserSignupStatusSelector,
  isVideoQuizAndAIEnabledSelector,
  isRedirectToVQAddOnSelector,
} from '../../../src/selectors/user'
import SourceModal from '../../../QuestionEditor/components/SourceModal/SourceModal'
import ShareModal from '../../../src/components/common/ShareModal'

import AddItems from '../AddItems'
import Review from '../Review'
import Summary from '../Summary'
import Assign from '../Assign'
import Setting from '../Setting'
import GroupItems from '../GroupItems'

import MainWorksheet from '../../../AssessmentPage/components/Worksheet/Worksheet'
import VideoQuizWorksheet from '../../../AssessmentPage/VideoQuiz/VideoQuizWorksheet'
import {
  getQuestionsSelector,
  getQuestionsArraySelector,
} from '../../../sharedDucks/questions'
import { validateQuestionsForDocBased } from '../../../../common/utils/helpers'
import {
  allowDuplicateCheck,
  allowContentEditCheck,
  isContentOfCollectionEditable,
} from '../../../src/utils/permissionCheck'
import WarningModal from '../../../ItemDetail/components/WarningModal'
import {
  hasUserGotAccessToPremiumItem,
  setDefaultInterests,
} from '../../../dataUtils'
import { getCurrentGroup, getClassIds } from '../../../../student/Reports/ducks'
import { redirectToStudentPage } from '../../../../publicTest/utils'
import {
  startAssignmentAction,
  resumeAssignmentAction,
  getSelectedLanguageSelector,
} from '../../../../student/Assignments/ducks'
import { setSelectedLanguageAction } from '../../../../student/sharedDucks/AssignmentModule/ducks'
import { fetchCustomKeypadAction } from '../../../../assessment/components/KeyPadOptions/ducks'
import { convertCollectionOptionsToArray } from '../../../src/utils/util'
import TeacherSignup from '../../../../student/Signup/components/TeacherContainer/Container'
import { STATUS } from '../../../AssessmentCreate/components/CreateAITest/ducks/constants'
import ConfirmTabChange from './ConfirmTabChange'
import { hasUnsavedAiItems } from '../../../../assessment/utils/helpers'
import { DEFAULT_TEST_TITLE, getSettingsToSaveOnTestType } from '../../utils'
import { getSubscriptionSelector } from '../../../Subscription/ducks'
import SectionsTestGroupItems from '../GroupItems/SectionsTestGroupItems'
import BuyAISuiteAlertModal from '../../../../common/components/BuyAISuiteAlertModal'
import TestNameChangeModal from '../TestNameChangeModal/TestNameChangeModal'
import { getIsBuyAiSuiteAlertModalVisible } from '../../../utils/videoQuiz'
import { getUserAccommodations } from '../../../../student/Login/ducks'

const ItemCloneModal = loadable(() => import('../ItemCloneConfirmationModal'))

const { getDefaultImage } = testsApi
const {
  statusConstants,
  releaseGradeLabels,
  passwordPolicy: passwordPolicyValues,
  ITEM_GROUP_TYPES,
  ITEM_GROUP_DELIVERY_TYPES,
  testCategoryTypes,
  sectionTestActions,
} = testConstants
const { nonPremiumCollectionsToShareContent } = collectionsConstant
const { PARTIAL_PREMIUM, ENTERPRISE } = SUBSCRIPTION_SUB_TYPES

const TEST_ACTIONS = {
  publish: 'PUBLISH',
  assign: 'ASSIGN',
  share: 'SHARE',
  navigation: 'NAVIGATION',
}

class Container extends PureComponent {
  constructor() {
    super()
    this.state = {
      showModal: false,
      showShareModal: false,
      isShowFilter: true,
      showCancelButton: false,
      testLoaded: false,
      disableAlert: false,
      showCloneModal: false,
      isSettingsChecked: false,
      showCompeleteSignUp: false,
      currentGroupIndex: null,
      currentGroupDetails: {},
      groupNotEdited: true,
      goToTabProps: {},
      showConfirmationOnTabChange: false,
      showSectionsTestSelectGroupIndexModal: true,
      showTestNameChangeModal: false,
      toBeResumedTestAction: null,
      toBeNavigatedLocation: null,
    }
  }

  sebPasswordRef = React.createRef()

  gotoTab = (tab) => {
    const { history, match, location } = this.props
    const { regradeFlow = false, previousTestId = '' } = location?.state || {}
    const { showCancelButton } = this.state
    const id =
      match.params.id && match.params.id != 'undefined' && match.params.id
    const oldId =
      match.params.oldId &&
      match.params.oldId != 'undefined' &&
      match.params.oldId
    let url = `/author/tests/create/${tab}`
    if ((id && oldId) || regradeFlow) {
      const newTab = previousTestId ? 'review' : tab
      url = `/author/tests/tab/${newTab}/id/${id}/old/${
        oldId || previousTestId
      }`
    } else if (id) {
      url = `/author/tests/tab/${tab}/id/${id}`
    }
    // if (tab === 'addItems') {
    //   url += `?page=${pageNumber}`
    // }

    history.push({
      pathname: url,
      state: { ...history.location.state, showCancelButton },
    })
  }

  componentDidMount() {
    const {
      match,
      receiveTestById,
      setDefaultData,
      history,
      history: { location },
      clearTestAssignments,
      // editAssigned,
      createdItems = [],
      setRegradeOldId,
      getDefaultTestSettings,
      setData,
      userRole,
      isReleaseScorePremium,
      location: _location,
      fetchAssignmentsByTest,
      setEditEnable,
      isOrganizationDA,
      isVersionFlow,
      getTestIdFromVersionId,
      fetchUserKeypads,
      setCurrentTestSettingsId,
      isPremiumUser,
      fetchTestSettingsList,
      userId,
      userSignupStatus,
      test,
      aiTestStatus,
    } = this.props

    const { versionId, id } = match.params

    if (userRole !== roleuser.STUDENT) {
      setCurrentTestSettingsId('')

      if (isPremiumUser) {
        fetchTestSettingsList({
          orgId: userId,
          orgType: roleuser.ORG_TYPE.USER,
        })
      }
      fetchUserKeypads()
      const self = this
      const { showCancelButton = false, editAssigned = false } =
        history.location.state || this.state
      if (location.hash === '#review') {
        this.handleNavChange('review', true)()
      }
      if (createdItems.length > 0) {
        setEditEnable(true)
        if (_location?.state?.showItemAddedMessage) {
          const msg = (
            <span>
              New item has been created and added to the current test. Click{' '}
              <span
                onClick={() => self.gotoTab('review')}
                style={{ color: themeColor, cursor: 'pointer' }}
              >
                here
              </span>{' '}
              to see it.
            </span>
          )
          notification({ type: 'success', msg })
        }
      }

      if (isVersionFlow && versionId && versionId != 'undefined') {
        this.setState({ testLoaded: false })
        getTestIdFromVersionId(versionId)
      } else if (id && id != 'undefined') {
        this.setState({ testLoaded: false })
        receiveTestById(id, true, editAssigned)
      } else if (aiTestStatus === STATUS.SUCCESS) {
        this.setState({ testLoaded: false })
      } else if (!_location?.state?.persistStore) {
        // currently creating test do nothing
        location?.state?.isDynamicTest
          ? this.gotoTab('description')
          : this.gotoTab('addItems')
        clearTestAssignments([])
        setDefaultData()
        if (
          userRole === roleuser.DISTRICT_ADMIN ||
          userRole === roleuser.SCHOOL_ADMIN
        ) {
          setData({
            testType: testTypesConstants.DEFAULT_ADMIN_TEST_TYPE_MAP[userRole],
            freezeSettings: !isOrganizationDA,
            updated: false,
          })
        }
        if (userRole === roleuser.TEACHER && isReleaseScorePremium) {
          setData({
            releaseScore: releaseGradeLabels.WITH_ANSWERS,
            updated: false,
          })
        }
      }
      // run only when creating a new test and not during edit test
      if (!id) {
        if (location?.state?.isDynamicTest) {
          const defaultItemGroup = {
            ...(test.itemGroups?.[0] || {}),
            ...NewGroupAutoselect,
          }
          // if create dynamic test, default item group is autoselect
          setData({
            testCategory: testCategoryTypes.DYNAMIC_TEST,
            itemGroups: [defaultItemGroup],
            testType: testTypesConstants.TEST_TYPES_VALUES_MAP.QUIZ, // currently premium users only able to create dynamic test hence quiz type allowed
          })
          // if create dynamic test, default item group should be editable
          this.setState({
            currentGroupIndex: 0,
            currentGroupDetails: defaultItemGroup,
          })
        }
        if (location?.state?.hasSections) {
          // if create sections test, default item group is manual
          const defaultItemGroup = createNewStaticGroup()
          setData({
            hasSections: true,
            itemGroups: [defaultItemGroup],
          })
          // if create sections test, default item group should be editable
          this.setState({
            currentGroupIndex: 0,
            currentGroupDetails: defaultItemGroup,
          })
        }
      }
      if (showCancelButton) {
        setEditEnable(true)
        this.setState({ showCancelButton })
      }

      if (editAssigned) {
        setRegradeOldId(id)
      } else {
        setRegradeOldId('')
      }

      if (userRole !== roleuser.EDULASTIC_CURATOR)
        getDefaultTestSettings({ saveDefaultTestSettings: true })
    } else {
      fetchAssignmentsByTest({ testId: id })
    }
    if (
      sessionStorage.getItem('completeSignUp') &&
      userSignupStatus === signUpState.ACCESS_WITHOUT_SCHOOL &&
      userRole === roleuser.TEACHER
    ) {
      sessionStorage.removeItem('completeSignUp')
      this.setState({ showCompeleteSignUp: true })
    }
  }

  componentWillUnmount() {
    const {
      match,
      removeTestEntity,
      resetPageState,
      setEditEnable,
      setTestSettingsList,
      isDynamicTest,
    } = this.props
    // reset test data when it's a saved test or dynamic test in creation
    if (match.params.id || isDynamicTest) {
      removeTestEntity()
    }
    // disable edit on unmount
    setEditEnable(false)
    resetPageState()
    setTestSettingsList([])
  }

  componentDidUpdate(prevProps) {
    const {
      receiveItemDetailById,
      test,
      history,
      userId,
      isTestLoading,
      userRole,
      getDefaultTestSettings,
      studentAssignments,
      loadingAssignments,
      startAssignment,
      resumeAssignment,
      setEditEnable,
      editEnable,
      languagePreference,
      setSelectedLanguage,
      isUpgradePopupVisible,
      match,
      testStatus,
      testSettingsList,
      testAssignments,
      setData,
      accommodations,
    } = this.props
    const { isUsed } = test
    const { testLoaded, studentRedirected, isSettingsChecked } = this.state

    if (userRole !== roleuser.STUDENT) {
      if (
        test._id &&
        !prevProps.test._id &&
        test._id !== prevProps.test._id &&
        test.isDocBased
      ) {
        const testItem = test.itemGroups?.[0].items?.[0] || {}
        const testItemId =
          typeof testItem === 'object' ? testItem._id : testItem
        if (testItemId) {
          receiveItemDetailById(testItemId, { testId: test._id })
        }
      }
      const { editAssigned = false } = history.location.state || {}

      if (
        editAssigned &&
        test?._id &&
        !testLoaded &&
        !test.isInEditAndRegrade &&
        !isTestLoading &&
        !isUpgradePopupVisible
      ) {
        this.onEnableEdit(true)
      }
      if (
        editAssigned &&
        test?._id &&
        !editEnable &&
        test.isInEditAndRegrade &&
        !isTestLoading
      ) {
        const canEdit = test.authors?.some((x) => x._id === userId)
        if (canEdit) {
          setEditEnable(true)
        }
      }
      if (test._id && !testLoaded && !isTestLoading) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ testLoaded: true })
      }

      if (!isSettingsChecked) {
        const isTestAndSettingsListFetched =
          test._id && !isTestLoading && testLoaded && testSettingsList.length
        if (isTestAndSettingsListFetched) {
          if (
            !!test.settingId &&
            testSettingsList.some((t) => t._id === test.settingId) &&
            !this.isTestSettingsEqual(test.settingId)
          ) {
            const isOwner =
              test?.authors?.some((x) => x._id === userId) || !match?.params?.id
            const isEditable =
              isOwner && (editEnable || testStatus === statusConstants.DRAFT)
            setData({ settingId: '', updated: isEditable })
          }
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({ isSettingsChecked: true })
        }
      }

      if (
        userRole === roleuser.EDULASTIC_CURATOR &&
        prevProps?.test?._id !== test?._id
      ) {
        getDefaultTestSettings(test)
      }

      /* simulate
      useEffect(() => {
        if (bubbleSheetWarningCheck) {
          ...
        }
      }, [bubbleSheetWarningCheck])
      */
      const bubbleSheetWarningCheck =
        editEnable &&
        isUsed &&
        testAssignments.length > 0 &&
        testAssignments.some((ta) => ta.bubbleSheetTestId)
      if (
        bubbleSheetWarningCheck &&
        this.prevBubbleSheetWarningCheck != bubbleSheetWarningCheck
      ) {
        notification({
          type: 'warn',
          messageKey: 'editWarnBubblesheetGeneratedForThisTest',
          duration: 12,
        })
      }
      this.prevBubbleSheetWarningCheck = bubbleSheetWarningCheck
    } else if (userRole === roleuser.STUDENT) {
      if (
        prevProps.loadingAssignments &&
        !loadingAssignments &&
        studentAssignments
      ) {
        // this is to call redirectToStudentPage once, even if multiple props update happend
        if (!studentRedirected) {
          redirectToStudentPage(
            studentAssignments,
            history,
            startAssignment,
            resumeAssignment,
            test,
            languagePreference,
            setSelectedLanguage,
            accommodations
          )
          // eslint-disable-next-line react/no-did-update-set-state
          this.setState({ studentRedirected: true })
        }
      }
    }
  }

  cleanSettings = (settings) => {
    const { userRole } = this.props
    if (
      settings.passwordPolicy !==
      passwordPolicyValues.REQUIRED_PASSWORD_POLICY_STATIC
    ) {
      delete settings.assignmentPassword
    }
    if (
      settings.passwordPolicy !==
      passwordPolicyValues.REQUIRED_PASSWORD_POLICY_DYNAMIC
    ) {
      delete settings.passwordExpireIn
    }
    if (!settings.safeBrowser) {
      delete settings.sebPassword
    }
    if (userRole === roleuser.TEACHER && settings.testContentVisibility) {
      delete settings.testContentVisibility
    }
    if (!settings.hasInstruction) {
      delete settings.instruction
    }
    if (!settings.timedAssignment) {
      delete settings.allowedTime
    }
    if (settings.restrictNavigationOut !== 'warn-and-report-after-n-alerts') {
      delete settings.restrictNavigationOutAttemptsThreshold
    }
    if (!settings.restrictNavigationOut) {
      delete settings.restrictNavigationOut
    }
  }

  setSectionsState = (hasSections) => {
    const { history } = this.props
    history.push({
      state: { ...history.location.state, hasSections },
    })
  }

  isTestSettingsEqual = (settingId) => {
    const { test, testSettingsList } = this.props

    // should not check assignment level settings in test settings
    const settingsToPick = difference(
      getSettingsToSaveOnTestType(test.isDocBased),
      ['autoRedirect', 'autoRedirectSettings']
    )

    const settingsSaved = pick(
      testSettingsList.find((t) => t._id === settingId) || {},
      settingsToPick
    )
    this.cleanSettings(settingsSaved)
    const settingsInTest = pick(test, settingsToPick)
    this.cleanSettings(settingsInTest)
    return isEqual(settingsSaved, settingsInTest)
  }

  // Make use of the router Prompt Component. No custom beforeunload method is required.
  beforeUnload = () => {
    const {
      test,
      match: { params },
      userId,
      testStatus,
      questionsUpdated,
      updated,
      editEnable,
    } = this.props
    const { authors, itemGroups, isDocBased } = test
    const { disableAlert } = this.state
    const isOwner =
      (authors && authors.some((x) => x._id === userId)) || !params.id
    const isEditable =
      isOwner && (editEnable || testStatus === statusConstants.DRAFT)
    if (
      isEditable &&
      itemGroups.flatMap((itemGroup) => itemGroup.items || []).length > 0 &&
      (updated || (questionsUpdated && isDocBased)) &&
      !disableAlert
    ) {
      return true
    }
    return false
  }

  // When the user clicks on the 'Add new Sections' button for the first time and he did
  // not select any test items, then the section should be editable
  setCurrentGroupDetails = () => {
    const { test } = this.props
    const isItemPresentInGrp = test?.itemGroups?.[0]?.items || []
    if (isEmpty(isItemPresentInGrp)) {
      this.setState({
        currentGroupIndex: 0,
        currentGroupDetails: createNewStaticGroup(),
      })
    }
  }

  handleNavChange = (value, firstFlow, checkAiItems = true) => () => {
    const {
      test,
      match: { params },
      userId,
      testStatus,
      updated,
      editEnable,
      location,
      creating,
      isDynamicTest,
      hasSections,
      currentTab,
      isDefaultTest,
    } = this.props
    const { groupNotEdited } = this.state
    const { authors, itemGroups = [], _id } = test

    if (!isDefaultTest && !test?.title?.trim()?.length) {
      notification({ type: 'warn', messageKey: 'pleaseEnterName' })
      return false
    }

    let hasValidGroups = false
    let hasValidGroupsForSectionsTest = false
    // condition to validate Add Sections has been updated successfully before navigating to other tabs
    // Add Items needs to be exempt from this as it is a full-screen popup which works in tandem with Add Sections
    // Description page navigation should be allowed if there was no edit made to the groups
    if (
      location?.pathname?.includes('manageSections') &&
      !['addItems', 'manageSections'].includes(value) &&
      !(value === 'description' && groupNotEdited) &&
      isDynamicTest
    ) {
      hasValidGroups = this.validateGroups()
      if (!hasValidGroups) return
    }

    if (
      !isDynamicTest &&
      hasSections &&
      location?.pathname?.includes('manageSections') &&
      !(value === 'description' && groupNotEdited)
    ) {
      hasValidGroupsForSectionsTest = this.validateGroupsForSectionsTest()
      if (!hasValidGroupsForSectionsTest) return
    }

    if (value === 'source') {
      this.setState({
        showModal: true,
      })
      return
    }

    /** For AI quiz we need to unselect section */
    if (value === 'manageSections' && test?.aiGenerated) {
      this.setState({
        currentGroupIndex: null,
      })
    }

    const _hasUnsavedAiItems = hasUnsavedAiItems(itemGroups)

    if (_hasUnsavedAiItems && checkAiItems && currentTab === 'review') {
      this.setState((state) => ({
        ...state,
        goToTabProps: { value, firstFlow },
        showConfirmationOnTabChange: true,
      }))
    } else {
      this.gotoTab(value)
      const isOwner =
        (authors && authors.some((x) => x._id === userId)) || !params.id
      const isEditable =
        isOwner && (editEnable || testStatus === statusConstants.DRAFT)
      const totalTestItems = itemGroups.flatMap(
        (itemGroup) => itemGroup.items || []
      ).length
      const isAutoSelectGroup =
        test.itemGroups[0].type === ITEM_GROUP_TYPES.AUTOSELECT
      if (
        isEditable &&
        (hasValidGroups ||
          test.testCategory !== testCategoryTypes.DYNAMIC_TEST) &&
        (totalTestItems > 0 || isAutoSelectGroup) &&
        !(totalTestItems === 1 && !_id && creating && !isAutoSelectGroup) && // avoid redundant new test creation api call when user adds first item and quickly switches the tab
        updated &&
        (!firstFlow || _hasUnsavedAiItems)
      ) {
        this.handleSave()
      }
    }
  }

  confirmChangeNav = (confirm) => () => {
    if (confirm) {
      const { goToTabProps } = this.state
      const { value, firstFlow } = goToTabProps
      this.handleNavChange(value, firstFlow, false)()
      this.setState((state) => ({
        ...state,
        goToTabProps: {},
        showConfirmationOnTabChange: false,
      }))
    } else {
      this.setState((state) => ({
        ...state,
        goToTabProps: {},
        showConfirmationOnTabChange: false,
      }))
    }
  }

  checkInvalidTestTitle = (title) =>
    !title?.trim() ||
    title?.trim().toLowerCase() === DEFAULT_TEST_TITLE.toLowerCase()

  validateGroups = (isCreateNewItem = false) => {
    const { test, isDynamicTest, hasSections } = this.props
    const { currentGroupIndex } = this.state
    /* 
        Apart from dynamic and sections test, it is not required to validate the item groups.
        Separate validate group method is created for sections test as the conditions are different.
    */
    if (hasSections || (!isDynamicTest && (!hasSections || isCreateNewItem))) {
      return true
    }
    if (currentGroupIndex !== null) {
      notification({
        messageKey: 'pleaseSaveTheChangesMadeToGroupFirst',
      })
      return false
    }
    const groupNamesFromTest = _uniq(
      test.itemGroups.map((g) => `${g.groupName || ''}`.toLowerCase())
    )
    if (groupNamesFromTest.length !== test.itemGroups.length) {
      notification({ messageKey: 'eachGroupShouldHaveUniqueGroupName' })
      return false
    }
    const staticGroups = []
    const autoSelectGroups = []
    test?.itemGroups?.forEach((group) => {
      if (group.type === ITEM_GROUP_TYPES.STATIC) staticGroups.push(group)
      else autoSelectGroups.push(group)
    })
    for (let i = 0; i < staticGroups.length; i++) {
      const { items, deliveryType, deliverItemsCount } = staticGroups[i]
      if (!items.length) {
        notification({
          messageKey: 'eachStaticGroupShouldContainAtleastOneItems',
        })
        return false
      }
      if (
        deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
        !deliverItemsCount
      ) {
        notification({ messageKey: 'pleaseEnterTotalNumberOfItems' })
        return false
      }
      if (
        deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
        items.length <= deliverItemsCount
      ) {
        notification({
          messageKey: 'totalItemsToBeDelivered',
        })
        return false
      }
    }
    for (let i = 0; i < autoSelectGroups.length; i++) {
      const {
        collectionDetails,
        standardDetails,
        deliverItemsCount,
      } = autoSelectGroups[i]
      if (!collectionDetails || isEmpty(standardDetails?.standards)) {
        notification({
          messageKey: 'eachAutoselectGroupShouldHaveAStandardAndCollection',
        })
        return false
      }
      if (!deliverItemsCount) {
        notification({ messageKey: 'pleaseEnterTotalNumberOfItems' })
        return false
      }
    }
    return true
  }

  validateGroupsForSectionsTest = (isPublishFlow = false) => {
    const { test } = this.props
    const groupNamesFromTest = _uniq(
      test.itemGroups.map((g) => `${g.groupName || ''}`.toLowerCase())
    )
    if (
      !(test?.itemGroups || []).every((group) => group?.groupName?.length > 0)
    ) {
      notification({ messageKey: 'pleaseEnterGroupName' })
      return false
    }
    if (groupNamesFromTest.length !== test.itemGroups.length) {
      notification({ messageKey: 'eachGroupShouldHaveUniqueGroupName' })
      return false
    }
    if (isPublishFlow) {
      if (
        !(test?.itemGroups || []).every((group) => group?.items?.length > 0)
      ) {
        notification({ messageKey: 'eachSectionShouldAtleastOneItem' })
        return false
      }
    }
    return true
  }

  validateTimedAssignment = () => {
    const { test } = this.props
    const { allowedTime, timedAssignment } = test
    if (timedAssignment && allowedTime === 0) {
      notification({ messageKey: 'timedAssigmentTimeCanNotBeZero' })
      return false
    }
    return true
  }

  validatePenaltyOnUsingHintsValue = () => {
    const { test, hasPenaltyOnUsingHints } = this.props
    const { showHintsToStudents = true, penaltyOnUsingHints = 0 } = test

    if (
      showHintsToStudents &&
      hasPenaltyOnUsingHints &&
      (Number.isNaN(penaltyOnUsingHints) || !penaltyOnUsingHints > 0)
    ) {
      notification({ messageKey: 'enterPenaltyOnHintsValue' })
      return false
    }

    return true
  }

  handleAssign = () => {
    const {
      test,
      history,
      match,
      updated,
      collections: orgCollections,
      location,
    } = this.props
    let source = location?.state?.assessmentAssignedFrom
    let assessmentTestCategory = location?.state?.assessmentTestCategory

    if (!source) {
      source = 'Created New'
    }

    if (!assessmentTestCategory) {
      assessmentTestCategory = test?.testCategory
    }
    const { status, collections } = test

    if (!this.validateTimedAssignment()) {
      return
    }

    const sparkMathId = orgCollections?.find(
      (x) => x.name.toLowerCase() === 'spark math'
    )?._id

    const isSparkMathCollection = collections?.some(
      (x) => x._id === sparkMathId
    )

    // We actually add the item grades and subjects in modifyTest function
    // which is called later in publish flow. Added getUpdatedTestWithGradeAndSubject
    // function to pass the respective validation.
    const testWithGradeAndSubject = this.getUpdatedTestWithGradeAndSubject()
    if (this.validateTest(testWithGradeAndSubject, TEST_ACTIONS.assign)) {
      if (status !== statusConstants.PUBLISHED || updated) {
        this.handlePublishTest(true)
      } else {
        const { id } = match.params
        if (id) {
          history.push({
            pathname: `/author/assignments/${id}`,
            state: {
              fromText: 'TEST LIBRARY',
              toUrl: '/author/tests',
              isSparkMathCollection,
              assessmentAssignedFrom: source,
              assessmentTestCategory,
            },
          })
        }
      }
    }
  }

  handleChangeGrade = (grades) => {
    const {
      setData,
      getItemsSubjectAndGrade,
      test,
      itemsSubjectAndGrade,
    } = this.props
    setData({ ...test, grades })
    setDefaultInterests({ grades })
    getItemsSubjectAndGrade({
      subjects: itemsSubjectAndGrade.subjects,
      grades: [],
    })
  }

  handleChangeCollection = (_, options) => {
    const { setData, test, collectionsToShow } = this.props

    const collectionArray = convertCollectionOptionsToArray(options)

    const orgCollectionIds = collectionsToShow.map((o) => o._id)
    const extraCollections = (test.collections || []).filter(
      (c) => !orgCollectionIds.includes(c._id)
    )
    setData({ collections: [...collectionArray, ...extraCollections] })
  }

  handleChangeSubject = (subjects) => {
    const {
      setData,
      getItemsSubjectAndGrade,
      test,
      itemsSubjectAndGrade,
      updateDefaultThumbnail,
    } = this.props
    setData({ ...test, subjects })
    if (test.thumbnail === defaultImage) {
      getDefaultImage({
        subject: subjects[0] || 'Other Subjects',
        standard: get(test, 'summary.standards[0].identifier', ''),
      }).then((thumbnail) => updateDefaultThumbnail(thumbnail))
    }
    getItemsSubjectAndGrade({
      grades: itemsSubjectAndGrade.grades,
      subjects: [],
    })
    setDefaultInterests({ subject: subjects || [] })
  }

  onChangeSkillIdentifiers = (identifiers) => {
    const { setData, test } = this.props
    if (!isEmpty(identifiers)) {
      const metadata = {
        ...test.metadata,
        skillIdentifiers: _uniq(identifiers.split(',')),
      }
      setData({ ...test, metadata })
    }
  }

  handleSaveTestId = () => {
    const { test, saveCurrentEditingTestId } = this.props
    saveCurrentEditingTestId(test._id)
  }

  handleSectionsTestSetGroupIndex = (
    groupIndex,
    updateShowSelectGroupIndexModalValue = false
  ) => {
    const { setCurrentGroupIndexInStore } = this.props
    if (updateShowSelectGroupIndexModalValue) {
      this.setState({
        currentGroupIndex: groupIndex,
        showSectionsTestSelectGroupIndexModal: false,
      })
    } else {
      this.setState({
        currentGroupIndex: groupIndex,
      })
    }
    setCurrentGroupIndexInStore(groupIndex)
  }

  setShowSectionsTestSelectGroupIndexModal = (val) => {
    this.setState({
      showSectionsTestSelectGroupIndexModal: val,
    })
  }

  getIsEditable = () => {
    const { test, userId, editEnable, match, testStatus } = this.props
    const isOwner =
      test?.authors?.some((x) => x._id === userId) || !match?.params?.id
    const isEditable =
      isOwner && (editEnable || testStatus === statusConstants.DRAFT)
    return isEditable
  }

  renderContent = () => {
    const {
      test,
      setData,
      rows,
      userId,
      match = {},
      testStatus,
      questions,
      questionsById,
      history,
      updated,
      currentTab,
      userRole,
      editEnable,
      userFeatures,
      collections,
      writableCollections,
      isPlaylist,
      isDefaultTest,
      subscription: { subType } = {},
      isDynamicTest,
      hasSections,
    } = this.props
    const isEnterprise = [PARTIAL_PREMIUM, ENTERPRISE].includes(subType)
    const { params = {} } = match
    const { showCancelButton = false } =
      history.location.state || this.state || {}
    const {
      isShowFilter,
      currentGroupIndex,
      currentGroupDetails,
      groupNotEdited,
      showSectionsTestSelectGroupIndexModal,
    } = this.state
    const current = currentTab
    const {
      authors,
      isDocBased,
      docUrl,
      annotations,
      pageStructure,
      freeFormNotes = {},
      videoUrl = '',
      _id: testId,
    } = test
    const isCollectionContentEditable = isContentOfCollectionEditable(
      test.collections,
      writableCollections
    )
    const isOwner =
      (authors && authors.some((x) => x._id === userId)) ||
      !params.id ||
      userRole === roleuser.EDULASTIC_CURATOR ||
      (userFeatures.isCurator &&
        allowContentEditCheck(test.collections, collections)) ||
      isCollectionContentEditable
    const isEditable =
      isOwner && (editEnable || testStatus === statusConstants.DRAFT)
    const hasCollectionAccess = allowContentEditCheck(
      test.collections,
      writableCollections
    )
    const isCurator =
      (hasCollectionAccess && userFeatures.isCurator) ||
      userRole === roleuser.EDULASTIC_CURATOR
    const props = {
      docUrl,
      annotations,
      questions,
      freeFormNotes,
      questionsById,
      pageStructure,
      isEditable,
      videoUrl,
    }

    switch (current) {
      case 'addItems':
        return (
          <Content>
            <AddItems
              current={current}
              isEditable={isEditable}
              onSaveTestId={this.handleSaveTestId}
              test={test}
              gotoSummary={this.handleNavChange('description')}
              gotoManageSections={() => {
                if (
                  test.itemGroups?.[currentGroupIndex]?.type ===
                  ITEM_GROUP_TYPES.STATIC
                ) {
                  // update state for currentGroupDetails after items have been (added to/removed from) itemGroups
                  this.setState({
                    currentGroupDetails: test.itemGroups[currentGroupIndex],
                  })
                }
                this.handleNavChange('manageSections')()
              }}
              toggleFilter={this.toggleFilter}
              isShowFilter={isShowFilter}
              handleSaveTest={this.handleSave}
              setSectionsState={this.setSectionsState}
              setCurrentGroupDetails={this.setCurrentGroupDetails}
              showSelectGroupIndexModal={
                hasSections ? showSectionsTestSelectGroupIndexModal : true
              }
              updated={updated}
              userRole={userRole}
              setData={setData}
              isOwner={isOwner}
              isDefaultTest={isDefaultTest}
              isEnterprise={isEnterprise}
              testId={testId}
              setSectionsTestSetGroupIndex={
                this.handleSectionsTestSetGroupIndex
              }
              setShowSectionsTestSelectGroupIndexModal={
                this.setShowSectionsTestSelectGroupIndexModal
              }
            />
          </Content>
        )
      case 'description':
        return (
          <Content>
            <Summary
              onShowSource={this.handleNavChange('source')} // eslint-disable-next-line react/no-did-update-set-state
              setData={setData}
              test={test}
              owner={isOwner}
              current={current}
              isEditable={isEditable}
              onChangeGrade={this.handleChangeGrade}
              onChangeCollection={this.handleChangeCollection}
              onChangeSubjects={this.handleChangeSubject}
              showCancelButton={showCancelButton}
            />
          </Content>
        )
      case 'review':
        return isDocBased ? (
          <Content>
            <EduIf condition={videoUrl?.length > 0}>
              <EduThen>
                <VideoQuizWorksheet
                  key="review"
                  review
                  {...props}
                  viewMode="review"
                />
              </EduThen>
              <EduElse>
                <MainWorksheet
                  key="review"
                  review
                  {...props}
                  viewMode="review"
                />
              </EduElse>
            </EduIf>
          </Content>
        ) : (
          <Review
            test={test}
            rows={rows}
            onSaveTestId={this.handleSaveTestId}
            onChangeGrade={this.handleChangeGrade}
            onChangeSubjects={this.handleChangeSubject}
            onChangeSkillIdentifiers={this.onChangeSkillIdentifiers}
            onChangeCollection={this.handleChangeCollection}
            handleNavChange={this.handleNavChange('manageSections', true)}
            handleNavChangeToAddItems={this.handleNavChange('addItems')}
            handleSave={this.handleSave}
            setSectionsState={this.setSectionsState}
            setCurrentGroupDetails={this.setCurrentGroupDetails}
            owner={isOwner}
            isEditable={isEditable}
            current={current}
            showCancelButton={showCancelButton}
            updated={updated}
            userId={userId}
            setSectionsTestSetGroupIndex={this.handleSectionsTestSetGroupIndex}
            setShowSectionsTestSelectGroupIndexModal={
              this.setShowSectionsTestSelectGroupIndexModal
            }
            showSelectGroupIndexModal={
              hasSections ? showSectionsTestSelectGroupIndexModal : true
            }
          />
        )
      case 'settings':
        return (
          <Setting
            current={current}
            isEditable={isEditable}
            onShowSource={this.handleNavChange('source')}
            sebPasswordRef={this.sebPasswordRef}
            owner={isOwner}
            showCancelButton={showCancelButton}
            isCurator={isCurator}
            isPlaylist={isPlaylist}
          />
        )
      case 'worksheet':
        return (
          <Content>
            <EduIf condition={videoUrl?.length > 0}>
              <EduThen>
                <VideoQuizWorksheet
                  key="worksheet"
                  {...props}
                  viewMode="edit"
                />
              </EduThen>
              <EduElse>
                <MainWorksheet key="worksheet" {...props} viewMode="edit" />
              </EduElse>
            </EduIf>
          </Content>
        )
      case 'assign':
        return (
          <Content>
            <Assign test={test} setData={setData} current={current} />
          </Content>
        )
      case 'manageSections':
        return (
          <Content>
            <EduIf condition={isDynamicTest}>
              <EduThen>
                <GroupItems
                  currentGroupIndex={currentGroupIndex}
                  setCurrentGroupIndex={(groupIndex, cb = undefined) =>
                    this.setState({ currentGroupIndex: groupIndex }, cb)
                  }
                  currentGroupDetails={currentGroupDetails}
                  setCurrentGroupDetails={(itemGroup, cb = undefined) =>
                    this.setState({ currentGroupDetails: itemGroup }, cb)
                  }
                  groupNotEdited={groupNotEdited}
                  setGroupNotEdited={(value, cb = undefined) =>
                    this.setState({ groupNotEdited: value }, cb)
                  }
                  validateGroups={this.validateGroups}
                  handleSaveTest={this.handleSave}
                />
              </EduThen>
              <EduElse>
                <SectionsTestGroupItems
                  testId={testId}
                  currentGroupIndex={currentGroupIndex}
                  setCurrentGroupIndex={this.handleSectionsTestSetGroupIndex}
                  groupNotEdited={groupNotEdited}
                  setGroupNotEdited={(value, cb = undefined) =>
                    this.setState({ groupNotEdited: value }, cb)
                  }
                  setShowSectionsTestSelectGroupIndexModal={(val) =>
                    this.setState({
                      showSectionsTestSelectGroupIndexModal: val,
                    })
                  }
                  setSectionsState={this.setSectionsState}
                  gotoAddItems={this.handleNavChange('addItems')}
                  handleSaveTest={this.handleSave}
                />
              </EduElse>
            </EduIf>
          </Content>
        )
      default:
        return null
    }
  }

  getUpdatedTestWithGradeAndSubject = () => {
    const { test, itemsSubjectAndGrade } = this.props
    const newTest = produce(test, (draft) => {
      draft.subjects = _uniq([
        ...draft.subjects,
        ...itemsSubjectAndGrade.subjects,
      ])
      draft.grades = _uniq([...draft.grades, ...itemsSubjectAndGrade.grades])
    })

    return newTest
  }

  modifyTest = () => {
    const { user, test, itemsSubjectAndGrade } = this.props
    const { itemGroups } = test
    const newTest = cloneDeep(test)

    newTest.subjects = _uniq([
      ...newTest.subjects,
      ...itemsSubjectAndGrade.subjects,
    ])
    newTest.grades = _uniq([...newTest.grades, ...itemsSubjectAndGrade.grades])
    const name = without(
      [user.firstName, user.lastName],
      undefined,
      null,
      ''
    ).join(' ')
    newTest.createdBy = {
      id: user._id,
      name,
    }

    if (newTest && !newTest.scoring) {
      // recommended tests created via differentiation might not have scoring details
      newTest.scoring = { total: 0, testItems: [] }
    }

    newTest.scoring.testItems = (
      itemGroups.flatMap((itemGroup) => itemGroup.items || []) || []
    ).map((item) => {
      const foundItem = newTest.scoring.testItems.find(
        ({ id }) => item && item._id === id
      )
      if (!foundItem) {
        return {
          id: item ? item._id : uuidv4(),
          points: 0,
        }
      }
      return foundItem
    })
    return newTest
  }

  handleSave = (action, nextLocation, nextAction) => {
    const {
      test = {},
      updateTest,
      createTest,
      currentTab,
      updateLastUsedCollectionList,
      history,
      testAssignments,
      userRole,
      userFeatures,
      testSettingsList,
      isDefaultTest,
    } = this.props

    if (!isDefaultTest && !test?.title?.trim()?.length) {
      notification({ messageKey: 'nameFieldRequired' })
      return
    }

    if (
      !this.validateTimedAssignment() ||
      !this.validatePenaltyOnUsingHintsValue() ||
      !this.validateGroups(true) || // validate groups for dynamic tests before save
      !this.validateGroupsForSectionsTest()
    ) {
      return
    }

    const newTest = this.modifyTest()
    if (newTest.safeBrowser && !newTest.sebPassword) {
      if (this.sebPasswordRef.current && this.sebPasswordRef.current.input) {
        this.sebPasswordRef.current.input.focus()
      }
      notification({ messageKey: 'enterValidPassword' })
      return
    }

    if (
      !!newTest.settingId &&
      testSettingsList.length &&
      testSettingsList.some((t) => t._id === newTest.settingId)
    ) {
      const isSettingsEqual = this.isTestSettingsEqual(newTest.settingId)
      if (!isSettingsEqual) {
        newTest.settingId = ''
      }
    }
    switch (action) {
      case sectionTestActions.ADD:
        newTest.hasSections = true
        break
      case sectionTestActions.REMOVE:
        newTest.hasSections = false
        newTest.itemGroups = [createNewStaticGroup()]
        break
      default:
        break
    }

    updateLastUsedCollectionList(test.collections)

    if (!test?.title?.trim()?.length) {
      newTest.title = DEFAULT_TEST_TITLE
    }
    if (test._id) {
      // Push `isInEditAndRegrade` flag in test if a user intentionally editing an assigned in progess test.
      if (
        (history.location.state?.editAssigned || testAssignments.length) &&
        test.isUsed &&
        userRole !== roleuser.EDULASTIC_CURATOR &&
        !userFeatures.isCurator
      ) {
        newTest.isInEditAndRegrade = true
      }
      updateTest(test._id, { ...newTest, currentTab, nextLocation, nextAction })
    } else {
      createTest({ ...newTest, currentTab, nextLocation, nextAction })
    }
  }

  handleDocBasedSave = async () => {
    const {
      questions: assessmentQuestions,
      test,
      updateDocBasedTest,
    } = this.props
    if (
      test.isDocBased &&
      !validateQuestionsForDocBased(assessmentQuestions, true, !!test.videoUrl)
    ) {
      return
    }
    updateDocBasedTest(test._id, test, true)
  }

  validateTest = (test, toBeResumedTestAction = null) => {
    const {
      title,
      subjects,
      grades,
      passwordPolicy = passwordPolicyValues.REQUIRED_PASSWORD_POLICY_OFF,
      assignmentPassword = '',
      safeBrowser,
      sebPassword,
      passages,
      hasSections,
    } = test
    const {
      userFeatures,
      isOrganizationDistrictUser,
      isDefaultTest,
    } = this.props
    if (isDefaultTest && this.checkInvalidTestTitle(title)) {
      this.setState({
        showTestNameChangeModal: true,
        toBeResumedTestAction,
      })
      return false
    }
    if (!isDefaultTest && !title?.trim()?.length) {
      notification({ messageKey: 'nameShouldNotEmpty' })
      return false
    }
    if (isEmpty(grades)) {
      notification({ messageKey: 'gradeFieldEmpty' })
      return false
    }
    if (isEmpty(subjects)) {
      notification({ messageKey: 'subjectFieldEmpty' })
      return false
    }
    if (
      passwordPolicy === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_STATIC
    ) {
      if (assignmentPassword.length < 6 || assignmentPassword.length > 25) {
        notification({ messageKey: 'enterValidPassword' })
        return false
      }
    }
    if (safeBrowser && !sebPassword) {
      if (this.sebPasswordRef.current && this.sebPasswordRef.current.input) {
        this.sebPasswordRef.current.input.focus()
      }
      notification({ messageKey: 'enterValidPassword' })
      return false
    }
    if (
      userFeatures.isPublisherAuthor ||
      userFeatures.isCurator ||
      isOrganizationDistrictUser
    ) {
      if (test.collections?.length === 0) {
        notification({
          type: 'warn',
          messageKey: 'testNotAssociatedWithCollection',
        })
        return false
      }
    }
    if (!this.validateGroups()) {
      // validate groups for dynamic tests
      return false
    }
    if (hasSections && !this.validateGroupsForSectionsTest(true)) {
      return false
    }
    if (!this.validatePenaltyOnUsingHintsValue()) {
      return false
    }
    // for itemGroup with limted delivery type should not contain items with question level scoring
    let itemGroupWithQuestionsCount = 0
    let testHasInvalidItem = false
    for (const itemGroup of test.itemGroups) {
      if (
        itemGroup.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
        itemGroup.items.some((item) => item.itemLevelScoring === false)
      ) {
        notification({
          msg: `${itemGroup.name} contains items with question level scoring.`,
        })
        return false
      }
      if (itemGroup.items.some((item) => item.data.questions.length > 0)) {
        itemGroupWithQuestionsCount++
      }

      if (
        itemGroup.items.some(
          (item) =>
            item.data.questions.length <= 0 && item.data.resources.length <= 0
        )
      ) {
        testHasInvalidItem = true
      }
      if (
        itemGroup.items.some((item) => {
          if (!item.isPassageWithQuestions || !item.passageId) {
            return false
          }
          const _passage = passages?.find((p) => p._id === item.passageId)
          if (!_passage) {
            return false
          }
          const { structure } = _passage
          const { widgets = [] } = structure
          if (!widgets.length) {
            // cannot publish the test if it has invalid passage item
            // @see: https://snapwiz.atlassian.net/browse/EV-29485
            return true
          }
          return false
        })
      ) {
        testHasInvalidItem = true
      }
    }

    if (!itemGroupWithQuestionsCount) {
      notification({ messageKey: `noQuestions` })
      return false
    }

    if (testHasInvalidItem) {
      notification({ messageKey: `testHasInvalidItem` })
      return false
    }
    return true
  }

  onShareModalChange = () => {
    const { showShareModal } = this.state
    const { test, isDefaultTest } = this.props
    if (isDefaultTest && this.checkInvalidTestTitle(test.title)) {
      this.setState({
        showTestNameChangeModal: true,
        toBeResumedTestAction: TEST_ACTIONS.share,
      })
      return
    }
    this.setState({
      showShareModal: !showShareModal,
    })
  }

  handleApplySource = (source) => {
    const { setData } = this.props
    try {
      const data = JSON.parse(source)
      setData(data)
      this.setState({
        showModal: false,
      })
    } catch (err) {
      console.error(err)
    }
  }

  setShowModal = (value) => () => {
    this.setState({
      showModal: value,
    })
  }

  handlePublishTest = (assignFlow = false) => {
    const {
      questions: assessmentQuestions,
      publishTest,
      test,
      match,
      currentTab,
      updateLastUsedCollectionList,
      setEditEnable,
    } = this.props
    const { _id } = test
    if (
      test.isDocBased &&
      !validateQuestionsForDocBased(assessmentQuestions, false, !!test.videoUrl)
    ) {
      return
    }

    // We actually add the item grades and subjects in modifyTest function.
    // Added getUpdatedTestWithGradeAndSubject function to pass the respective validation.
    const testWithGradeAndSubject = this.getUpdatedTestWithGradeAndSubject()
    if (this.validateTest(testWithGradeAndSubject, TEST_ACTIONS.publish)) {
      const newTest = this.modifyTest()
      publishTest({
        _id,
        oldId: match.params.oldId,
        test: newTest,
        assignFlow,
        currentTab,
      })
      setEditEnable(false)
      updateLastUsedCollectionList(test.collections)
    }
  }

  onEnableEdit = async (onRegrade, editClick) => {
    const {
      test,
      userId,
      duplicateTest,
      currentTab,
      userRole,
      setEditEnable,
      userFeatures,
      collections,
      setShowUpgradePopup,
      receiveTestByIdSuccess,
      testAssignments,
    } = this.props
    const { _id: testId, authors, title, isUsed } = test
    const isCurator =
      (allowContentEditCheck(test.collections, collections) &&
        userFeatures.isCurator) ||
      userRole === roleuser.EDULASTIC_CURATOR
    const isCollectionContentEditable = isContentOfCollectionEditable(
      test?.collections,
      collections
    )
    const canEdit =
      (authors && authors.some((x) => x._id === userId)) ||
      isCurator ||
      isCollectionContentEditable
    const isArchivedInactiveTest =
      test.status === statusConstants.ARCHIVED && test.active === 0
    // If assignments present for the test and user clicking on edit do a quick test fetch and see if co author regraded or not. Else older code.
    if (editClick && testAssignments.length) {
      const entity = await testsApi.getById(testId, {
        data: true,
        requestLatest: true,
        editAndRegrade: true,
      })
      if (isRegradedByCoAuthor(userId, entity, testId)) {
        setShowUpgradePopup(true)
        return receiveTestByIdSuccess(entity)
      }
    }
    setEditEnable(true)
    if (canEdit && !isArchivedInactiveTest) {
      return this.handleSave()
    }
    if (!test.isInEditAndRegrade || isArchivedInactiveTest) {
      duplicateTest({
        currentTab,
        title,
        _id: testId,
        isInEditAndRegrade: isUsed,
        onRegrade,
      })
    }
  }

  showCloneModal = () => {
    this.setState({ showCloneModal: true })
  }

  handleDuplicateTest = (cloneItems) => {
    const { test, duplicateTest } = this.props
    duplicateTest({
      _id: test._id,
      title: test.title,
      redirectToNewTest: true,
      cloneItems,
    })
    this.setState({ showCloneModal: false })
  }

  renderModal = () => {
    const { test } = this.props
    const { showModal } = this.state

    if (showModal) {
      return (
        <SourceModal
          onClose={this.setShowModal(false)}
          onApply={this.handleApplySource}
        >
          {JSON.stringify(test, null, 4)}
        </SourceModal>
      )
    }
  }

  toggleFilter = () => {
    const { isShowFilter } = this.state

    this.setState({
      isShowFilter: !isShowFilter,
    })
  }

  onCuratorApproveOrReject = (payload) => {
    const { approveOrRejectSingleTestRequest } = this.props
    approveOrRejectSingleTestRequest(payload)
  }

  setDisableAlert = (payload) => {
    this.setState({ disableAlert: payload })
  }

  handleCloneModalVisibility = (visibility) => {
    this.setState({ showCloneModal: visibility })
  }

  handleResumeActivity = () => {
    const { toBeResumedTestAction, toBeNavigatedLocation } = this.state
    switch (toBeResumedTestAction) {
      case TEST_ACTIONS.publish:
        this.handlePublishTest()
        break
      case TEST_ACTIONS.assign:
        this.handleAssign()
        break
      case TEST_ACTIONS.navigation:
        this.handleSave(null, toBeNavigatedLocation)
        break
      case TEST_ACTIONS.share:
        this.onShareModalChange()
        break
      default:
        break
    }

    this.setState({
      showTestNameChangeModal: false,
      toBeResumedTestAction: null,
    })
  }

  render() {
    const {
      creating,
      windowWidth,
      test,
      testStatus,
      userId,
      updated,
      showWarningModal,
      proceedPublish,
      isTestLoading,
      collections = [],
      userFeatures,
      currentTab,
      testAssignments,
      userRole,
      editEnable,
      writableCollections,
      t,
      history,
      isRedirectToVQAddOn,
      isDefaultTest,
    } = this.props
    if (userRole === roleuser.STUDENT) {
      return null
    }
    const {
      showShareModal,
      isShowFilter,
      showCloneModal,
      showCompeleteSignUp,
      showConfirmationOnTabChange,
      showTestNameChangeModal,
      toBeResumedTestAction,
    } = this.state
    const current = currentTab
    const {
      _id: testId,
      status,
      authors,
      grades,
      subjects,
      itemGroups,
      isDocBased,
      versionId,
      derivedFromPremiumBankId = false,
    } = test
    const hasCollectionAccess = allowContentEditCheck(
      test.collections,
      writableCollections
    )
    const isCollectionContentEditable = isContentOfCollectionEditable(
      test?.collections,
      collections
    )
    const isCurator =
      (hasCollectionAccess && userFeatures.isCurator) ||
      userRole === roleuser.EDULASTIC_CURATOR
    const isOwner = authors?.some((x) => x._id === userId)
    const showPublishButton =
      (testStatus !== statusConstants.PUBLISHED &&
        testId &&
        (isOwner || isCurator || isCollectionContentEditable)) ||
      editEnable
    const hasTestId = !!testId
    const allowDuplicate =
      (allowDuplicateCheck(test.collections, collections, 'test') || isOwner) &&
      !derivedFromPremiumBankId
    const showDuplicateButton =
      testStatus === statusConstants.PUBLISHED &&
      !editEnable &&
      allowDuplicate &&
      !isCurator
    const showEditButton =
      testStatus === statusConstants.PUBLISHED &&
      !editEnable &&
      (isOwner || isCurator || isCollectionContentEditable)
    const showCancelButton =
      test.isUsed &&
      !!testAssignments.length &&
      !showEditButton &&
      !showDuplicateButton &&
      (testStatus === statusConstants.DRAFT || editEnable)

    const premiumOrgCollections = collections.filter(
      ({ _id }) =>
        !Object.keys(nonPremiumCollectionsToShareContent).includes(_id)
    )
    const testItems = (itemGroups || []).flatMap(
      (itemGroup) => itemGroup.items || []
    )
    const hasPremiumQuestion = !!testItems.find((i) =>
      hasUserGotAccessToPremiumItem(i.collections, premiumOrgCollections)
    )

    const gradeSubject = { grades, subjects }

    const isBuyAISuiteAlertModalVisible = getIsBuyAiSuiteAlertModalVisible(
      test?.testCategory,
      isRedirectToVQAddOn
    )

    return (
      <>
        <CustomPrompt
          when={
            !!updated ||
            (isDefaultTest && testId && this.checkInvalidTestTitle(test.title))
          }
          onUnload
          message={(loc = {}) => {
            const { pathname = '', state } = loc

            const testFlowPath = RegExp('/author/tests/\\w*')
            const allow =
              testFlowPath.test(pathname) ||
              pathname.startsWith('/author/assignments/')

            if (allow || !!state?.skipTestNameChangeModal) {
              return true
            }

            if (
              isDefaultTest &&
              testId &&
              this.checkInvalidTestTitle(test.title)
            ) {
              this.setState({
                showTestNameChangeModal: true,
                toBeResumedTestAction: TEST_ACTIONS.navigation,
                toBeNavigatedLocation: pathname,
              })
              return false
            }

            return t('component.common.modal.exitPageWarning')
          }}
        />
        <ConfirmTabChange
          confirmChangeNav={this.confirmChangeNav}
          showConfirmationOnTabChange={showConfirmationOnTabChange}
        />
        {this.renderModal()}
        {showCompeleteSignUp && !isTestLoading && (
          <TeacherSignup
            isModal
            isVisible={showCompeleteSignUp}
            handleCancel={() => {
              this.setState({ showCompeleteSignUp: false })
            }}
          />
        )}
        {showShareModal && (
          <ShareModal
            shareLabel="TEST URL"
            isVisible={showShareModal}
            testId={testId}
            testVersionId={versionId}
            hasPremiumQuestion={hasPremiumQuestion}
            isPublished={status === statusConstants.PUBLISHED}
            onClose={this.onShareModalChange}
            gradeSubject={gradeSubject}
          />
        )}
        {showTestNameChangeModal && (
          <TestNameChangeModal
            visible={showTestNameChangeModal}
            showSaveTitle={toBeResumedTestAction === TEST_ACTIONS.navigation}
            closeModal={() => {
              this.setState({
                showTestNameChangeModal: false,
                toBeResumedTestAction: null,
              })
            }}
            handleResponse={this.handleResumeActivity}
          />
        )}
        <WarningModal
          visible={showWarningModal}
          proceedPublish={proceedPublish}
        />

        <EduIf condition={isBuyAISuiteAlertModalVisible}>
          <BuyAISuiteAlertModal
            isVisible={isBuyAISuiteAlertModalVisible}
            setAISuiteAlertModalVisibility={() => {}}
            history={history}
            isClosable={false}
            stayOnSamePage={false}
          />
        </EduIf>

        <TestPageHeader
          onChangeNav={this.handleNavChange}
          current={current}
          isDocBased={isDocBased}
          onSave={isDocBased ? this.handleDocBasedSave : this.handleSave}
          onShare={this.onShareModalChange}
          onPublish={this.handlePublishTest}
          title={test?.title || ''}
          creating={creating}
          showEditButton={showEditButton}
          owner={isOwner || isCurator || !testId || isCollectionContentEditable}
          isUsed={test.isUsed}
          windowWidth={windowWidth}
          showPublishButton={showPublishButton}
          testStatus={testStatus}
          hasTestId={hasTestId}
          editEnable={editEnable}
          onEnableEdit={this.onEnableEdit}
          onShowSource={this.handleNavChange('source')}
          onAssign={this.handleAssign}
          updated={updated}
          toggleFilter={this.toggleFilter}
          isShowFilter={isShowFilter}
          isTestLoading={isTestLoading}
          showDuplicateButton={showDuplicateButton}
          handleDuplicateTest={this.showCloneModal}
          showCancelButton={showCancelButton}
          onCuratorApproveOrReject={this.onCuratorApproveOrReject}
          validateTest={this.validateTest}
          setDisableAlert={this.setDisableAlert}
          hasCollectionAccess={hasCollectionAccess}
          derivedFromPremiumBankId={derivedFromPremiumBankId}
          isEditable={isDefaultTest && this.getIsEditable()}
        />
        {/* This will work like an overlay during the test save for prevent content edit */}
        {creating && !(isTestLoading && !test._id) && (
          <Spin size="large" style={{ zIndex: 2000 }} />
        )}
        {isTestLoading && test._id && <ContentBackDrop />}
        {isTestLoading && !test._id ? (
          <Content>
            <SpinLoader />
          </Content>
        ) : (
          this.renderContent()
        )}
        <ItemCloneModal
          fallback={<Progress />}
          handleDuplicateTest={this.handleDuplicateTest}
          visible={showCloneModal}
          toggleVisibility={this.handleCloneModalVisibility}
        />
      </>
    )
  }
}

Container.propTypes = {
  createTest: PropTypes.func.isRequired,
  updateTest: PropTypes.func.isRequired,
  receiveTestById: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  setDefaultData: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  rows: PropTypes.array.isRequired,
  creating: PropTypes.bool.isRequired,
  windowWidth: PropTypes.number.isRequired,
  test: PropTypes.object,
  user: PropTypes.object,
  isTestLoading: PropTypes.bool.isRequired,
  saveCurrentEditingTestId: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  currentTab: PropTypes.string,
  testStatus: PropTypes.string,
  userId: PropTypes.string,
  updated: PropTypes.bool,
  showWarningModal: PropTypes.bool,
  proceedPublish: PropTypes.func.isRequired,
  clearTestAssignments: PropTypes.func.isRequired,
  editAssigned: PropTypes.bool,
  createdItems: PropTypes.array,
  setRegradeOldId: PropTypes.func.isRequired,
  getDefaultTestSettings: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  userRole: PropTypes.string,
  isReleaseScorePremium: PropTypes.bool,
  receiveItemDetailById: PropTypes.func.isRequired,
  questionsUpdated: PropTypes.bool,
  getItemsSubjectAndGrade: PropTypes.func.isRequired,
  itemsSubjectAndGrade: PropTypes.object,
  collectionsToShow: PropTypes.array,
  updateDefaultThumbnail: PropTypes.func.isRequired,
  questions: PropTypes.array,
  questionsById: PropTypes.object,
  updateDocBasedTest: PropTypes.func.isRequired,
  userFeatures: PropTypes.object.isRequired,
  publishTest: PropTypes.func.isRequired,
  duplicateTest: PropTypes.func.isRequired,
  collections: PropTypes.array,
  approveOrRejectSingleTestRequest: PropTypes.func.isRequired,
}

Container.defaultProps = {
  test: null,
  user: {},
  currentTab: 'review',
  testStatus: '',
  userId: '',
  updated: false,
  showWarningModal: false,
  editAssigned: false,
  createdItems: [],
  userRole: 'teacher',
  isReleaseScorePremium: false,
  questionsUpdated: false,
  itemsSubjectAndGrade: {},
  collectionsToShow: [],
  questions: [],
  questionsById: {},
  collections: [],
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces('author'),
  connect(
    (state) => ({
      test: getTestSelector(state),
      rows: getTestItemsRowsSelector(state),
      creating: getTestsCreatingSelector(state),
      user: getUserSelector(state),
      questions: getQuestionsArraySelector(state),
      questionsById: getQuestionsSelector(state),
      createdItems: getTestCreatedItemsSelector(state),
      isTestLoading: getTestsLoadingSelector(state),
      testStatus: getTestStatusSelector(state),
      userId: get(state, 'user.user._id', ''),
      updated: get(state, 'tests.updated', false),
      showWarningModal: get(state, ['itemDetail', 'showWarningModal'], false),
      questionsUpdated: get(state, 'authorQuestions.updated', false),
      itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state),
      standardsData: get(state, ['standardsProficiencyReducer', 'data'], []),
      performanceBandsData: get(
        state,
        ['performanceBandDistrict', 'profiles'],
        []
      ),
      userRole: getUserRole(state),
      isReleaseScorePremium: getReleaseScorePremiumSelector(state),
      collections: getCollectionsSelector(state),
      writableCollections: getWritableCollectionsSelector(state),
      userFeatures: getUserFeatures(state),
      testAssignments: getAssignmentsSelector(state),
      collectionsToShow: getCollectionsToAddContent(state),
      groupId: getCurrentGroup(state),
      classIds: getClassIds(state),
      studentAssignments: getAllAssignmentsSelector(state),
      loadingAssignments: get(state, 'publicTest.loadingAssignments'),
      editEnable: get(state, 'tests.editEnable'),
      pageNumber: state?.testsAddItems?.page || 1,
      isOrganizationDistrictUser: isOrganizationDistrictUserSelector(state),
      isOrganizationDA: isOrganizationDistrictSelector(state),
      languagePreference: getSelectedLanguageSelector(state),
      isPremiumUser: isPremiumUserSelector(state),
      isUpgradePopupVisible: getShowUpgradePopupSelector(state),
      testSettingsList: getTestSettingsListSelector(state),
      userSignupStatus: getUserSignupStatusSelector(state),
      hasPenaltyOnUsingHints: getPenaltyOnUsingHintsSelector(state),
      aiTestStatus: get(state, 'aiTestDetails.status'),
      isDynamicTest: isDynamicTestSelector(state),
      hasSections: hasSectionsSelector(state),
      isDefaultTest: isDefaultTestSelector(state),
      subscription: getSubscriptionSelector(state),
      isVideoQuiAndAiEnabled: isVideoQuizAndAIEnabledSelector(state),
      isRedirectToVQAddOn: isRedirectToVQAddOnSelector(state),
      accommodations: getUserAccommodations(state),
    }),
    {
      createTest: createTestAction,
      proceedPublish: proceedPublishingItemAction,
      updateTest: updateTestAction,
      updateDocBasedTest: updateDocBasedTestAction,
      receiveTestById: receiveTestByIdAction,
      setData: setTestDataAction,
      updateDefaultThumbnail: updateDefaultThumbnailAction,
      setDefaultData: setDefaultTestDataAction,
      publishTest: publishTestAction,
      updateItemsDocBasedById: updateItemsDocBasedByIdAction,
      setRegradeOldId: setRegradeOldIdAction,
      clearTestAssignments: loadAssignmentsAction,
      receiveItemDetailById: getItemDetailByIdAction,
      saveCurrentEditingTestId: saveCurrentEditingTestIdAction,
      getItemsSubjectAndGrade: getItemsSubjectAndGradeAction,
      getDefaultTestSettings: getDefaultTestSettingsAction,
      duplicateTest: duplicateTestRequestAction,
      approveOrRejectSingleTestRequest: approveOrRejectSingleTestRequestAction,
      updateLastUsedCollectionList: updateLastUsedCollectionListAction,
      removeTestEntity: removeTestEntityAction,
      fetchAssignmentsByTest: fetchAssignmentsByTestAction,
      startAssignment: startAssignmentAction,
      resumeAssignment: resumeAssignmentAction,
      setEditEnable: setEditEnableAction,
      resetPageState: resetPageStateAction,
      getTestIdFromVersionId: getTestIdFromVersionIdAction,
      setSelectedLanguage: setSelectedLanguageAction,
      fetchUserKeypads: fetchCustomKeypadAction,
      setShowUpgradePopup: setShowUpgradePopupAction,
      receiveTestByIdSuccess: receiveTestByIdSuccessAction,
      setCurrentTestSettingsId: setCurrentTestSettingsIdAction,
      fetchTestSettingsList: fetchTestSettingsListAction,
      setTestSettingsList: setTestSettingsListAction,
      setCurrentGroupIndexInStore: setCurrentGroupIndexAction,
    }
  )
)

Container.displayName = 'TestPage'

export default enhance(Container)
