import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Anchor, Input, Row, Col, Radio, Switch, List, Select, Checkbox, Form } from "antd";

import { test } from "@edulastic/constants";
import { red, green, blueBorder } from "@edulastic/colors";
import { IconCaretDown } from "@edulastic/icons";

import { setMaxAttemptsAction, setSafeBroswePassword } from "../../ducks";
import { setTestDataAction, getTestEntitySelector } from "../../../../ducks";
import ListCard from "../Card/Card";
import UiTime from "../UiTime/UiTime";
import { isFeatureAccessible } from "../../../../../../features/components/FeaturesSwitch";

import {
  StyledAnchor,
  RadioGroup,
  InputTitle,
  InputPassword,
  MaxAttempts,
  Body,
  Title,
  Block,
  AdvancedButton,
  AdvancedSettings,
  BlueText,
  Description,
  NormalText,
  StyledRadioGroup,
  RadioWrapper,
  TestTypeSelect,
  ActivityInput,
  Container,
  MaxAnswerChecksInput,
  CompletionTypeRadio,
  MessageSpan
} from "./styled";
import FeaturesSwitch from "../../../../../../features/components/FeaturesSwitch";
import { getUserFeatures, getUserRole } from "../../../../../../student/Login/ducks";

const {
  settingCategories,
  settingCategoriesFeatureMap,
  performanceBandsData,
  type,
  navigations,
  completionTypes,
  calculators,
  calculatorKeys,
  evalTypes,
  evalTypeLabels,
  accessibilities,
  releaseGradeTypes,
  releaseGradeLabels
} = test;

const { Option } = Select;

const { ASSESSMENT, PRACTICE } = type;

const testTypes = {
  [ASSESSMENT]: "Asessment",
  [PRACTICE]: "Practice"
};

const releaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY", "WITH_RESPONSE", "WITH_ANSWERS"];
const nonPremiumReleaseGradeKeys = ["DONT_RELEASE", "SCORE_ONLY"];

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

  static getDerivedStateFromProps(nextProps, nextState) {
    const { features, entity } = nextProps;
    const { grades, subjects } = entity;
    if (
      features["assessmentSuperPowersReleaseScorePremium"] === false &&
      grades &&
      subjects &&
      isFeatureAccessible({
        features: features,
        inputFeatures: "assessmentSuperPowersReleaseScorePremium",
        gradeSubject: { grades, subjects }
      })
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
    const { setTestData, setMaxAttempts } = this.props;
    switch (key) {
      case "testType":
        if (value === ASSESSMENT) {
          setMaxAttempts(1);
          setTestData({
            releaseScore: releaseGradeLabels.DONT_RELEASE,
            maxAnswerChecks: 0
          });
        } else {
          setMaxAttempts(3);
          setTestData({
            releaseScore: releaseGradeLabels.WITH_ANSWERS,
            maxAnswerChecks: 3
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

  onPerformanceBandUpdate = item => {
    const { setTestData, entity = {} } = this.props;
    const { performanceBands } = entity;
    const newPerformanceBands = {
      ...performanceBands,
      [item]: {
        ...performanceBands[item],
        isAbove: !performanceBands[item].isAbove
      }
    };
    setTestData({
      performanceBands: newPerformanceBands
    });
  };

  handleBlur = e => {
    this.setState({ inputBlur: true });
  };

  render() {
    const { enable, showAdvancedOption, showPassword, _releaseGradeKeys } = this.state;
    const { history, windowWidth, entity, owner, userRole, isEditable = false, sebPasswordRef } = this.props;

    const {
      releaseScore,
      safeBrowser,
      sebPassword,
      shuffleQuestions,
      shuffleAnswers,
      answerOnPaper,
      requirePassword,
      maxAnswerChecks,
      scoringType,
      penalty,
      testType,
      calcType,
      assignmentPassword,
      markAsDone,
      maxAttempts,
      grades,
      subjects
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
        validationMessage = "Password is too short";
        if (assignmentPassword.length > 25) validationMessage = "Password is too long";
        return red;
      }
    };

    const availableFeatures = settingCategories.slice(0, -5).map(category => {
      if (
        this.props.features[settingCategoriesFeatureMap[category.id]] ||
        isFeatureAccessible({
          features: this.props.features,
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
    return (
      <Container padding="30px">
        <Row style={{ padding: 0 }}>
          <Col span={isSmallSize ? 0 : 6}>
            <StyledAnchor affix={false} offsetTop={125}>
              {settingCategories.slice(0, -5).map(category => {
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
            {/* <AdvancedButton onClick={this.advancedHandler} show={showAdvancedOption}>
              {showAdvancedOption ? "HIDE ADVANCED OPTIONS" : "SHOW ADVANCED OPTIONS"}
              <IconCaretDown color={themeColor} width={11} height={6} />
            </AdvancedButton>
            {showAdvancedOption && (
              <StyledAnchor affix={false} offsetTop={125}>
                {settingCategories.slice(-5).map(category => (
                  <Anchor.Link
                    key={category.id}
                    href={`${history.location.pathname}#${category.id}`}
                    title={category.title.toLowerCase()}
                  />
                ))}
              </StyledAnchor>
            )} */}
          </Col>
          <Col span={isSmallSize ? 24 : 18}>
            {availableFeatures.includes("selectTestType") ? (
              <Block id="test-type" smallSize={isSmallSize}>
                <Row>
                  <Title>Test Type</Title>
                  <Body smallSize={isSmallSize}>
                    <TestTypeSelect
                      defaultValue={testType}
                      disabled={!owner || !isEditable}
                      onChange={this.updateTestData("testType")}
                    >
                      {Object.keys(testTypes).map(key => (
                        <Option key={key} value={key}>
                          {key === ASSESSMENT
                            ? userRole === "teacher"
                              ? "Class Assessment "
                              : "Common Assessment "
                            : testTypes[key]}
                        </Option>
                      ))}
                    </TestTypeSelect>
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
                  <MaxAttempts
                    type="number"
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
                      <CompletionTypeRadio value={completionTypes[item]} key={completionTypes[item]}>
                        {completionTypes[item]}
                      </CompletionTypeRadio>
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
              <Title>Release Scores</Title>
              <Body smallSize={isSmallSize}>
                <StyledRadioGroup
                  disabled={!owner || !isEditable}
                  onChange={this.updateFeatures("releaseScore")}
                  value={releaseScore}
                >
                  {_releaseGradeKeys.map(item => (
                    <Radio value={item} key={item}>
                      {releaseGradeTypes[item]}
                    </Radio>
                  ))}
                </StyledRadioGroup>
                <Description>
                  {"Select "}
                  <BlueText>ON</BlueText>
                  {" for students to see their scores instantly after submission."}
                  <br />
                  {"Select "}
                  <BlueText>OFF</BlueText>
                  {" to manually control when students get to see their scores."}
                </Description>
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
                    {
                      "Ensure secure testing environment by using Safe Exam Browser to lockdown the student's device. To use this feature Safe Exam Browser (on Windows/Mac only) must be installed."
                    }
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
                    onChange={this.updateTestData("shuffleQuestions")}
                  />
                  <Description>
                    {"If "}
                    <BlueText>ON</BlueText>
                    {", then order of questions will be different for each student."}
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
                    onChange={this.updateTestData("shuffleAnswers")}
                  />
                  <Description>
                    {"If set to "}
                    <BlueText>ON</BlueText>
                    {
                      ", answer choices for multiple choice and multiple select questions will be randomly shuffled for students."
                    }
                    <br />
                    {"Text to speech does not work when the answer choices are shuffled."}
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
                      <Radio value={item} key={item}>
                        {calculators[item]}
                      </Radio>
                    ))}
                  </StyledRadioGroup>
                  <Description>
                    {
                      "Choose if student can use a calculator, also select the type of calculator that would be shown to the students."
                    }
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
                    disabled={!owner || !isEditable}
                    defaultChecked={answerOnPaper}
                    onChange={this.updateTestData("answerOnPaper")}
                  />
                  <Description>
                    {
                      "Use this opinion if you are administering this assessment on paper. If you use this opinion, you will have to manually grade student responses after the assessment is closed."
                    }
                  </Description>
                </Body>
              </Block>
            ) : (
              ""
            )}
            {availableFeatures.includes("assessmentSuperPowersRequirePassword") ? (
              <Block id="require-password" smallSize={isSmallSize}>
                <Title>Require Password</Title>
                <Body smallSize={isSmallSize}>
                  <Switch
                    disabled={!owner || !isEditable}
                    defaultChecked={requirePassword}
                    onChange={this.updateTestData("requirePassword")}
                  />
                  {requirePassword && (
                    <>
                      <InputPassword
                        required
                        color={isPasswordValid()}
                        onBlur={this.handleBlur}
                        onChange={e => this.updateTestData("assignmentPassword")(e.target.value)}
                        size="large"
                        value={assignmentPassword}
                        type={"text"}
                        placeholder="Enter Password"
                      />
                      {validationMessage ? <MessageSpan>{validationMessage}</MessageSpan> : ""}
                    </>
                  )}
                  <Description>
                    {
                      "Require your students to type a password when opening the assessment. Password ensures that your students can access this assessment only in the classroom."
                    }
                  </Description>
                </Body>
              </Block>
            ) : (
              ""
            )}
            {availableFeatures.includes("assessmentSuperPowersCheckAnswerTries") ? (
              <Block id="check-answer-tries-per-question" smallSize={isSmallSize}>
                <Title>Check Answer Tries Per Question</Title>
                <Body smallSize={isSmallSize}>
                  <MaxAnswerChecksInput
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
                    {Object.keys(evalTypes).map(item => (
                      <Radio value={item} key={item}>
                        {evalTypes[item]}
                      </Radio>
                    ))}
                  </StyledRadioGroup>
                  {scoringType === evalTypeLabels.PARTIAL_CREDIT && (
                    <p>
                      <Checkbox
                        disabled={!owner || !isEditable}
                        checked={penalty === false}
                        onChange={e => this.updateTestData("penalty")(!e.target.checked)}
                      >
                        {"Don’t penalize for incorrect selection"}
                      </Checkbox>
                    </p>
                  )}
                  <Description>
                    {
                      "Choose if students should be awarded partial credit for their answers or not. If partial credit is allowed, then choose whether the student should be penalized for."
                    }
                  </Description>
                </Body>
              </Block>
            ) : (
              ""
            )}
            {availableFeatures.includes("performanceBands") ? (
              <Block id="performance-bands" smallSize={isSmallSize}>
                <Row style={{ marginBottom: 18, display: "flex", alignItems: "center" }}>
                  <Col span={6}>
                    <Title>Performance Bands</Title>
                  </Col>
                  <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
                    <NormalText>Above or At Standard</NormalText>
                  </Col>
                  <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
                    <NormalText>From</NormalText>
                  </Col>
                  <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
                    <NormalText>To</NormalText>
                  </Col>
                </Row>
                <List
                  grid={{ column: 1 }}
                  dataSource={Object.keys(performanceBandsData)}
                  renderItem={item => (
                    <List.Item>
                      <ListCard
                        item={performanceBandsData[item]}
                        owner={owner}
                        isEditable={isEditable}
                        onPerformanceBandUpdate={() => this.onPerformanceBandUpdate(item)}
                      />
                    </List.Item>
                  )}
                />
              </Block>
            ) : (
              ""
            )}
            <AdvancedSettings style={{ display: isSmallSize || showAdvancedOption ? "block" : "none" }}>
              <Block id="title" smallSize={isSmallSize}>
                <Title>Title</Title>
                <Body smallSize={isSmallSize}>
                  <RadioGroup disabled={!owner || !isEditable} onChange={this.enableHandler} defaultValue={enable}>
                    <Radio style={{ display: "block", marginBottom: "24px" }} value={true}>
                      Enable
                    </Radio>
                    <Radio style={{ display: "block", marginBottom: "24px" }} value={false}>
                      Disable
                    </Radio>
                  </RadioGroup>
                  <Row gutter={28}>
                    <Col span={12}>
                      <InputTitle>Activity Title</InputTitle>
                      <ActivityInput disabled={!owner || !isEditable} placeholder="Title of activity" />
                    </Col>
                  </Row>
                </Body>
              </Block>

              <Block id="navigations" smallSize={isSmallSize}>
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
                          <Radio value={true}>Enable</Radio>
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
                          <Radio value={true}>Enable</Radio>
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
                        <Radio value={true}>Enable</Radio>
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
                        <Radio value={true}>Enable</Radio>
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
                        <Radio value={true}>Enable</Radio>
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
                        <Radio value={true}>Enable</Radio>
                        <Radio value={false}>Disable</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>
                </RadioWrapper>
              </Block>
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
  entity: PropTypes.object.isRequired
};

export default connect(
  state => ({
    entity: getTestEntitySelector(state),
    features: getUserFeatures(state),
    userRole: getUserRole(state)
  }),
  {
    setMaxAttempts: setMaxAttemptsAction,
    setSafePassword: setSafeBroswePassword,
    setTestData: setTestDataAction
  }
)(MainSetting);
