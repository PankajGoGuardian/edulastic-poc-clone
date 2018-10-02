import React from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { PaddingDiv } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';

import QuestionAuthoring from '../../Base/QuestionAuthoring';
import { ALPHABET } from '../constants/others';
import SortableItemContainer from './SortableItemContainer';
import Subtitle from './Sutitle';
import QuestionTextArea from './QuestionTextArea';
import AddNewChoiceBtn from './AddNewChoiceBtn';
import MultipleChoiceDisplay from '../Display';

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

class MultipleChoiceAuthoring extends QuestionAuthoring {
  state = {
    choiceOptions: [],
    question: '',
    answers: [],
  };

  componentWillReceiveProps(nextProps) {
    const { item } = nextProps;
    const { edit } = this.props;
    if (item && edit) {
      const { stimulus: question, list: options, validation: validAnswers } = item;
      const validResponse = Array(options.length).fill(false);
      let answersFromItem = [];
      if (validAnswers !== null) {
        answersFromItem = JSON.parse(validAnswers.valid_response);
      }
      answersFromItem.forEach((answer) => {
        validResponse[answer] = true;
      });
      this.setData({ question, options, answers: validResponse });
    } else {
      const options = [
        {
          value: 0,
          label: 'Choice A',
        },
        {
          value: 1,
          label: 'Choice B',
        },
        {
          value: 2,
          label: 'Choice C',
        },
        {
          value: 3,
          label: 'Choice D',
        },
      ];
      const answers = Array(options.length).fill(false);
      this.initialize({ options, answers });
      localStorage.removeItem('PickUpQuestionType');
    }
    const { question, answers } = this.getData();
    this.choiceLength = question.options.length;
    this.setState({
      choiceOptions: question.options,
      answers,
      question: question.stimulus,
    });
  }

  onChangeQuesiton = (e) => {
    const question = e.target.value;
    this.setData({ question });
    this.setState({ question });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { choiceOptions: choiceOptionsState, answers: answersState } = this.state;
    const choiceOptions = arrayMove(choiceOptionsState, oldIndex, newIndex);
    const answers = arrayMove(answersState, oldIndex, newIndex);
    this.setState({
      choiceOptions,
      answers,
    });
    this.setData({ options: choiceOptions, answers });
  };

  remove = (index) => {
    const { choiceOptions, answers } = this.state;
    choiceOptions.splice(index, 1);
    answers.splice(index, 1);
    this.setData({ options: choiceOptions, answers });
    this.setState({ choiceOptions, answers });
  };

  handleMultiSelect = (e) => {
    const { answers } = this.state;
    const changedOption = parseInt(e.target.value, 10);
    answers[changedOption] = !answers[changedOption];
    this.setData({ answers });
    this.setState({ answers });
  };

  editOptions = (index, e) => {
    const { choiceOptions } = this.state;
    choiceOptions[index] = {
      value: index,
      label: e.target.value,
    };
    this.setData({ options: choiceOptions });
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
    this.setData({ options: choiceOptions, answers });
    this.setState({ choiceOptions, answers });
  };

  render() {
    const { choiceOptions, question, answers } = this.state;
    const { t } = this.props;

    return (
      <React.Fragment>
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
          />
          <div>
            <AddNewChoiceBtn onClick={this.addNewChoiceBtn}>
              {t('component.multiplechoice.addnewchoice')}
            </AddNewChoiceBtn>
          </div>
          <Subtitle>{t('component.multiplechoice.setcorrectanswers')}</Subtitle>
          <MultipleChoiceDisplay
            setAnswers
            options={choiceOptions}
            userSelections={answers}
            onChange={this.handleMultiSelect}
            key={choiceOptions && answers}
          />
        </PaddingDiv>
      </React.Fragment>
    );
  }
}

export default withNamespaces('assessment')(MultipleChoiceAuthoring);
