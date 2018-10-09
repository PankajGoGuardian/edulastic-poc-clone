import PropTypes from "prop-types";
import React from "react";
import { Line } from "rc-progress";
import { ThemeProvider } from "styled-components";
import MainWrapper from "./MainWrapper";
import MainContent from "./MainContent";
import MainFooter from "./MainFooter";
import Sidebar from "./Sidebar";
import ProgressContainer from "./ProgressContainer";
import QuestionSelectDropdown from "../common/QuestionSelectDropdown";
import LogoImage from "../../assets/logo.png";
import SettingImage from "../../assets/screwdriver.png";
import SidebarQuestionList from "./SidebarQuestionList";
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
} from "../common";
import QuestionWrapper from "../../components/QuestionWrapper";

/* eslint import/no-webpack-loader-syntax: off */
// eslint-disable-next-line
const defaultTheme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../../styles/vars.scss');

class AssessmentPlayerSimple extends React.Component {
  static propTypes = {
    theme: PropTypes.object,
    // t: PropTypes.func.isRequired,
    questions: PropTypes.array.isRequired,
    currentQuestion: PropTypes.number,
    isLast: PropTypes.func,
    isFirst: PropTypes.func,
    moveToNext: PropTypes.func,
    moveToPrev: PropTypes.func,
    questionSelectChange: PropTypes.func
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
      questionSelectChange
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
                </FlexContainer>
              </MobileMainMenu>
            </HeaderLeftMenu>
            <HeaderMainMenu skinB>
              <DesktopMainMenu>
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
                </FlexContainer>
              </DesktopMainMenu>
              <MobileMainMenu>
                <FlexContainer>
                  <QuestionSelectDropdown
                    key={currentQuestion}
                    value={currentQuestion}
                    onChange={questionSelectChange}
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
                <FlexContainer />
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
                    {/* <span>{t("common.layout.nextbtn")}</span> */}
                  </ControlBtn>
                </FlexContainer>
              </MainFooter>
            </MainWrapper>
            <Sidebar>
              <SidebarQuestionList
                questions={dropDownQuizOptions}
                selectedQuestion={currentQuestion}
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
