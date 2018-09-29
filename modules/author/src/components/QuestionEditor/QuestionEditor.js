import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import SourceModal from './SourceModal';
import OrderList from '../OrderList';
import MultipleChoice from '../MultipleChoice';
import { changePreviewTabAction } from '../../actions/preview';
import { getPreivewTabSelector } from '../../selectors/preview';
import { getItemSelector } from '../../selectors/items';
import { changeViewAction } from '../../actions/view';
import { getViewSelector } from '../../selectors/view';
import { receiveItemByIdAction } from '../../actions/items';
import { Container } from './styled_components';
import { translate } from '../../utils/localization';
import { ButtonBar, ItemHeader, Paper } from '../common';
import { setQuestionsStateAction } from '../../actions/questionsOrderList';
import { getQuestionsStateSelector } from '../../selectors/questionsOrderList';
import { addQuestion } from '../../actions/questions';
import {
  QUESTION_PROBLEM,
  QUESTION_OPTIONS,
  QUESTION_ANSWERS,
  ASSESSMENTID,
} from '../../constants/others';

const headerTitle = {
  mcq: 'MultipleChoice',
  orderlist: 'Order List',
};

class QuestionEditor extends Component {
  state = {
    showModal: false,
  };

  componentWillMount() {
    const { match, receiveItemById } = this.props;
    if (match.params !== undefined) {
      receiveItemById(match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('props chagned:', nextProps.item);
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

  onSaveClicked = () => {
    const { add } = this.props;
    console.log('save current question');
    const problem = localStorage.getItem(QUESTION_PROBLEM);
    const options = localStorage.getItem(QUESTION_OPTIONS);
    const answers = JSON.parse(localStorage.getItem(QUESTION_ANSWERS)) || [];
    const assessmentId = localStorage.getItem(ASSESSMENTID);
    const correctAnswer = [];
    answers.forEach((answer, index) => {
      if (answer) {
        correctAnswer.push(index);
      }
    });
    const question = {
      assessmentId,
      question: problem,
      options: JSON.parse(options),
      type: 'mcq',
      answer: JSON.stringify(correctAnswer),
    };
    add(question);
  }

  handleApplySource = (json) => {
    const { setQuestionsState } = this.props;
    try {
      const state = JSON.parse(json);
      setQuestionsState(state);
      this.handleHideSource();
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { view, changePreviewTab, previewTab, questionsData, item, type } = this.props;
    let questionType = type;
    console.log('editor type', type, item);
    const itemId = item === null ? '' : item.id;
    if (item !== {} && item !== null) {
      questionType = item.type;
    }
    const { showModal } = this.state;
    return (
      <Container>
        {showModal && (
          <SourceModal onClose={this.handleHideSource} onApply={this.handleApplySource}>
            {JSON.stringify(questionsData, null, 4)}
          </SourceModal>
        )}
        <ItemHeader
          hideIcon
          title={headerTitle[questionType]}
          link={{ url: '/author/items', text: translate('component.backToItemList') }}
          reference={itemId}
        >
          <ButtonBar
            onChangeView={this.handleChangeView}
            onShowSource={this.handleShowSource}
            changePreviewTab={changePreviewTab}
            onSave={this.onSaveClicked}
            view={view}
            previewTab={previewTab}
          />
        </ItemHeader>
        <Paper>
          {questionType === 'orderlist' && <OrderList view={view} />}
          {questionType === 'mcq' && <MultipleChoice view={view} />}
        </Paper>
      </Container>
    );
  }
}

QuestionEditor.propTypes = {
  questionsData: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  changeView: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  previewTab: PropTypes.string.isRequired,
  setQuestionsState: PropTypes.func.isRequired,
  item: PropTypes.object,
  add: PropTypes.func.isRequired,
  type: PropTypes.string,
  match: PropTypes.object,
  receiveItemById: PropTypes.func.isRequired,
};

QuestionEditor.defaultProps = {
  item: {},
  match: {},
  type: undefined,
};

const enhance = compose(
  connect(
    state => ({
      questionsData: getQuestionsStateSelector(state),
      view: getViewSelector(state),
      previewTab: getPreivewTabSelector(state),
      item: getItemSelector(state),
    }),
    {
      changeView: changeViewAction,
      changePreviewTab: changePreviewTabAction,
      setQuestionsState: setQuestionsStateAction,
      receiveItemById: receiveItemByIdAction,
      add: addQuestion,
    },
  ),
);

export default enhance(QuestionEditor);
