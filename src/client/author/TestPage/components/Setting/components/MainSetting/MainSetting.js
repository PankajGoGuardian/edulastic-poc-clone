import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Anchor, Input, Row, Col, Radio, Switch, List, Select } from "antd";

import { Paper } from "@edulastic/common";
import { test } from "@edulastic/constants";
import { lightBlueSecondary } from "@edulastic/colors";
import { IconCaretDown } from "@edulastic/icons";

import { setMaxAttemptsAction, setSafeBroswePassword } from "../../ducks";
import { setTestDataAction, getTestEntitySelector } from "../../../../ducks";
import ListCard from "../Card/Card";
import UiTime from "../UiTime/UiTime";

import {
  StyledAnchor,
  RadioGroup,
  InputTitle,
  InputPassword,
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
  GenerateReportSelect,
  ActivityInput,
  Container
} from "./styled";

const {
  settingCategories,
  performanceBandsData,
  type,
  navigations,
  completionTypes,
  calculators,
  calculatorKeys,
  evalTypes,
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
const generateReportTypes = {
  YES: {
    val: "Yes",
    type: true
  },
  NO: {
    val: "No",
    type: false
  }
};
class MainSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markAsDoneValue: props.entity.markAsDoneValue,
      evalType: props.entity.evalType,
      showPassword: false,
      enable: true,
      showAdvancedOption: false
    };
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
    setMaxAttempts(e.target.value);
  };

  setPassword = e => {
    const { setSafePassword } = this.props;
    setSafePassword(e.target.value);
  };

  updateTestData = key => value => {
    const { setTestData, setMaxAttempts } = this.props;
    if (key === "testType") {
      if (value === ASSESSMENT) {
        setMaxAttempts(1);
        setTestData({
          releaseScore: releaseGradeLabels.DONT_RELEASE
        });
        setTestData({ generateReport: true });
      } else {
        setMaxAttempts(3);
        setTestData({
          releaseScore: releaseGradeLabels.WITH_ANSWERS
        });
        setTestData({ generateReport: false });
      }
    }
    if (key === "safeBrowser" && value === false) {
      setTestData({
        sebPassword: "",
        [key]: value
      });
    } else {
      setTestData({
        [key]: value
      });
    }
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

  render() {
    const { markAsDoneValue, evalType, enable, showAdvancedOption, showPassword } = this.state;
    const { history, windowWidth, entity } = this.props;

    const {
      releaseScore,
      safeBrowser,
      sebPassword,
      shuffleQuestions,
      shuffleAnswers,
      answerOnPaper,
      requirePassword,
      testType,
      generateReport,
      calcType
    } = entity;
    const isSmallSize = windowWidth < 993 ? 1 : 0;
    return (
      <Container>
        <Row style={{ padding: 0 }}>
          <Col span={isSmallSize ? 0 : 6}>
            <StyledAnchor affix={false} offsetTop={125}>
              {settingCategories.slice(0, -5).map(category => (
                <Anchor.Link
                  key={category.id}
                  href={`${history.location.pathname}#${category.id}`}
                  title={category.title.toLowerCase()}
                />
              ))}
            </StyledAnchor>
            <AdvancedButton onClick={this.advancedHandler} show={showAdvancedOption}>
              {showAdvancedOption ? "HIDE ADVANCED OPTIONS" : "SHOW ADVANCED OPTIONS"}
              <IconCaretDown color={lightBlueSecondary} width={11} height={6} />
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
            )}
          </Col>
          <Col span={isSmallSize ? 24 : 18}>
            <Block id="test-type" smallSize={isSmallSize}>
              <Row>
                <Col span={12}>
                  <Title>Test Type</Title>
                  <Body smallSize={isSmallSize}>
                    <TestTypeSelect defaultValue={testType} onChange={this.updateTestData("testType")}>
                      {Object.keys(testTypes).map(key => (
                        <Option key={key} value={key}>
                          {testTypes[key]}
                        </Option>
                      ))}
                    </TestTypeSelect>
                  </Body>
                </Col>
                <Col span={12}>
                  {testType === PRACTICE && (
                    <React.Fragment>
                      {" "}
                      <Title>Generate Report </Title>
                      <Body smallSize={isSmallSize}>
                        <GenerateReportSelect
                          defaultValue={generateReport}
                          onChange={this.updateTestData("generateReport")}
                        >
                          {Object.keys(generateReportTypes).map(key => (
                            <Select.Option key={key} value={generateReportTypes[key].type}>
                              {generateReportTypes[key].val}
                            </Select.Option>
                          ))}
                        </GenerateReportSelect>
                      </Body>
                    </React.Fragment>
                  )}
                </Col>
              </Row>
            </Block>
            <Block id="mark-as-done" smallSize={isSmallSize}>
              <Title>Mark as Done</Title>
              <Body smallSize={isSmallSize}>
                <StyledRadioGroup onChange={this.updateFeatures("markAsDoneValue")} value={markAsDoneValue}>
                  {Object.keys(completionTypes).map(item => (
                    <Radio value={completionTypes[item]} key={completionTypes[item]}>
                      {completionTypes[item]}
                    </Radio>
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

            <Block id="release-scores" smallSize={isSmallSize}>
              <Title>Release Scores</Title>
              <Body smallSize={isSmallSize}>
                <StyledRadioGroup onChange={this.updateFeatures("releaseScore")} value={releaseScore}>
                  {releaseGradeKeys.map(item => (
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

            <Block id="require-safe-exame-browser" smallSize={isSmallSize}>
              <Title>Require Safe Exam Browser</Title>
              <Body smallSize={isSmallSize}>
                <Switch defaultChecked={safeBrowser} onChange={this.updateTestData("safeBrowser")} />
                {safeBrowser && (
                  <InputPassword
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

            <Block id="suffle-question" smallSize={isSmallSize}>
              <Title>Shuffle Questions</Title>
              <Body smallSize={isSmallSize}>
                <Switch defaultChecked={shuffleQuestions} onChange={this.updateTestData("shuffleQuestions")} />
                <Description>
                  {"If "}
                  <BlueText>ON</BlueText>
                  {", then order of questions will be different for each student."}
                </Description>
              </Body>
            </Block>

            <Block id="show-answer-choice" smallSize={isSmallSize}>
              <Title>Shuffle Answer Choice</Title>
              <Body smallSize={isSmallSize}>
                <Switch defaultChecked={shuffleAnswers} onChange={this.updateTestData("shuffleAnswers")} />
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

            <Block id="show-calculator" smallSize={isSmallSize}>
              <Title>Show Calculator</Title>
              <Body smallSize={isSmallSize}>
                <StyledRadioGroup onChange={this.updateFeatures("calcType")} value={calcType}>
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

            <Block id="answer-on-paper" smallSize={isSmallSize}>
              <Title>Answer on Paper</Title>
              <Body smallSize={isSmallSize}>
                <Switch defaultChecked={answerOnPaper} onChange={this.updateTestData("answerOnPaper")} />
                <Description>
                  {
                    "Use this opinion if you are administering this assessment on paper. If you use this opinion, you will have to manually grade student responses after the assessment is closed."
                  }
                </Description>
              </Body>
            </Block>

            <Block id="require-password" smallSize={isSmallSize}>
              <Title>Require Password</Title>
              <Body smallSize={isSmallSize}>
                <Switch defaultChecked={requirePassword} onChange={this.updateTestData("shuffleAns")} />
                <Description>
                  {
                    "Require your students to type a password when opening the assessment. Password ensures that your students can access this assessment only in the classroom."
                  }
                </Description>
              </Body>
            </Block>

            <Block id="evaluation-method" smallSize={isSmallSize}>
              <Title>Evaluation Method</Title>
              <Body smallSize={isSmallSize}>
                <StyledRadioGroup onChange={this.updateFeatures("evalType")} value={evalType}>
                  {Object.keys(evalTypes).map(item => (
                    <Radio value={evalTypes[item]} key={evalTypes[item]}>
                      {evalTypes[item]}
                    </Radio>
                  ))}
                </StyledRadioGroup>
                <Description>
                  {
                    "Choose if students should be awarded partial credit for their answers or not. If partial credit is allowed, then choose whether the student should be penalized for."
                  }
                </Description>
              </Body>
            </Block>

            <Block id="performance-bands" smallSize={isSmallSize}>
              <Row style={{ marginBottom: 18, display: "flex", alignItems: "center" }}>
                <Col span={6}>
                  <Title>Performance Bands</Title>
                </Col>
                <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
                  <NormalText>Above or At Standardss</NormalText>
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
                      onPerformanceBandUpdate={() => this.onPerformanceBandUpdate(item)}
                    />
                  </List.Item>
                )}
              />
            </Block>
            <AdvancedSettings style={{ display: isSmallSize || showAdvancedOption ? "block" : "none" }}>
              <Block id="title" smallSize={isSmallSize}>
                <Title>Title</Title>
                <Body smallSize={isSmallSize}>
                  <RadioGroup onChange={this.enableHandler} defaultValue={enable}>
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
                      <ActivityInput placeholder="Title of activity" />
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
                        <RadioGroup onChange={this.enableHandler} defaultValue={enable}>
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
                <RadioWrapper style={{ marginTop: "29px", marginBottom: 0 }}>
                  {Object.keys(accessibilities).map(item => (
                    <Row key={accessibilities[item]} style={{ width: "100%" }}>
                      <Col span={8}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{accessibilities[item]}</span>
                      </Col>
                      <Col span={16}>
                        <RadioGroup onChange={this.enableHandler} defaultValue={enable}>
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
                      <RadioGroup onChange={this.enableHandler} defaultValue={enable}>
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
                      <Input placeholder="Your Password" />
                    </Col>
                  </Row>
                </Body>
                <RadioWrapper>
                  <Row style={{ width: "100%" }}>
                    <Col span={8}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Save & Quit</span>
                    </Col>
                    <Col span={16}>
                      <RadioGroup onChange={this.enableHandler} defaultValue={enable}>
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
                      <RadioGroup onChange={this.enableHandler} defaultValue={enable}>
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
                      <RadioGroup onChange={this.enableHandler} defaultValue={enable}>
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
  entity: PropTypes.object.isRequired
};

export default connect(
  state => ({
    entity: getTestEntitySelector(state)
  }),
  {
    setMaxAttempts: setMaxAttemptsAction,
    setSafePassword: setSafeBroswePassword,
    setTestData: setTestDataAction
  }
)(MainSetting);
