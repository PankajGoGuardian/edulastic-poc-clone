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
import { receiveItemByIdAction, updateItemByIdAction } from '../../actions/items';
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
    const { add, item, updateItemById } = this.props;
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
    // eslint-disable-next-line
    updateItemById({ ...item, id: item._id, reference: item.id, stimulus: problem, list: JSON.parse(options), validation: { valid_response:  JSON.stringify(correctAnswer) } });
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
    const { view, changePreviewTab, previewTab, questionsData, item, type, history } = this.props;
    let questionType = type;
    const itemId = item === null ? '' : item.id;
    if (item !== {} && item !== null) {
      questionType = item.type;
    }
    let editable = false;
    if (localStorage.getItem('PickUpQuestionType')) {
      editable = true;
    }
    console.log('editable:', editable, history);
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
          {questionType === 'orderList' && <OrderList view={view} />}
          {questionType === 'mcq' && <MultipleChoice view={view} isNew={editable} />}
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
  updateItemById: PropTypes.func.isRequired,
  history: PropTypes.object,
};

QuestionEditor.defaultProps = {
  item: {},
  match: {},
  history: {},
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
      updateItemById: updateItemByIdAction,
      add: addQuestion,
    },
  ),
);

export default enhance(QuestionEditor);
