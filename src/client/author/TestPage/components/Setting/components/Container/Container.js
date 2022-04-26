import React, { Component, memo } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { get, isObject, pick, omit } from 'lodash'
import Styled from 'styled-components'
import { Anchor, Col, Icon, InputNumber, Row, Select, Tooltip } from 'antd'
import {
  blueBorder,
  green,
  lightGrey9,
  red,
  themeColor,
} from '@edulastic/colors'

import {
  CheckboxLabel,
  EduSwitchStyled,
  FieldLabel,
  MainContentWrapper,
  notification,
  RadioBtn,
  SelectInputStyled,
  TextInputStyled,
  withWindowSizes,
  EduButton,
} from '@edulastic/common'
import { roleuser, test as testContants } from '@edulastic/constants'
import { IconInfo, IconTrash } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'

import { isFeatureAccessible } from '../../../../../../features/components/FeaturesSwitch'
import {
  getUserFeatures,
  getUserRole,
  getUserId,
} from '../../../../../../student/Login/ducks'
import {
  testTypesToTestSettings,
  defaultTestTypeProfilesSelector,
  getDisableAnswerOnPaperSelector,
  getReleaseScorePremiumSelector,
  getTestEntitySelector,
  resetUpdatedStateAction,
  setTestDataAction,
  testTypeAsProfileNameType,
  fetchTestSettingsListAction,
  saveTestSettingsAction,
  getTestSettingsListSelector,
  getTestDefaultSettingsSelector,
  deleteTestSettingRequestAction,
  updateTestSettingRequestAction,
} from '../../../../ducks'
import Breadcrumb from '../../../../../src/components/Breadcrumb'

import { setMaxAttemptsAction, setSafeBroswePassword } from '../../ducks'
import {
  allowedToSelectMultiLanguageInTest,
  isEtsDistrictSelector,
  isPublisherUserSelector,
  allowReferenceMaterialSelector,
} from '../../../../../src/selectors/user'
import {
  Block,
  BlueText,
  Body,
  Container,
  Description,
  Label,
  MessageSpan,
  NavigationMenu,
  RadioWrapper,
  SettingsCategoryBlock,
  StyledAnchor,
  StyledRadioGroup,
  Title,
  SavedSettingsContainerStyled,
  SubHeaderContainer,
} from './styled'
import PeformanceBand from './PeformanceBand'
import StandardProficiencyTable from './StandardProficiencyTable'
import Instruction from './InstructionBlock/InstructionBlock'
import DollarPremiumSymbol from '../../../../../AssignTest/components/Container/DollarPremiumSymbol'
import {
  SettingContainer,
  DeleteIconContainer,
} from '../../../../../AssignTest/components/Container/styled'
import {
  CheckBoxWrapper,
  StyledRow,
} from '../../../../../AssignTest/components/SimpleOptions/styled'
import KeypadDropdown from './KeypadDropdown'
import ReferenceMaterial from './ReferenceMaterial'
import { getAssignmentsSelector } from '../../../Assign/ducks'
import { ConfirmationModal } from '../../../../../src/components/common/ConfirmationModal'
import { skinTypesOrder, showRubricToStudentsSetting } from '../../../../utils'
import SaveSettingsModal from '../../../../../AssignTest/components/Container/SaveSettingsModal'
import DeleteTestSettingsModal from '../../../../../AssignTest/components/Container/DeleteSettingsConfirmationModal'
import UpdateTestSettingsModal from '../../../../../AssignTest/components/Container/UpdateTestSettingModal'
import { multiFind } from '../../../../../../common/utils/main'
import CalculatorSetting from './CalculatorSetting'

const {
  settingCategories,
  settingCategoriesFeatureMap,
  type,
  completionTypes,
  evalTypes,
  evalTypeLabels,
  accessibilities,
  releaseGradeTypes,
  releaseGradeLabels,
  releaseGradeKeys,
  nonPremiumReleaseGradeKeys,
  testContentVisibility: testContentVisibilityOptions,
  testContentVisibilityTypes,
  passwordPolicy: passwordPolicyValues,
  passwordPolicyOptions,
  playerSkinTypes,
  playerSkinValues,
  settingsList,
  TEST_SETTINGS_SAVE_LIMIT,
  testSettingsOptions,
  docBasedSettingsOptions,
} = testContants

const { Option } = Select

const { ASSESSMENT, PRACTICE, COMMON } = type

const testTypes = {
  [ASSESSMENT]: 'Class Assessment',
  [PRACTICE]: 'Practice',
}

const authorPublisherTestTypes = {
  [ASSESSMENT]: 'Assessment',
  [PRACTICE]: 'Practice',
}

const {
  ALL_OR_NOTHING,
  PARTIAL_CREDIT,
  ITEM_LEVEL_EVALUATION,
  PARTIAL_CREDIT_IGNORE_INCORRECT,
} = evalTypeLabels

