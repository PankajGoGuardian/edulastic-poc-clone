import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Anchor, Row, Col, Radio, Switch, List } from 'antd';
import { Paper } from '@edulastic/common';

import ListCard from './Card';

const settingCategories = [
  { id: 'mark-as-done', title: 'MARK AS DONE' },
  { id: 'release-scores', title: 'RELEASE SCORES' },
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
  { id: 'administration', title: 'ADMINISTRATION' },
];

const data = [
  {
    bands: 'Advanced',
    from: '100%',
  },
  {
    bands: 'Mastery',
    from: '100%',
  },
  {
    bands: 'Basic',
    from: '100%',
  },
  {
    bands: 'Approaching Basic',
    from: '100%',
  },
  {
    bands: 'Unsatisfactory',
    from: '100%',
  },
];


class MainSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markAsDoneValue: 1,
    };
  }

  markHandler = (e) => {
    this.setState({ markAsDoneValue: e.target.value });
  }

  render() {
    const { markAsDoneValue } = this.state;
    const { history } = this.props;
    return (
      <Paper style={{ marginTop: 27 }}>
        <Row>
          <Col span={6}>
            <StyledAnchor affix={false}>
              {
                settingCategories.map(category => (
                  <Anchor.Link href={`${history.location.pathname}#${category.id}`} title={category.title} />
                ))
              }
            </StyledAnchor>
          </Col>
          <Col span={18}>
            <Block>
              <Title>Mark as Done</Title>
              <Body>
                <StyledRadioGroup onChange={this.markHandler} value={markAsDoneValue}>
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

            <Block>
              <Title>Release Scores</Title>
              <Body>
                <Switch />
              </Body>
              <Description>
                {'Select '}<BlueText>ON</BlueText>{' for students to see their scores instantly after submission.'}<br />
                {'Select '}<BlueText>OFF</BlueText>{' to manually control when students get to see their scores.\n'}
              </Description>
            </Block>

            <Block>
              <Title>Require Safe Exam Browser</Title>
              <Body>
                <Switch />
              </Body>
              <Description>
                {'Ensure secure testing environment by using Safe Exam Browser to lockdown the studen\'s device. To use this feature Safe Exam Browser (on Windows/Mac only) must be'}
              </Description>
            </Block>

            <Block>
              <Title>Show Questions to Students after Submission</Title>
              <Body>
                <Switch />
              </Body>
              <Description>
                {'Select '}<BlueText>OFF</BlueText>{', if you do not want students to see the assessment questions, responses, and the correct answers after they submit.'}
              </Description>
            </Block>

            <Block>
              <Title>Shuffle Question</Title>
              <Body>
                <Switch defaultChecked />
              </Body>
              <Description>
                {'If '}<BlueText>ON</BlueText>{', then order of questions will be different for each student.'}
              </Description>
            </Block>

            <Block>
              <Title>Shuffle Answer Choice</Title>
              <Body>
                <Switch defaultChecked />
              </Body>
              <Description>
                {'If set to '}<BlueText>ON</BlueText>{', answer choices for multiple choice and multiple select questions will be randomly shuffled for students.'}<br />
                {'Text to speech does not work when the answer choices are shuffled.'}
              </Description>
            </Block>

            <Block>
              <Title>Show Calculator</Title>
              <Body>
                <StyledRadioGroup onChange={this.markHandler} value={markAsDoneValue}>
                  <Radio value={1}>None</Radio>
                  <Radio value={2}>Scientific</Radio>
                  <Radio value={3}>Basic</Radio>
                  <Radio value={4}>Graphing</Radio>
                </StyledRadioGroup>
              </Body>
              <Description>
                {'Choose if student can use a calculator, also select the type of calculator that would be shown to the students.'}
              </Description>
            </Block>

            <Block>
              <Title>Answer on Paper</Title>
              <Body>
                <Switch defaultChecked />
              </Body>
              <Description>
                {'Use this opinion if you are administering this assessment on paper. If you use this opinion, you will have to manually grade student responses after the assessment is closed.'}
              </Description>
            </Block>

            <Block>
              <Title>Require Password</Title>
              <Body>
                <Switch defaultChecked />
              </Body>
              <Description>
                {'Require your students to type a password when opening the assessment. Password ensures that your students can access this assessment only in the classroom.'}
              </Description>
            </Block>

            <Block id="evaluation-method">
              <Title>Evaluation Method</Title>
              <Body>
                <StyledRadioGroup onChange={this.markHandler} value={markAsDoneValue}>
                  <Radio value={1}>All or Nothing</Radio>
                  <Radio value={2}>Partial Credit</Radio>
                </StyledRadioGroup>
              </Body>
              <Description>
                {'Choose if students should be awarded partial credit for their answers or not. If partial credit is allowed, then choose whether the student should be penalized for.'}
              </Description>
            </Block>

            <Block>
              <Row style={{ marginBottom: 18 }}>
                <Col span={6}>
                  <BandsText>Performance Bands</BandsText>
                </Col>
                <Col span={6} style={{ display: 'flex', justifyContent: 'center' }}>
                  <NormalText>Above or at Standard</NormalText>
                </Col>
                <Col span={6} style={{ display: 'flex', justifyContent: 'center' }}>
                  <NormalText>From</NormalText>
                </Col>
                <Col span={6} style={{ display: 'flex', justifyContent: 'center' }}>
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
          </Col>
        </Row>
      </Paper>
    );
  }
}

MainSetting.propTypes = {
  history: PropTypes.func.isRequired,
};

export default MainSetting;

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

// const ShowAdvancedContainer = styled.div`

// `;
