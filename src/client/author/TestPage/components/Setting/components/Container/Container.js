import React, { Component, memo } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { get } from 'lodash'
import { Anchor, Col, Row, Select, Tooltip } from 'antd'
import {
  blueBorder,
  green,
  red,
  themeColor,
  lightGrey9,
} from '@edulastic/colors'
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
import { IconCaretDown, IconInfo } from '@edulastic/icons'
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
  AdvancedButton,
  AdvancedSettings,
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
} from './styled'
import PeformanceBand from './PeformanceBand'
import StandardProficiencyTable from './StandardProficiencyTable'
import SubscriptionsBlock from './SubscriptionsBlock'
import Instruction from './InstructionBlock/InstructionBlock'

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
      showAdvancedOption: false,
      inputBlur: false,
      _releaseGradeKeys: nonPremiumReleaseGradeKeys,
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

  // enableHandler = e => {
  //   this.setState({ enable: e.target.value });
  // };

  advancedHandler = () => {
    const { showAdvancedOption } = this.state
    this.setState({ showAdvancedOption: !showAdvancedOption })
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
    const featVal = e.target.value
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

  render() {
    const { showAdvancedOption, showPassword, _releaseGradeKeys } = this.state
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
      enableSkipAlert = false,
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

    const availableFeatures = settingCategories.slice(0, -5).map((category) => {
      if (isDocBased && categories.includes(category.id)) return null
      if (
        features[settingCategoriesFeatureMap[category.id]] ||
        isFeatureAccessible({
          features,
          inputFeatures: settingCategoriesFeatureMap[category.id],
          gradeSubject: { grades, subjects },
        })
      ) {
        return settingCategoriesFeatureMap[category.id]
      }
      if (settingCategoriesFeatureMap[category.id] === 'releaseScore') {
        // release score is free feature
        return settingCategoriesFeatureMap[category.id]
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

    // TODO: check publisher here to add/remove testlet option into skinTypes
    skinTypes[playerSkinValues.testlet] = 'ETS Testlet Player'

    const accessibilityData = [
      { key: 'showMagnifier', value: showMagnifier },
      { key: 'enableScratchpad', value: enableScratchpad },
      { key: 'enableSkipAlert', value: enableSkipAlert },
    ].filter((a) => features[a.key])

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
                  {settingCategories
                    .filter((item) =>
                      item.adminFeature ? userRole !== roleuser.TEACHER : true
                    )
                    .slice(0, -6)
                    .map((category) => {
                      if (
                        availableFeatures.includes(
                          settingCategoriesFeatureMap[category.id]
                        )
                      ) {
                        return (
                          <Anchor.Link
                            key={category.id}
                            href={`${history.location.pathname}#${category.id}`}
                            title={category.title.toLowerCase()}
                          />
                        )
                      }
                      return null
                    })}
                </StyledAnchor>
                {/* Hiding temporarly for deploying */}
                {!isDocBased && features.premium && (
                  <AdvancedButton
                    onClick={this.advancedHandler}
                    show={showAdvancedOption}
                    data-cy="advanced-option"
                  >
                    {showAdvancedOption
                      ? 'HIDE ADVANCED OPTIONS'
                      : 'SHOW ADVANCED OPTIONS'}
                    <IconCaretDown color={themeColor} width={11} height={6} />
                  </AdvancedButton>
                )}
                {features.premium && showAdvancedOption && (
                  <StyledAnchor affix={false} offsetTop={125}>
                    {advancedSettingCategoris.map((category) => (
                      <Anchor.Link
                        key={category.id}
                        href={`${history.location.pathname}#${category.id}`}
                        title={category.title.toLowerCase()}
                      />
                    ))}
                  </StyledAnchor>
                )}
              </NavigationMenu>
            </Col>
            <Col span={isSmallSize ? 24 : 18}>
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
                    {(userRole === roleuser.DISTRICT_ADMIN ||
                      userRole === roleuser.SCHOOL_ADMIN) &&
                      testType === COMMON && (
                        <>
                          <br />
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
                        </>
                      )}
                  </Body>
                </Row>
              </Block>
              {availableFeatures.includes('maxAttemptAllowed') && (
                <Block id="maximum-attempts-allowed">
                  <Title>Maximum Attempts Allowed</Title>
                  <Body>
                    <FieldLabel>Quantity</FieldLabel>
                    <TextInputStyled
                      type="number"
                      width="100px"
                      disabled={!owner || !isEditable}
                      size="large"
                      value={maxAttempts}
                      onChange={this.updateAttempt}
                      min={1}
                      step={1}
                    />
                  </Body>
                </Block>
              )}

              {/* Add instruction starts */}
              <Block id="add-instruction" smallSize={isSmallSize}>
                <Title>
                  <span>Test Instructions</span>
                  <EduSwitchStyled
                    disabled={!owner || !isEditable}
                    data-cy="add-test-instruction"
                    defaultChecked={hasInstruction}
                    onChange={() =>
                      this.updateTestData('hasInstruction')(!hasInstruction)
                    }
                  />
                </Title>
                <Body smallSize={isSmallSize}>
                  <Description>
                    Add instructions for the students here. For example,
                    &ldquo;You will be allowed two attempts on this quiz.&ldquo;
                    Or, &ldquo;This test is worth 30% of your grade.&ldquo;
                  </Description>
                  {hasInstruction && (
                    <Instruction
                      border="border"
                      size="SM"
                      updateTestData={this.updateTestData}
                      instruction={instruction}
                    />
                  )}
                </Body>
              </Block>
              {/* Add instruction ends */}

              {availableFeatures.includes(
                'assessmentSuperPowersMarkAsDone'
              ) && (
                <Block id="mark-as-done" smallSize={isSmallSize}>
                  <Title>Mark as Done</Title>
                  <Body smallSize={isSmallSize}>
                    <Row type="flex" align="middle">
                      <Col span={8}>
                        <StyledRadioGroup
                          disabled={!owner || !isEditable}
                          onChange={this.updateFeatures('markAsDone')}
                          value={markAsDone}
                        >
                          {Object.keys(completionTypes).map((item) => (
                            <RadioBtn
                              value={completionTypes[item]}
                              key={completionTypes[item]}
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
                </Block>
              )}

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

              {availableFeatures.includes(
                'assessmentSuperPowersRequireSafeExamBrowser'
              ) && (
                <Block id="require-safe-exame-browser" smallSize={isSmallSize}>
                  <Title>
                    <span>Safe Exam Browser/Kiosk Mode</span>
                    <Tooltip
                      title="Ensure a secure testing environment by using Safe Exam Browser or Edulastic Kiosk Mode to 
                  lockdown the student's device. To use this feature, Safe Exam Browser (on Windows/Mac/iPad) must 
                  be installed on the student device. On Chromebook, Edulastic Kiosk Mode 2.1 must be installed.
                    The quit password can be used by teacher or proctor to safely exit Safe Exam Browser in the middle 
                  of an assessment. The quit password should not be revealed to the students. The quit password cannot 
                  be used to exit Chromebook Kiosk mode."
                    >
                      <IconInfo
                        color={lightGrey9}
                        style={{ cursor: 'pointer', marginLeft: '10px' }}
                      />
                    </Tooltip>
                    <EduSwitchStyled
                      disabled={!owner || !isEditable}
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
                            disabled={!owner || !isEditable}
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
                      Browser or Edulastic Kiosk Mode to lockdown the
                      student&apos;s device. To use this feature, Safe Exam
                      Browser (on Windows/Mac/iPad) must be installed on the
                      student device. On Chromebook, Edulastic Kiosk Mode 2.1
                      must be installed. <br />
                      The quit password can be used by teacher or proctor to
                      safely exit Safe Exam Browser in the middle of an
                      assessment. The quit password should not be revealed to
                      the students. The quit password cannot be used to exit
                      Chromebook Kiosk mode.
                    </Description>
                  </Body>
                </Block>
              )}

              {availableFeatures.includes(
                'assessmentSuperPowersShuffleQuestions'
              ) && (
                <Block id="suffle-question" smallSize={isSmallSize}>
                  <Title>
                    <span>Shuffle Questions</span>
                    <EduSwitchStyled
                      disabled={!owner || !isEditable}
                      defaultChecked={shuffleQuestions}
                      data-cy="shuffleQuestions"
                      onChange={this.updateTestData('shuffleQuestions')}
                    />
                  </Title>
                  <Body smallSize={isSmallSize}>
                    <Description>
                      {'If '}
                      <BlueText>ON</BlueText>, then order of questions will be
                      different for each student.
                    </Description>
                  </Body>
                </Block>
              )}

              {availableFeatures.includes(
                'assessmentSuperPowersShuffleAnswerChoice'
              ) && (
                <Block id="show-answer-choice" smallSize={isSmallSize}>
                  <Title>
                    <span>Shuffle Answer Choice</span>
                    <EduSwitchStyled
                      disabled={!owner || !isEditable}
                      defaultChecked={shuffleAnswers}
                      data-cy="shuffleChoices"
                      onChange={this.updateTestData('shuffleAnswers')}
                    />
                  </Title>
                  <Body smallSize={isSmallSize}>
                    <Description>
                      {'If set to '}
                      <BlueText>ON</BlueText>, answer choices for multiple
                      choice and multiple select questions will be randomly
                      shuffled for students.
                    </Description>
                  </Body>
                </Block>
              )}

              {availableFeatures.includes(
                'assessmentSuperPowersShowCalculator'
              ) && (
                <Block id="show-calculator" smallSize={isSmallSize}>
                  <Title>Show Calculator</Title>
                  <Body smallSize={isSmallSize}>
                    <Row>
                      <Col span={8}>
                        <StyledRadioGroup
                          disabled={!owner || !isEditable}
                          onChange={this.updateFeatures('calcType')}
                          value={calcType}
                        >
                          {calculatorKeysAvailable.map((item) => (
                            <RadioBtn data-cy={item} value={item} key={item}>
                              {calculators[item]}
                            </RadioBtn>
                          ))}
                        </StyledRadioGroup>
                      </Col>
                      <Col span={16}>
                        <Description>
                          Choose if student can use a calculator, also select
                          the type of calculator that would be shown to the
                          students.
                        </Description>
                      </Col>
                    </Row>
                  </Body>
                </Block>
              )}

              {availableFeatures.includes(
                'assessmentSuperPowersAnswerOnPaper'
              ) && (
                <Block id="answer-on-paper" smallSize={isSmallSize}>
                  <Title>
                    <span>Answer on Paper</span>
                    <EduSwitchStyled
                      disabled={!owner || !isEditable || disableAnswerOnPaper}
                      defaultChecked={answerOnPaper}
                      onChange={this.updateTestData('answerOnPaper')}
                      data-cy="answer-on-paper"
                    />
                  </Title>
                  <Body smallSize={isSmallSize}>
                    <Description>
                      Use this opinion if you are administering this assessment
                      on paper. If you use this opinion, you will have <br /> to
                      manually grade student responses after the assessment is
                      closed.
                    </Description>
                  </Body>
                </Block>
              )}

              {!!availableFeatures.includes(
                'assessmentSuperPowersRequirePassword'
              ) && (
                <Block id="test-type" smallSize={isSmallSize}>
                  <Row>
                    <Title>Require Password</Title>
                    <Body smallSize={isSmallSize}>
                      <Row gutter={24}>
                        <Col span={12}>
                          <SelectInputStyled
                            value={passwordPolicy}
                            data-cy={passwordPolicy}
                            disabled={!owner || !isEditable}
                            onChange={this.updateTestData('passwordPolicy')}
                            getPopupContainer={(trigger) => trigger.parentNode}
                          >
                            {Object.keys(passwordPolicyOptions).map((key) => (
                              <Option
                                key={key}
                                value={passwordPolicyValues[key]}
                              >
                                {passwordPolicyOptions[key]}
                              </Option>
                            ))}
                          </SelectInputStyled>
                        </Col>
                        <Col span={12}>
                          {passwordPolicy ===
                          passwordPolicyValues.REQUIRED_PASSWORD_POLICY_STATIC ? (
                            <Description>
                              <TextInputStyled
                                required
                                color={isPasswordValid()}
                                disabled={!owner || !isEditable}
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
                                <MessageSpan>{validationMessage}</MessageSpan>
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
                                disabled={!owner || !isEditable}
                                onChange={this.handleUpdatePasswordExpireIn}
                                value={passwordExpireIn / 60}
                                style={{ width: '100px', marginRight: '10px' }}
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
                              change. Students must enter this password before
                              they can take the assessment.
                            </Description>
                          ) : passwordPolicy ===
                            passwordPolicyValues.REQUIRED_PASSWORD_POLICY_DYNAMIC ? (
                            <Description>
                              Students must enter a password to take the
                              assessment. The password is auto-generated and
                              revealed only when the assessment is opened. If
                              you select this method, you also need to specify
                              the time in minutes after which the password would
                              automatically expire. Use this method for highly
                              sensitive and secure assessments. If you select
                              this method, the teacher or the proctor must open
                              the assessment manually and announce the password
                              in class when the students are ready to take the
                              assessment.
                            </Description>
                          ) : (
                            <Description>
                              Require your students to type a password when
                              opening the assessment. Password ensures that your{' '}
                              <br /> students can access this assessment only in
                              the classroom
                            </Description>
                          )}
                        </Col>
                      </Row>
                    </Body>
                  </Row>
                </Block>
              )}
              {availableFeatures.includes(
                'assessmentSuperPowersCheckAnswerTries'
              ) && (
                <Block
                  id="check-answer-tries-per-question"
                  smallSize={isSmallSize}
                >
                  <Title>Check Answer Tries Per Question</Title>
                  <Body smallSize={isSmallSize}>
                    <Row gutter={24}>
                      <Col span={12}>
                        <TextInputStyled
                          disabled={!owner || !isEditable}
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
                </Block>
              )}

              <Block id="evaluation-method" smallSize={isSmallSize}>
                <Title>Evaluation Method</Title>
                <Body smallSize={isSmallSize}>
                  <Row>
                    <Col span={8}>
                      <StyledRadioGroup
                        disabled={!owner || !isEditable}
                        onChange={(e) =>
                          this.updateTestData('scoringType')(e.target.value)
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
                        Choose if students should be awarded partial credit for
                        their answers or not. If partial credit is allowed, then
                        choose whether the student should be penalized for
                        incorrect answers or not (applicable only for multiple
                        selection question and multi part question with multiple
                        selection widgets)
                      </Description>
                    </Col>
                  </Row>
                </Body>
              </Block>

              {availableFeatures.includes('assessmentSuperPowersTimedTest') && (
                <Block id="timed-test" smallSize={isSmallSize}>
                  <Title>
                    <span>Timed Test</span>
                    <Tooltip title="The time can be modified in one minute increments.  When the time limit is reached, students will be locked out of the assessment.  If the student begins an assessment and exits with time remaining, upon returning, the timer will start up again where the student left off.  This ensures that the student does not go over the allotted time.">
                      <IconInfo
                        color={lightGrey9}
                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                      />
                    </Tooltip>
                    <EduSwitchStyled
                      disabled={!owner || !isEditable}
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
                      time limit on the test. Adjust the minutes accordingly.
                    </Description>
                  </Body>
                </Block>
              )}

              {(userRole === roleuser.DISTRICT_ADMIN ||
                userRole === roleuser.SCHOOL_ADMIN) && (
                <Block id="test-content-visibility" smallSize={isSmallSize}>
                  <Title>Item content visibility to Teachers</Title>
                  <Body smallSize={isSmallSize}>
                    <StyledRadioGroup
                      disabled={!owner || !isEditable}
                      onChange={this.updateFeatures('testContentVisibility')}
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

              {availableFeatures.includes('performanceBands') && (
                <Block id="performance-bands" smallSize={isSmallSize}>
                  <PeformanceBand
                    setSettingsData={(val) =>
                      this.updateTestData('performanceBand')(val)
                    }
                    performanceBand={performanceBand}
                    disabled={!owner || !isEditable}
                  />
                </Block>
              )}

              {!premium && <SubscriptionsBlock />}

              <Block id="standards-proficiency" smallSize={isSmallSize}>
                <StandardProficiencyTable
                  standardGradingScale={standardGradingScale}
                  setSettingsData={(val) =>
                    this.updateTestData('standardGradingScale')(val)
                  }
                  disabled={!owner || !isEditable}
                />
              </Block>

              <AdvancedSettings show={isSmallSize || showAdvancedOption}>
                {availableFeatures.includes('selectPlayerSkinType') &&
                  testType !== 'testlet' &&
                  !isDocBased && (
                    <Block id="player-skin-type" smallSize={isSmallSize}>
                      <Row>
                        <Title>Student Player Skin</Title>
                        <Body smallSize={isSmallSize}>
                          <SelectInputStyled
                            value={
                              playerSkinType ===
                              playerSkinTypes.edulastic.toLowerCase()
                                ? edulastic
                                : playerSkinType
                            }
                            disabled={!owner || !isEditable}
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
                {!!accessibilityData.length && (
                  <Block id="accessibility" smallSize={isSmallSize}>
                    <Title>Accessibility</Title>
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
                              disabled={!owner || !isEditable}
                              onChange={(e) =>
                                this.updateTestData(o.key)(e.target.value)
                              }
                              defaultValue={o.value}
                              style={{ flexDirection: 'row', height: '18px' }}
                            >
                              <RadioBtn value>ENABLE</RadioBtn>
                              <RadioBtn value={false}>DISABLE</RadioBtn>
                            </StyledRadioGroup>
                          </Col>
                        </Row>
                      ))}
                    </RadioWrapper>
                  </Block>
                )}
                {playerSkinType === playerSkinValues.testlet.toLowerCase() && (
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
                {/* {availableFeatures.includes("enableMagnifier") && (
              <Block id="enable-magnifier" smallSize={isSmallSize}>
                <Title>Accessibility</Title>
                <Body smallSize={isSmallSize}>
                  <Row>
                    <Col span={12}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Magnifier</span>
                    </Col>
                    <Col span={12}>
                      <StyledRadioGroup
                        disabled={!owner || !isEditable}
                        onChange={this.updateFeatures("enableMagnifier")}
                        value={true}
                        style={{flexDirection: "row"}}
                      >
                        <RadioBtn value={true} key="true">
                          ENABLE
                        </RadioBtn>
                        <RadioBtn value={false} key="false">
                          DISABLE
                        </RadioBtn>
                      </StyledRadioGroup>
                    </Col>
                  </Row>
                </Body>
              </Block>
            )} */}
                {/* <Block id="navigations" smallSize={isSmallSize}>
                <Title>Navigation / Control</Title>
                <RadioWrapper style={{ marginTop: "29px" }}>
                  {navigations.map(navigation => (
                    <Row key={navigation} style={{ width: "100%", marginBottom: 15 }}>
                      <Col span={8}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{navigation}</span>
                      </Col>
                      <Col span={16}>
                        <RadioGroup
                          disabled={!owner || !isEditable}
                          onChange={this.enableHandler}
                          defaultValue={enable}
                        >
                          <Radio value>Enable</Radio>
                          <Radio value={false}>Disable</Radio>
                        </RadioGroup>
                      </Col>
                    </Row>
                  ))}
                </RadioWrapper>
                <Body smallSize={isSmallSize}>
                  <Row gutter={28}>
                    <Col span={12}>
                      <InputTitle>On Submit Redirect URL</InputTitle>
                      <ActivityInput placeholder="https://edulastic.com/" />
                    </Col>
                    <Col span={12}>
                      <InputTitle>On Discard Redirect URL</InputTitle>
                      <ActivityInput placeholder="https://edulastic.com/" />
                    </Col>
                    <Col span={12} style={{ paddingTop: 15 }}>
                      <InputTitle>On Save Redirect URL</InputTitle>
                      <ActivityInput placeholder="https://edulastic.com/" />
                    </Col>
                  </Row>
                </Body>
              </Block>

              <Block id="accessibility" smallSize={isSmallSize}>
                <Title>Accessibility</Title>
                <RadioWrapper disabled={!owner || !isEditable} style={{ marginTop: "29px", marginBottom: 0 }}>
                  {Object.keys(accessibilities).map(item => (
                    <Row key={accessibilities[item]} style={{ width: "100%" }}>
                      <Col span={8}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{accessibilities[item]}</span>
                      </Col>
                      <Col span={16}>
                        <RadioGroup
                          disabled={!owner || !isEditable}
                          onChange={this.enableHandler}
                          defaultValue={enable}
                        >
                          <Radio value>Enable</Radio>
                          <Radio value={false}>Disable</Radio>
                        </RadioGroup>
                      </Col>
                    </Row>
                  ))}
                </RadioWrapper>
              </Block>

              <UiTime />

              <Block id="administration" smallSize={isSmallSize}>
                <Title>Administration</Title>
                <RadioWrapper style={{ marginTop: "29px" }}>
                  <Row style={{ width: "100%", marginBottom: 15 }}>
                    <Col span={8}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Configuration Panel</span>
                    </Col>
                    <Col span={16}>
                      <RadioGroup disabled={!owner || !isEditable} onChange={this.enableHandler} defaultValue={enable}>
                        <Radio value>Enable</Radio>
                        <Radio value={false}>Disable</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>
                </RadioWrapper>
                <Body style={{ marginTop: 0, marginBottom: "15px" }} smallSize={isSmallSize}>
                  <Row gutter={28}>
                    <Col span={12}>
                      <InputTitle>Password</InputTitle>
                      <Input disabled={!owner || !isEditable} placeholder="Your Password" />
                    </Col>
                  </Row>
                </Body>
                <RadioWrapper>
                  <Row style={{ width: "100%" }}>
                    <Col span={8}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Save & Quit</span>
                    </Col>
                    <Col span={16}>
                      <RadioGroup disabled={!owner || !isEditable} onChange={this.enableHandler} defaultValue={enable}>
                        <Radio value>Enable</Radio>
                        <Radio value={false}>Disable</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>
                </RadioWrapper>

                <RadioWrapper>
                  <Row style={{ width: "100%" }}>
                    <Col span={8}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Exit & Discard</span>
                    </Col>
                    <Col span={16}>
                      <RadioGroup disabled={!owner || !isEditable} onChange={this.enableHandler} defaultValue={enable}>
                        <Radio value>Enable</Radio>
                        <Radio value={false}>Disable</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>
                </RadioWrapper>

                <RadioWrapper style={{ marginBottom: 0 }}>
                  <Row style={{ width: "100%" }}>
                    <Col span={8}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Extend Assessment Time</span>
                    </Col>
                    <Col span={16}>
                      <RadioGroup disabled={!owner || !isEditable} onChange={this.enableHandler} defaultValue={enable}>
                        <Radio value>Enable</Radio>
                        <Radio value={false}>Disable</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>
                </RadioWrapper>
              </Block> */}
              </AdvancedSettings>
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
