import PropTypes from 'prop-types';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';

import { gotoQuestion } from '../../../actions/questions';
import Assessment from '../../index';
import QuestionSelectDropdown from '../QuestionSelectDropdown';
import MainWrapper from './MainWrapper';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderLeftMenu from '../common/HeaderLeftMenu';
import HeaderMainMenu from '../common/HeaderMainMenu';
import HeaderRightMenu from '../common/HeaderRightMenu';
import FlexContainer from '../common/FlexContainer';
import Logo from '../common/Logo';
import Main from '../common/Main';
import ControlBtn from '../common/ControlBtn';
import LogoImage from '../../assets/logo.png';
import SettingImage from '../../assets/screwdriver.png';
import QuestionWrapper from '../QuestionWrapper';

/* eslint import/no-webpack-loader-syntax: off */
const defaultTheme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../../styles/vars.scss');

class AssessmentPlayerDefault extends Assessment {
  static propTypes = {
    theme: PropTypes.object,
  }

  static defaultProps = {
    theme: defaultTheme,
  };

  render() {
    let { questions, currentQuestion, theme } = this.props;
    const dropDownQuizOptions = questions.map((item, index) => {
      return {
        value: index,
      }
    });
    const survey = questions[currentQuestion] || {};
    const { type='', options=[], stimulus='' } = survey;

    return (
      <ThemeProvider theme={theme} >
        <Container>
          <Header>
            <HeaderLeftMenu>
              <Logo src={LogoImage} alt="Logo" />
            </HeaderLeftMenu>
            <HeaderMainMenu skin >
              <FlexContainer>
                <QuestionSelectDropdown
                  key={currentQuestion}
                  value={currentQuestion}
                  onChange={this.questionSelectChange}
                  options={dropDownQuizOptions}
                />
                <ControlBtn prev skin disabled={this.isFirst()} onClick={this.moveToPrev} >
                  <i className="fa fa-angle-left"></i>
                </ControlBtn>
                <ControlBtn next skin disabled={this.isLast()} onClick={this.moveToNext}>
                  <i className="fa fa-angle-right"></i>
                </ControlBtn>
                <ControlBtn setting skin >
                  <img src={SettingImage} alt="Setting" />
                </ControlBtn>
              </FlexContainer>
              <FlexContainer />
            </HeaderMainMenu>
            <HeaderRightMenu skin />
          </Header>
          <Main skin >
            <MainWrapper >
              <QuestionWrapper
                type={type}
                skin
                key={currentQuestion}
                options={options}
                question={stimulus}
              />
            </MainWrapper>
          </Main>
        </Container>
      </ThemeProvider>
    );
  };
};


const mapStateToProps = state => {
  return {
    questions: state.questions.questions,
    currentQuestion: state.questions.currentQuestion
  }
};

const mapDispatchToProps = dispatch => ({
  gotoQuestion: question => {
    dispatch(gotoQuestion(question));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssessmentPlayerDefault);
