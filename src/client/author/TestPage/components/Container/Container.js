import React, { PureComponent } from 'react'
import loadable from '@loadable/component'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
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
} from '@edulastic/common'
import {
  test as testContants,
  roleuser,
  collections as collectionsConstant,
  signUpState,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { testsApi } from '@edulastic/api'
import { themeColor } from '@edulastic/colors'
import { withNamespaces } from '@edulastic/localization'
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
  isEnabledRefMaterialSelector,
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
import {
  getQuestionsSelector,
  getQuestionsArraySelector,
} from '../../../sharedDucks/questions'
import { validateQuestionsForDocBased } from '../../../../common/utils/helpers'
import {
  allowDuplicateCheck,
  allowContentEditCheck,
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

const ItemCloneModal = loadable(() => import('../ItemCloneConfirmationModal'))

const { getDefaultImage } = testsApi
const {
  statusConstants,
  releaseGradeLabels,
  passwordPolicy: passwordPolicyValues,
  ITEM_GROUP_TYPES,
  ITEM_GROUP_DELIVERY_TYPES,
  testSettingsOptions,
  docBasedSettingsOptions,
} = testContants
const { nonPremiumCollectionsToShareContent } = collectionsConstant

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
    // if (tab === "addItems") {
    //   url += `?page=${pageNumber}`;
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
      } else if (!_location?.state?.persistStore) {
        // currently creating test do nothing
        this.gotoTab('description')
        clearTestAssignments([])
        setDefaultData()
        if (
          userRole === roleuser.DISTRICT_ADMIN ||
          userRole === roleuser.SCHOOL_ADMIN
        ) {
          setData({
            testType:
              testTypesConstants.TEST_TYPES_VALUES_MAP.COMMON_ASSESSMENT,
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
    const { resetPageState, setEditEnable, setTestSettingsList } = this.props
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
            setSelectedLanguage
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

  isTestSettingsEqual = (settingId) => {
    const { test, testSettingsList } = this.props

    // should not check assignment level settings in test settings
    const settingsToPick = difference(
      test.isDocBased ? docBasedSettingsOptions : testSettingsOptions,
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

  handleNavChange = (value, firstFlow) => () => {
    const {
      test,
      match: { params },
      userId,
      testStatus,
      updated,
      editEnable,
    } = this.props
    const { authors, itemGroups = [], _id } = test
    if (!test?.title?.trim()?.length) {
      notification({ type: 'warn', messageKey: 'pleaseEnterName' })
      return
    }
    if (value === 'source') {
      this.setState({
        showModal: true,
      })
      return
    }

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
      (totalTestItems > 0 || isAutoSelectGroup) &&
      !(totalTestItems === 1 && !_id && !isAutoSelectGroup) && // avoid redundant new test creation api call when user adds first item and quickly switches the tab
      updated &&
      !firstFlow
    ) {
      this.handleSave(test)
    }
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

  validateReferenceDocMaterial = () => {
    const { test, enabledRefMaterial } = this.props
    if (enabledRefMaterial && isEmpty(test.referenceDocAttributes)) {
      notification({ messageKey: 'uploadReferenceMaterial' })
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
    if (!source) {
      source = 'Created New'
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

    if (this.validateTest(test)) {
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
    setDefaultInterests({ subject: subjects[0] || '' })
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

  get isTestEditable() {
    const {
      test,
      match,
      userId,
      userFeatures,
      userRole,
      collections,
      editEnable,
      testStatus,
    } = this.props
    const { params = {} } = match

    const isOwner =
      (test.authors && test.authors.some((x) => x._id === userId)) ||
      !params.id ||
      userRole === roleuser.EDULASTIC_CURATOR ||
      (userFeatures.isCurator &&
        allowContentEditCheck(test.collections, collections))

    return isOwner && (editEnable || testStatus === statusConstants.DRAFT)
  }

  renderContent = () => {
    const {
      test,
      setData,
      rows,
      isTestLoading,
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
    } = this.props
    const { params = {} } = match
    const { showCancelButton = false } =
      history.location.state || this.state || {}
    const { isShowFilter } = this.state
    const current = currentTab
    const {
      authors,
      isDocBased,
      docUrl,
      annotations,
      pageStructure,
      freeFormNotes = {},
    } = test
    const isOwner =
      (authors && authors.some((x) => x._id === userId)) ||
      !params.id ||
      userRole === roleuser.EDULASTIC_CURATOR ||
      (userFeatures.isCurator &&
        allowContentEditCheck(test.collections, collections))
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
    }

    if (isTestLoading && !test._id) {
      return <Spin />
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
              gotoGroupItems={this.handleNavChange('groupItems')}
              toggleFilter={this.toggleFilter}
              isShowFilter={isShowFilter}
              handleSaveTest={this.handleSave}
              updated={updated}
              userRole={userRole}
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
            <MainWorksheet key="review" review {...props} viewMode="review" />
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
            owner={isOwner}
            isEditable={isEditable}
            current={current}
            showCancelButton={showCancelButton}
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
            <MainWorksheet key="worksheet" {...props} viewMode="edit" />
          </Content>
        )
      case 'assign':
        return (
          <Content>
            <Assign test={test} setData={setData} current={current} />
          </Content>
        )
      case 'groupItems':
        return (
          <Content>
            <GroupItems handleSaveTest={this.handleSave} />
          </Content>
        )
      default:
        return null
    }
  }

  modifyTest = () => {
    const {
      currentTab,
      enabledRefMaterial,
      user,
      test,
      itemsSubjectAndGrade,
    } = this.props
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

    if (
      !enabledRefMaterial &&
      currentTab === 'settings' &&
      !isEmpty(newTest.referenceDocAttributes)
    ) {
      newTest.referenceDocAttributes = {}
    }

    return newTest
  }

  handleSave = () => {
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
    } = this.props
    if (!test?.title?.trim()?.length) {
      notification({ messageKey: 'nameFieldRequired' })
      return
    }
    if (
      !this.validateTimedAssignment() ||
      !this.validateReferenceDocMaterial()
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

    updateLastUsedCollectionList(test.collections)

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
      updateTest(test._id, { ...newTest, currentTab })
    } else {
      createTest({ ...newTest, currentTab })
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
      !validateQuestionsForDocBased(assessmentQuestions, true)
    ) {
      return
    }
    updateDocBasedTest(test._id, test, true)
  }

  validateTest = (test) => {
    const {
      title,
      subjects,
      grades,
      passwordPolicy = passwordPolicyValues.REQUIRED_PASSWORD_POLICY_OFF,
      assignmentPassword = '',
      safeBrowser,
      sebPassword,
      passages,
    } = test
    const { userFeatures, isOrganizationDistrictUser } = this.props
    if (!title) {
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
      if (
        test.itemGroups.some(
          (itemGroup) =>
            itemGroup.type === ITEM_GROUP_TYPES.STATIC &&
            itemGroup.deliveryType ===
              ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
            itemGroup.items.length <= itemGroup.deliverItemsCount
        )
      ) {
        notification({
          messageKey: 'selectedItemsGroupShouldNotBeMoreThanDelivedItems',
        })
        return false
      }
    }
    // for itemGroup with limited delivery type should not contain items with question level scoring
    let testHasValidTestItems = false

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

      testHasValidTestItems = itemGroup.items.every((item) => {
        const {
          multipartItem,
          isPassageWithQuestions,
          data: { resources, questions },
        } = item

        if (multipartItem && !isPassageWithQuestions) {
          return questions.length
        }

        if (isPassageWithQuestions) {
          const passage = passages?.find((p) => p._id === item.passageId)
          if (!passage) {
            return true
          }
          const { structure } = passage
          const { widgets = [] } = structure
          // cannot publish the test if it has invalid passage item
          // @see: https://snapwiz.atlassian.net/browse/EV-29485
          return widgets.length && questions.length
        }

        return questions.length || resources.length
      })
    }

    if (!testHasValidTestItems) {
      notification({ messageKey: `testHasInvalidItem` })
      return false
    }
    return true
  }

  onShareModalChange = () => {
    const { showShareModal } = this.state
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
      !validateQuestionsForDocBased(assessmentQuestions, false)
    ) {
      return
    }
    if (this.validateTest(test)) {
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
    const canEdit =
      (authors && authors.some((x) => x._id === userId)) || isCurator
    const isArchivedInactiveTest =
      test.status === testContants.statusConstants.ARCHIVED && test.active === 0
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
    } = this.props
    if (userRole === roleuser.STUDENT) {
      return null
    }
    const {
      showShareModal,
      isShowFilter,
      showCloneModal,
      showCompeleteSignUp,
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
    } = test
    const hasCollectionAccess = allowContentEditCheck(
      test.collections,
      writableCollections
    )
    const isCurator =
      (hasCollectionAccess && userFeatures.isCurator) ||
      userRole === roleuser.EDULASTIC_CURATOR
    const isOwner = authors?.some((x) => x._id === userId)
    const showPublishButton =
      (testStatus !== statusConstants.PUBLISHED &&
        testId &&
        (isOwner || isCurator)) ||
      editEnable
    const hasTestId = !!testId
    const allowDuplicate =
      allowDuplicateCheck(test.collections, collections, 'test') || isOwner
    const showDuplicateButton =
      testStatus === statusConstants.PUBLISHED &&
      !editEnable &&
      allowDuplicate &&
      !isCurator
    const showEditButton =
      testStatus === statusConstants.PUBLISHED &&
      !editEnable &&
      (isOwner || isCurator)
    const showCancelButton =
      test.isUsed &&
      !!testAssignments.length &&
      !showEditButton &&
      !showDuplicateButton &&
      (testStatus === 'draft' || editEnable)

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

    return (
      <>
        <CustomPrompt
          when={!!updated}
          onUnload
          message={(loc = {}) => {
            const { pathname = '' } = loc

            const testFlowPath = RegExp('/author/tests/\\w*')
            const allow =
              testFlowPath.test(pathname) ||
              pathname.startsWith('/author/assignments/')

            if (allow) {
              return true
            }

            return t('component.common.modal.exitPageWarning')
          }}
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

        <WarningModal
          visible={showWarningModal}
          proceedPublish={proceedPublish}
        />
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
          owner={isOwner || isCurator || !testId}
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
        />
        {/* This will work like an overlay during the test save for prevent content edit */}
        {isTestLoading && test._id && <ContentBackDrop />}
        {this.renderContent()}
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
      enabledRefMaterial: isEnabledRefMaterialSelector(state),
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
    }
  )
)

Container.displayName = 'TestPage'

export default enhance(Container)
