import PropTypes from 'prop-types';
import React from 'react';
import { Line } from 'rc-progress';
import { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';

import { gotoQuestion } from '../../actions/questions';
import Assessment from '../Assessment';
import MainWrapper from './MainWrapper';
import MainContent from './MainContent';
import MainFooter from './MainFooter';
import Sidebar from './Sidebar';
import ProgressContainer from './ProgressContainer';
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
  MobileMainMenu,
} from '../common';
import QuestionWrapper from '../../../../assessment/src/components/QuestionWrapper';

/* eslint import/no-webpack-loader-syntax: off */
// eslint-disable-next-line
const defaultTheme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../../styles/vars.scss');

class AssessmentPlayerSimple extends Assessment {
  static propTypes = {
    theme: PropTypes.object,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    theme: defaultTheme,
  };

  render() {
    const { questions, currentQuestion, theme, t } = this.props;
    const dropDownQuizOptions = questions.map((item, index) => ({
      value: index,
    }));
    const survey = questions[currentQuestion] || {};
    const { type } = survey;
    const percent = Math.round(((currentQuestion + 1) * 100) / dropDownQuizOptions.length);
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
                    onChange={this.questionSelectChange}
                    options={dropDownQuizOptions}
                  />
                  <ControlBtn prev skinB disabled={this.isFirst()} onClick={this.moveToPrev}>
                    <i className="fa fa-angle-left" />
                  </ControlBtn>
                  <ControlBtn next skinB disabled={this.isLast()} onClick={this.moveToNext}>
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
                  <ControlBtn prev skinB disabled={this.isFirst()} onClick={this.moveToPrev}>
                    <i className="fa fa-angle-left" />
                  </ControlBtn>
                  <ControlBtn next skinB disabled={this.isLast()} onClick={this.moveToNext}>
                    <i className="fa fa-angle-right" />
                    <span>{t('common.layout.nextbtn')}</span>
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

const enhance = compose(
  withNamespaces('student'),
  connect(
    state => ({
      questions: state.questions.questions,
      currentQuestion: state.questions.currentQuestion,
    }),
    dispatch => ({
      gotoQuestion: (question) => {
        dispatch(gotoQuestion(question));
      },
    }),
  ),
);

export default enhance(AssessmentPlayerSimple);
