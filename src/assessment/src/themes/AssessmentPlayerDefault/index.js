import PropTypes from 'prop-types';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import QuestionSelectDropdown from '../common/QuestionSelectDropdown';
import MainWrapper from './MainWrapper';
import HeaderLeftMenu from '../common/HeaderLeftMenu';
import HeaderMainMenu from '../common/HeaderMainMenu';
import HeaderRightMenu from '../common/HeaderRightMenu';
import LogoImage from '../../assets/logo.png';
import SettingImage from '../../assets/screwdriver.png';
import {
  ControlBtn,
  Main,
  Header,
  Container,
  Logo,
  FlexContainer,
} from '../common';
import QuestionWrapper from '../../components/QuestionWrapper';

/* eslint import/no-webpack-loader-syntax: off */
// eslint-disable-next-line
const defaultTheme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../../styles/vars.scss');

class AssessmentPlayerDefault extends React.Component {
  static propTypes = {
    theme: PropTypes.object,
    questions: PropTypes.array.isRequired,
    currentQuestion: PropTypes.number,
    isLast: PropTypes.func,
    isFirst: PropTypes.func,
    moveToNext: PropTypes.func,
    moveToPrev: PropTypes.func,
    questionSelectChange: PropTypes.func,
  };

  static defaultProps = {
    theme: defaultTheme,
  };

  render() {
    const {
      questions,
      currentQuestion,
      theme,
      isLast,
      isFirst,
      moveToNext,
      moveToPrev,
      gotoQuestion,
    } = this.props;
    const dropDownQuizOptions = questions.map((item, index) => ({
      value: index,
    }));

    const survey = questions[currentQuestion] || {};
    const { type } = survey;
    return (
      <ThemeProvider theme={theme}>
        <Container>
          <Header>
            <HeaderLeftMenu>
              <Logo src={LogoImage} alt="Logo" />
            </HeaderLeftMenu>
            <HeaderMainMenu skin>
              <FlexContainer>
                <QuestionSelectDropdown
                  key={currentQuestion}
                  value={currentQuestion}
                  gotoQuestion={gotoQuestion}
                  options={dropDownQuizOptions}
                />
                <ControlBtn prev skin disabled={isFirst()} onClick={moveToPrev}>
                  <i className="fa fa-angle-left" />
                </ControlBtn>
                <ControlBtn next skin disabled={isLast()} onClick={moveToNext}>
                  <i className="fa fa-angle-right" />
                </ControlBtn>
                <ControlBtn setting skin>
                  <img src={SettingImage} alt="Setting" />
                </ControlBtn>
              </FlexContainer>
              <FlexContainer />
            </HeaderMainMenu>
            <HeaderRightMenu skin />
          </Header>
          <Main skin>
            <MainWrapper>
              <QuestionWrapper
                type={type}
                view="preview"
                key={type}
                data={survey}
              />
            </MainWrapper>
          </Main>
        </Container>
      </ThemeProvider>
    );
  }
}

export default AssessmentPlayerDefault;
