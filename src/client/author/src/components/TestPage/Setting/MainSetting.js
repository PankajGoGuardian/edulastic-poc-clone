import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Anchor, Input, Row, Col, Radio, Switch, List, Button } from 'antd';
import { Paper } from '@edulastic/common';
import ListCard from './Card';
import UiTime from './ui-time';
import { setMaxAttemptsAction } from '../../../actions/tests';
import { getMaxAttemptSelector } from '../../../selectors/tests';

const settingCategories = [
  { id: 'mark-as-done', title: 'MARK AS DONE' },
  { id: 'release-scores', title: 'RELEASE SCORES' },
  { id: 'maximum-attempts-allowed', title: 'MAXIMUM ATTEMPTS ALLOWED' },
  { id: 'require-safe-exame-browser', title: 'REQUIRE SAFE EXAME BROWSER' },
  { id: 'show-questions', title: 'SHOW QUESTIONS TO STUDENT' },
  { id: 'suffle-question', title: 'SUFFLE QUESTION' },
  { id: 'show-answer-choice', title: 'SHOW ANSWER CHOICE' },
  { id: 'show-calculator', title: 'SHOW CALCULATOR' },
  { id: 'answer-on-paper', title: 'ANSWER ON PAPER' },
  { id: 'require-password', title: 'REQUIRE PASSWORD' },
  { id: 'evaluation-method', title: 'EVALUATION METHOD' },
  { id: 'performance-bands', title: 'PERFORMANCE BANDS' },
  { id: 'title', title: 'TITLE' },
  { id: 'navigations', title: 'NAVIGATIONS / CONTROL' },
  { id: 'accessibility', title: 'ACCESSIBILITY' },
  { id: 'ui-time', title: 'UI / TIME' },
  { id: 'administration', title: 'ADMINISTRATION' }
];

const data = [
  {
    bands: 'Advanced',
    from: '100%'
  },
  {
    bands: 'Mastery',
    from: '100%'
  },
  {
    bands: 'Basic',
    from: '100%'
  },
  {
    bands: 'Approaching Basic',
    from: '100%'
  },
  {
    bands: 'Unsatisfactory',
    from: '100%'
  }
];

const navigations = [
  'Intro Item',
  'Outro Item',
  'Previous',
  'Next',
  'Pause',
  'Save',
  'Submit',
  'Fullscreen',
  'Response Masking',
  'TOC Item Count',
  'Calculator',
  'Submit Criteria',
  'Warning if question not attempted',
  'Confirmation windows on submit',
  'Scroll to test element on test start',
  'Scroll to top on item change',
  'Exit Secure Browser',
  'Acknowledgements',
  'Table of Contents'
];

const accessibilities = ['Show Colour Shceme', 'Show Font Size', 'Show Zoom'];

class MainSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markAsDoneValue: 1,
      showAdvancedOption: true
    };
    this.inputRef = React.createRef();
  }

  markHandler = (e) => {
    this.setState({ markAsDoneValue: e.target.value });
  };

  advancedHandler = () => {
    const { showAdvancedOption } = this.state;
    this.setState({ showAdvancedOption: !showAdvancedOption });
  };

  updateAttempt = (e) => {
    const { setMaxAttempts } = this.props;
    setMaxAttempts(e.target.value);
  };

  render() {
    const { markAsDoneValue, showAdvancedOption } = this.state;
    const { history, windowWidth, maxAttempts } = this.props;
    const isSmallSize = windowWidth > 993 ? 1 : 0;
    return (
      <Paper style={{ marginTop: 27 }}>
        <Row style={{ padding: windowWidth < 468 && '25px' }}>
          <Col span={isSmallSize ? 6 : 0}>
            <StyledAnchor affix={false}>
              {settingCategories.map(category => (
                <Anchor.Link
                  key={category.id}
                  href={`${history.location.pathname}#${category.id}`}
                  title={category.title}
                />
              ))}
            </StyledAnchor>
          </Col>
          <Col span={isSmallSize ? 18 : 24}>
            <Block id="mark-as-done">
              <Title>Mark as Done</Title>
              <Body>
                <StyledRadioGroup
                  onChange={this.markHandler}
                  value={markAsDoneValue}
                >
                  <Radio value={1}>Automatically</Radio>
                  <Radio value={2}>Manually</Radio>
                </StyledRadioGroup>
              </Body>
              <Description>
                {'Control when class will be marked as Done. '}
                <BlueText>Automatically</BlueText>
                {' when all students are graded and due date has passed OR '}
                <BlueText>Manually</BlueText>
                {' when you click the "Mark as Done" button.'}
              </Description>
            </Block>

            <Block id="release-scores">
              <Title>Release Scores</Title>
              <Body>
                <Switch />
              </Body>
              <Description>
                {'Select '}
                <BlueText>ON</BlueText>
                {
                  ' for students to see their scores instantly after submission.'
                }
                <br />
                {'Select '}
                <BlueText>OFF</BlueText>
                {
                  ' to manually control when students get to see their scores.\n'
                }
              </Description>
            </Block>

            <Block id="maximum-attempts-allowed">
              <Title>Maximum Attempts Allowed </Title>
              <Body />
              <Description>
                <Input
                  type="number"
                  size="large"
                  defaultValue={maxAttempts}
                  onChange={this.updateAttempt}
                  min={1}
                  step={1}
                  style={{ width: '20%', marginRight: 30 }}
                />
              </Description>
            </Block>

            <Block id="require-safe-exame-browser">
              <Title>Require Safe Exam Browser</Title>
              <Body>
                <Switch />
              </Body>
              <Description>
                {
                  "Ensure secure testing environment by using Safe Exam Browser to lockdown the studen's device. To use this feature Safe Exam Browser (on Windows/Mac only) must be"
                }
              </Description>
            </Block>

            <Block id="show-questions">
              <Title>Show Questions to Students after Submission</Title>
              <Body>
                <Switch />
              </Body>
              <Description>
                {'Select '}
                <BlueText>OFF</BlueText>
                {
                  ', if you do not want students to see the assessment questions, responses, and the correct answers after they submit.'
                }
              </Description>
            </Block>

            <Block id="suffle-question">
              <Title>Shuffle Question</Title>
              <Body>
                <Switch defaultChecked />
              </Body>
              <Description>
                {'If '}
                <BlueText>ON</BlueText>
                {
                  ', then order of questions will be different for each student.'
                }
              </Description>
            </Block>

            <Block id="show-answer-choice">
              <Title>Shuffle Answer Choice</Title>
              <Body>
                <Switch defaultChecked />
              </Body>
              <Description>
                {'If set to '}
                <BlueText>ON</BlueText>
                {
                  ', answer choices for multiple choice and multiple select questions will be randomly shuffled for students.'
                }
                <br />
                {
                  'Text to speech does not work when the answer choices are shuffled.'
                }
              </Description>
            </Block>

            <Block id="show-calculator">
              <Title>Show Calculator</Title>
              <Body>
                <StyledRadioGroup
                  onChange={this.markHandler}
                  value={markAsDoneValue}
                >
                  <Radio value={1}>None</Radio>
                  <Radio value={2}>Scientific</Radio>
                  <Radio value={3}>Basic</Radio>
                  <Radio value={4}>Graphing</Radio>
                </StyledRadioGroup>
              </Body>
              <Description>
                {
                  'Choose if student can use a calculator, also select the type of calculator that would be shown to the students.'
                }
              </Description>
            </Block>

            <Block id="answer-on-paper">
              <Title>Answer on Paper</Title>
              <Body>
                <Switch defaultChecked />
              </Body>
              <Description>
                {
                  'Use this opinion if you are administering this assessment on paper. If you use this opinion, you will have to manually grade student responses after the assessment is closed.'
                }
              </Description>
            </Block>

            <Block id="require-password">
              <Title>Require Password</Title>
              <Body>
                <Switch defaultChecked />
              </Body>
              <Description>
                {
                  'Require your students to type a password when opening the assessment. Password ensures that your students can access this assessment only in the classroom.'
                }
              </Description>
            </Block>

            <Block id="evaluation-method">
              <Title>Evaluation Method</Title>
              <Body>
                <StyledRadioGroup
                  onChange={this.markHandler}
                  value={markAsDoneValue}
                >
                  <Radio value={1}>All or Nothing</Radio>
                  <Radio value={2}>Partial Credit</Radio>
                </StyledRadioGroup>
              </Body>
              <Description>
                {
                  'Choose if students should be awarded partial credit for their answers or not. If partial credit is allowed, then choose whether the student should be penalized for.'
                }
              </Description>
            </Block>

            <Block id="performance-bands">
              <Row style={{ marginBottom: 18 }}>
                <Col span={6}>
                  <BandsText>Performance Bands</BandsText>
                </Col>
                <Col
                  span={6}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <NormalText>Above or at Standard</NormalText>
                </Col>
                <Col
                  span={6}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <NormalText>From</NormalText>
                </Col>
                <Col
                  span={6}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <NormalText>To</NormalText>
                </Col>
              </Row>
              <List
                grid={{ column: 1 }}
                dataSource={data}
                renderItem={item => (
                  <List.Item>
                    <ListCard item={item} />
                  </List.Item>
                )}
              />
            </Block>
            <AdvancedSettings
              style={{ display: showAdvancedOption ? 'block' : 'none' }}
            >
              <Block id="title">
                <Title>Title</Title>
                <FlexBody>
                  <RadioGroup
                    onChange={this.markHandler}
                    value={markAsDoneValue}
                  >
                    <Radio value={1}>Enable</Radio>
                    <Radio value={2}>Disable</Radio>
                  </RadioGroup>
                </FlexBody>
                <Row gutter={28} style={{ marginBottom: 30 }}>
                  <Col span={12}>
                    <InputTitle>Activity Title</InputTitle>
                    <Input placeholder="Title of activity" />
                  </Col>
                  <Col span={12}>
                    <InputTitle>Activity Title</InputTitle>
                    <Input placeholder="Title of activity" />
                  </Col>
                </Row>
              </Block>

              <Block id="navigations">
                <Title>Navigation / Control</Title>
                <Body>
                  {navigations.map(navigation => (
                    <Row
                      key={navigation}
                      style={{ width: '100%', marginBottom: 25 }}
                    >
                      <Col span={8}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>
                          {navigation}
                        </span>
                      </Col>
                      <Col span={16}>
                        <RadioGroup
                          onChange={this.markHandler}
                          value={markAsDoneValue}
                        >
                          <Radio value={1}>Enable</Radio>
                          <Radio value={2}>Disable</Radio>
                        </RadioGroup>
                      </Col>
                    </Row>
                  ))}
                </Body>
                <Row gutter={28} style={{ marginBottom: 30 }}>
                  <Col span={12}>
                    <InputTitle>On Submit Redirect URL</InputTitle>
                    <Input placeholder="https://edulastic.com/" />
                  </Col>
                  <Col span={12}>
                    <InputTitle>On Discard Redirect URL</InputTitle>
                    <Input placeholder="https://edulastic.com/" />
                  </Col>
                  <Col span={12} style={{ paddingTop: 30 }}>
                    <InputTitle>On Save Redirect URL</InputTitle>
                    <Input placeholder="https://edulastic.com/" />
                  </Col>
                </Row>
              </Block>

              <Block id="accessibility">
                <Title>Accessibility</Title>
                <Body>
                  {accessibilities.map(accessibility => (
                    <Row
                      key={accessibility}
                      style={{ width: '100%', marginBottom: 25 }}
                    >
                      <Col span={8}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>
                          {accessibility}
                        </span>
                      </Col>
                      <Col span={16}>
                        <RadioGroup
                          onChange={this.markHandler}
                          value={markAsDoneValue}
                        >
                          <Radio value={1}>Enable</Radio>
                          <Radio value={2}>Disable</Radio>
                        </RadioGroup>
                      </Col>
                    </Row>
                  ))}
                </Body>
              </Block>

              <UiTime />

              <Block id="administration">
                <Title>Administration</Title>
                <Body>
                  <Row style={{ width: '100%', marginBottom: 25 }}>
                    <Col span={8}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>
                        Configuration Panel
                      </span>
                    </Col>
                    <Col span={16}>
                      <RadioGroup
                        onChange={this.markHandler}
                        value={markAsDoneValue}
                      >
                        <Radio value={1}>Enable</Radio>
                        <Radio value={2}>Disable</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>

                  <Row gutter={28} style={{ marginBottom: 30 }}>
                    <Col span={12}>
                      <InputTitle>Password</InputTitle>
                      <Input placeholder="Your Password" />
                    </Col>
                  </Row>

                  <Row style={{ width: '100%', marginBottom: 25 }}>
                    <Col span={8}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>
                        Save & Quit
                      </span>
                    </Col>
                    <Col span={16}>
                      <RadioGroup
                        onChange={this.markHandler}
                        value={markAsDoneValue}
                      >
                        <Radio value={1}>Enable</Radio>
                        <Radio value={2}>Disable</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>

                  <Row style={{ width: '100%', marginBottom: 25 }}>
                    <Col span={8}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>
                        Exit & Discard
                      </span>
                    </Col>
                    <Col span={16}>
                      <RadioGroup
                        onChange={this.markHandler}
                        value={markAsDoneValue}
                      >
                        <Radio value={1}>Enable</Radio>
                        <Radio value={2}>Disable</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>

                  <Row style={{ width: '100%', marginBottom: 25 }}>
                    <Col span={8}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>
                        Extend Assessment Time
                      </span>
                    </Col>
                    <Col span={16}>
                      <RadioGroup
                        onChange={this.markHandler}
                        value={markAsDoneValue}
                      >
                        <Radio value={1}>Enable</Radio>
                        <Radio value={2}>Disable</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>
                </Body>
              </Block>
            </AdvancedSettings>

            <AdvancedButton>
              <Line />
              <Button onClick={() => this.advancedHandler()}>
                {showAdvancedOption
                  ? 'HIDE ADVANCED OPTIONS'
                  : 'SHOW ADVANCED OPTIONS'}
              </Button>
              <Line />
            </AdvancedButton>
          </Col>
        </Row>
      </Paper>
    );
  }
}