class Setting extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showPassword: false,
      inputBlur: false,
      _releaseGradeKeys: nonPremiumReleaseGradeKeys,
      isTestBehaviorGroupExpanded: true,
      isAntiCheatingGroupExpanded: true,
      isMiscellaneousGroupExpanded: true,
      warningKeypadSelection: false,
      selectedKeypad: null,
      showSaveSettingsModal: false,
      showDeleteSettingModal: false,
      showUpdateSettingModal: false,
      settingDetails: null,
    }

    this.containerRef = React.createRef()
  }

  static getDerivedStateFromProps(nextProps) {
    const { features, entity } = nextProps
    const { grades, subjects } = entity
    if (
      features?.assessmentSuperPowersReleaseScorePremium ||
      (grades &&
        subjects &&
        isFeatureAccessible({
          features,
          inputFeatures: 'assessmentSuperPowersReleaseScorePremium',
          gradeSubject: { grades, subjects },
        }))
    ) {
      return {
        _releaseGradeKeys: releaseGradeKeys,
      }
    }
    return {
      _releaseGradeKeys: nonPremiumReleaseGradeKeys,
    }
  }

  componentDidMount = () => {
    const { entity, resetUpdatedState } = this.props
    if (entity?.scoringType === PARTIAL_CREDIT && !entity?.penalty) {
      this.updateTestData('scoringType')(PARTIAL_CREDIT_IGNORE_INCORRECT)
    }
    if (entity?.safeBrowser) {
      this.updateTestData('safeBrowser')(true)
    }
    // resetting updated state on mount
    resetUpdatedState()
  }

  handleShowPassword = () => {
    this.setState((state) => ({ showPassword: !state.showPassword }))
  }

  updateAttempt = (e) => {
    const { setMaxAttempts } = this.props
    let { value = 0 } = e.target
    if (value < 0) value = 0
    setMaxAttempts(parseInt(value, 10))
  }

  setPassword = (e) => {
    const { setSafePassword } = this.props
    setSafePassword(e.target.value)
  }

  keypadSelection = (value) => {
    if (!value) {
      return
    }
    if (value.type === 'item-level') {
      this.updateTestData('keypad')(value)
    } else {
      this.setState({ selectedKeypad: value, warningKeypadSelection: true })
    }
  }

  confirmKeypadSelection = (confirm = false) => {
    const { selectedKeypad } = this.state
    if (confirm === true && selectedKeypad && selectedKeypad.type) {
      this.updateTestData('keypad')(selectedKeypad)
    }
    this.setState({ warningKeypadSelection: false })
  }

  handleApplyEBSR = (event) => {
    const {
      target: { checked },
    } = event
    const { setTestData } = this.props
    setTestData({
      applyEBSR: checked,
    })
  }

  updateTestData = (key) => (value) => {
    const {
      setTestData,
      setMaxAttempts,
      performanceBandsData,
      standardsData,
      defaultTestTypeProfiles,
      isReleaseScorePremium,
      disableAnswerOnPaper,
      entity: { testType },
    } = this.props
    switch (key) {
      case 'testType': {
        const testProfileType = testTypeAsProfileNameType[value]
        const defaultBandId =
          defaultTestTypeProfiles?.performanceBand?.[testProfileType]
        const defaultStandardId =
          defaultTestTypeProfiles?.standardProficiency?.[testProfileType]
        const performanceBand =
          performanceBandsData.find((item) => item._id === defaultBandId) || {}
        const standardGradingScale =
          standardsData.find((item) => item._id === defaultStandardId) || {}
        if (value === ASSESSMENT || value === COMMON) {
          const releaseScore =
            value === ASSESSMENT && isReleaseScorePremium
              ? releaseGradeLabels.WITH_RESPONSE
              : releaseGradeLabels.DONT_RELEASE
          setMaxAttempts(1)
          setTestData({
            releaseScore,
            maxAnswerChecks: 0,
            performanceBand: {
              name: performanceBand.name,
              _id: performanceBand._id,
            },
            standardGradingScale: {
              name: standardGradingScale.name,
              _id: standardGradingScale._id,
            },
            freezeSettings: false,
          })
        } else {
          setMaxAttempts(1)
          setTestData({
            releaseScore: releaseGradeLabels.WITH_ANSWERS,
            maxAnswerChecks: 3,
            performanceBand: {
              name: performanceBand.name,
              _id: performanceBand._id,
            },
            standardGradingScale: {
              name: standardGradingScale.name,
              _id: standardGradingScale._id,
            },
            freezeSettings: false,
          })
        }
        break
      }
      case 'scoringType': {
        const penalty = value === evalTypeLabels.PARTIAL_CREDIT
        const dataToSet = {
          penalty,
        }
        if (
          ![
            evalTypeLabels.PARTIAL_CREDIT,
            evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT,
          ].includes(value)
        ) {
          Object.assign(dataToSet, { applyEBSR: false })
        } else {
          value = evalTypeLabels.PARTIAL_CREDIT
        }
        setTestData(dataToSet)
        break
      }
      case 'safeBrowser':
        if (!value) {
          setTestData({
            sebPassword: '',
          })
        } else {
          setTestData({
            restrictNavigationOut: undefined,
          })
        }
        break
      case 'maxAnswerChecks':
        value = parseInt(value, 10)
        if (value < 0) value = 0
        break
      case 'passwordPolicy': {
        if (value === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_DYNAMIC) {
          setTestData({
            passwordExpireIn: 15 * 60,
          })
        } else if (
          value === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_STATIC
        ) {
          setTestData({
            assignmentPassword: '',
          })
        }
        break
      }
      case 'answerOnPaper':
        if (value === true && disableAnswerOnPaper) {
          notification({ messageKey: 'answerOnPaperNotSupportedForThisTest' })
          return
        }
        break
      case 'performanceBand':
        value = pick(
          multiFind(
            performanceBandsData,
            [
              { _id: value._id },
              {
                _id:
                  defaultTestTypeProfiles.performanceBand[
                    testTypesToTestSettings[testType]
                  ],
              },
            ],
            value
          ),
          ['_id', 'name']
        )
        break
      case 'standardGradingScale':
        value = pick(
          multiFind(
            standardsData,
            [
              { _id: value._id },
              {
                _id:
                  defaultTestTypeProfiles.standardProficiency[
                    testTypesToTestSettings[testType]
                  ],
              },
            ],
            value
          ),
          ['_id', 'name']
        )
        break
      default:
        break
    }
    setTestData({
      [key]: value,
    })
  }

  updateFeatures = (key) => (e) => {
    const { setTestData } = this.props
    let featVal = isObject(e) ? e.target.value : e
    if (typeof featVal === 'undefined') {
      featVal = null
    }
    this.setState({ [key]: featVal })
    setTestData({
      [key]: featVal,
    })
  }

  handleBlur = () => this.setState({ inputBlur: true })

  handleUpdatePasswordExpireIn = (e) => {
    let { value = 1 } = e.target
    value *= 60
    // eslint-disable-next-line no-restricted-globals
    if (value < 60 || isNaN(value)) {
      value = 60
    } else if (value > 999 * 60) {
      value = 999 * 60
    }
    this.updateTestData('passwordExpireIn')(value)
  }

  updateTimedTest = (attr) => (value) => {
    const { totalItems, setTestData } = this.props
    if (value) {
      setTestData({
        [attr]: value,
        pauseAllowed: true,
        allowedTime: totalItems * 60 * 1000,
      })
      return
    }
    setTestData({
      [attr]: value,
    })
  }

  updateExternalData = (key) => (e) => {
    const {
      setTestData,
      entity: { testletConfig = {} },
    } = this.props
    setTestData({
      testletConfig: {
        ...testletConfig,
        [key]: e.target.value,
      },
    })
  }

  togglePanel = (panelType, value) => {
    this.setState({ [panelType]: value })
  }

  get keypadDropdownValue() {
    const { entity: { keypad: testKeypad = {} } = {} } = this.props
    if (!testKeypad.type) return 'item-level-keypad'
    if (testKeypad.type === 'custom') {
      return testKeypad.value?._id
    }
    return testKeypad.value
  }

  handleMouseOver = (e) => {
    e.currentTarget.querySelector('.delete-setting-button').style.display =
      'flex'
  }

  handleMouseOut = (e) => {
    e.currentTarget.querySelector('.delete-setting-button').style.display =
      'none'
  }

  sanitizeSettingsForTest = (initialSettings) => {
    const {
      entity: { itemGroups },
      userRole,
    } = this.props
    const newSettings = omit(initialSettings, [
      'autoRedirect',
      'autoRedirectSettings',
    ])
    const multipartItems = itemGroups
      .map((o) => o.items)
      .flat()
      .filter((o) => o.multipartItem).length
    if (
      newSettings.applyEBSR &&
      (![
        evalTypeLabels.PARTIAL_CREDIT,
        evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT,
      ].includes(newSettings.scoringType) ||
        !multipartItems)
    ) {
      newSettings.applyEBSR = false
    }
    if (userRole === roleuser.TEACHER && newSettings.testContentVisibility) {
      delete newSettings.testContentVisibility
    }
    if (
      newSettings.scoringType === evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT
    ) {
      newSettings.scoringType = evalTypeLabels.PARTIAL_CREDIT
      newSettings.penalty = false
    }
    if (
      newSettings.passwordPolicy !==
      testContants.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
    ) {
      delete newSettings.passwordExpireIn
    }
    if (
      newSettings.passwordPolicy !==
      testContants.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC
    ) {
      delete newSettings.assignmentPassword
    }
    if (!newSettings.safeBrowser) {
      delete newSettings.sebPassword
    }
    return newSettings
  }

  handleSettingsSelection = (value) => {
    const {
      setTestData,
      testSettingsList,
      testDefaultSettings,
      entity,
      totalItems,
    } = this.props
    const { settingId: currentSettingsId = '' } = entity
    if (value === 'save-settings-option') {
      if (currentSettingsId === '')
        this.setState({ showSaveSettingsModal: true })
      else {
        const { _id, title } =
          testSettingsList.find((t) => t._id === currentSettingsId) || {}
        this.setState({
          showUpdateSettingModal: true,
          settingDetails: {
            _id,
            title,
          },
        })
      }
    } else {
      let newSettings = {}
      if (value === '') {
        newSettings = {
          ...testDefaultSettings,
        }
      } else {
        const selectedSetting = testSettingsList.find((t) => t._id === value)
        newSettings = {
          ...pick(
            selectedSetting,
            entity.isDocBased ? docBasedSettingsOptions : testSettingsOptions
          ),
        }
      }
      newSettings = this.sanitizeSettingsForTest(newSettings)
      if (newSettings.timedAssignment && !newSettings.allowedTime) {
        newSettings.allowedTime = totalItems * 60 * 1000
      } else if (!newSettings.timedAssignment) {
        newSettings.allowedTime = 0
      }
      newSettings.settingId = value
      setTestData(newSettings)
    }
  }

  toggleSaveSettingsModal = (value) => {
    this.setState({ showSaveSettingsModal: value })
  }

  validateSettings = (entity) => {
    let isValid = true
    if (
      entity.passwordPolicy ===
        testContants.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC &&
      !entity.passwordExpireIn
    ) {
      notification({ msg: 'Please enter password expiry time' })
      isValid = false
    } else if (
      entity.passwordPolicy ===
        testContants.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC &&
      (!entity.assignmentPassword ||
        (entity.assignmentPassword &&
          (entity?.assignmentPassword?.length < 6 ||
            entity?.assignmentPassword?.length > 25)))
    ) {
      notification({ messageKey: 'enterValidPassword' })
      isValid = false
    } else if (entity.safeBrowser && !entity.sebPassword) {
      notification({ msg: 'Please enter safe exam browser password' })
      isValid = false
    }
    return isValid
  }

  getCurrentSettings = (title, currentSelectedSettings = {}) => {
    const { entity, userId } = this.props
    const obj = pick(
      { ...currentSelectedSettings, ...entity },
      entity.isDocBased ? docBasedSettingsOptions : testSettingsOptions
    )
    const settings = {
      ...obj,
      orgId: userId,
      orgType: roleuser.ORG_TYPE.USER,
      title,
    }
    const sanitizedSettings = this.sanitizeSettingsForTest(settings)
    const isValid = this.validateSettings(sanitizedSettings)
    if (isValid) return sanitizedSettings
    return false
  }

  handleSaveTestSetting = (settingName) => {
    const { saveTestSettings } = this.props
    const data = this.getCurrentSettings(settingName)
    if (data) saveTestSettings({ data, switchSettingInTest: true })
    this.toggleSaveSettingsModal(false)
  }

  handleDeleteSettings = (value) => {
    if (value) {
      const { deleteTestSettingRequest, entity } = this.props
      const { settingDetails } = this.state
      deleteTestSettingRequest(settingDetails._id)
      if (settingDetails._id === entity.settingId)
        this.handleSettingsSelection('')
    }
    this.setState({ showDeleteSettingModal: false })
  }

  handleUpdateSettings = (value) => {
    if (!value) {
      const { testSettingsList } = this.props
      this.setState({
        showUpdateSettingModal: false,
        showSaveSettingsModal:
          testSettingsList.length < TEST_SETTINGS_SAVE_LIMIT,
      })
    } else {
      const { updateTestSettingRequest, testSettingsList, entity } = this.props
      const { settingId: currentSettingsId = '' } = entity
      const currentSelectedSetting =
        testSettingsList.find((t) => t._id === currentSettingsId) || {}
      const data = this.getCurrentSettings(
        currentSelectedSetting.title,
        currentSelectedSetting
      )
      if (data) {
        const settings = {
          ...data,
          testSettingId: currentSettingsId,
        }
        updateTestSettingRequest(settings)
      }

      this.setState({
        showUpdateSettingModal: false,
      })
    }
  }

  get isReferenceMaterialAllowedForCurrentSkin() {
    const { quester, edulastic } = playerSkinValues
    const { entity: { playerSkinType = edulastic } = {} } = this.props
    const retval = playerSkinType === edulastic || playerSkinType === quester

    return retval
  }

  render() {
    const {
      showPassword,
      _releaseGradeKeys,
      isTestBehaviorGroupExpanded,
      isAntiCheatingGroupExpanded,
      isMiscellaneousGroupExpanded,
      warningKeypadSelection,
      showSaveSettingsModal,
      showDeleteSettingModal,
      settingDetails,
      showUpdateSettingModal,
    } = this.state
    const {
      current,
      history,
      windowWidth,
      entity,
      owner,
      userRole,
      features,
      isEditable,
      sebPasswordRef,
      showCancelButton,
      disableAnswerOnPaper,
      premium,
      districtPermissions = [],
      isAuthorPublisher,
      calculatorProvider,
      allowedToSelectMultiLanguage,
      testAssignments,
      editEnable,
      isCurator,
      isPlaylist,
      isEtsDistrict,
      t,
      testSettingsList = [],
      performanceBandsData,
      standardsData,
      defaultTestTypeProfiles,
    } = this.props
    const {
      isDocBased,
      releaseScore,
      safeBrowser,
      sebPassword,
      blockNavigationToAnsweredQuestions,
      shuffleQuestions,
      shuffleAnswers,
      answerOnPaper,
      passwordPolicy,
      maxAnswerChecks,
      testType,
      calcType,
      assignmentPassword,
      passwordExpireIn,
      markAsDone,
      maxAttempts,
      grades,
      subjects,
      testContentVisibility = testContentVisibilityOptions.ALWAYS,
      playerSkinType = playerSkinTypes.edulastic.toLowerCase(),
      showMagnifier = true,
      timedAssignment,
      allowedTime,
      enableScratchpad = true,
      freezeSettings = false,
      hasInstruction = false,
      instruction = '',
      testletConfig = {},
      multiLanguageEnabled,
      restrictNavigationOut,
      restrictNavigationOutAttemptsThreshold,
      blockSaveAndContinue,
      pauseAllowed,
      itemGroups = [],
      applyEBSR = false,
      enableSkipAlert = false,
      settingId: currentSettingsId = '',
      referenceDocAttributes,
      showRubricToStudents = false,
      performanceBand: _performanceBand,
      standardGradingScale: _standardGradingScale,
    } = entity

    let isSettingPresent = false
    if (
      currentSettingsId &&
      testSettingsList.some((s) => s._id === currentSettingsId)
    ) {
      isSettingPresent = true
    }
    const scoringType =
      entity.scoringType === evalTypeLabels.PARTIAL_CREDIT &&
      entity.penalty === false
        ? evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT
        : entity.scoringType
    const multipartItems = itemGroups
      .map((o) => o.items)
      .flat()
      .filter((o) => o.multipartItem).length
    const breadcrumbData = [
      {
        title: showCancelButton ? 'ASSIGNMENTS / EDIT TEST' : 'TESTS',
        to: showCancelButton ? '/author/assignments' : '/author/tests',
      },
      {
        title: current,
        to: '',
      },
    ]

    const isShowRubricToStudentsSettingVisible = showRubricToStudentsSetting(
      itemGroups
    )

    const isSmallSize = windowWidth < 993 ? 1 : 0

    let validationMessage = ''
    const isPasswordValid = () => {
      const { inputBlur } = this.state
      if (!inputBlur) return blueBorder
      if (assignmentPassword.split(' ').length > 1) {
        validationMessage = 'Password must not contain space'
        return red
      }
      if (assignmentPassword.length >= 6 && assignmentPassword.length <= 25) {
        return green
      }
      validationMessage =
        'Password is too short - must be at least 6 characters'
      if (assignmentPassword.length > 25)
        validationMessage = 'Password is too long'
      return red
    }

    const categories = ['show-answer-choice', 'suffle-question']

    const availableFeatures = {}
    settingsList.slice(0, -5).forEach((category) => {
      if (isDocBased && categories.includes(category.id)) return null
      if (
        features[settingCategoriesFeatureMap[category.id]] ||
        isFeatureAccessible({
          features,
          inputFeatures: settingCategoriesFeatureMap[category.id],
          gradeSubject: { grades, subjects },
        })
      ) {
        availableFeatures[settingCategoriesFeatureMap[category.id]] = true
      }
      return null
    })

    const edulastic = `${playerSkinTypes.edulastic} ${
      testType.includes('assessment') ? 'Test' : 'Practice'
    }`
    const skinTypes = {
      ...playerSkinTypes,
      edulastic,
    }

    const accessibilityData = [
      {
        key: 'showMagnifier',
        value: showMagnifier,
        description:
          'This tool provides visual assistance. When enabled, students can move the magnifier around the page to enlarge areas of their screen.',
        id: 'magnifier-setting',
      },
      {
        key: 'enableScratchpad',
        value: enableScratchpad,
        description:
          'When enabled, a student can open ScratchPad to show their work. The tool contains options for text, drawing, shapes, rulers, and more.',
        id: 'scratchpad-setting',
      },
      {
        key: 'enableSkipAlert',
        value: enableSkipAlert,
        description:
          'When enabled, a student can not skip a question without confirmation.',
        id: 'skip-alert',
      },
    ]

    const advancedSettingCategoris = settingCategories.slice(-6, -4)
    if (playerSkinType === playerSkinValues.testlet.toLowerCase()) {
      advancedSettingCategoris.push({
        id: 'external-metadata',
        title: 'External Metadata',
      })
    }

    const {
      assessmentSuperPowersMarkAsDone = false,
      assessmentSuperPowersShowCalculator = false,
      assessmentSuperPowersTimedTest = false,
      assessmentSuperPowersCheckAnswerTries = false,
      maxAttemptAllowed = false,
      assessmentSuperPowersShuffleQuestions = false,
      assessmentSuperPowersShuffleAnswerChoice = false,
      assessmentSuperPowersRequirePassword = false,
      assessmentSuperPowersRestrictQuestionBackNav = false,
      assessmentSuperPowersRequireSafeExamBrowser = false,
      assessmentSuperPowersAnswerOnPaper = false,
      performanceBands = false,
      selectPlayerSkinType = false,
    } = availableFeatures

    const navigationThresholdMoreThan1 =
      restrictNavigationOut === 'warn-and-report-after-n-alerts' &&
      restrictNavigationOutAttemptsThreshold > 1
    const isEdulasticCurator = userRole === roleuser.EDULASTIC_CURATOR
    const testStatus = entity.status
    const isRegradeFlow =
      entity.isUsed &&
      !!testAssignments.length &&
      !isEdulasticCurator &&
      !isCurator &&
      (testStatus === 'draft' || editEnable)
    const disabled = !owner || !isEditable

    const performanceBand = pick(
      multiFind(
        performanceBandsData,
        [
          { _id: _performanceBand?._id },
          {
            _id:
              defaultTestTypeProfiles.performanceBand?.[
                testTypesToTestSettings[testType]
              ],
          },
        ],
        _performanceBand
      ),
      ['_id', 'name']
    )
    const standardGradingScale = pick(
      multiFind(
        standardsData,
        [
          { _id: _standardGradingScale?._id },
          {
            _id:
              defaultTestTypeProfiles.standardProficiency?.[
                testTypesToTestSettings[testType]
              ],
          },
        ],
        _standardGradingScale
      ),
      ['_id', 'name']
    )

    const applyEBSRComponent = () => {
      return (
        <CheckBoxWrapper>
          <CheckboxLabel
            disabled={disabled}
            data-cy="applyEBSR"
            checked={applyEBSR}
            onChange={this.handleApplyEBSR}
          >
            <StyledSpan className="spanText">APPLY EBSR GRADING</StyledSpan>
          </CheckboxLabel>
        </CheckBoxWrapper>
      )
    }

    const isTestSettingSaveLimitReached =
      testSettingsList.length >= TEST_SETTINGS_SAVE_LIMIT

    return (
      <MainContentWrapper ref={this.containerRef} padding="10px 20px">
        {showSaveSettingsModal && (
          <SaveSettingsModal
            visible={showSaveSettingsModal}
            toggleModal={this.toggleSaveSettingsModal}
            handleSave={this.handleSaveTestSetting}
          />
        )}
        <DeleteTestSettingsModal
          visible={showDeleteSettingModal}
          settingDetails={settingDetails}
          handleResponse={this.handleDeleteSettings}
        />
        <UpdateTestSettingsModal
          visible={showUpdateSettingModal}
          settingDetails={settingDetails}
          handleResponse={this.handleUpdateSettings}
          disableSaveNew={isTestSettingSaveLimitReached}
          closeModal={() => {
            this.setState({ showUpdateSettingModal: false })
          }}
        />
        <Container padding="10px 20px" marginTop="0px">
          <SubHeaderContainer>
            <Col span={12}>
              <Breadcrumb
                data={breadcrumbData}
                style={{ position: 'relative', top: '0px' }}
              />
            </Col>
            <Col span={12}>
              {premium && (
                <SavedSettingsContainerStyled isSmallSize={isSmallSize}>
                  <div>SAVED SETTINGS</div>
                  <Select
                    value={isSettingPresent ? currentSettingsId : ''}
                    getPopupContainer={(node) => node.parentNode}
                    onChange={this.handleSettingsSelection}
                    optionLabelProp="label"
                    data-cy="select-save-test-settings"
                    disabled={disabled}
                  >
                    <Select.Option
                      key="1"
                      value=""
                      label="DEFAULT TEST SETTINGS"
                    >
                      DEFAULT TEST SETTINGS
                    </Select.Option>
                    {testSettingsList.map((ts) => (
                      <Select.Option
                        key={ts._id}
                        value={ts._id}
                        label={ts.title}
                      >
                        <span
                          onMouseOver={this.handleMouseOver}
                          onMouseOut={this.handleMouseOut}
                          onFocus={() => {}}
                          onBlur={() => {}}
                        >
                          {ts.title}{' '}
                          <DeleteIconContainer
                            className="delete-setting-button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              this.setState({
                                showDeleteSettingModal: true,
                                settingDetails: {
                                  _id: ts._id,
                                  title: ts.title,
                                },
                              })
                            }}
                            title="Remove Setting"
                          >
                            <IconTrash color={themeColor} />
                          </DeleteIconContainer>
                        </span>
                      </Select.Option>
                    ))}
                    <Select.Option
                      key="2"
                      value="save-settings-option"
                      label="SAVE CURRENT SETTING"
                      disabled={
                        isTestSettingSaveLimitReached && !currentSettingsId
                      }
                      title={
                        isTestSettingSaveLimitReached && !currentSettingsId
                          ? 'Maximum limit reached. Please delete existing one to add new.'
                          : ''
                      }
                      className="save-settings-option"
                    >
                      <span>
                        <Icon type="save" theme="filled" />
                        SAVE CURRENT SETTING
                      </span>
                    </Select.Option>
                  </Select>
                </SavedSettingsContainerStyled>
              )}
            </Col>
          </SubHeaderContainer>
          <Row>
            <Col span={isSmallSize ? 0 : 4}>
              <NavigationMenu>
                <StyledAnchor
                  affix={false}
                  offsetTop={125}
                  getContainer={() => this.containerRef.current || window}
                >
                  {settingCategories.map((category) => {
                    return (
                      <Anchor.Link
                        key={category.id}
                        href={`${history.location.pathname}#${category.id}`}
                        title={category.title.toLowerCase()}
                      />
                    )
                  })}
                </StyledAnchor>
              </NavigationMenu>
            </Col>

            <Col span={isSmallSize ? 24 : 20}>
              <SettingsCategoryBlock id="test-behavior">
                <span>Test Behavior</span>
                <span
                  onClick={() =>
                    this.togglePanel(
                      'isTestBehaviorGroupExpanded',
                      !isTestBehaviorGroupExpanded
                    )
                  }
                >
                  <Icon type={isTestBehaviorGroupExpanded ? 'minus' : 'plus'} />
                </span>
              </SettingsCategoryBlock>
              {isTestBehaviorGroupExpanded && (
                <>
                  <Block id="test-type" smallSize={isSmallSize}>
                    <Row>
                      <Title>
                        <span>Test Type</span>
                        {isRegradeFlow && !isPlaylist && (
                          <Tooltip title="Updates made to the test type will not reflect for existing assignments after regrade.">
                            <IconInfo
                              color={lightGrey9}
                              style={{ marginLeft: '10px', cursor: 'pointer' }}
                            />
                          </Tooltip>
                        )}
                      </Title>
                      <Body smallSize={isSmallSize}>
                        <Row>
                          <Col span={12}>
                            <SelectInputStyled
                              value={testType}
                              disabled={disabled}
                              onChange={this.updateTestData('testType')}
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              data-cy="testType"
                            >
                              {(userRole === roleuser.DISTRICT_ADMIN ||
                                userRole === roleuser.SCHOOL_ADMIN ||
                                testType === COMMON) &&
                                !districtPermissions.includes('publisher') && (
                                  <Option key={COMMON} value={COMMON}>
                                    Common Assessment
                                  </Option>
                                )}
                              {Object.keys(
                                isAuthorPublisher
                                  ? authorPublisherTestTypes
                                  : testTypes
                              ).map((key) => (
                                <Option key={key} value={key}>
                                  {isAuthorPublisher
                                    ? authorPublisherTestTypes[key]
                                    : testTypes[key]}
                                </Option>
                              ))}
                            </SelectInputStyled>
                          </Col>
                        </Row>
                        <Description>
                          Designate what type of assignment you are delivering.
                          You’ll be able to use these categories later to filter
                          reports so make sure practice is set as practice.
                        </Description>
                      </Body>
                    </Row>
                  </Block>

                  {(userRole === roleuser.DISTRICT_ADMIN ||
                    userRole === roleuser.SCHOOL_ADMIN) &&
                    testType === COMMON && (
                      <Block id="freeze-settings" smallSize={isSmallSize}>
                        <Row>
                          <Title>
                            <span>Freeze Settings</span>
                            <EduSwitchStyled
                              disabled={disabled}
                              data-cy="freeze-settings"
                              checked={freezeSettings}
                              onChange={() =>
                                this.updateTestData('freezeSettings')(
                                  !freezeSettings
                                )
                              }
                            />
                            <Tooltip title="Instructors won’t be allowed to override the test settings while assigning it.">
                              <IconInfo
                                color={lightGrey9}
                                style={{
                                  cursor: 'pointer',
                                  position: 'relative',
                                  right: '-10px',
                                }}
                              />
                            </Tooltip>
                          </Title>
                        </Row>
                      </Block>
                    )}

                  {/* Add instruction starts */}
                  <Block id="add-instruction" smallSize={isSmallSize}>
                    <SettingContainer>
                      <Title>
                        <span>Test Instructions</span>
                        <EduSwitchStyled
                          disabled={disabled}
                          data-cy="add-test-instruction"
                          checked={hasInstruction}
                          onChange={() =>
                            this.updateTestData('hasInstruction')(
                              !hasInstruction
                            )
                          }
                        />
                      </Title>
                      <Body smallSize={isSmallSize}>
                        <Description>
                          Add instructions for the students here. For example,
                          &ldquo;You will be allowed two attempts on this
                          quiz.&ldquo; Or, &ldquo;This test is worth 30% of your
                          grade.&ldquo;
                        </Description>
                        {hasInstruction && (
                          <Instruction
                            border="border"
                            size="SM"
                            updateTestData={this.updateTestData}
                            instruction={instruction}
                            disabled={disabled}
                          />
                        )}
                      </Body>
                    </SettingContainer>
                  </Block>
                  {/* Add instruction ends */}
                  <Block id="release-scores" smallSize={isSmallSize}>
                    <Title>
                      Release Scores{' '}
                      {releaseScore === releaseGradeLabels.DONT_RELEASE
                        ? '[OFF]'
                        : '[ON]'}
                    </Title>
                    <Body smallSize={isSmallSize}>
                      <StyledRadioGroup
                        disabled={disabled}
                        onChange={this.updateFeatures('releaseScore')}
                        value={releaseScore}
                      >
                        {_releaseGradeKeys.map((item) => (
                          <RadioBtn value={item} key={item}>
                            {releaseGradeTypes[item]}
                          </RadioBtn>
                        ))}
                      </StyledRadioGroup>
                      <Description>
                        Decide what students immediately get to see upon
                        submitting an assessment.
                      </Description>
                    </Body>
                  </Block>

                  <Block id="evaluation-method" smallSize={isSmallSize}>
                    <SettingContainer>
                      <Title>Evaluation Method</Title>
                      <Body smallSize={isSmallSize}>
                        <Row>
                          <Col span={8}>
                            <StyledRadioGroup
                              disabled={disabled}
                              onChange={(e) =>
                                this.updateTestData('scoringType')(
                                  e.target.value
                                )
                              }
                              value={scoringType}
                            >
                              <RadioBtn
                                value={ALL_OR_NOTHING}
                                data-cy={ALL_OR_NOTHING}
                                key={ALL_OR_NOTHING}
                              >
                                {evalTypes.ALL_OR_NOTHING}
                              </RadioBtn>
                              <RadioBtn
                                value={PARTIAL_CREDIT}
                                data-cy={PARTIAL_CREDIT}
                                key={PARTIAL_CREDIT}
                              >
                                {evalTypes.PARTIAL_CREDIT}
                                {scoringType === PARTIAL_CREDIT &&
                                multipartItems &&
                                premium
                                  ? applyEBSRComponent()
                                  : null}
                              </RadioBtn>
                              <RadioBtn
                                value={PARTIAL_CREDIT_IGNORE_INCORRECT}
                                data-cy={PARTIAL_CREDIT_IGNORE_INCORRECT}
                                key={PARTIAL_CREDIT_IGNORE_INCORRECT}
                              >
                                {evalTypes.PARTIAL_CREDIT_IGNORE_INCORRECT}
                                {scoringType ===
                                  PARTIAL_CREDIT_IGNORE_INCORRECT &&
                                multipartItems &&
                                premium
                                  ? applyEBSRComponent()
                                  : null}
                              </RadioBtn>
                              {/* ant-radio-wrapper already has bottom-margin: 18px by default. */}
                              {/* not setting mb (margin bottom) as it is common component */}
                              <RadioBtn
                                value={ITEM_LEVEL_EVALUATION}
                                data-cy={ITEM_LEVEL_EVALUATION}
                                key={ITEM_LEVEL_EVALUATION}
                                style={{ marginBottom: '0px' }}
                              >
                                {evalTypes.ITEM_LEVEL_EVALUATION}
                              </RadioBtn>
                            </StyledRadioGroup>
                          </Col>
                          <Col span={16}>
                            <Description>
                              Choose if students should be awarded partial
                              credit for their answers or not. If partial credit
                              is allowed, then choose whether the student should
                              be penalized for incorrect answers or not
                              (applicable only for multiple selection question
                              and multi part question with multiple selection
                              widgets)
                            </Description>
                          </Col>
                        </Row>
                      </Body>
                    </SettingContainer>
                  </Block>

                  <Block id="mark-as-done" smallSize={isSmallSize}>
                    <SettingContainer>
                      <Title>
                        Mark as Done{' '}
                        <DollarPremiumSymbol
                          premium={assessmentSuperPowersMarkAsDone}
                        />
                      </Title>
                      <Body smallSize={isSmallSize}>
                        <Row type="flex" align="middle">
                          <Col span={8}>
                            <StyledRadioGroup
                              disabled={
                                disabled || !assessmentSuperPowersMarkAsDone
                              }
                              onChange={this.updateFeatures('markAsDone')}
                              value={markAsDone}
                            >
                              {Object.keys(completionTypes).map((item) => (
                                <RadioBtn
                                  value={completionTypes[item]}
                                  key={completionTypes[item]}
                                  data-cy={`mark-as-done-${completionTypes[item]}`}
                                >
                                  {completionTypes[item]}
                                </RadioBtn>
                              ))}
                            </StyledRadioGroup>
                          </Col>
                          <Col span={16}>
                            <Description>
                              When an assignment is marked “Done”, data flows to
                              the reports. Automatically will mark it as done
                              when all students are graded and the due date has
                              passed, OR choose Manually and select the Mark as
                              Done button when ready.
                            </Description>
                          </Col>
                        </Row>
                      </Body>
                    </SettingContainer>
                  </Block>

                  <Block id="show-calculator" smallSize={isSmallSize}>
                    <SettingContainer>
                      <Title>
                        Show Calculator{' '}
                        <DollarPremiumSymbol
                          premium={assessmentSuperPowersShowCalculator}
                        />
                      </Title>
                      <Body smallSize={isSmallSize}>
                        <Row>
                          <Col span={8}>
                            <CalculatorSetting
                              onChangeHandle={this.updateFeatures('calcType')}
                              disabled={
                                disabled || !assessmentSuperPowersShowCalculator
                              }
                              calcType={calcType}
                              premium={premium}
                              calculatorProvider={calculatorProvider}
                            />
                          </Col>
                          <Col span={16}>
                            <Description>
                              If students can use an on-screen calculator,
                              select the type to make available on the test.
                            </Description>
                          </Col>
                        </Row>
                      </Body>
                    </SettingContainer>
                  </Block>

                  {this.isReferenceMaterialAllowedForCurrentSkin &&
                    !isDocBased && (
                      <Block id="reference-material" smallSize={isSmallSize}>
                        <ReferenceMaterial
                          owner={owner}
                          isEditable={isEditable}
                          isSmallSize={isSmallSize}
                          premium={premium}
                          disabled={disabled}
                          referenceDocAttributes={referenceDocAttributes}
                        />
                      </Block>
                    )}

                  <Block id="timed-test" smallSize={isSmallSize}>
                    <SettingContainer>
                      <Title>
                        <span>
                          Timed Test{' '}
                          <DollarPremiumSymbol
                            premium={assessmentSuperPowersTimedTest}
                          />
                        </span>
                        <Tooltip title="Timed test allows you to control how long students have to take the test. When the time limit is reached, students will be locked out of the assessment. Choose the time and whether students can pause and continue later or if the test should be taken in a single sitting.">
                          <IconInfo
                            color={lightGrey9}
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                          />
                        </Tooltip>
                        <EduSwitchStyled
                          disabled={disabled || !assessmentSuperPowersTimedTest}
                          checked={timedAssignment}
                          data-cy="assignment-time-switch"
                          onChange={this.updateTimedTest('timedAssignment')}
                        />
                      </Title>
                      <Body smallSize={isSmallSize}>
                        <Row type="flex" align="middle">
                          <Col span={8}>
                            {timedAssignment && (
                              <>
                                {/* eslint-disable no-restricted-globals */}
                                <TextInputStyled
                                  type="number"
                                  width="100px"
                                  size="large"
                                  data-cy="assignment-time"
                                  style={{ margin: '0px 20px 0px 0px' }}
                                  value={
                                    !isNaN(allowedTime)
                                      ? allowedTime / (60 * 1000) || ''
                                      : 1
                                  }
                                  onChange={(e) => {
                                    if (e.target.value <= 300) {
                                      this.updateTestData('allowedTime')(
                                        e.target.value * 60 * 1000
                                      )
                                    }
                                  }}
                                  min={1}
                                  max={300}
                                  step={1}
                                />
                                <Label>Minutes</Label>
                                {/* eslint-enable no-restricted-globals */}
                              </>
                            )}
                          </Col>
                          <Col span={16}>
                            {timedAssignment && (
                              <CheckboxLabel
                                checked={pauseAllowed}
                                disabled={disabled}
                                data-cy="exit-allowed"
                                onChange={(e) =>
                                  this.updateTestData('pauseAllowed')(
                                    e.target.checked
                                  )
                                }
                              >
                                Allow student to save and continue later.
                              </CheckboxLabel>
                            )}
                          </Col>
                        </Row>
                        <Description style={{ marginTop: '10px' }}>
                          Timed test allows you to control how long students
                          have to take the test. When the time limit is reached,
                          students will be locked out of the assessment. Choose
                          the time and whether students can pause and continue
                          later or if the test should be taken in a single
                          sitting.
                        </Description>
                      </Body>
                    </SettingContainer>
                  </Block>

                  {!isDocBased && (
                    <Block id="show-rubric-to-students" smallSize={isSmallSize}>
                      <SettingContainer>
                        <Title>
                          <span>Show Rubric to Students </span>
                          <DollarPremiumSymbol premium={premium} />
                          <Tooltip title={t('showRubricToStudents.info')}>
                            <IconInfo
                              color={lightGrey9}
                              style={{ marginLeft: '10px', cursor: 'pointer' }}
                            />
                          </Tooltip>
                          <EduSwitchStyled
                            disabled={
                              !isShowRubricToStudentsSettingVisible ||
                              !owner ||
                              !isEditable ||
                              !premium
                            }
                            checked={showRubricToStudents}
                            data-cy="show-rubric-to-students-switch"
                            onChange={this.updateTestData(
                              'showRubricToStudents'
                            )}
                          />
                        </Title>
                        <Body smallSize={isSmallSize}>
                          <Description style={{ marginTop: '10px' }}>
                            {t('showRubricToStudents.info')}
                          </Description>
                        </Body>
                      </SettingContainer>
                    </Block>
                  )}

                  <Block id="maximum-attempts-allowed">
                    <SettingContainer>
                      <Title>
                        Maximum Attempts Allowed{' '}
                        <DollarPremiumSymbol premium={maxAttemptAllowed} />
                      </Title>
                      <Body>
                        <TextInputStyled
                          type="number"
                          width="100px"
                          disabled={disabled || !maxAttemptAllowed}
                          size="large"
                          value={maxAttempts}
                          onChange={this.updateAttempt}
                          min={1}
                          step={1}
                        />
                        <Description>
                          Select the number of times a student can attempt the
                          test. Note, this can be overridden at a later time in
                          the settings if necessary.
                        </Description>
                      </Body>
                    </SettingContainer>
                  </Block>

                  <Block
                    id="check-answer-tries-per-question"
                    smallSize={isSmallSize}
                  >
                    <SettingContainer>
                      <Title>
                        Check Answer Tries Per Question{' '}
                        <DollarPremiumSymbol
                          premium={assessmentSuperPowersCheckAnswerTries}
                        />
                      </Title>
                      <Body smallSize={isSmallSize}>
                        <Row gutter={24}>
                          <Col span={12}>
                            <TextInputStyled
                              disabled={
                                disabled ||
                                !assessmentSuperPowersCheckAnswerTries
                              }
                              onChange={(e) =>
                                this.updateTestData('maxAnswerChecks')(
                                  e.target.value
                                )
                              }
                              size="large"
                              width="160px"
                              value={maxAnswerChecks}
                              type="number"
                              min={0}
                              placeholder="Number of tries"
                            />
                          </Col>
                        </Row>
                        <Description>
                          Allow students to check their answer before moving on
                          to the next question. Enter the number of attempts
                          allowed per question.
                        </Description>
                      </Body>
                    </SettingContainer>
                  </Block>

                  {(userRole === roleuser.DISTRICT_ADMIN ||
                    userRole === roleuser.SCHOOL_ADMIN) && (
                    <Block id="test-content-visibility" smallSize={isSmallSize}>
                      <Title>Item content visibility to Teachers</Title>
                      <Body smallSize={isSmallSize}>
                        <StyledRadioGroup
                          disabled={disabled}
                          onChange={this.updateFeatures(
                            'testContentVisibility'
                          )}
                          value={testContentVisibility}
                        >
                          {testContentVisibilityTypes.map((item) => (
                            <RadioBtn value={item.key} key={item.key}>
                              {item.value}
                            </RadioBtn>
                          ))}
                        </StyledRadioGroup>
                      </Body>
                    </Block>
                  )}
                </>
              )}

              <SettingsCategoryBlock id="anti-cheating">
                <span>
                  Anti-Cheating <DollarPremiumSymbol premium={premium} />
                </span>
                <span
                  onClick={() =>
                    this.togglePanel(
                      'isAntiCheatingGroupExpanded',
                      !isAntiCheatingGroupExpanded
                    )
                  }
                >
                  <Icon type={isAntiCheatingGroupExpanded ? 'minus' : 'plus'} />
                </span>
              </SettingsCategoryBlock>
              {isAntiCheatingGroupExpanded && (
                <>
                  {!isDocBased && (
                    <Block id="suffle-question" smallSize={isSmallSize}>
                      <SettingContainer>
                        <Title>
                          <span>
                            Shuffle Items{' '}
                            <DollarPremiumSymbol
                              premium={assessmentSuperPowersShuffleQuestions}
                            />
                          </span>
                          <EduSwitchStyled
                            disabled={
                              disabled || !assessmentSuperPowersShuffleQuestions
                            }
                            checked={shuffleQuestions}
                            data-cy="shuffleQuestions"
                            onChange={this.updateTestData('shuffleQuestions')}
                          />
                        </Title>
                        <Body smallSize={isSmallSize}>
                          <Description>
                            {'If '}
                            <BlueText>ON</BlueText>, then order of questions
                            will be different for each student.
                          </Description>
                        </Body>
                      </SettingContainer>
                    </Block>
                  )}

                  {!isDocBased && (
                    <Block id="show-answer-choice" smallSize={isSmallSize}>
                      <SettingContainer>
                        <Title>
                          <span>
                            Shuffle Answer Choice{' '}
                            <DollarPremiumSymbol
                              premium={assessmentSuperPowersShuffleAnswerChoice}
                            />
                          </span>
                          <EduSwitchStyled
                            disabled={
                              disabled ||
                              !assessmentSuperPowersShuffleAnswerChoice
                            }
                            checked={shuffleAnswers}
                            data-cy="shuffleChoices"
                            onChange={this.updateTestData('shuffleAnswers')}
                          />
                        </Title>
                        <Body smallSize={isSmallSize}>
                          <Description>
                            {'If set to '}
                            <BlueText>ON</BlueText>, answer choices for multiple
                            choice and multiple select questions will be
                            randomly shuffled for students.
                          </Description>
                        </Body>
                      </SettingContainer>
                    </Block>
                  )}

                  <Block id="require-password" smallSize={isSmallSize}>
                    <SettingContainer>
                      <Row>
                        <Title>
                          Test Password{' '}
                          <DollarPremiumSymbol
                            premium={assessmentSuperPowersRequirePassword}
                          />
                        </Title>
                        <Body smallSize={isSmallSize}>
                          <Row gutter={24}>
                            <Col span={12}>
                              <SelectInputStyled
                                value={passwordPolicy}
                                data-cy={passwordPolicy}
                                disabled={
                                  disabled ||
                                  !assessmentSuperPowersRequirePassword
                                }
                                onChange={this.updateTestData('passwordPolicy')}
                                getPopupContainer={(trigger) =>
                                  trigger.parentNode
                                }
                              >
                                {Object.keys(passwordPolicyOptions).map(
                                  (key) => (
                                    <Option
                                      key={key}
                                      value={passwordPolicyValues[key]}
                                    >
                                      {passwordPolicyOptions[key]}
                                    </Option>
                                  )
                                )}
                              </SelectInputStyled>
                            </Col>
                            <Col span={12}>
                              {passwordPolicy ===
                              passwordPolicyValues.REQUIRED_PASSWORD_POLICY_STATIC ? (
                                <Description marginTop="0px">
                                  <TextInputStyled
                                    required
                                    color={isPasswordValid()}
                                    disabled={
                                      disabled ||
                                      !assessmentSuperPowersRequirePassword
                                    }
                                    onBlur={this.handleBlur}
                                    onChange={(e) =>
                                      this.updateTestData('assignmentPassword')(
                                        e.target.value
                                      )
                                    }
                                    size="large"
                                    value={assignmentPassword}
                                    type="text"
                                    placeholder="Enter Password"
                                  />
                                  {validationMessage ? (
                                    <MessageSpan>
                                      {validationMessage}
                                    </MessageSpan>
                                  ) : (
                                    ''
                                  )}
                                </Description>
                              ) : passwordPolicy ===
                                passwordPolicyValues.REQUIRED_PASSWORD_POLICY_DYNAMIC ? (
                                <Description marginTop="0px">
                                  <TextInputStyled
                                    required
                                    type="number"
                                    disabled={
                                      disabled ||
                                      !assessmentSuperPowersRequirePassword
                                    }
                                    onChange={this.handleUpdatePasswordExpireIn}
                                    value={passwordExpireIn / 60}
                                    style={{
                                      width: '100px',
                                      marginRight: '10px',
                                    }}
                                    max={999}
                                    min={1}
                                    step={1}
                                  />{' '}
                                  Minutes
                                </Description>
                              ) : (
                                ''
                              )}
                            </Col>
                            <Col span={24} style={{ marginTop: '10px' }}>
                              {passwordPolicy ===
                              passwordPolicyValues.REQUIRED_PASSWORD_POLICY_STATIC ? (
                                <Description>
                                  The password is entered by you and does not
                                  change. Students must enter this password
                                  before they can take the assessment.
                                </Description>
                              ) : passwordPolicy ===
                                passwordPolicyValues.REQUIRED_PASSWORD_POLICY_DYNAMIC ? (
                                <Description>
                                  Students must enter a password to take the
                                  assessment. The password is auto-generated and
                                  revealed only when the assessment is opened.
                                  If you select this method, you also need to
                                  specify the time in minutes after which the
                                  password would automatically expire. Use this
                                  method for highly sensitive and secure
                                  assessments. If you select this method, the
                                  teacher or the proctor must open the
                                  assessment manually and announce the password
                                  in class when the students are ready to take
                                  the assessment.
                                </Description>
                              ) : (
                                <Description>
                                  Require your students to type a password when
                                  opening the assessment.
                                </Description>
                              )}
                            </Col>
                          </Row>
                        </Body>
                      </Row>
                    </SettingContainer>
                  </Block>

                  <Block id="block-save-and-continue" smallSize={isSmallSize}>
                    <Title>
                      <span>
                        Complete Test in One Sitting
                        <DollarPremiumSymbol premium={premium} />
                      </span>
                      <EduSwitchStyled
                        disabled={disabled || !premium}
                        checked={blockSaveAndContinue}
                        data-cy="bockSaveAndContinueSwitch"
                        onChange={(v) =>
                          this.updateTestData('blockSaveAndContinue')(v)
                        }
                      />
                    </Title>
                    <Body smallSize={isSmallSize}>
                      <Description>
                        If <b>ON</b>, then students will not be allowed to exit
                        the test without submitting. In case they close the app
                        they will be paused and the instructor will need to
                        manually resume.
                      </Description>
                    </Body>
                  </Block>

                  <Block id="restrict-navigation-out" smallSize={isSmallSize}>
                    <Title>
                      Restrict Navigation Out of Test{' '}
                      <DollarPremiumSymbol premium={premium} />
                    </Title>
                    <Body smallSize={isSmallSize}>
                      <Row>
                        <Col span={11}>
                          <StyledRadioGroup
                            disabled={disabled || !premium || safeBrowser}
                            onChange={this.updateFeatures(
                              'restrictNavigationOut'
                            )}
                            value={restrictNavigationOut || undefined}
                          >
                            <RadioBtn
                              value={undefined}
                              key="disabled"
                              data-cy="restrict-nav-out-disabled"
                            >
                              DISABLED
                            </RadioBtn>
                            <RadioBtn
                              value="warn-and-report"
                              key="warn-and-report"
                              data-cy="restrict-nav-out-warn-report"
                            >
                              WARN AND REPORT ONLY
                            </RadioBtn>
                            <RadioBtn
                              value="warn-and-report-after-n-alerts"
                              key="warn-and-report-after-n-alerts"
                              data-cy="restrict-nav-out-warn-report-alerts"
                            >
                              WARN AND BLOCK TEST AFTER{' '}
                              <InputNumberStyled
                                size="small"
                                value={
                                  restrictNavigationOut
                                    ? restrictNavigationOutAttemptsThreshold
                                    : undefined
                                }
                                min={1}
                                onChange={this.updateFeatures(
                                  'restrictNavigationOutAttemptsThreshold'
                                )}
                                disabled={
                                  !(
                                    restrictNavigationOut ===
                                    'warn-and-report-after-n-alerts'
                                  ) ||
                                  disabled ||
                                  safeBrowser
                                }
                              />{' '}
                              ALERTS
                              {navigationThresholdMoreThan1 ? (
                                <>
                                  {' '}
                                  <br />{' '}
                                  <span style={{ textTransform: 'lowercase' }}>
                                    {`or maximum of ${
                                      restrictNavigationOutAttemptsThreshold * 5
                                    } sec.`}
                                  </span>{' '}
                                </>
                              ) : (
                                ''
                              )}
                            </RadioBtn>
                          </StyledRadioGroup>
                        </Col>
                        <Col span={13}>
                          <Description>
                            If <b>ON</b>, then students must take the test in
                            full screen mode to prevent opening another browser
                            window. Alert will appear if student has navigated
                            away for more than 5 seconds. If the designated
                            number of alerts are exceeded, the student’s
                            assignment will be paused and the instructor will
                            need to manually reset.
                            <br />
                            Please Note: this is not compatible with iPads.
                            {navigationThresholdMoreThan1 ? (
                              <>
                                <br />
                                <br />
                                Alert will appear if student has navigated away
                                for more than 5 seconds and student will be
                                blocked after{' '}
                                {restrictNavigationOutAttemptsThreshold *
                                  5}{' '}
                                seconds{' '}
                              </>
                            ) : (
                              ''
                            )}
                          </Description>
                        </Col>
                      </Row>
                    </Body>
                  </Block>

                  <Block id="restrict-back-navigation" smallSize={isSmallSize}>
                    <SettingContainer>
                      <Title>
                        <span>
                          Restrict Question Navigation{' '}
                          <DollarPremiumSymbol
                            premium={
                              assessmentSuperPowersRestrictQuestionBackNav
                            }
                          />
                        </span>
                        <EduSwitchStyled
                          disabled={
                            disabled ||
                            !assessmentSuperPowersRestrictQuestionBackNav ||
                            isDocBased
                          }
                          checked={blockNavigationToAnsweredQuestions}
                          data-cy="restrict-back-nav-switch-test"
                          onChange={this.updateTestData(
                            'blockNavigationToAnsweredQuestions'
                          )}
                        />
                      </Title>
                      <Body smallSize={isSmallSize}>
                        <Description>
                          {'If '}
                          <BlueText>ON</BlueText>, then students will be
                          restricted from navigating back to the previous
                          question. Recommended to use along with Shuffle
                          Questions for preventing cheating among students.
                          (This setting is not applicable for SnapQuiz)
                        </Description>
                      </Body>
                    </SettingContainer>
                  </Block>

                  <Block
                    id="require-safe-exame-browser"
                    smallSize={isSmallSize}
                  >
                    <SettingContainer>
                      <Title>
                        <span>
                          Require Safe Exam Browser{' '}
                          <DollarPremiumSymbol
                            premium={
                              assessmentSuperPowersRequireSafeExamBrowser
                            }
                          />
                        </span>
                        <Tooltip
                          title="Ensure a secure testing environment by using Safe Exam Browser
                      to lockdown the student's device. To use this feature, Safe Exam Browser 
                      (on Windows/Mac/iPad) must be installed on the student device. The quit 
                      password can be used by teacher or proctor to safely exit Safe Exam Browser 
                      in the middle of an assessment. The quit password should not be revealed to 
                      the students. If you select this option, students must use devices (Windows, 
                      Mac or iPad) with Safe Exam Browser installed."
                        >
                          <IconInfo
                            color={lightGrey9}
                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                          />
                        </Tooltip>
                        <EduSwitchStyled
                          disabled={
                            disabled ||
                            !assessmentSuperPowersRequireSafeExamBrowser
                          }
                          checked={safeBrowser}
                          onChange={this.updateTestData('safeBrowser')}
                        />
                      </Title>
                      <Body smallSize={isSmallSize}>
                        <Row>
                          <Col span={24}>
                            {safeBrowser && (
                              <TextInputStyled
                                className={`sebPassword ${
                                  sebPassword && sebPassword.length
                                    ? ' good'
                                    : ' dirty'
                                }`}
                                disabled={
                                  disabled ||
                                  !assessmentSuperPowersRequireSafeExamBrowser
                                }
                                ref={sebPasswordRef}
                                prefix={
                                  <i
                                    className={`fa fa-eye${
                                      showPassword ? '-slash' : ''
                                    }`}
                                    onClick={this.handleShowPassword}
                                  />
                                }
                                onChange={this.setPassword}
                                size="large"
                                value={sebPassword || ''}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Quit Password"
                              />
                            )}
                          </Col>
                        </Row>
                        <Description>
                          Ensure a secure testing environment by using Safe Exam
                          Browser to lockdown the student&apos;s device. To use
                          this feature, Safe Exam Browser (on Windows/Mac/iPad)
                          must be installed on the student device. The quit
                          password can be used by teacher or proctor to safely
                          exit Safe Exam Browser in the middle of an assessment.
                          The quit password should not be revealed to the
                          students. If you select this option, students must use
                          devices (Windows, Mac or iPad) with Safe Exam Browser
                          installed.
                        </Description>
                      </Body>
                    </SettingContainer>
                  </Block>
                </>
              )}

              <SettingsCategoryBlock id="miscellaneous">
                <span>
                  Miscellaneous <DollarPremiumSymbol premium={premium} />
                </span>
                <span
                  onClick={() =>
                    this.togglePanel(
                      'isMiscellaneousGroupExpanded',
                      !isMiscellaneousGroupExpanded
                    )
                  }
                >
                  <Icon
                    type={isMiscellaneousGroupExpanded ? 'minus' : 'plus'}
                  />
                </span>
              </SettingsCategoryBlock>
              {isMiscellaneousGroupExpanded && (
                <>
                  <Block id="answer-on-paper" smallSize={isSmallSize}>
                    <SettingContainer>
                      <Title>
                        <span>
                          Answer on Paper
                          <DollarPremiumSymbol
                            premium={assessmentSuperPowersAnswerOnPaper}
                          />
                        </span>
                        <EduSwitchStyled
                          disabled={
                            disabled ||
                            disableAnswerOnPaper ||
                            !assessmentSuperPowersAnswerOnPaper
                          }
                          checked={answerOnPaper}
                          onChange={this.updateTestData('answerOnPaper')}
                          data-cy="answer-on-paper"
                        />
                      </Title>
                      <Body smallSize={isSmallSize}>
                        <Description>
                          Use this option if you are administering this
                          assessment on paper. If you use this option, you will
                          have to manually grade student responses after the
                          assessment is closed.
                        </Description>
                      </Body>
                    </SettingContainer>
                  </Block>

                  {testType !== 'testlet' && !isDocBased && (
                    <Block id="player-skin-type" smallSize={isSmallSize}>
                      <Row>
                        <Title>
                          Choose Test Interface{' '}
                          <DollarPremiumSymbol premium={selectPlayerSkinType} />
                        </Title>
                        <Body smallSize={isSmallSize}>
                          <Col span={12}>
                            <SelectInputStyled
                              data-cy="playerSkinType"
                              showSearch
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              value={
                                playerSkinType ===
                                playerSkinTypes.edulastic.toLowerCase()
                                  ? edulastic
                                  : playerSkinType
                              }
                              disabled={disabled || !selectPlayerSkinType}
                              onChange={this.updateTestData('playerSkinType')}
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                            >
                              {skinTypesOrder(skinTypes).map((key) => {
                                if (key === 'testlet' && !isEtsDistrict) {
                                  return null
                                }
                                if (key === 'devider') {
                                  return (
                                    <Option key={key} value={key} disabled>
                                      {'-'.repeat(15)}
                                    </Option>
                                  )
                                }
                                return (
                                  <Option key={key} value={key}>
                                    {skinTypes[key]}
                                  </Option>
                                )
                              })}
                            </SelectInputStyled>
                          </Col>
                          <Col span={24}>
                            <Description>
                              Teachers can change the look and feel of the
                              assessments to more closely align with formats
                              similar to state and nationally administered
                              assessments. If you don’t see your state, select
                              the generic option, Edulastic Test.
                            </Description>
                          </Col>
                        </Body>
                      </Row>
                    </Block>
                  )}

                  {/* Multi language start */}
                  {allowedToSelectMultiLanguage && (
                    <Block id="multi-language-enabled" smallSize={isSmallSize}>
                      <Body>
                        <Title>
                          <span>Multi-Language</span>
                          <EduSwitchStyled
                            disabled={disabled}
                            data-cy="multi-language-enabled"
                            checked={multiLanguageEnabled}
                            onChange={() =>
                              this.updateTestData('multiLanguageEnabled')(
                                !multiLanguageEnabled
                              )
                            }
                          />
                        </Title>
                        <Body smallSize={isSmallSize}>
                          <Description>
                            Select <BlueText> ON </BlueText> , If you want to
                            enable multiple languages for the test.
                          </Description>
                        </Body>
                      </Body>
                    </Block>
                  )}
                  {/* Multi language Ends */}

                  <Block id="performance-bands" smallSize={isSmallSize}>
                    <PeformanceBand
                      setSettingsData={(val) =>
                        this.updateTestData('performanceBand')(val)
                      }
                      performanceBand={performanceBand || {}}
                      disabled={disabled || !performanceBands}
                      isFeatureAvailable={performanceBands}
                    />
                    <Description>
                      Performance bands are set by district or school admins.
                      Teachers can choose from the different profiles created by
                      the admin.
                    </Description>
                  </Block>

                  <Block id="standards-proficiency" smallSize={isSmallSize}>
                    <StandardProficiencyTable
                      standardGradingScale={standardGradingScale || {}}
                      setSettingsData={(val) =>
                        this.updateTestData('standardGradingScale')(val)
                      }
                      disabled={disabled || !premium}
                      isFeatureAvailable={premium}
                    />
                    <Description>
                      Standards based scales are set by district or school
                      admins. Teachers can choose from the different profiles
                      created by the admin
                    </Description>
                  </Block>

                  <Block id="accessibility" smallSize={isSmallSize}>
                    <Title>
                      Accessibility <DollarPremiumSymbol premium={premium} />
                    </Title>
                    <RadioWrapper
                      disabled={disabled}
                      style={{
                        marginTop: '20px',
                        marginBottom: 0,
                        flexDirection: 'row',
                      }}
                    >
                      {accessibilityData
                        .filter(
                          (item) =>
                            !(item.key === 'enableSkipAlert' && isDocBased)
                        )
                        .map((o) => (
                          <StyledRow key={o.key} align="middle">
                            <Col span={6}>
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  textTransform: 'uppercase',
                                }}
                              >
                                {accessibilities[o.key]}
                              </span>
                            </Col>
                            <Col span={12}>
                              <StyledRadioGroup
                                disabled={disabled || !features[o.key]}
                                onChange={(e) =>
                                  this.updateTestData(o.key)(e.target.value)
                                }
                                value={o.value}
                                style={{ flexDirection: 'row', height: '18px' }}
                              >
                                <RadioBtn data-cy={`${o.key}-enable`} value>
                                  ENABLE
                                </RadioBtn>
                                <RadioBtn
                                  data-cy={`${o.key}-disable`}
                                  value={false}
                                >
                                  DISABLE
                                </RadioBtn>
                              </StyledRadioGroup>
                            </Col>
                            <Col span={24}>
                              <Description>{o.description}</Description>
                            </Col>
                          </StyledRow>
                        ))}
                    </RadioWrapper>
                    <RadioWrapper
                      disabled={disabled}
                      style={{
                        marginTop: '5px',
                        marginBottom: 0,
                        flexDirection: 'row',
                      }}
                    >
                      <StyledRow align="middle">
                        <Col span={6}>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              textTransform: 'uppercase',
                            }}
                          >
                            Keypad <DollarPremiumSymbol premium={premium} />
                          </span>
                        </Col>
                        <Col span={12}>
                          <KeypadDropdown
                            value={this.keypadDropdownValue}
                            // This anonymous function should be wrapping the keypad selection function to make the Dropdown method work. Issue: EV-29904
                            onChangeHandler={(value) => {
                              this.keypadSelection(value)
                            }}
                            disabled={disabled || !premium}
                          />
                        </Col>
                        <Col span={24}>
                          <ConfirmationModal
                            centered
                            visible={warningKeypadSelection}
                            footer={[
                              <EduButton
                                isGhost
                                onClick={() =>
                                  this.confirmKeypadSelection(false)
                                }
                              >
                                CANCEL
                              </EduButton>,
                              <EduButton
                                onClick={() =>
                                  this.confirmKeypadSelection(true)
                                }
                              >
                                PROCEED
                              </EduButton>,
                            ]}
                            textAlign="center"
                            onCancel={() => () =>
                              this.confirmKeypadSelection(false)}
                          >
                            <p>
                              <b>{t('keypadSettings.warning')}</b>
                            </p>
                          </ConfirmationModal>
                          <Description>
                            Select keypad to apply current selection to all
                            questions in the test
                          </Description>
                        </Col>
                      </StyledRow>
                    </RadioWrapper>
                  </Block>

                  {playerSkinType ===
                    playerSkinValues.testlet.toLowerCase() && (
                    <Block id="external-metadata" smallSize={isSmallSize}>
                      <Title>External Metadata</Title>
                      <Row gutter={16} style={{ marginTop: 20 }}>
                        <Col span={12}>
                          <FieldLabel>EMBED URL</FieldLabel>
                          <TextInputStyled
                            size="large"
                            type="text"
                            onChange={this.updateExternalData('testletURL')}
                            value={testletConfig?.testletURL || ''}
                          />
                        </Col>
                        <Col span={12}>
                          <FieldLabel>EMBED ID</FieldLabel>
                          <TextInputStyled
                            size="large"
                            type="text"
                            onChange={this.updateExternalData('testletId')}
                            value={testletConfig?.testletId || ''}
                          />
                        </Col>
                      </Row>
                    </Block>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </MainContentWrapper>
    )
  }
}

