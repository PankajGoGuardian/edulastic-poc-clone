import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from '@edulastic/localization';
import { ContentWrapper } from '@edulastic/common';

import SourceModal from './SourceModal';
import { changeViewAction } from '../../actions/view';
import { getDictCurriculumsAction, getDictStandardsForCurriculumAction } from '../../actions/dictionaries';
import { getViewSelector } from '../../selectors/view';
import { getCurriculumsListSelector, getStandardsListSelector } from '../../selectors/dictionaries';
import { ButtonBar } from '../common';
import QuestionWrapper from '../../../../assessment/src/components/QuestionWrapper';
import QuestionMetadata from '../../../../assessment/src/components/QuestionMetadata';
import ItemHeader from './ItemHeader';
import { getQuestionSelector } from '../../selectors/question';
import {
  receiveQuestionByIdAction,
  saveQuestionAction,
  setQuestionDataAction
} from '../../actions/question';
import selectData from '../TestPage/common/selectsData';

const headerTitles = {
  multipleChoice: 'MultipleChoice',
  orderList: 'Order List',
  sortList: 'Sort List',
  shortText: 'Short Text',
  essayPlainText: 'Essay with plain text',
  essayRichText: 'Essay with rich text',
  classification: 'Classification',
  matchList: 'Match List',
  clozeDragDrop: 'Cloze Drag & Drop',
  clozeImageDragDrop: 'Label Image with Drag & Drop'
};

class QuestionEditor extends Component {
  state = {
    showModal: false,
    saveClicked: false,
    previewTab: 'clear'
  };

  componentDidMount() {
    const { match, receiveQuestionById, curriculums, getDictCurriculums } = this.props;
    if (match.params.id) {
      receiveQuestionById(match.params.id);
    }
    if (curriculums.length === 0) {
      getDictCurriculums();
    }
  }

  handleChangeView = (view) => {
    const { changeView } = this.props;
    changeView(view);
  };

  handleShowSource = () => {
    this.setState({ showModal: true });
  };

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
    this.setState({
      previewTab
    });
  };

  renderQuestion = (questionType) => {
    const {
      view,
      question,
      match,
      curriculums,
      getDictStandardsForCurriculum,
      standards
    } = this.props;
    const { previewTab, saveClicked } = this.state;
    if (view === 'metadata') {
      return (
        <QuestionMetadata
          curriculums={curriculums}
          getStandards={getDictStandardsForCurriculum}
          standards={standards}
          allGradesObj={selectData.allGradesObj}
        />
      );
    }
    if (question) {
      return (
        <QuestionWrapper
          type={questionType}
          view={view}
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
    const { view, question } = this.props;
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
        <ContentWrapper
          style={{
            padding: '0px 45px',
            overflow: 'auto',
            height: 'calc(100% - 135px)'
          }}
        >
          { this.renderQuestion(questionType) }
        </ContentWrapper>
      </div>
    );
  }
}

QuestionEditor.propTypes = {
  view: PropTypes.string.isRequired,
  changeView: PropTypes.func.isRequired,
  question: PropTypes.object,
  match: PropTypes.object,
  receiveQuestionById: PropTypes.func.isRequired,
  saveQuestion: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  curriculums: PropTypes.array,
  standards: PropTypes.array,
  getDictCurriculums: PropTypes.func.isRequired,
  getDictStandardsForCurriculum: PropTypes.func.isRequired
};

QuestionEditor.defaultProps = {
  question: null,
  match: {},
  curriculums: [],
  standards: []
};

const enhance = compose(
  withRouter,
  withNamespaces('author'),
  connect(
    state => ({
      view: getViewSelector(state),
      question: getQuestionSelector(state),
      curriculums: getCurriculumsListSelector(state),
      standards: getStandardsListSelector(state)
    }),
    {
      changeView: changeViewAction,
      receiveQuestionById: receiveQuestionByIdAction,
      saveQuestion: saveQuestionAction,
      setQuestionData: setQuestionDataAction,
      getDictCurriculums: getDictCurriculumsAction,
      getDictStandardsForCurriculum: getDictStandardsForCurriculumAction
    }
  )
);

export default enhance(QuestionEditor);