MainSetting.propTypes = {
  history: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  setMaxAttempts: PropTypes.func.isRequired,
  maxAttempts: PropTypes.number.isRequired
};

export default connect(
  state => ({
    maxAttempts: getMaxAttemptSelector(state)
  }),
  { setMaxAttempts: setMaxAttemptsAction }
)(MainSetting);

const StyledAnchor = styled(Anchor)`
  .ant-anchor-link {
    padding: 20px 30px;
  }

  .ant-anchor-link-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #b1b1b1;
  }

  .ant-anchor-link-title-active {
    color: #00b0ff;
  }

  .ant-anchor-ink-ball {
    border: 2px solid #00b0ff;
  }
`;

const Block = styled.div`
  margin-bottom: 30px;
  border-bottom: 1px solid lightgrey;

  .ant-input {
    height: 40px;
    font-size: 13px;
    border-radius: 4px;

    ::placeholder {
      font-style: italic;
    }
  }
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #4aac8b;
`;

const Body = styled.div`
  margin-top: 30px;
  margin-bottom: 22px;
`;

const FlexBody = styled.div`
  display: flex;
  margin-top: 30px;
  margin-bottom: 22px;
`;

const Description = styled.div`
  font-size: 13px;
  color: #444444;
  margin-bottom: 30px;
`;

const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-direction: column;

  span {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }

  .ant-radio {
    margin-right: 25px;
  }

  .ant-radio-wrapper {
    margin-bottom: 18px;
  }
`;

const RadioGroup = styled(Radio.Group)`
  display: flex;

  span {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }

  .ant-radio {
    margin-right: 25px;
  }

  .ant-radio-wrapper {
    margin-bottom: 18px;
    margin-right: 40px;
  }
`;

const BlueText = styled.span`
  color: #00b0ff;
  font-weight: 600;
`;

const BandsText = styled.span`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #4aac8b;
`;

const NormalText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #434b5d;
`;

const InputTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #434b5d;
  margin-bottom: 12px;
`;

const AdvancedSettings = styled.div``;

const AdvancedButton = styled.div`
  display: flex;
  justify-content: space-between;

  .ant-btn {
    height: 40px;
    width: 225px;
    font-size: 11px;
    font-weight: 600;
    color: #00b0ff;
    border: 1px solid;
  }
`;

const Line = styled.div`
  border-top: 1px solid #00b0ff;
  width: calc((100% - 285px) / 2);
  position: relative;
  top: 20px;
`;
