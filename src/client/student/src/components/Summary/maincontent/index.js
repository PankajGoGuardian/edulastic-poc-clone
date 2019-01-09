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
      <AssignmentContentWrapperSummary>
        <Confirmation
          isVisible={isShowConfirmationModal}
          onClose={this.closeConfirmationModal}
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
              <ColorDescriptionRow gutter={32}>
                <FlexCol lg={8} md={24}>
                  <GreenMark />
                  <SpaceLeft>
                    <Description>You have marked these questions.</Description>
                    <Description style={{ marginTop: -2 }}>
                      Review them before submitting your test.
                    </Description>
                  </SpaceLeft>
                </FlexCol>
                <FlexCol lg={8} md={24}>
                  <GrayMark />
                  <SpaceLeft>
                    <Description>
                      Please review your skipped questions before submitting the test
                    </Description>
                  </SpaceLeft>
                </FlexCol>
                <FlexCol lg={8} md={24}>
                  <RedMark />
                  <SpaceLeft>
                    <Description>You have marked for review these questions.</Description>
                    <Description style={{ marginTop: -2 }}>
                      Review them before submitting your test.
                    </Description>
                  </SpaceLeft>
                </FlexCol>
              </ColorDescriptionRow>
            </ColorDescription>
            <Questions>
              <Options>
                <QuestionText lg={8} md={24}>Questions</QuestionText>
                <Col lg={16} md={24}>
                  <AnsweredTypeButtonContainer>
                    <StyledButton
                      onClick={() => this.handlerButton(0)}
                      enabled={buttonIdx === 0}
                    >
                      ALL
                    </StyledButton>
                    <StyledButton
                      onClick={() => this.handlerButton(1)}
                      enabled={buttonIdx === 1}
                    >
                      FLAGGED
                    </StyledButton>
                    <StyledButton
                      onClick={() => this.handlerButton(2)}
                      enabled={buttonIdx === 2}
                    >
                      SKIPPED
                    </StyledButton>
                  </AnsweredTypeButtonContainer>
                </Col>
              </Options>
              <QuestionBlock>
                <QuestionColorBlock type={1} isVisible={buttonIdx === 0 || buttonIdx === 1}>
                  <span>1</span>
                </QuestionColorBlock>
                <QuestionColorBlock type={1} isVisible={buttonIdx === 0 || buttonIdx === 1}>
                  <span>2</span>
                </QuestionColorBlock>
                <QuestionColorBlock type={2} isVisible={buttonIdx === 0}>
                  <span>3</span>
                </QuestionColorBlock>
                <QuestionColorBlock type={3} isVisible={buttonIdx === 0 || buttonIdx === 2}>
                  <span>4</span>
                </QuestionColorBlock>
                <QuestionColorBlock type={2} isVisible={buttonIdx === 0}>
                  <span>5</span>
                </QuestionColorBlock>
                <QuestionColorBlock type={2} isVisible={buttonIdx === 0}>
                  <span>6</span>
                </QuestionColorBlock>
                <QuestionColorBlock type={1} isVisible={buttonIdx === 0 || buttonIdx === 1}>
                  <span>7</span>
                </QuestionColorBlock>
                <QuestionColorBlock type={1} isVisible={buttonIdx === 0 || buttonIdx === 1}>
                  <span>8</span>
                </QuestionColorBlock>
                <QuestionColorBlock type={2} isVisible={buttonIdx === 0}>
                  <span>9</span>
                </QuestionColorBlock>
                <QuestionColorBlock type={3} isVisible={buttonIdx === 0 || buttonIdx === 2}>
                  <span>10</span>
                </QuestionColorBlock>
              </QuestionBlock>
            </Questions>
          </MainContent>
          <Footer>
            <ShortDescription>
              Next Step: When you are done reviewing your answers, select Submit test. You cannot change your answers after you submit the test
            </ShortDescription>
            <SubmitButton type="primary" onClick={this.handlerConfirmationModal}>
              SUBMIT
            </SubmitButton>
          </Footer>
        </Container>
      </AssignmentContentWrapperSummary>
    );
  }
}

SummaryTest.propTypes = {
  finishTest: PropTypes.func.isRequired
};

export default SummaryTest;

const AssignmentContentWrapperSummary = styled(AssignmentContentWrapper)`
  margin: 24px 95px;
  @media screen and (max-width: 992px) {
    margin: 15px 26px;
  }
`;
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

const Markers = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 2px;
  flex-shrink: 0;
`;
const GreenMark = styled(Markers)`
background-color: #1fe3a1;
`;

const GrayMark = styled(Markers)`
  background-color: #b1b1b1;
`;

const RedMark = styled(Markers)`
  background-color: #ee1658;
`;

const Description = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #878282;
`;

const ColorDescriptionRow = styled(Row)`
  width:100%;
`;

const FlexCol = styled(Col)`
  display:flex;
  align-items:center;
`;

const SpaceLeft = styled.div`
  margin-left:22px;
`;

const Questions = styled.div`
  margin-top: 60px;
`;

const Options = styled(Row)`
`;

const QuestionText = styled(Col)`
  font-size: 16px;
  font-weight: bold;
  color: #434b5d;
`;

const AnsweredTypeButtonContainer = styled.div`
  @media screen and (min-width: 992px) {
    float:right;
    margin-right: -20px;
  }
`;

const StyledButton = styled(Button)`
  height: 24px;
  float:left;
  color: ${props => (props.enabled ? '#fff' : '#00b0ff')};
  border: 1px solid #00b0ff;
  border-radius: 4px;
  margin-right: 20px;
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
  @media screen and (max-width: 992px) {
    margin-top: 10px;
  }
`;

const QuestionBlock = styled.div`
  display: flex;
  flex-flow: wrap;
  margin-top: 30px;
`;

const QuestionColorBlock = styled.div`
  width: 60px;
  height: 40px;
  border-radius: 4px;
  background-color: ${props => (props.type === 1 ? '#ee1658' : props.type === 2 ? '#1fe3a1' : '#b1b1b1')};
  margin-right: 23px;
  display: ${props => (props.isVisible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  margin-top: 5px;

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
