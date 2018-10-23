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
  FlexContainer
} from '../common';
import TestItemPreview from '../../components/TestItemPreview';

/* eslint import/no-webpack-loader-syntax: off */
// eslint-disable-next-line
const defaultTheme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../../styles/vars.scss');

class AssessmentPlayerDefault extends React.Component {
  static propTypes = {
    theme: PropTypes.object,
    isLast: PropTypes.func.isRequired,
    isFirst: PropTypes.func.isRequired,
    moveToNext: PropTypes.func.isRequired,
    moveToPrev: PropTypes.func.isRequired,
    currentItem: PropTypes.any.isRequired,
    items: PropTypes.any.isRequired,
    gotoQuestion: PropTypes.any.isRequired
  };

  static defaultProps = {
    theme: defaultTheme
  };

  render() {
    const {
      theme,
      isLast,
      items,
      isFirst,
      moveToNext,
      moveToPrev,
      gotoQuestion,
      currentItem,
      itemRows
    } = this.props;

    const dropdownOptions = Array.isArray(items)
      ? items.map((item, index) => index)
      : [];

    const item = items[currentItem];
    if (!item) {
      return <div />;
    }
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
                  key={currentItem}
                  currentItem={currentItem}
                  gotoQuestion={gotoQuestion}
                  options={dropdownOptions}
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
              <TestItemPreview cols={itemRows} />
            </MainWrapper>
          </Main>
        </Container>
      </ThemeProvider>
    );
  }
}

export default AssessmentPlayerDefault;