Setting.propTypes = {
  history: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired,
  setMaxAttempts: PropTypes.func.isRequired,
  setTestData: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  entity: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
  userRole: PropTypes.string,
}

Setting.defaultProps = {
  owner: false,
  userRole: '',
  isEditable: false,
}

const enhance = compose(
  memo,
  withRouter,
  withWindowSizes,
  withNamespaces('author'),
  connect(
    (state) => ({
      entity: getTestEntitySelector(state),
      features: getUserFeatures(state),
      userRole: getUserRole(state),
      defaultTestTypeProfiles: defaultTestTypeProfilesSelector(state),
      standardsData: get(state, ['standardsProficiencyReducer', 'data'], []),
      performanceBandsData: get(
        state,
        ['performanceBandReducer', 'profiles'],
        []
      ),
      isReleaseScorePremium: getReleaseScorePremiumSelector(state),
      disableAnswerOnPaper: getDisableAnswerOnPaperSelector(state),
      districtPermissions:
        state?.user?.user?.orgData?.districts?.[0]?.districtPermissions,
      premium: state?.user?.user?.features?.premium,
      allowReferenceMaterial: allowReferenceMaterialSelector(state),
      calculatorProvider: state?.user?.user?.features?.calculatorProvider,
      totalItems: state?.tests?.entity?.isDocBased
        ? state?.tests?.entity?.summary?.totalQuestions
        : state?.tests?.entity?.summary?.totalItems,
      isAuthorPublisher: isPublisherUserSelector(state),
      editEnable: state.tests?.editEnable,
      allowedToSelectMultiLanguage: allowedToSelectMultiLanguageInTest(state),
      testAssignments: getAssignmentsSelector(state),
      isEtsDistrict: isEtsDistrictSelector(state),
      testSettingsList: getTestSettingsListSelector(state),
      testDefaultSettings: getTestDefaultSettingsSelector(state),
      userId: getUserId(state),
    }),
    {
      setMaxAttempts: setMaxAttemptsAction,
      setSafePassword: setSafeBroswePassword,
      setTestData: setTestDataAction,
      resetUpdatedState: resetUpdatedStateAction,
      fetchTestSettingsList: fetchTestSettingsListAction,
      saveTestSettings: saveTestSettingsAction,
      deleteTestSettingRequest: deleteTestSettingRequestAction,
      updateTestSettingRequest: updateTestSettingRequestAction,
    }
  )
)

export default enhance(Setting)

const InputNumberStyled = Styled(InputNumber)`
    width: 60px;
`

const StyledSpan = Styled.span`
  &.spanText {
    font-weight: ${(props) => props.theme.semiBold};
    font-size: 12px;
  }
`
