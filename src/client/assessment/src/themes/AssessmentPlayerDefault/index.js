import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Affix } from 'antd';
import { withWindowSizes } from '@edulastic/common';
import QuestionSelectDropdown from '../common/QuestionSelectDropdown';
import MainWrapper from './MainWrapper';
import HeaderLeftMenu from '../common/HeaderLeftMenu';
import HeaderMainMenu from '../common/HeaderMainMenu';
import HeaderRightMenu from '../common/HeaderRightMenu';
import ToolbarModal from '../common/ToolbarModal';
import SubmitConfirmation from '../common/SubmitConfirmation';
import {
  ControlBtn,
  ToolButton,
  Main,
  Header,
  Container,
  FlexContainer,
  LogoCompact,
  TestButton,
  ToolBar,
  Clock,
  SaveAndExit
} from '../common';
import TestItemPreview from '../../components/TestItemPreview';
import {
  LARGE_DESKTOP_WIDTH,
  MEDIUM_DESKTOP_WIDTH,
  MAX_MOBILE_WIDTH
} from '../../constants/others';

import { checkAnswerAction } from '../../../../author/src/actions/testItem';
import { changePreviewAction } from '../../../../author/src/actions/view';
import { getItemDetailByIdAction } from '../../../../author/src/actions/itemDetail';


/* eslint import/no-webpack-loader-syntax: off */
// eslint-disable-next-line
const defaultTheme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../../styles/vars.scss');

class AssessmentPlayerDefault extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testItemState: '',
      isToolbarModalVisible: false,
      isSubmitConfirmationVisible: false
    };
  }

  static propTypes = {
    theme: PropTypes.object,
    isFirst: PropTypes.func.isRequired,
    moveToNext: PropTypes.func.isRequired,
    moveToPrev: PropTypes.func.isRequired,
    currentItem: PropTypes.any.isRequired,
    items: PropTypes.any.isRequired,
    gotoQuestion: PropTypes.any.isRequired,
    itemRows: PropTypes.array.isRequired,
    finishTest: PropTypes.any.isRequired,
    evaluation: PropTypes.any.isRequired,
    checkAnswer: PropTypes.func.isRequired,
    changePreview: PropTypes.func.isRequired,
    getItemDetailById: PropTypes.func.isRequired,
    windowWidth: PropTypes.number.isRequired
  };

  static defaultProps = {
    theme: defaultTheme
  };

  componentDidMount() {
    const { getItemDetailById, items, currentItem } = this.props;
    if (items[currentItem] !== undefined) {
      getItemDetailById(items[currentItem]._id, { data: true, validation: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentItem, items, getItemDetailById } = this.props;
    if (currentItem !== nextProps.currentItem) {
      getItemDetailById(items[nextProps.currentItem]._id, { data: true, validation: true });
    }
  }

  changeTabItemState = (value) => {
    const { checkAnswer, changePreview } = this.props;
    checkAnswer();

    changePreview(value);
    this.setState({ testItemState: value });
  }

  closeToolbarModal = () => {
    this.setState({ isToolbarModalVisible: false });
  }

  openSubmitConfirmation = () => {
    this.setState({ isSubmitConfirmationVisible: true });
  }

  closeSubmitConfirmation = () => {
    this.setState({ isSubmitConfirmationVisible: false });
  }

  render() {
    const {
      theme,
      items,
      isFirst,
      moveToNext,
      moveToPrev,
      gotoQuestion,
      currentItem,
      itemRows,
      finishTest,
      evaluation,
      windowWidth
    } = this.props;

    const { testItemState, isToolbarModalVisible, isSubmitConfirmationVisible } = this.state;

    const dropdownOptions = Array.isArray(items) ? items.map((item, index) => index) : [];

    const item = items[currentItem];
    if (!item) {
      return <div />;
    }
    return (
      <ThemeProvider theme={theme}>
        <Container>
          <ToolbarModal
            isVisible={isToolbarModalVisible}
            onClose={() => this.closeToolbarModal()}
            checkanswer={() => this.changeTabItemState('check')}
          />
          <SubmitConfirmation
            isVisible={isSubmitConfirmationVisible}
            onClose={() => this.closeSubmitConfirmation()}
            finishTest={finishTest}
          />
          <Affix>
            <Header>
              <HeaderLeftMenu>
                <LogoCompact />
                { windowWidth < MAX_MOBILE_WIDTH && <Clock /> }
              </HeaderLeftMenu>
              <HeaderMainMenu skin>
                <FlexContainer style={{ justifyContent: windowWidth < MAX_MOBILE_WIDTH && 'space-between' }}>
                  <QuestionSelectDropdown
                    key={currentItem}
                    currentItem={currentItem}
                    gotoQuestion={gotoQuestion}
                    options={dropdownOptions}
                  />
                  <FlexContainer style={{ flex: 1, justifyContent: windowWidth < MAX_MOBILE_WIDTH && 'flex-end' }}>
                    <ControlBtn prev skin type="primary" icon="left" disabled={isFirst()} onClick={moveToPrev} />
                    <ControlBtn next skin type="primary" icon="right" onClick={moveToNext} />
                    { windowWidth < LARGE_DESKTOP_WIDTH && (
                      <ToolButton
                        next
                        skin
                        size="large"
                        type="primary"
                        icon="tool"
                        onClick={() => this.setState({ isToolbarModalVisible: true })}
                      />
                    )}
                    { windowWidth >= MEDIUM_DESKTOP_WIDTH && <TestButton checkAnwser={() => this.changeTabItemState('check')} /> }
                    { windowWidth >= LARGE_DESKTOP_WIDTH && <ToolBar /> }
                    { windowWidth >= MAX_MOBILE_WIDTH && <Clock /> }
                    { windowWidth >= MAX_MOBILE_WIDTH && <SaveAndExit finishTest={() => this.openSubmitConfirmation()} /> }
                  </FlexContainer>
                </FlexContainer>
                <FlexContainer />
              </HeaderMainMenu>
              <HeaderRightMenu skin />
            </Header>
          </Affix>
          <Main skin>
            <MainWrapper>
              {
                testItemState === '' &&
                <TestItemPreview cols={itemRows} />
              }
              {
                testItemState === 'check' && (
                <TestItemPreview
                  cols={itemRows}
                  previewTab="check"
                  evaluation={evaluation}
                  verticalDivider={item.verticalDivider}
                  scrolling={item.scrolling}
                />)
              }
            </MainWrapper>
          </Main>
        </Container>
      </ThemeProvider>
    );
  }
}

const enhance = compose(
  withWindowSizes,
  connect(
    state => ({
      evaluation: state.evluation,
      preview: state.view.preview
    }),
    {
      checkAnswer: checkAnswerAction,
      changePreview: changePreviewAction,
      getItemDetailById: getItemDetailByIdAction
    }
  )
);

export default enhance(AssessmentPlayerDefault);
