import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Affix } from 'antd';
import { withWindowSizes } from '@edulastic/common';
import { IconSend } from '@edulastic/icons';
import QuestionSelectDropdown from '../common/QuestionSelectDropdown';
import MainWrapper from './MainWrapper';
import HeaderLeftMenu from '../common/HeaderLeftMenu';
import HeaderMainMenu from '../common/HeaderMainMenu';
import HeaderRightMenu from '../common/HeaderRightMenu';
import ToolbarModal from '../common/ToolbarModal';
import SavePauseModalMobile from '../common/SavePauseModalMobile';
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
  SaveAndExit,
  SavePauseMobile
} from '../common';
import TestItemPreview from '../../components/TestItemPreview';
import {
  LARGE_DESKTOP_WIDTH,
  MEDIUM_DESKTOP_WIDTH,
  IPAD_PORTRAIT_WIDTH
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
      isSubmitConfirmationVisible: false,
      isSavePauseModalVisible: false
    };
  }

  static propTypes = {
    theme: PropTypes.object,
    isFirst: PropTypes.func.isRequired,
    isLast: PropTypes.func.isRequired,
    moveToNext: PropTypes.func.isRequired,
    moveToPrev: PropTypes.func.isRequired,
    currentItem: PropTypes.any.isRequired,
    items: PropTypes.any.isRequired,
    gotoQuestion: PropTypes.any.isRequired,
    itemRows: PropTypes.array.isRequired,
    evaluation: PropTypes.any.isRequired,
    checkAnswer: PropTypes.func.isRequired,
    changePreview: PropTypes.func.isRequired,
    getItemDetailById: PropTypes.func.isRequired,
    history: PropTypes.func.isRequired,
    windowWidth: PropTypes.number.isRequired
  };

  static defaultProps = {
    theme: defaultTheme
  };

  componentDidMount() {
    const { getItemDetailById, items, currentItem } = this.props;
    if (items[currentItem] !== undefined) {
      getItemDetailById(items[currentItem]._id, {
        data: true,
        validation: true
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentItem, items, getItemDetailById } = this.props;
    if (currentItem !== nextProps.currentItem) {
      getItemDetailById(items[nextProps.currentItem]._id, {
        data: true,
        validation: true
      });
    }
  }

  changeTabItemState = (value) => {
    const { checkAnswer, changePreview } = this.props;
    checkAnswer();

    changePreview(value);
    this.setState({ testItemState: value });
  };

  closeToolbarModal = () => {
    this.setState({ isToolbarModalVisible: false });
  };

  closeSavePauseModal = () => {
    this.setState({ isSavePauseModalVisible: false });
  };

  openSavePauseModal = () => {
    this.setState({ isSavePauseModalVisible: true });
  };

  openSubmitConfirmation = () => {
    this.setState({ isSubmitConfirmationVisible: true });
  };

  closeSubmitConfirmation = () => {
    this.setState({ isSubmitConfirmationVisible: false });
  };

  finishTest = () => {
    const { history } = this.props;
    history.push('/home/assignments');
  };

  finishTest = () => {
    const { history } = this.props;
    history.push('/home/assignments');
  };

  finishTest = () => {
    const { history } = this.props;
    history.push('/home/assignments');
  };

  render() {
    const {
      theme,
      items,
      isFirst,
      isLast,
      moveToNext,
      moveToPrev,
      gotoQuestion,
      currentItem,
      itemRows,
      evaluation,
      windowWidth
    } = this.props;

    const {
      testItemState,
      isToolbarModalVisible,
      isSubmitConfirmationVisible,
      isSavePauseModalVisible
    } = this.state;

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
          <ToolbarModal
            isVisible={isToolbarModalVisible}
            onClose={() => this.closeToolbarModal()}
            checkanswer={() => this.changeTabItemState('check')}
          />
          <SavePauseModalMobile
            isVisible={isSavePauseModalVisible}
            onClose={this.closeSavePauseModal}
            onExitClick={this.openSubmitConfirmation}
          />
          <SubmitConfirmation
            isVisible={isSubmitConfirmationVisible}
            onClose={() => this.closeSubmitConfirmation()}
            finishTest={this.finishTest}
          />
          <Affix>
            <Header>
              <HeaderLeftMenu>
                <LogoCompact />
                {windowWidth < IPAD_PORTRAIT_WIDTH && (
                  <Fragment>
                    <Clock />
                    <SavePauseMobile
                      openSavePauseModal={this.openSavePauseModal}
                      isVisible={isSavePauseModalVisible}
                    />
                  </Fragment>
                )}
              </HeaderLeftMenu>
              <HeaderMainMenu skin>
                <FlexContainer
                  style={{
                    justifyContent:
                      windowWidth < IPAD_PORTRAIT_WIDTH && 'space-between'
                  }}
                >
                  <QuestionSelectDropdown
                    key={currentItem}
                    currentItem={currentItem}
                    gotoQuestion={gotoQuestion}
                    options={dropdownOptions}
                  />

                  <FlexContainer
                    style={{
                      flex: 1,
                      justifyContent:
                        windowWidth < IPAD_PORTRAIT_WIDTH && 'flex-end'
                    }}
                  >
                    <ControlBtn
                      prev
                      skin
                      type="primary"
                      icon="left"
                      disabled={isFirst()}
                      onClick={moveToPrev}
                    />
                    <ControlBtn
                      next
                      skin
                      type="primary"
                      icon={!isLast() && 'right'}
                      onClick={moveToNext}
                    >
                      {isLast() && <IconSend />}
                    </ControlBtn>
                    {windowWidth < LARGE_DESKTOP_WIDTH && (
                      <ToolButton
                        next
                        skin
                        size="large"
                        type="primary"
                        icon="tool"
                        onClick={() => {
                          this.setState({ isToolbarModalVisible: true });
                        }}
                      />
                    )}
                    {windowWidth >= MEDIUM_DESKTOP_WIDTH && (
                      <TestButton
                        checkAnwser={() => this.changeTabItemState('check')}
                      />
                    )}
                    {windowWidth >= LARGE_DESKTOP_WIDTH && <ToolBar />}
                    {windowWidth >= IPAD_PORTRAIT_WIDTH && <Clock />}
                    {windowWidth >= IPAD_PORTRAIT_WIDTH && (
                      <SaveAndExit
                        finishTest={() => this.openSubmitConfirmation()}
                      />
                    )}
                  </FlexContainer>
                </FlexContainer>
                <FlexContainer />
              </HeaderMainMenu>
              <HeaderRightMenu skin />
            </Header>
          </Affix>
          <Main skin>
            <MainWrapper>
              {testItemState === '' && <TestItemPreview cols={itemRows} />}
              {testItemState === 'check' && (
                <TestItemPreview
                  cols={itemRows}
                  previewTab="check"
                  evaluation={evaluation}
                  verticalDivider={item.verticalDivider}
                  scrolling={item.scrolling}
                />
              )}
            </MainWrapper>
          </Main>
        </Container>
      </ThemeProvider>
    );
  }
}

const enhance = compose(
  withRouter,
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
