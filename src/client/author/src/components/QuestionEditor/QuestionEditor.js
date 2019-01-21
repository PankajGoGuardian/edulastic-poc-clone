import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { withNamespaces } from '@edulastic/localization';
import { ContentWrapper, withWindowSizes } from '@edulastic/common';

import SourceModal from './SourceModal';
import { changeViewAction, changePreviewAction } from '../../actions/view';
import { getViewSelector } from '../../selectors/view';
import { MAX_MOBILE_WIDTH } from '../../constants/others';
import { ButtonBar, SecondHeadBar } from '../common';
import QuestionWrapper from '../../../../assessment/src/components/QuestionWrapper';
import QuestionMetadata from '../../../../assessment/src/components/QuestionMetadata';
import ItemHeader from './ItemHeader';
import { getQuestionSelector } from '../../selectors/question';
import { getItemIdSelector } from '../../selectors/itemDetail';
import { saveQuestionAction, setQuestionDataAction } from '../../actions/question';
import { checkAnswerAction, showAnswerAction } from '../../actions/testItem';

const headerTitles = {
  multipleChoice: 'Multiple Choice',
  orderList: 'Order List',
  sortList: 'Sort List',
  shortText: 'Short Text',
  essayPlainText: 'Essay with plain text',
  essayRichText: 'Essay with rich text',
  tokenhighlight: 'Token Highlight',
  hotspot: 'Hotspot',
  highlightImage: 'Highlight Image',
  shading: 'Shading',
  classification: 'Classification',
  matchList: 'Match List',
  choiceMatrix: 'Choice Matrix',
  clozeDragDrop: 'Cloze with Drag & Drop',
  clozeDropDown: 'Cloze with Drop Down',
  clozeText: 'Cloze with Text',
  clozeImageDragDrop: 'Label Image with Drag & Drop',
  clozeImageDropDown: 'Label Image with DropDown',
  clozeImageText: 'Label Image with Text',
  graph: 'Graphing',
  passage: 'passage',
  math: 'Math',
  formulaessay: 'Formula Essay'
};

class QuestionEditor extends Component {
  state = {
    showModal: false,
    saveClicked: false,
    previewTab: 'clear'
  };

  handleChangeView = (view) => {
    const { changeView } = this.props;
    changeView(view);
  };

  handleShowSource = () => {
    this.setState({ showModal: true });
  };

  handleShowSettings = () => {};

  handleHideSource = () => {
    this.setState({ showModal: false });
  };

  handleApplySource = (json) => {
    try {
      const state = JSON.parse(json);
      const { setQuestionData } = this.props;

      setQuestionData(state);
      this.handleHideSource();
    } catch (err) {
      console.error(err);
    }
  };

  handleSave = () => {
    const { saveQuestion } = this.props;
    saveQuestion();
  };

  getQuestionType = () => {
    const { question } = this.props;
    if (question !== null) {
      const questionType = question.data.type;
      return questionType;
    }
  };

  handleChangePreviewTab = (previewTab) => {
    const { checkAnswer, showAnswer, changePreview } = this.props;

    if (previewTab === 'check') {
      checkAnswer('edit');
    }
    if (previewTab === 'show') {
      showAnswer('edit');
    }

    changePreview(previewTab);

    this.setState({
      previewTab
    });
  };

  renderQuestion = (questionType) => {
    const { view, question, match, evaluation: evaluations } = this.props;
    const evaluation = evaluations[question.data.id];
    const { previewTab, saveClicked } = this.state;
    if (view === 'metadata') {
      return <QuestionMetadata />;
    }
    if (question) {
      return (
        <QuestionWrapper
          type={questionType}
          view={view}
          evaluation={evaluation}
          previewTab={previewTab}
          key={questionType && view && saveClicked}
          data={question.data}
          questionId={match.params._id}
          saveClicked={saveClicked}
        />
      );
    }
  };

  render() {
    const { view, question, windowWidth, testItemId } = this.props;
    const { previewTab, showModal } = this.state;
    const itemId = question === null ? '' : question._id;
    const questionType = this.getQuestionType();

    return (
      <div>
        {showModal && (
          <SourceModal onClose={this.handleHideSource} onApply={this.handleApplySource}>
            {JSON.stringify(question.data, null, 4)}
          </SourceModal>
        )}
        <ItemHeader title={headerTitles[questionType]} reference={itemId}>
          <ButtonBar
            onChangeView={this.handleChangeView}
            onShowSource={this.handleShowSource}
            onShowSettings={() => {}}
            changePreviewTab={this.handleChangePreviewTab}
            onSave={this.handleSave}
            view={view}
            previewTab={previewTab}
          />
        </ItemHeader>
        {windowWidth > MAX_MOBILE_WIDTH && (
          <SecondHeadBar
            onShowSource={this.handleShowSource}
            onShowSettings={this.handleShowSettings}
            onChangeView={this.handleChangeView}
            changePreviewTab={this.handleChangePreviewTab}
            onSave={this.handleSave}
            view={view}
            previewTab={previewTab}
            breadcrumb={[
              {
                title: 'ITEM DETAIL',
                to: `/author/items/${testItemId}/item-detail`
              },
              { title: headerTitles[questionType], to: '' }
            ]}
          />
        )}
        <ContentWrapper
          style={{
            padding: '0px 45px',
            overflow: 'visible'
            // height: 'calc(100vh - 135px)'
          }}
        >
          {this.renderQuestion(questionType)}
        </ContentWrapper>
      </div>
    );
  }
}

QuestionEditor.propTypes = {
  view: PropTypes.string.isRequired,
  evaluation: PropTypes.any.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  changePreview: PropTypes.func.isRequired,
  showAnswer: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  question: PropTypes.object,
  match: PropTypes.object,
  saveQuestion: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  testItemId: PropTypes.func.isRequired
};

QuestionEditor.defaultProps = {
  question: null,
  match: {}
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces('author'),
  connect(
    state => ({
      evaluation: state.evaluation,
      view: getViewSelector(state),
      question: getQuestionSelector(state),
      testItemId: getItemIdSelector(state)
    }),
    {
      changeView: changeViewAction,
      saveQuestion: saveQuestionAction,
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction,
      showAnswer: showAnswerAction,
      changePreview: changePreviewAction
    }
  )
);

export default enhance(QuestionEditor);
