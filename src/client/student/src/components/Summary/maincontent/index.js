import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col, Button } from 'antd';

import Confirmation from './confirmation';
import AssignmentContentWrapper from '../../commonStyle/assignmentContentWrapper';

class SummaryTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonIdx: 0,
      isShowConfirmationModal: false
    };
  }

  handlerButton = (buttonIdx) => {
    this.setState({ buttonIdx });
  }

  handlerConfirmationModal = () => {
    this.setState(prevState => ({ isShowConfirmationModal: !prevState.isShowConfirmationModal }));
  }

  closeConfirmationModal = () => {
    this.setState({ isShowConfirmationModal: false });
  }

  render() {
    const { finishTest } = this.props;
    const { buttonIdx, isShowConfirmationModal } = this.state;
    return (
      <AssignmentContentWrapper style={{ margin: '24px 95px' }}>
        <Confirmation
          isVisible={isShowConfirmationModal}
          onClose={() => this.closeConfirmationModal()}
          finishTest={finishTest}
        />
        <Container>
          <Header>
            <Title>Congratulations, you reached out the end of the test!</Title>
            <TitleDescription>
              If you need to review your answers, select the question number you wish to review.
              A flag icon appears for any questions that you marked for review.
            </TitleDescription>
          </Header>
          <MainContent>
            <ColorDescription>
              <Row gutter={32} style={{ width: '100%' }}>
                <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                  <GreenMark />
                  <div style={{ marginLeft: 22 }}>
                    <Description>You have marked these questions.</Description>
                    <Description style={{ marginTop: -2 }}>
                      Review them before submitting your test.
                    </Description>
                  </div>
                </Col>
                <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                  <GrayMark />
                  <div style={{ marginLeft: 22 }}>
                    <Description>
                      Please review your skipped questions before submitting the test
                    </Description>
                  </div>
                </Col>
                <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                  <RedMark />
                  <div style={{ marginLeft: 22 }}>
                    <Description>You have marked for review these questions.</Description>
                    <Description style={{ marginTop: -2 }}>
                      Review them before submitting your test.
                    </Description>
                  </div>
                </Col>
              </Row>
            </ColorDescription>
            <Questions>
              <Options>
                <QuestionText>Questions</QuestionText>
                <StyledButton
                  onClick={() => this.handlerButton(0)}
                  enabled={buttonIdx === 0 && true}
                >
                  ALL
                </StyledButton>
                <StyledButton
                  onClick={() => this.handlerButton(1)}
                  enabled={buttonIdx === 1 && true}
                >
                  FLAGGED
                </StyledButton>
                <StyledButton
                  onClick={() => this.handlerButton(2)}
                  enabled={buttonIdx === 2 && true}
                >
                  SKIPPED
                </StyledButton>
              </Options>
              <QuestionBlock>
                <RedQuestionBlock><span>1</span></RedQuestionBlock>
                <RedQuestionBlock><span>2</span></RedQuestionBlock>
                <RedQuestionBlock><span>3</span></RedQuestionBlock>
                <RedQuestionBlock><span>4</span></RedQuestionBlock>
                <RedQuestionBlock><span>5</span></RedQuestionBlock>
              </QuestionBlock>
            </Questions>
          </MainContent>
          <Footer>
            <ShortDescription>
              Next Step: When you are done reviewing your answers, select Submit test. You cannot change your answers after you submit the test
            </ShortDescription>
            <SubmitButton type="primary" onClick={() => this.handlerConfirmationModal()}>
              SUBMIT
            </SubmitButton>
          </Footer>
        </Container>
      </AssignmentContentWrapper>
    );
  }
}

SummaryTest.propTypes = {
  finishTest: PropTypes.func.isRequired
};

export default SummaryTest;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 531px;
  margin-top: 52px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  letter-spacing: -1px;
  color: #434b5d;
  text-align: center;
`;

const TitleDescription = styled.div`
  margin-top: 13px;
  font-size: 13px;
  font-weight: 600;
  color: #434b5d;
  text-align: center;
`;

const MainContent = styled.div`
  margin-top: 22.5px;
  width: 100%;
  border-top: 1px solid #f2f2f2;
  padding-top: 38px;
  `;

const ColorDescription = styled.div`
  display: flex;
  justify-content: center;
`;

const GreenMark = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 2px;
  background-color: #1fe3a1;
`;

const GrayMark = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 2px;
  background-color: #b1b1b1;
`;

const RedMark = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 2px;
  background-color: #ee1658;
`;

const Description = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #878282;
`;

const Questions = styled.div`
  margin-top: 60px;
`;

const Options = styled.div`
  display: flex;
`;

const QuestionText = styled.div`
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  color: #434b5d;
`;

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  color: ${props => (props.enabled ? '#fff' : '#00b0ff')};
  border: 1px solid #00b0ff;
  border-radius: 4px;
  margin-left: 20px;
  min-width: 85px;
  background: ${props => (props.enabled ? '#00b0ff' : 'transparent')};
  &:focus, &:active {
    color: ${props => (props.enabled ? '#fff' : '#00b0ff')};
    background: ${props => (props.enabled ? '#00b0ff' : 'transparent')};
  }
  span {
    font-size: 10px;
    font-weight: 600;
  }
`;

const QuestionBlock = styled.div`
  display: flex;
  margin-top: 30px;
`;

const RedQuestionBlock = styled.div`
  width: 60px;
  height: 40px;
  border-radius: 4px;
  background-color: #ee1658;
  margin-right: 23px;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 0.3px;
  }
`;

const Footer = styled.div`
  margin-top: 186px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ShortDescription = styled.div`
  font-size: 12px;
  color: #1e1e1e;
`;

const SubmitButton = styled(Button)`
  margin: 62px 0px;
  width: 200px;
  height: 40px;
  border-radius: 4px;
  background-color: #12a6e8;
  span {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
  }
`;
