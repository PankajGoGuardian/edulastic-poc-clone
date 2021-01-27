import React, { Component, memo } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { get, isObject } from 'lodash'
import { Anchor, Col, Row, Select, Tooltip, InputNumber, Icon } from 'antd'
import Styled from 'styled-components'
import { blueBorder, green, red, lightGrey9 } from '@edulastic/colors'

import {
  MainContentWrapper,
  CheckboxLabel,
  RadioBtn,
  SelectInputStyled,
  TextInputStyled,
  notification,
  FieldLabel,
  EduSwitchStyled,
  withWindowSizes,
} from '@edulastic/common'
import { roleuser, test as testContants } from '@edulastic/constants'
import { IconInfo } from '@edulastic/icons'
import { isFeatureAccessible } from '../../../../../../features/components/FeaturesSwitch'
import {
  getUserFeatures,
  getUserRole,
} from '../../../../../../student/Login/ducks'
import Breadcrumb from '../../../../../src/components/Breadcrumb'
import {
  defaultTestTypeProfilesSelector,
  getDisableAnswerOnPaperSelector,
  getReleaseScorePremiumSelector,
  getTestEntitySelector,
  setTestDataAction,
  testTypeAsProfileNameType,
  resetUpdatedStateAction,
} from '../../../../ducks'
import { setMaxAttemptsAction, setSafeBroswePassword } from '../../ducks'
import { isPublisherUserSelector } from '../../../../../src/selectors/user'
import {
  Block,
  BlueText,
  Body,
  Container,
  Description,
  MessageSpan,
  NavigationMenu,
  StyledAnchor,
  StyledRadioGroup,
  Title,
  RadioWrapper,
  Label,
  SettingsCategoryBlock,
} from './styled'
import PeformanceBand from './PeformanceBand'
import StandardProficiencyTable from './StandardProficiencyTable'
import Instruction from './InstructionBlock/InstructionBlock'
import DollarPremiumSymbol from '../../../../../AssignTest/components/Container/DollarPremiumSymbol'
import DetailsTooltip from '../../../../../AssignTest/components/Container/DetailsTooltip'
import { SettingContainer } from '../../../../../AssignTest/components/Container/styled'

