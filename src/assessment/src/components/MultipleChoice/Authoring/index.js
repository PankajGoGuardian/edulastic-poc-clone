import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { PaddingDiv } from '@edulastic/common';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from '@edulastic/localization';

import QuestionAuthoring from '../../Base/QuestionAuthoring';
import { ALPHABET } from '../constants/others';
import SortableItemContainer from './SortableItemContainer';
import Subtitle from './Sutitle';
import QuestionTextArea from './QuestionTextArea';
import AddNewChoiceBtn from './AddNewChoiceBtn';

const DragHandle = SortableHandle(() => <i className="fa fa-align-justify" />);

const SortableItem = SortableElement(({ value, onRemove, onChange }) => (
  <SortableItemContainer>
    <div className="main">
      <DragHandle />
      <div>
        <input type="text" placeholder={`[${value}]`} onChange={onChange} />
      </div>
    </div>
    <i className="fa fa-trash-o" onClick={onRemove} />
  </SortableItemContainer>
));

const SortableList = SortableContainer(({ items, onRemove, onChange }) => (
  <div>
    {items.map((value, index) => (
      <SortableItem
        key={index}
        index={index}
        value={value.label}
        onRemove={() => onRemove(index)}
        onChange={e => onChange(index, e)}
      />
    ))}
  </div>
));

class MultipleChoiceAuthoring extends Component {
  state = {
    choiceOptions: [],
    question: '',
    answers: [],
  };

  static propTypes = {
    item: PropTypes.object,
    t: PropTypes.func.isRequired,
  }

  static defaultProps = {
    item: {},
  }

  async componentDidMount() {
    const { item } = this.props;
    const { stimulus, list, validation } = item;
    await this.baseQuestion.initializeData({ question: stimulus, options: list, answers: validation });
    const { question, options, answers } = this.baseQuestion.getData();

    this.choiceLength = options.length;
    const stateAnswers = this.getStateAnswersFromData(options, answers);
    this.setState({
      question,
      choiceOptions: options.map((label, index) => ({ value: index, label })),
      answers: stateAnswers,
    });
  }

  getStateOptionsFromData = options => options.map((label, index) => ({ value: index, label }));

  getOptionsFromState = stateOptions => (stateOptions.map(option => option.label));

  getStateAnswersFromData = (options, answers) => {
    const { valid_response } = answers;
    const stateAnswers = Array(options.length).fill(false);
    valid_response.value.forEach((item) => {
      stateAnswers[item] = true;
    });
    return stateAnswers;
  }

  getAnswersFromState = (stateAnswers) => {
    const correctAnswer = [];
    stateAnswers.forEach((answer, index) => {
      if (answer) {
        correctAnswer.push(index);
      }
    });
    return {
      valid_response: {
        score: 1,
        value: correctAnswer,
      },
      alt_responses: [],
    };
  }

  onChangeQuesiton = (e) => {
    const question = e.target.value;
    this.baseQuestion.setData({ question });
    this.setState({ question });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { choiceOptions: choiceOptionsState, answers: answersState } = this.state;
    const newChoiceOptionsState = arrayMove(choiceOptionsState, oldIndex, newIndex);
    const newAnswersState = arrayMove(answersState, oldIndex, newIndex);
    this.setState({
      choiceOptions: newChoiceOptionsState,
      answers: newAnswersState,
    });
    this.baseQuestion.setData({
      options: this.getOptionsFromState(newChoiceOptionsState),
      answers: this.getAnswersFromState(newAnswersState),
    });
  };

  remove = (index) => {
    const { choiceOptions, answers } = this.state;
    choiceOptions.splice(index, 1);
    answers.splice(index, 1);
    this.baseQuestion.setData({ options: this.getOptionsFromState(choiceOptions), answers: this.getAnswersFromState(answers) });
    this.setState({ choiceOptions, answers });
  };

  handleMultiSelect = (e) => {
    const { answers } = this.state;
    const changedOption = parseInt(e.target.value, 10);
    answers[changedOption] = !answers[changedOption];
    this.baseQuestion.setData({ answers: this.getAnswersFromState(answers) });
    this.setState({ answers });
  };

  editOptions = (index, e) => {
    const { choiceOptions } = this.state;
    choiceOptions[index] = {
      value: index,
      label: e.target.value,
    };
    this.baseQuestion.setData({ options: this.getOptionsFromState(choiceOptions) });
    this.setState({ choiceOptions });
  };

  addNewChoiceBtn = () => {
    const { choiceOptions, answers } = this.state;
    choiceOptions.push({
      value: choiceOptions.length,
      label: `Choice ${ALPHABET[this.choiceLength]}`,
    });
    answers.push(false);
    this.choiceLength++;
    this.baseQuestion.setData({
      options: this.getOptionsFromState(choiceOptions),
      answers: this.getAnswersFromState(answers),
    });
    this.setState({ choiceOptions, answers });
  };

  render() {
    const { choiceOptions, question } = this.state;
    const { t } = this.props;

    return (
      <QuestionAuthoring onRef={(ref) => { this.baseQuestion = ref; }}>
        <PaddingDiv bottom={20}>
          <Subtitle>{t('component.multiplechoice.composequestion')}</Subtitle>
          <QuestionTextArea
            placeholder={t('component.multiplechoice.thisisstem')}
            onChange={this.onChangeQuesiton}
            value={question}
          />
          <Subtitle>{t('component.multiplechoice.multiplechoiceoptions')}</Subtitle>
          <SortableList
            items={choiceOptions}
            onSortEnd={this.onSortEnd}
            useDragHandle
            onRemove={this.remove}
            onChange={this.editOptions}
            key={choiceOptions.length}
          />
          <div>
            <AddNewChoiceBtn onClick={this.addNewChoiceBtn}>
              {t('component.multiplechoice.addnewchoice')}
            </AddNewChoiceBtn>
          </div>
          <Subtitle>{t('component.multiplechoice.setcorrectanswers')}</Subtitle>
        </PaddingDiv>
      </QuestionAuthoring>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces('assessment'),
);

export default enhance(MultipleChoiceAuthoring);
