import { blueBorder, green, red, themeColor, lightGrey9 } from "@edulastic/colors";
import { CheckboxLabel, RadioBtn, withWindowScroll, SelectInputStyled, TextInputStyled } from "@edulastic/common";
import { roleuser, test as testContants } from "@edulastic/constants";
import { IconCaretDown, IconInfo } from "@edulastic/icons";
import { Anchor, Col, Input, message, Row, Radio, Select, Switch, Tooltip } from "antd";
import { get } from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { isFeatureAccessible } from "../../../../../../features/components/FeaturesSwitch";
import { getUserFeatures, getUserRole } from "../../../../../../student/Login/ducks";
import {
  defaultTestTypeProfilesSelector,
  getDisableAnswerOnPaperSelector,
  getReleaseScorePremiumSelector,
  getTestEntitySelector,
  setTestDataAction,
  testTypeAsProfileNameType
} from "../../../../ducks";
import { setMaxAttemptsAction, setSafeBroswePassword } from "../../ducks";
import PeformanceBand from "./PeformanceBand";
import StandardProficiencyTable from "./StandardProficiencyTable";
import {
  AdvancedButton,
  AdvancedSettings,
  Block,
  BlueText,
  Body,
  Container,
  Description,
  InputPassword,
  MaxAnswerChecksInput,
  MaxAttempts,
  MessageSpan,
  NavigationMenu,
  StyledAnchor,
  StyledRadioGroup,
  StyledSelect,
  Title,
  RadioGroup,
  RadioWrapper,
  StyledCol,
  Label
} from "./styled";
import SubscriptionsBlock from "./SubscriptionsBlock";

const {
  settingCategories,
  settingCategoriesFeatureMap,
  type,
  navigations,
  completionTypes,
  calculators,
  calculatorKeys,
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
  playerSkinTypes
} = testContants;

const { Option } = Select;

const { ASSESSMENT, PRACTICE, COMMON } = type;

const testTypes = {
  [ASSESSMENT]: "Class Assessment",
  [PRACTICE]: "Practice"
};

const { ALL_OR_NOTHING, PARTIAL_CREDIT, ITEM_LEVEL_EVALUATION } = evalTypeLabels;

class MainSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPassword: false,
      enable: true,
      showAdvancedOption: false,
      inputBlur: false,
      _releaseGradeKeys: nonPremiumReleaseGradeKeys
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { features, entity } = nextProps;
    const { grades, subjects } = entity;
    if (
      features["assessmentSuperPowersReleaseScorePremium"] ||
      (grades &&
        subjects &&
        isFeatureAccessible({
          features: features,
          inputFeatures: "assessmentSuperPowersReleaseScorePremium",
          gradeSubject: { grades, subjects }
        }))
    ) {
      return {
        _releaseGradeKeys: releaseGradeKeys
      };
    } else {
      return {
        _releaseGradeKeys: nonPremiumReleaseGradeKeys
      };
    }
  }

  handleShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  enableHandler = e => {
    this.setState({ enable: e.target.value });
  };

  advancedHandler = () => {
    const { showAdvancedOption } = this.state;
    this.setState({ showAdvancedOption: !showAdvancedOption });
  };

  updateAttempt = e => {
    const { setMaxAttempts } = this.props;
    let { value = 0 } = e.target;
    if (value < 0) value = 0;
    setMaxAttempts(value);
  };

  setPassword = e => {
    const { setSafePassword } = this.props;
    setSafePassword(e.target.value);
  };

  updateTestData = key => value => {
    const {
      setTestData,
      setMaxAttempts,
      performanceBandsData,
      standardsData,
      defaultTestTypeProfiles,
      isReleaseScorePremium,
      disableAnswerOnPaper
    } = this.props;
    switch (key) {
      case "testType":
        const testProfileType = testTypeAsProfileNameType[value];
        const defaultBandId = defaultTestTypeProfiles?.performanceBand?.[testProfileType];
        const defaultStandardId = defaultTestTypeProfiles?.standardProficiency?.[testProfileType];
        const performanceBand = performanceBandsData.find(item => item._id === defaultBandId) || {};
        const standardGradingScale = standardsData.find(item => item._id === defaultStandardId) || {};
        if (value === ASSESSMENT || value === COMMON) {
          const releaseScore =
            value === ASSESSMENT && isReleaseScorePremium
              ? releaseGradeLabels.WITH_RESPONSE
              : releaseGradeLabels.DONT_RELEASE;
          setMaxAttempts(1);
          setTestData({
            releaseScore,
            maxAnswerChecks: 0,
            performanceBand: {
              name: performanceBand.name,
              _id: performanceBand._id
            },
            standardGradingScale: {
              name: standardGradingScale.name,
              _id: standardGradingScale._id
            }
          });
        } else {
          setMaxAttempts(3);
          setTestData({
            releaseScore: releaseGradeLabels.WITH_ANSWERS,
            maxAnswerChecks: 3,
            performanceBand: {
              name: performanceBand.name,
              _id: performanceBand._id
            },
            standardGradingScale: {
              name: standardGradingScale.name,
              _id: standardGradingScale._id
            }
          });
        }
        break;
      case "scoringType":
        setTestData({
          penalty: false
        });
        break;
      case "safeBrowser":
        if (!value)
          setTestData({
            sebPassword: ""
          });
        break;
      case "maxAnswerChecks":
        if (value < 0) value = 0;
        break;
      case "passwordPolicy":
        if (value === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_DYNAMIC) {
          setTestData({
            passwordExpireIn: 15 * 60
          });
        } else if (value === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_STATIC) {
          setTestData({
            assignmentPassword: ""
          });
        }
        break;
      case "answerOnPaper":
        if (value === true && disableAnswerOnPaper) {
          return message.error("Answer on paper not suppported for this test");
        }
    }
    setTestData({
      [key]: value
    });
  };

  updateFeatures = key => e => {
    const { setTestData } = this.props;
    const featVal = e.target.value;
    this.setState({ [key]: featVal });
    setTestData({
      [key]: featVal
    });
  };

  handleBlur = e => {
    this.setState({ inputBlur: true });
  };

  handleUpdatePasswordExpireIn = e => {
    let { value = 1 } = e.target;
    value = value * 60;
    if (value < 60 || isNaN(value)) {
      value = 60;
    } else if (value > 999 * 60) {
      value = 999 * 60;
    }
    this.updateTestData("passwordExpireIn")(value);
  };

  updateTimedTest = attr => value => {
    const { totalItems, setTestData } = this.props;
    if (value) {
      setTestData({
        [attr]: value,
        allowedTime: totalItems * 60 * 1000
      });
      return;
    }
    setTestData({
      [attr]: value
    });
  };

  render() {
    const { enable, showAdvancedOption, showPassword, _releaseGradeKeys } = this.state;
    const {
      history,
      windowWidth,
      entity,
      owner,
      userRole,
      features,
      isEditable,
      sebPasswordRef,
      windowScrollTop,
      disableAnswerOnPaper,
      premium
    } = this.props;

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
      penalty,
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
      pauseAllowed
    } = entity;
    const isSmallSize = windowWidth < 993 ? 1 : 0;

    let validationMessage = "";
    const isPasswordValid = () => {
      const { inputBlur } = this.state;
      if (!inputBlur) return blueBorder;
      if (assignmentPassword.split(" ").length > 1) {
        validationMessage = "Password must not contain space";
        return red;
      }
      if (assignmentPassword.length >= 6 && assignmentPassword.length <= 25) {
        return green;
      } else {
        validationMessage = "Password is too short - must be at least 6 characters";
        if (assignmentPassword.length > 25) validationMessage = "Password is too long";
        return red;
      }
    };

    const categories = ["show-answer-choice", "suffle-question", "check-answer-tries-per-question"];

    const availableFeatures = settingCategories.slice(0, -5).map(category => {
      if (isDocBased && categories.includes(category.id)) return;
      if (
        features[settingCategoriesFeatureMap[category.id]] ||
        isFeatureAccessible({
          features,
          inputFeatures: settingCategoriesFeatureMap[category.id],
          gradeSubject: { grades, subjects }
        })
      ) {
        return settingCategoriesFeatureMap[category.id];
      } else if (settingCategoriesFeatureMap[category.id] === "releaseScore") {
        // release score is free feature
        return settingCategoriesFeatureMap[category.id];
      }
    });

    const edulastic = `${playerSkinTypes.edulastic} ${testType.includes("assessment") ? "Test" : "Practice"}`;
    const skinTypes = {
      ...playerSkinTypes,
      edulastic
    };
    return (
      <Container padding="30px" marginTop="10px">
        <Row style={{ padding: 0 }}>
          <Col span={isSmallSize ? 0 : 6}>
            <NavigationMenu fixed={windowScrollTop >= 90}>
              <StyledAnchor affix={false} offsetTop={125}>
                {settingCategories
                  .filter(item => (item.adminFeature ? userRole !== roleuser.TEACHER : true))
                  .slice(0, -6)
                  .map(category => {
                    if (availableFeatures.includes(settingCategoriesFeatureMap[category.id])) {
                      return (
                        <Anchor.Link
                          key={category.id}
                          href={`${history.location.pathname}#${category.id}`}
                          title={category.title.toLowerCase()}
                        />
                      );
                    }
                  })}
              </StyledAnchor>
              {/* Hiding temporarly for deploying */}
              {!isDocBased && (
                <AdvancedButton onClick={this.advancedHandler} show={showAdvancedOption}>
                  {showAdvancedOption ? "HIDE ADVANCED OPTIONS" : "SHOW ADVANCED OPTIONS"}
                  <IconCaretDown color={themeColor} width={11} height={6} />
                </AdvancedButton>
              )}
              {showAdvancedOption && (
                <StyledAnchor affix={false} offsetTop={125}>
                  {settingCategories.slice(-6, -4).map(category => (
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
            {availableFeatures.includes("selectTestType") ? (
              <Block id="test-type" smallSize={isSmallSize}>
                <Row>
                  <Title>Test Type</Title>
                  <Body smallSize={isSmallSize}>
                    <SelectInputStyled
                      width="70%"
                      value={testType}
                      disabled={!owner || !isEditable}
                      onChange={this.updateTestData("testType")}
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      {(userRole === roleuser.DISTRICT_ADMIN ||
                        userRole === roleuser.SCHOOL_ADMIN ||
                        testType === COMMON) && (
                        <Option key={COMMON} value={COMMON}>
                          Common Assessment
                        </Option>
                      )}
                      {Object.keys(testTypes).map(key => (
                        <Option key={key} value={key}>
                          {testTypes[key]}
                        </Option>
                      ))}
                    </SelectInputStyled>
                  </Body>
                </Row>
              </Block>
            ) : (
              ""
            )}
            {availableFeatures.includes("maxAttemptAllowed") ? (
              <Block id="maximum-attempts-allowed">
                <Title>Maximum Attempts Allowed </Title>
                <Body>
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
            ) : (
              ""
            )}
            {availableFeatures.includes("assessmentSuperPowersMarkAsDone") ? (
              <Block id="mark-as-done" smallSize={isSmallSize}>
                <Title>Mark as Done</Title>
                <Body smallSize={isSmallSize}>
                  <StyledRadioGroup
                    disabled={!owner || !isEditable}
                    onChange={this.updateFeatures("markAsDone")}
                    value={markAsDone}
                  >
                    {Object.keys(completionTypes).map(item => (
                      <RadioBtn value={completionTypes[item]} key={completionTypes[item]}>
                        {completionTypes[item]}
                      </RadioBtn>
                    ))}
                  </StyledRadioGroup>
                  <Description>
                    {"Control when class will be marked as Done. "}
                    <BlueText>Automatically</BlueText>
                    {" when all students are graded and due date has passed OR "}
                    <BlueText>Manually</BlueText>
                    {' when you click the "Mark as Done" button.'}
                  </Description>
                </Body>
              </Block>
            ) : (
              ""
            )}
            <Block id="release-scores" smallSize={isSmallSize}>
              <Title>Release Scores {releaseScore === releaseGradeLabels.DONT_RELEASE ? "[OFF]" : "[ON]"}</Title>
              <Body smallSize={isSmallSize}>
                <StyledRadioGroup
                  disabled={!owner || !isEditable}
                  onChange={this.updateFeatures("releaseScore")}
                  value={releaseScore}
                >
                  {_releaseGradeKeys.map(item => (
                    <RadioBtn value={item} key={item}>
                      {releaseGradeTypes[item]}
                    </RadioBtn>
                  ))}
                </StyledRadioGroup>
              </Body>
            </Block>
            {availableFeatures.includes("assessmentSuperPowersRequireSafeExamBrowser") ? (
              <Block id="require-safe-exame-browser" smallSize={isSmallSize}>
                <Title>Require Safe Exam Browser</Title>
                <Body smallSize={isSmallSize}>
                  <Switch
                    disabled={!owner || !isEditable}
                    defaultChecked={safeBrowser}
                    onChange={this.updateTestData("safeBrowser")}
                  />
                  {safeBrowser && (
                    <Input
                      className={`sebPassword ${sebPassword && sebPassword.length ? " good" : " dirty"}`}
                      disabled={!owner || !isEditable}
                      ref={sebPasswordRef}
                      prefix={
                        <i className={`fa fa-eye${showPassword ? "-slash" : ""}`} onClick={this.handleShowPassword} />
                      }
                      onChange={this.setPassword}
                      size="large"
                      value={sebPassword}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                    />
                  )}
                  <Description>
                    Ensure secure testing environment by using Safe Exam Browser to lockdown the student's device. To
                    use this feature Safe Exam Browser (on Windows/Mac only) must be installed.
                  </Description>
                </Body>
              </Block>
            ) : (
              ""
            )}
            {availableFeatures.includes("assessmentSuperPowersShuffleQuestions") ? (
              <Block id="suffle-question" smallSize={isSmallSize}>
                <Title>Shuffle Questions</Title>
                <Body smallSize={isSmallSize}>
                  <Switch
                    disabled={!owner || !isEditable}
                    defaultChecked={shuffleQuestions}
                    data-cy="shuffleQuestions"
                    onChange={this.updateTestData("shuffleQuestions")}
                  />
                  <Description>
                    {"If "}
                    <BlueText>ON</BlueText>, then order of questions will be different for each student.
                  </Description>
                </Body>
              </Block>
            ) : (
              ""
            )}
            {availableFeatures.includes("assessmentSuperPowersShuffleAnswerChoice") ? (
              <Block id="show-answer-choice" smallSize={isSmallSize}>
                <Title>Shuffle Answer Choice</Title>
                <Body smallSize={isSmallSize}>
                  <Switch
                    disabled={!owner || !isEditable}
                    defaultChecked={shuffleAnswers}
                    data-cy="shuffleChoices"
                    onChange={this.updateTestData("shuffleAnswers")}
                  />
                  <Description>
                    {"If set to "}
                    <BlueText>ON</BlueText>
                    , answer choices for multiple choice and multiple select questions will be randomly shuffled for
                    students.
                    <br />
                    Text to speech does not work when the answer choices are shuffled.
                  </Description>
                </Body>
              </Block>
            ) : (
              ""
            )}
            {availableFeatures.includes("assessmentSuperPowersShowCalculator") ? (
              <Block id="show-calculator" smallSize={isSmallSize}>
                <Title>Show Calculator</Title>
                <Body smallSize={isSmallSize}>
                  <StyledRadioGroup
                    disabled={!owner || !isEditable}
                    onChange={this.updateFeatures("calcType")}
                    value={calcType}
                  >
                    {calculatorKeys.map(item => (
                      <RadioBtn data-cy={item} value={item} key={item}>
                        {calculators[item]}
                      </RadioBtn>
                    ))}
                  </StyledRadioGroup>
                  <Description>
                    Choose if student can use a calculator, also select the type of calculator that would be shown to
                    the students.
                  </Description>
                </Body>
              </Block>
            ) : (
              ""
            )}
            {availableFeatures.includes("assessmentSuperPowersAnswerOnPaper") ? (
              <Block id="answer-on-paper" smallSize={isSmallSize}>
                <Title>Answer on Paper</Title>
                <Body smallSize={isSmallSize}>
                  <Switch
                    disabled={!owner || !isEditable || disableAnswerOnPaper}
                    defaultChecked={answerOnPaper}
                    onChange={this.updateTestData("answerOnPaper")}
                  />
                  <Description>
                    Use this opinion if you are administering this assessment on paper. If you use this opinion, you
                    will have to manually grade student responses after the assessment is closed.
                  </Description>
                </Body>
              </Block>
            ) : (
              ""
            )}
            {!!availableFeatures.includes("assessmentSuperPowersRequirePassword") && (
              <Block id="test-type" smallSize={isSmallSize}>
                <Row>
                  <Title>Require Password</Title>
                  <Body smallSize={isSmallSize}>
                    <SelectInputStyled
                      width="70%"
                      value={passwordPolicy}
                      data-cy={passwordPolicy}
                      disabled={!owner || !isEditable}
                      onChange={this.updateTestData("passwordPolicy")}
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      {Object.keys(passwordPolicyOptions).map(key => (
                        <Option key={key} value={passwordPolicyValues[key]}>
                          {passwordPolicyOptions[key]}
                        </Option>
                      ))}
                    </SelectInputStyled>
                    {passwordPolicy === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_STATIC && (
                      <>
                        <Description>
                          <TextInputStyled
                            width="40%"
                            required
                            color={isPasswordValid()}
                            disabled={!owner || !isEditable}
                            onBlur={this.handleBlur}
                            onChange={e => this.updateTestData("assignmentPassword")(e.target.value)}
                            size="large"
                            value={assignmentPassword}
                            type="text"
                            placeholder="Enter Password"
                          />
                          {validationMessage ? <MessageSpan>{validationMessage}</MessageSpan> : ""}
                        </Description>
                        <Description>
                          The password is entered by you and does not change. Students must enter this password before
                          they can take the assessment.
                        </Description>
                      </>
                    )}
                    {passwordPolicy === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_DYNAMIC && (
                      <>
                        <Description>
                          <TextInputStyled
                            required
                            type="number"
                            disabled={!owner || !isEditable}
                            onChange={this.handleUpdatePasswordExpireIn}
                            value={passwordExpireIn / 60}
                            style={{ width: "100px", marginRight: "10px" }}
                            max={999}
                            min={1}
                            step={1}
                          />{" "}
                          Minutes
                        </Description>
                        <Description>
                          Students must enter a password to take the assessment. The password is auto-generated and
                          revealed only when the assessment is opened. If you select this method, you also need to
                          specify the time in minutes after which the password would automatically expire. Use this
                          method for highly sensitive and secure assessments. If you select this method, the teacher or
                          the proctor must open the assessment manually and announce the password in class when the
                          students are ready to take the assessment.
                        </Description>
                      </>
                    )}
                  </Body>
                </Row>
              </Block>
            )}
            {availableFeatures.includes("assessmentSuperPowersCheckAnswerTries") ? (
              <Block id="check-answer-tries-per-question" smallSize={isSmallSize}>
                <Title>Check Answer Tries Per Question</Title>
                <Body smallSize={isSmallSize}>
                  <TextInputStyled
                    width="40%"
                    disabled={!owner || !isEditable}
                    onChange={e => this.updateTestData("maxAnswerChecks")(e.target.value)}
                    size="large"
                    value={maxAnswerChecks}
                    type="number"
                    min={0}
                    placeholder="Number of tries"
                  />
                </Body>
              </Block>
            ) : (
              ""
            )}
            {availableFeatures.includes("assessmentSuperPowersEvaluationMethod") ? (
              <Block id="evaluation-method" smallSize={isSmallSize}>
                <Title>Evaluation Method</Title>
                <Body smallSize={isSmallSize}>
                  <StyledRadioGroup
                    disabled={!owner || !isEditable}
                    onChange={e => this.updateTestData("scoringType")(e.target.value)}
                    value={scoringType}
                  >
                    <RadioBtn value={ALL_OR_NOTHING} data-cy={ALL_OR_NOTHING} key={ALL_OR_NOTHING}>
                      {evalTypes.ALL_OR_NOTHING}
                    </RadioBtn>
                    <RadioBtn value={PARTIAL_CREDIT} data-cy={PARTIAL_CREDIT} key={PARTIAL_CREDIT}>
                      {evalTypes.PARTIAL_CREDIT}
                    </RadioBtn>
                    {/* effective margin 9px between checkbox and radio button */}
                    {/* half of the margin (18px) if checkbox is not getting rendered */}
                    {scoringType === evalTypeLabels.PARTIAL_CREDIT && (
                      <CheckboxLabel
                        disabled={!owner || !isEditable}
                        checked={penalty === false}
                        data-cy="PENALIZE"
                        onChange={e => this.updateTestData("penalty")(!e.target.checked)}
                        mt="-9px"
                        ml="40px"
                        mb="18px"
                      >
                        Don’t penalize for incorrect selection
                      </CheckboxLabel>
                    )}
                    {/* ant-radio-wrapper already has bottom-margin: 18px by default. */}
                    {/* not setting mb (margin bottom) as it is common component */}
                    <RadioBtn
                      value={ITEM_LEVEL_EVALUATION}
                      data-cy={ITEM_LEVEL_EVALUATION}
                      key={ITEM_LEVEL_EVALUATION}
                      style={{ marginBottom: "0px" }}
                    >
                      {evalTypes.ITEM_LEVEL_EVALUATION}
                    </RadioBtn>
                  </StyledRadioGroup>
                  <Description>
                    Choose if students should be awarded partial credit for their answers or not. If partial credit is
                    allowed, then choose whether the student should be penalized for.
                  </Description>
                </Body>
              </Block>
            ) : (
              ""
            )}

            {availableFeatures.includes("assessmentSuperPowersTimedTest") && (
              <Block id="timed-test" smallSize={isSmallSize}>
                <Title>Timed Test</Title>
                <Body smallSize={isSmallSize}>
                  <Row gutter="16">
                    <StyledCol span={12}>
                      <Switch
                        disabled={!owner || !isEditable}
                        defaultChecked={false}
                        checked={timedAssignment}
                        data-cy="assignment-time-switch"
                        onChange={this.updateTimedTest("timedAssignment")}
                      />
                      {timedAssignment && (
                        <>
                          <TextInputStyled
                            type="number"
                            width="100px"
                            size="large"
                            data-cy="assignment-time"
                            style={{ margin: "0 30px" }}
                            value={!isNaN(allowedTime) ? allowedTime / (60 * 1000) : 1}
                            onChange={e => this.updateTestData("allowedTime")(e.target.value * 60 * 1000)}
                            min={1}
                            max={300}
                            step={1}
                          />
                          <Label>Minutes</Label>
                        </>
                      )}
                    </StyledCol>
                    <Col
                      span={12}
                      justify="end"
                      style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                    >
                      <Tooltip title="The time can be modified in one minute increments.  When the time limit is reached, students will be locked out of the assessment.  If the student begins an assessment and exits with time remaining, upon returning, the timer will start up again where the student left off.  This ensures that the student does not go over the allotted time.">
                        <IconInfo color={lightGrey9} style={{ cursor: "pointer" }} />
                      </Tooltip>
                    </Col>
                  </Row>
                  {timedAssignment && (
                    <>
                      <br />
                      <CheckboxLabel
                        disabled={!owner || !isEditable}
                        checked={pauseAllowed}
                        data-cy="pause-allowed"
                        onChange={e => this.updateTestData("pauseAllowed")(e.target.checked)}
                      >
                        Allow Students to exit assignment without submitting.
                      </CheckboxLabel>
                    </>
                  )}
                  <Description>
                    {" Select "}
                    <BlueText> ON </BlueText>
                    , If you want to set a time limit on the test. Adjust the minutes accordingly.
                    <br />
                  </Description>
                </Body>
              </Block>
            )}

            {(userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN) && (
              <Block id="test-content-visibility" smallSize={isSmallSize}>
                <Title>Item content visibility to Teachers</Title>
                <Body smallSize={isSmallSize}>
                  <StyledRadioGroup
                    disabled={!owner || !isEditable}
                    onChange={this.updateFeatures("testContentVisibility")}
                    value={testContentVisibility}
                  >
                    {testContentVisibilityTypes.map(item => (
                      <RadioBtn value={item.key} key={item.key}>
                        {item.value}
                      </RadioBtn>
                    ))}
                  </StyledRadioGroup>
                </Body>
              </Block>
            )}
            {availableFeatures.includes("performanceBands") ? (
              <Block id="performance-bands" smallSize={isSmallSize}>
                <PeformanceBand
                  setSettingsData={val => this.updateTestData("performanceBand")(val)}
                  performanceBand={performanceBand}
                />
              </Block>
            ) : (
              ""
            )}

            {!premium && <SubscriptionsBlock />}

            <Block id="standards-proficiency" smallSize={isSmallSize}>
              <StandardProficiencyTable
                standardGradingScale={standardGradingScale}
                setSettingsData={val => this.updateTestData("standardGradingScale")(val)}
              />
            </Block>
            <AdvancedSettings style={{ display: isSmallSize || showAdvancedOption ? "block" : "none" }}>
              {availableFeatures.includes("selectPlayerSkinType") && testType !== "testlet" && !isDocBased && (
                <Block id="player-skin-type" smallSize={isSmallSize}>
                  <Row>
                    <Title>Student Player Skin</Title>
                    <Body smallSize={isSmallSize}>
                      <SelectInputStyled
                        value={playerSkinType === playerSkinTypes.edulastic.toLowerCase() ? edulastic : playerSkinType}
                        disabled={!owner || !isEditable}
                        onChange={this.updateTestData("playerSkinType")}
                        getPopupContainer={trigger => trigger.parentNode}
                      >
                        {Object.keys(skinTypes).map(key => (
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
                <Title>Accessibility</Title>
                <RadioWrapper disabled={!owner || !isEditable} style={{ marginTop: "29px", marginBottom: 0 }}>
                  {Object.keys(accessibilities).map(item => (
                    <Row key={accessibilities[item]} style={{ width: "100%" }}>
                      <Col span={12}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{accessibilities[item]}</span>
                      </Col>
                      <Col span={12}>
                        <StyledRadioGroup
                          disabled={!owner || !isEditable}
                          onChange={e => this.updateTestData("showMagnifier")(e.target.value)}
                          defaultValue={showMagnifier}
                        >
                          <RadioBtn value>ENABLE</RadioBtn>
                          <RadioBtn value={false}>DISABLE</RadioBtn>
                        </StyledRadioGroup>
                      </Col>
                    </Row>
                  ))}
                </RadioWrapper>
              </Block>
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
    );
  }
}

MainSetting.propTypes = {
  history: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired,
  setMaxAttempts: PropTypes.func.isRequired,
  setTestData: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  entity: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
  userRole: PropTypes.string,
  windowScrollTop: PropTypes.number.isRequired
};

MainSetting.defaultProps = {
  owner: false,
  userRole: "",
  isEditable: false
};

export default connect(
  state => ({
    entity: getTestEntitySelector(state),
    features: getUserFeatures(state),
    userRole: getUserRole(state),
    defaultTestTypeProfiles: defaultTestTypeProfilesSelector(state),
    standardsData: get(state, ["standardsProficiencyReducer", "data"], []),
    performanceBandsData: get(state, ["performanceBandReducer", "profiles"], []),
    isReleaseScorePremium: getReleaseScorePremiumSelector(state),
    disableAnswerOnPaper: getDisableAnswerOnPaperSelector(state),
    premium: state?.user?.user?.features?.premium,
    totalItems: state?.tests?.entity?.summary?.totalItems
  }),
  {
    setMaxAttempts: setMaxAttemptsAction,
    setSafePassword: setSafeBroswePassword,
    setTestData: setTestDataAction
  }
)(withWindowScroll(MainSetting));
