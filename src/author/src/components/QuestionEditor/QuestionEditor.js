import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from '@edulastic/localization';
import { Paper } from '@edulastic/common';

import SourceModal from './SourceModal';
import { changePreviewTabAction } from '../../actions/preview';
import { getPreivewTabSelector } from '../../selectors/preview';
import { changeViewAction } from '../../actions/view';
import { getViewSelector } from '../../selectors/view';
import { Container } from './styled_components';
import { ButtonBar } from '../common';
import QuestionWrapper from '../../../../assessment/src/components/QuestionWrapper';
import ItemHeader from './ItemHeader';
import { getQuestionSelector } from '../../selectors/question';
import {
  receiveQuestionByIdAction,
  saveQuestionAction,
  setQuestionDataAction,
} from '../../actions/question';

const headerTitles = {
  multipleChoice: 'MultipleChoice',
  orderList: 'Order List',
};

class QuestionEditor extends Component {
  state = {
    showModal: false,
    saveClicked: false,
  };

  componentDidMount() {
    const { match, receiveQuestionById } = this.props;
    if (match.params.id) {
      receiveQuestionById(match.params.id);
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

  render() {
    const { view, changePreviewTab, previewTab, question, history } = this.props;
    const itemId = question === null ? '' : question.id;
    const questionType = this.getQuestionType();
    const { showModal, saveClicked } = this.state;

    return (
      <Container>
        {showModal && (
          <SourceModal onClose={this.handleHideSource} onApply={this.handleApplySource}>
            {JSON.stringify(question.data, null, 4)}
          </SourceModal>
        )}
        <ItemHeader
          title={headerTitles[questionType]}
          link={{ url: history.location.state.backUrl, text: history.location.state.backText }}
          reference={itemId}
        >
          <ButtonBar
            onChangeView={this.handleChangeView}
            onShowSource={this.handleShowSource}
            changePreviewTab={changePreviewTab}
            onSave={this.handleSave}
            view={view}
            previewTab={previewTab}
          />
        </ItemHeader>
        <Paper>
          {question && (
            <QuestionWrapper
              type={questionType}
              view={view}
              key={questionType && view && saveClicked}
              data={question.data}
              saveClicked={saveClicked}
            />
          )}
        </Paper>
      </Container>
    );
  }
}

QuestionEditor.propTypes = {
  view: PropTypes.string.isRequired,
  changeView: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  previewTab: PropTypes.string.isRequired,
  question: PropTypes.object,
  match: PropTypes.object,
  receiveQuestionById: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  saveQuestion: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
};

QuestionEditor.defaultProps = {
  question: null,
  match: {},
};

const enhance = compose(
  withRouter,
  withNamespaces('author'),
  connect(
    state => ({
      view: getViewSelector(state),
      previewTab: getPreivewTabSelector(state),
      question: getQuestionSelector(state),
    }),
    {
      changeView: changeViewAction,
      changePreviewTab: changePreviewTabAction,
      receiveQuestionById: receiveQuestionByIdAction,
      saveQuestion: saveQuestionAction,
      setQuestionData: setQuestionDataAction,
    },
  ),
);

export default enhance(QuestionEditor);