const {
  settingCategories,
  settingCategoriesFeatureMap,
  type,
  completionTypes,
  calculators,
  calculatorKeys,
  calculatorTypes,
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
    }

    this.containerRef = React.createRef()
  }

  static getDerivedStateFromProps(nextProps) {
    const { features, entity } = nextProps
    const { grades, subjects } = entity
    if (
      features.assessmentSuperPowersReleaseScorePremium ||
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
    const {
      entity,
      isAuthorPublisher,
      resetUpdatedState,
      editEnable,
    } = this.props
    if (entity?.scoringType === PARTIAL_CREDIT && !entity?.penalty) {
      this.updateTestData('scoringType')(PARTIAL_CREDIT_IGNORE_INCORRECT)
    }
    if (isAuthorPublisher) {
      this.updateTestData('testType')(ASSESSMENT)
    }
    if (entity?.status === 'published' && !editEnable) {
      resetUpdatedState()
    }
  }

  handleShowPassword = () => {
    this.setState((state) => ({ showPassword: !state.showPassword }))
  }

  updateAttempt = (e) => {
    const { setMaxAttempts } = this.props
    let { value = 0 } = e.target
    if (value < 0) value = 0
    setMaxAttempts(value)
  }

  setPassword = (e) => {
    const { setSafePassword } = this.props
    setSafePassword(e.target.value)
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
        setTestData({ penalty })
        break
      }
      case 'safeBrowser':
        if (!value)
          setTestData({
            sebPassword: '',
          })
        break
      case 'maxAnswerChecks':
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
      default:
        break
    }
    setTestData({
      [key]: value,
    })
  }

  updateFeatures = (key) => (e) => {
    const { setTestData } = this.props
    const featVal = isObject(e) ? e.target.value : e
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
        pauseAllowed: false,
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

  render() {
    const {
      showPassword,
      _releaseGradeKeys,
      isTestBehaviorGroupExpanded,
      isAntiCheatingGroupExpanded,
      isMiscellaneousGroupExpanded,
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
      scoringType,
      testType,
      calcType,
      assignmentPassword,
      passwordExpireIn,
      markAsDone,
      maxAttempts,
      grades,
      subjects,
      performanceBand,
      standardGradingScale,
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
      //      enableSkipAlert = false,
      restrictNavigationOut,
      restrictNavigationOutAttemptsThreshold,
      blockSaveAndContinue,
    } = entity

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

    const categories = [
      'show-answer-choice',
      'suffle-question',
      'check-answer-tries-per-question',
    ]

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
      { key: 'showMagnifier', value: showMagnifier },
      { key: 'enableScratchpad', value: enableScratchpad },
      // { key: 'enableSkipAlert', value: enableSkipAlert },
    ]

    const checkForCalculator = premium && calculatorProvider !== 'DESMOS'
    const calculatorKeysAvailable =
      (checkForCalculator &&
        calculatorKeys.filter((i) =>
          [calculatorTypes.NONE, calculatorTypes.BASIC].includes(i)
        )) ||
      calculatorKeys

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

    return (
      <MainContentWrapper ref={this.containerRef}>
        <Breadcrumb data={breadcrumbData} />
        <Container padding="30px" marginTop="0px">
          <Row>
            <Col span={isSmallSize ? 0 : 6}>
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

            <Col span={isSmallSize ? 24 : 18}>
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
                      <Title>Test Type</Title>
                      <Body smallSize={isSmallSize}>
                        <Row>
                          <SelectInputStyled
                            width="70%"
                            value={testType}
                            disabled={!owner || !isEditable}
                            onChange={this.updateTestData('testType')}
                            getPopupContainer={(trigger) => trigger.parentNode}
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
                        </Row>
                      </Body>
                    </Row>
                  </Block>

                  {(userRole === roleuser.DISTRICT_ADMIN ||
                    userRole === roleuser.SCHOOL_ADMIN) &&
                    testType === COMMON && (
                      <Block id="freeze-settings" smallSize={isSmallSize}>
                        <Row>
                          <CheckboxLabel
                            disabled={!owner || !isEditable}
                            data-cy="freeze-settings"
                            checked={freezeSettings}
                            onChange={(e) =>
                              this.updateTestData('freezeSettings')(
                                e.target.checked
                              )
                            }
                          >
                            Freeze Settings
                          </CheckboxLabel>
                          <Tooltip title="Instructors won’t be allowed to override the test settings while assigning it.">
                            <IconInfo
                              color={lightGrey9}
                              style={{ cursor: 'pointer' }}
                            />
                          </Tooltip>
                        </Row>
                      </Block>
                    )}

                  {/* Add instruction starts */}
                  <Block id="add-instruction" smallSize={isSmallSize}>
                    <SettingContainer>
                      <DetailsTooltip
                        showInsideContainer
                        title="Test Instructions"
                        content="Add instructions for the students here. For example, “You will be allowed two attempts on this quiz.“ Or, “This test is worth 30% of your grade.“"
                        premium
                      />
                      <Title>
                        <span>Test Instructions</span>
                        <EduSwitchStyled
                          disabled={!owner || !isEditable}
                          data-cy="add-test-instruction"
                          defaultChecked={hasInstruction}
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
                            disabled={!owner || !isEditable}
                          />
                        )}
                      </Body>
                    </SettingContainer>
                  </Block>
                  {/* Add instruction ends */}

                  <Block id="mark-as-done" smallSize={isSmallSize}>
                    <SettingContainer>
                      <DetailsTooltip
                        placement="rightBottom"
                        showInsideContainer
                        title="Mark as Done"
                        content="Control when class will be marked as Done. Automatically when all studens are graded and due date has passed OR Manually when you click the Mark as Done button."
                        premium={assessmentSuperPowersMarkAsDone}
                      />
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
                                !owner ||
                                !isEditable ||
                                !assessmentSuperPowersMarkAsDone
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
                              {'Control when class will be marked as Done. '}
                              <BlueText>Automatically</BlueText>
                              {
                                ' when all students are graded and due date has passed OR '
                              }
                              <BlueText>Manually</BlueText>
                              {' when you click the "Mark as Done" button.'}
                            </Description>
                          </Col>
                        </Row>
                      </Body>
                    </SettingContainer>
                  </Block>

                  <Block id="release-scores" smallSize={isSmallSize}>
                    <Title>
                      Release Scores{' '}
                      {releaseScore === releaseGradeLabels.DONT_RELEASE
                        ? '[OFF]'
                        : '[ON]'}
                    </Title>
                    <Body smallSize={isSmallSize}>
                      <StyledRadioGroup
                        disabled={!owner || !isEditable}
                        onChange={this.updateFeatures('releaseScore')}
                        value={releaseScore}
                      >
                        {_releaseGradeKeys.map((item) => (
                          <RadioBtn value={item} key={item}>
                            {releaseGradeTypes[item]}
                          </RadioBtn>
                        ))}
                      </StyledRadioGroup>
                    </Body>
                  </Block>

                  <Block id="show-calculator" smallSize={isSmallSize}>
                    <SettingContainer>
                      <DetailsTooltip
                        placement="rightBottom"
                        showInsideContainer
                        title="Show Calculator"
                        content="Choose if student can use a calculator, also select the type of calculator that would be shown to the students."
                        premium={assessmentSuperPowersShowCalculator}
                      />
                      <Title>
                        Show Calculator{' '}
                        <DollarPremiumSymbol
                          premium={assessmentSuperPowersShowCalculator}
                        />
                      </Title>
                      <Body smallSize={isSmallSize}>
                        <Row>
                          <Col span={8}>
                            <StyledRadioGroup
                              disabled={!owner || !isEditable}
                              onChange={this.updateFeatures('calcType')}
                              value={calcType}
                            >
                              {calculatorKeysAvailable.map((item) => (
                                <RadioBtn
                                  data-cy={item}
                                  value={item}
                                  key={item}
                                  disabled={
                                    !assessmentSuperPowersShowCalculator &&
                                    !['NONE', 'BASIC'].includes(item)
                                  }
                                >
                                  {calculators[item]}
                                </RadioBtn>
                              ))}
                            </StyledRadioGroup>
                          </Col>
                          <Col span={16}>
                            <Description>
                              Choose if student can use a calculator, also
                              select the type of calculator that would be shown
                              to the students.
                            </Description>
                          </Col>
                        </Row>
                      </Body>
                    </SettingContainer>
                  </Block>

                  <Block id="evaluation-method" smallSize={isSmallSize}>
                    <SettingContainer>
                      <DetailsTooltip
                        placement="rightBottom"
                        showInsideContainer
                        title="Evaluation Method"
                        content="Choose if students should be awarded partial credit for their answers or not. If partial credit is allowed, then choose whether the student should be penalized for incorrect answers or not (applicable only for multiple selection que widgets)."
                        premium
                      />
                      <Title>Evaluation Method</Title>
                      <Body smallSize={isSmallSize}>
                        <Row>
                          <Col span={8}>
                            <StyledRadioGroup
                              disabled={!owner || !isEditable}
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
                              </RadioBtn>
                              <RadioBtn
                                value={PARTIAL_CREDIT_IGNORE_INCORRECT}
                                data-cy={PARTIAL_CREDIT_IGNORE_INCORRECT}
                                key={PARTIAL_CREDIT_IGNORE_INCORRECT}
                              >
                                {evalTypes.PARTIAL_CREDIT_IGNORE_INCORRECT}
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

                  <Block id="timed-test" smallSize={isSmallSize}>
                    <SettingContainer>
                      <DetailsTooltip
                        placement="rightBottom"
                        showInsideContainer
                        title="Timed Test"
                        content="The time can be modified in one minute increments. When the time limit is reached, students will be locked out of the assessment. If the student begins an assessment and exits with time remaining, upon returning, the timer will start up again where the student left off. This ensures that the student does not go over the allotted time."
                        premium={assessmentSuperPowersTimedTest}
                      />
                      <Title>
                        <span>
                          Timed Test{' '}
                          <DollarPremiumSymbol
                            premium={assessmentSuperPowersTimedTest}
                          />
                        </span>
                        <Tooltip title="The time can be modified in one minute increments.  When the time limit is reached, students will be locked out of the assessment.  If the student begins an assessment and exits with time remaining, upon returning, the timer will start up again where the student left off.  This ensures that the student does not go over the allotted time.">
                          <IconInfo
                            color={lightGrey9}
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                          />
                        </Tooltip>
                        <EduSwitchStyled
                          disabled={
                            !owner ||
                            !isEditable ||
                            !assessmentSuperPowersTimedTest
                          }
                          defaultChecked={false}
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
                                      ? allowedTime / (60 * 1000)
                                      : 1
                                  }
                                  onChange={(e) => {
                                    if (
                                      e.target.value.length <= 3 &&
                                      e.target.value <= 300
                                    ) {
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
                                disabled={!owner || !isEditable}
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
                          Select <BlueText> ON </BlueText>, If you want to set a
                          time limit on the test. Adjust the minutes
                          accordingly.
                        </Description>
                      </Body>
                    </SettingContainer>
                  </Block>

                  {!isDocBased && (
                    <Block
                      id="check-answer-tries-per-question"
                      smallSize={isSmallSize}
                    >
                      <SettingContainer>
                        <DetailsTooltip
                          placement="rightBottom"
                          showInsideContainer
                          title="Check Answer Tries Per Question"
                          content="Control whether student can check in answer during attempt or not. Value mentioned will be equivalent to number of attempts allowed per student."
                          premium={assessmentSuperPowersCheckAnswerTries}
                        />
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
                                  !owner ||
                                  !isEditable ||
                                  !assessmentSuperPowersCheckAnswerTries
                                }
                                onChange={(e) =>
                                  this.updateTestData('maxAnswerChecks')(
                                    e.target.value
                                  )
                                }
                                size="large"
                                value={maxAnswerChecks}
                                type="number"
                                min={0}
                                placeholder="Number of tries"
                              />
                            </Col>
                          </Row>
                        </Body>
                      </SettingContainer>
                    </Block>
                  )}
                  {(userRole === roleuser.DISTRICT_ADMIN ||
                    userRole === roleuser.SCHOOL_ADMIN) && (
                    <Block id="test-content-visibility" smallSize={isSmallSize}>
                      <Title>Item content visibility to Teachers</Title>
                      <Body smallSize={isSmallSize}>
                        <StyledRadioGroup
                          disabled={!owner || !isEditable}
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

                  <Block id="maximum-attempts-allowed">
                    <SettingContainer>
                      <DetailsTooltip
                        placement="rightBottom"
                        showInsideContainer
                        title="Maximum Attempts Allowed"
                        content="Control the number of times a student can take the assignment."
                        premium={maxAttemptAllowed}
                      />
                      <Title>
                        Maximum Attempts Allowed{' '}
                        <DollarPremiumSymbol premium={maxAttemptAllowed} />
                      </Title>
                      <Body>
                        <FieldLabel>Quantity</FieldLabel>
                        <TextInputStyled
                          type="number"
                          width="100px"
                          disabled={!owner || !isEditable || !maxAttemptAllowed}
                          size="large"
                          value={maxAttempts}
                          onChange={this.updateAttempt}
                          min={1}
                          step={1}
                        />
                      </Body>
                    </SettingContainer>
                  </Block>
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
                        <DetailsTooltip
                          placement="rightBottom"
                          showInsideContainer
                          title="Shuffle Questions"
                          content="If ON, then order of questions will be different for each student."
                          premium={assessmentSuperPowersShuffleQuestions}
                        />
                        <Title>
                          <span>
                            Shuffle Questions{' '}
                            <DollarPremiumSymbol
                              premium={assessmentSuperPowersShuffleQuestions}
                            />
                          </span>
                          <EduSwitchStyled
                            disabled={
                              !owner ||
                              !isEditable ||
                              !assessmentSuperPowersShuffleQuestions
                            }
                            defaultChecked={shuffleQuestions}
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
                  {premium && (
                    <Block id="block-save-and-continue" smallSize={isSmallSize}>
                      <Title>
                        <span>Block Save And Continue</span>
                        <EduSwitchStyled
                          disabled={!owner || !isEditable}
                          checked={blockSaveAndContinue}
                          data-cy="bockSaveAndContinueSwitch"
                          onChange={this.updateTestData('blockSaveAndContinue')}
                        />
                      </Title>
                      <Body smallSize={isSmallSize}>
                        <Description>
                          Will force the students to take the test in single
                          sitting
                        </Description>
                      </Body>
                    </Block>
                  )}

                  {premium && (
                    <Block id="restrict-navigation-out" smallSize={isSmallSize}>
                      <Title>Restrict Navigation Out of Test</Title>
                      <Body smallSize={isSmallSize}>
                        <Row>
                          <Col span={11}>
                            <StyledRadioGroup
                              disabled={!owner || !isEditable}
                              onChange={this.updateFeatures(
                                'restrictNavigationOut'
                              )}
                              value={restrictNavigationOut}
                            >
                              <RadioBtn value={undefined} key="disabled">
                                DISABLED
                              </RadioBtn>
                              <RadioBtn
                                value="warn-and-report"
                                key="warn-and-report"
                              >
                                WARN AND REPORT ONLY
                              </RadioBtn>
                              <RadioBtn
                                value="warn-and-report-after-n-alerts"
                                key="warn-and-report-after-n-alerts"
                              >
                                WARN AND BLOCK TEST AFTER{' '}
                                <InputNumberStyled
                                  size="small"
                                  value={
                                    restrictNavigationOut
                                      ? restrictNavigationOutAttemptsThreshold
                                      : undefined
                                  }
                                  onChange={this.updateFeatures(
                                    'restrictNavigationOutAttemptsThreshold'
                                  )}
                                  disabled={
                                    !(
                                      restrictNavigationOut ===
                                      'warn-and-report-after-n-alerts'
                                    ) ||
                                    !owner ||
                                    !isEditable
                                  }
                                />{' '}
                                ALERTS
                              </RadioBtn>
                            </StyledRadioGroup>
                          </Col>
                          <Col span={13}>
                            <Description>
                              If <b> ON </b>, then students will be shown an
                              alert if they navigate away from edulastic tab and
                              if specific number of alerts exceeded, the
                              assignment will be paused and the instructor will
                              need to manually resume
                            </Description>
                          </Col>
                        </Row>
                      </Body>
                    </Block>
                  )}
                  {!isDocBased && (
                    <Block id="show-answer-choice" smallSize={isSmallSize}>
                      <SettingContainer>
                        <DetailsTooltip
                          placement="rightBottom"
                          showInsideContainer
                          title="Shuffle Answer Choice"
                          content="If set to ON, answer choices for multiple choice and multiple select questions will be randomly shuffled for students. Text to speech does not work when the answer choices are shuffled."
                          premium={assessmentSuperPowersShuffleAnswerChoice}
                        />
                        <Title>
                          <span>
                            Shuffle Answer Choice{' '}
                            <DollarPremiumSymbol
                              premium={assessmentSuperPowersShuffleAnswerChoice}
                            />
                          </span>
                          <EduSwitchStyled
                            disabled={
                              !owner ||
                              !isEditable ||
                              !assessmentSuperPowersShuffleAnswerChoice
                            }
                            defaultChecked={shuffleAnswers}
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
                      <DetailsTooltip
                        placement="rightBottom"
                        showInsideContainer
                        title="Require Password"
                        content="Require your students to type a password when opening the assessment. Password ensures that your students can access this assessment only in the classroom."
                        premium={assessmentSuperPowersRequirePassword}
                      />
                      <Row>
                        <Title>
                          Require Password{' '}
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
                                  !owner ||
                                  !isEditable ||
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
                                <Description>
                                  <TextInputStyled
                                    required
                                    color={isPasswordValid()}
                                    disabled={
                                      !owner ||
                                      !isEditable ||
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
                                <Description>
                                  <TextInputStyled
                                    required
                                    type="number"
                                    disabled={
                                      !owner ||
                                      !isEditable ||
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
                                  opening the assessment. Password ensures that
                                  your <br /> students can access this
                                  assessment only in the classroom
                                </Description>
                              )}
                            </Col>
                          </Row>
                        </Body>
                      </Row>
                    </SettingContainer>
                  </Block>

                  <Block id="restrict-back-navigation" smallSize={isSmallSize}>
                    <SettingContainer>
                      <DetailsTooltip
                        placement="rightBottom"
                        showInsideContainer
                        title="RESTRICT QUESTION NAVIGATION"
                        content="If ON, then students will be restricted from navigating back to the previous question that they have answered. It is recommended to use this along with Shuffle Questions for preventing cheating among students."
                        premium={assessmentSuperPowersRestrictQuestionBackNav}
                      />
                      <Title>
                        <span>
                          Restrict Navigation To Previously Answered Questions{' '}
                          <DollarPremiumSymbol
                            premium={
                              assessmentSuperPowersRestrictQuestionBackNav
                            }
                          />
                        </span>
                        <EduSwitchStyled
                          disabled={
                            !owner ||
                            !isEditable ||
                            !assessmentSuperPowersRestrictQuestionBackNav
                          }
                          defaultChecked={blockNavigationToAnsweredQuestions}
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
                        </Description>
                      </Body>
                    </SettingContainer>
                  </Block>

                  <Block
                    id="require-safe-exame-browser"
                    smallSize={isSmallSize}
                  >
                    <SettingContainer>
                      <DetailsTooltip
                        placement="rightBottom"
                        showInsideContainer
                        title="Require Safe Exam Browser"
                        content="Ensure secure testing environment by using Safe Exam Browser to lockdown the student's device. To use this feature Safe Exam Browser (on Windows/Mac only) must be installed on the student devices."
                        premium={assessmentSuperPowersRequireSafeExamBrowser}
                      />
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
                            !owner ||
                            !isEditable ||
                            !assessmentSuperPowersRequireSafeExamBrowser
                          }
                          defaultChecked={safeBrowser}
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
                                  !owner ||
                                  !isEditable ||
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
                                value={sebPassword}
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
                      <DetailsTooltip
                        placement="rightBottom"
                        showInsideContainer
                        title="Answer on Paper"
                        content="Use this option if you are administering this assessment on paper. If you use this option, you will have to manually grade student responses after the assessment is closed."
                        premium={assessmentSuperPowersAnswerOnPaper}
                      />
                      <Title>
                        <span>
                          Answer on Paper{' '}
                          <DollarPremiumSymbol
                            premium={assessmentSuperPowersAnswerOnPaper}
                          />
                        </span>
                        <EduSwitchStyled
                          disabled={
                            !owner ||
                            !isEditable ||
                            disableAnswerOnPaper ||
                            !assessmentSuperPowersAnswerOnPaper
                          }
                          defaultChecked={answerOnPaper}
                          onChange={this.updateTestData('answerOnPaper')}
                          data-cy="answer-on-paper"
                        />
                      </Title>
                      <Body smallSize={isSmallSize}>
                        <Description>
                          Use this opinion if you are administering this
                          assessment on paper. If you use this opinion, you will
                          have <br /> to manually grade student responses after
                          the assessment is closed.
                        </Description>
                      </Body>
                    </SettingContainer>
                  </Block>

                  <Block id="performance-bands" smallSize={isSmallSize}>
                    <PeformanceBand
                      setSettingsData={(val) =>
                        this.updateTestData('performanceBand')(val)
                      }
                      performanceBand={performanceBand}
                      disabled={!owner || !isEditable || !performanceBands}
                      isFeatureAvailable={performanceBands}
                    />
                  </Block>

                  <Block id="standards-proficiency" smallSize={isSmallSize}>
                    <StandardProficiencyTable
                      standardGradingScale={standardGradingScale}
                      setSettingsData={(val) =>
                        this.updateTestData('standardGradingScale')(val)
                      }
                      disabled={!owner || !isEditable}
                    />
                  </Block>

                  {testType !== 'testlet' && !isDocBased && (
                    <Block id="player-skin-type" smallSize={isSmallSize}>
                      <Row>
                        <Title>
                          Student Player Skin{' '}
                          <DollarPremiumSymbol premium={selectPlayerSkinType} />
                        </Title>
                        <Body smallSize={isSmallSize}>
                          <SelectInputStyled
                            data-cy="playerSkinType"
                            value={
                              playerSkinType ===
                              playerSkinTypes.edulastic.toLowerCase()
                                ? edulastic
                                : playerSkinType
                            }
                            disabled={
                              !owner || !isEditable || !selectPlayerSkinType
                            }
                            onChange={this.updateTestData('playerSkinType')}
                            getPopupContainer={(trigger) => trigger.parentNode}
                          >
                            {Object.keys(skinTypes).map((key) => (
                              <Option key={key} value={key}>
                                {skinTypes[key]}
                              </Option>
                            ))}
                          </SelectInputStyled>
                        </Body>
                      </Row>
                    </Block>
                  )}

                  <Block id="accessibility" smallSize={isSmallSize}>
                    <Title>
                      Accessibility <DollarPremiumSymbol premium={premium} />
                    </Title>
                    <RadioWrapper
                      disabled={!owner || !isEditable}
                      style={{
                        marginTop: '29px',
                        marginBottom: 0,
                        flexDirection: 'row',
                      }}
                    >
                      {accessibilityData.map((o) => (
                        <Row
                          key={o.key}
                          style={{ width: '100%' }}
                          align="middle"
                        >
                          <Col span={12}>
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
                              disabled={
                                !owner || !isEditable || !features[o.key]
                              }
                              onChange={(e) =>
                                this.updateTestData(o.key)(e.target.value)
                              }
                              defaultValue={o.value}
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
                        </Row>
                      ))}
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
      calculatorProvider: state?.user?.user?.features?.calculatorProvider,
      totalItems: state?.tests?.entity?.isDocBased
        ? state?.tests?.entity?.summary?.totalQuestions
        : state?.tests?.entity?.summary?.totalItems,
      isAuthorPublisher: isPublisherUserSelector(state),
      editEnable: state.tests?.editEnable,
    }),
    {
      setMaxAttempts: setMaxAttemptsAction,
      setSafePassword: setSafeBroswePassword,
      setTestData: setTestDataAction,
      resetUpdatedState: resetUpdatedStateAction,
    }
  )
)

export default enhance(Setting)

const InputNumberStyled = Styled(InputNumber)`
    width: 60px;
`
