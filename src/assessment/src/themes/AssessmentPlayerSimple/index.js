import PropTypes from 'prop-types';
import React from 'react';
import { Line } from 'rc-progress';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { IconClockCircularOutline } from '@edulastic/icons';
import { IconSave } from '@edulastic/icons';
import MainWrapper from './MainWrapper';
import MainContent from './MainContent';
import MainFooter from './MainFooter';
import Sidebar from './Sidebar';
import ProgressContainer from './ProgressContainer';
import QuestionAttempt from './QuestionAttempt';
import TimeDuration from './TimeDuration';
import ResponsiveTestDuration from './ResponsiveTestDuration';
import QuitAssesment from './QuitAssesment';
import QuestionSelectDropdown from '../common/QuestionSelectDropdown';
import LogoImage from '../../assets/logo.png';
import SettingImage from '../../assets/screwdriver.png';
import SidebarQuestionList from './SidebarQuestionList';
import {
  Blank,
  ControlBtn,
  Main,
  Header,
  Container,
  Logo,
  DesktopMainMenu,
  FlexContainer,
  HeaderLeftMenu,
  HeaderMainMenu,
  HeaderRightMenu,
  MobileMainMenu
} from '../common';
import QuestionWrapper from '../../components/QuestionWrapper';

/* eslint import/no-webpack-loader-syntax: off */
// eslint-disable-next-line
const defaultTheme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../../styles/vars.scss');

class AssessmentPlayerSimple extends React.Component {
  static propTypes = {
    theme: PropTypes.object,
    // t: PropTypes.func.isRequired,
    questions: PropTypes.array.isRequired,
    currentQuestion: PropTypes.number.isRequired,
    isLast: PropTypes.func.isRequired,
    isFirst: PropTypes.func.isRequired,
    moveToNext: PropTypes.func.isRequired,
    moveToPrev: PropTypes.func.isRequired
  };

  static defaultProps = {
    theme: defaultTheme
  };

  render() {
    const {
      questions,
      currentQuestion,
      theme,
      // t,
      isLast,
      isFirst,
      moveToNext,
      moveToPrev,
      gotoQuestion
    } = this.props;
    const dropDownQuizOptions = questions.map((item, index) => ({
      value: index
    }));
    const survey = questions[currentQuestion] || {};
    const { type } = survey;
    const percent = Math.round(
      ((currentQuestion + 1) * 100) / dropDownQuizOptions.length
    );
    return (
      <ThemeProvider theme={theme}>
        <Container>
          <Header>
            <HeaderLeftMenu>
              <Logo src={LogoImage} alt="Logo" />
              <MobileMainMenu>
                <FlexContainer>
                  <ProgressContainer>
                    <Line
                      percent={percent}
                      strokeWidth="2"
                      strokeColor="#00b0ff"
                      trailWidth="2"
                      trailColor="#e2e2e2"
                    />
                  </ProgressContainer>
                  <Timer>
                    <Icon color="#756e6e" />
                    <ResponsiveTestDuration />
                  </Timer>
                </FlexContainer>
              </MobileMainMenu>
            </HeaderLeftMenu>
            <HeaderMainMenu skinB>
              <DesktopMainMenu>
                <FlexContainer>
                  <ProgressContainer>
                    <Line
                      percent={percent}
                      strokeWidth="1"
                      strokeColor="#00b0ff"
                      trailWidth="1"
                      trailColor="#e2e2e2"
                    />
                  </ProgressContainer>
                  <Time>
                    <QuestionAttempt />
                  </Time>
                  <Timer>
                    <Icon color="#756e6e" />
                    <TimeDuration />
                  </Timer>
                  <Timer>
                    <Save>
                      <IconSave color="#756e6e" />
                    </Save>
                    <Save>
                      <IconSave color="#756e6e" />
                    </Save>
                  </Timer>
                </FlexContainer>
              </DesktopMainMenu>
              <MobileMainMenu>
                <FlexContainer>
                  <QuestionSelectDropdown
                    key={currentQuestion}
                    value={currentQuestion}
                    onChange={gotoQuestion}
                    options={dropDownQuizOptions}
                  />
                  <ControlBtn
                    prev
                    skinB
                    disabled={isFirst()}
                    onClick={moveToPrev}
                  >
                    <i className="fa fa-angle-left" />
                  </ControlBtn>
                  <ControlBtn
                    next
                    skinB
                    disabled={isLast()}
                    onClick={moveToNext}
                  >
                    <i className="fa fa-angle-right" />
                    <span>Next</span>
                  </ControlBtn>
                  <ControlBtn setting skinB>
                    <img src={SettingImage} alt="Setting" />
                  </ControlBtn>
                </FlexContainer>
              </MobileMainMenu>
            </HeaderMainMenu>
            <HeaderRightMenu skinB>
              <DesktopMainMenu />
            </HeaderRightMenu>
          </Header>
          <Main skinB>
            <Blank />
            <MainWrapper>
              <MainContent>
                <QuestionWrapper
                  skin
                  type={type}
                  view="preview"
                  key={currentQuestion}
                  data={survey}
                />
              </MainContent>
              <MainFooter>
                <FlexContainer>
                  <QuitAssesment />
                  <ControlBtn next skinB disabled>
                    <span>CHECK ANSWER</span>
                  </ControlBtn>
                </FlexContainer>
                <FlexContainer>
                  <ControlBtn
                    prev
                    skinB
                    disabled={isFirst()}
                    onClick={moveToPrev}
                  >
                    <i className="fa fa-angle-left" />
                  </ControlBtn>
                  <ControlBtn
                    next
                    skinB
                    disabled={isLast()}
                    onClick={moveToNext}
                  >
                    <i className="fa fa-angle-right" />
                    <span>NEXT</span>
                    {/* <span>{t("common.layout.nextbtn")}</span> */}
                  </ControlBtn>
                </FlexContainer>
              </MainFooter>
            </MainWrapper>
            <Sidebar>
              <SidebarQuestionList
                questions={dropDownQuizOptions}
                selectedQuestion={currentQuestion}
                gotoQuestion={gotoQuestion}
              />
            </Sidebar>
            <Blank />
          </Main>
        </Container>
      </ThemeProvider>
    );
  }
}

export default AssessmentPlayerSimple;

const Icon = styled(IconClockCircularOutline)`
  margin: 10px 15px;
  width: 20px !important;
  height: 20px !important;
`;

const Time = styled.div`
  color: #756e6e;
  font-weight: bold;
  font-size: 14px;
  margin: 0px 30px 0px 20px;
`;

const Save = styled.div`
  color: #e2e2e2;
  background: #e2e2e2;
  border-radius: 5px;
  padding: 10px;
  margin-left: 20px;
`;

const Quit = styled.span`
  margin-left: 42px !important;
  font-weight: bold;
  font-size: 14px;
  color: #ee1658;
`;

const Timer = styled.div`
  display: flex;
`;
