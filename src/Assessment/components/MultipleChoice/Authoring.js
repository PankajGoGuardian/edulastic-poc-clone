import React from 'react';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

import Container from './components/Container';
import PaddingDiv from '../common/PaddingDiv';
import SortableItemContainer from './components/SortableItemContainer';
import Subtitle from './components/Sutitle';
import QuestionTextArea from './components/QuestionTextArea';
import AddNewChoiceBtn from './components/AddNewChoiceBtn';
import QuestionWrapper from '../QuestionWrapper';

import QuestionAuthoring from '../Base/QuestionAuthoring';
import { translate } from '../../utilities/localization';
import { ALPHABET } from '../../../constants/others';

const DragHandle = SortableHandle(() => <i className="fa fa-align-justify"/>); 

const SortableItem = SortableElement(({value, onRemove, onChange}) =>
  <SortableItemContainer>
    <div className="main" >
      <DragHandle/>
      <div><input type="text" placeholder={`[${value}]`} onChange={onChange} /></div>
    </div>
    <i className="fa fa-trash-o" onClick={onRemove}/>
  </SortableItemContainer>
);

const SortableList = SortableContainer(({items, onRemove, onChange}) => {
  return (
    <div>
      {items.map((value, index) => (
        <SortableItem key={index} index={index} value={value.label} onRemove={() => onRemove(index)} onChange={(e) => onChange(index, e)} />
      ))}
    </div>
  );
});

class MultipleChoiceAuthoring extends QuestionAuthoring {
  constructor(props) {
    super(props);

    if (!this.props.edit) {
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
        }
      ];
      const answers = Array(options.length).fill(false);
      this.initialize({options, answers});
    }
    const {question, answers} = this.getData();
    this.choiceLength = question.options.length;
    this.state = {
      choiceOptions: question.options,
      answers,
      question: question.stimulus
    };
  }

  onChangeQuesiton = (e) => {
    const question = e.target.value;
    this.setData({question});
    this.setState({question});
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    const choiceOptions = arrayMove(this.state.choiceOptions, oldIndex, newIndex);
    const answers = arrayMove(this.state.answers, oldIndex, newIndex);
    this.setState({
      choiceOptions,
      answers
    });
    this.setData({options: choiceOptions, answers});
  };

  remove = (index) => {
    let { choiceOptions, answers } = this.state;
    choiceOptions.splice(index, 1);
    answers.splice(index, 1);
    this.setData({options: choiceOptions, answers});
    this.setState({choiceOptions, answers});
  }

  handleMultiSelect = (e) => {
    const { answers } = this.state;
    const changedOption = parseInt(e.target.value, 10);
    answers[changedOption] = !answers[changedOption];
    this.setData({answers});
    this.setState({answers});
  }

  editOptions = (index, e) => {
    let { choiceOptions } = this.state;
    choiceOptions[index] = {
      value: index,
      label: e.target.value
    };
    this.setData({options: choiceOptions});
    this.setState({choiceOptions});
  }

  addNewChoiceBtn = () => {
    let { choiceOptions, answers } = this.state;
    choiceOptions.push({value: choiceOptions.length, label: `Choice ${ALPHABET[this.choiceLength]}`});
    answers.push(false);
    this.choiceLength++;
    this.setData({options: choiceOptions, answers});
    this.setState({choiceOptions, answers});
  }

  render() {
    const { choiceOptions, question, answers } = this.state;
    return (
      <Container>
        <PaddingDiv bottom={20} >
          <Subtitle>
            {translate('component.multiplechoice.composequestion')}
          </Subtitle>
          <QuestionTextArea
            placeholder={translate('component.multiplechoice.thisisstem')}
            onChange={this.onChangeQuesiton}
            value={question}
          />
          <Subtitle>
            {translate('component.multiplechoice.multiplechoiceoptions')}
          </Subtitle>
          <SortableList
            items={choiceOptions}
            onSortEnd={this.onSortEnd}
            useDragHandle={true}
            onRemove={this.remove}
            onChange={this.editOptions}
          />
          <div>
          <AddNewChoiceBtn onClick={this.addNewChoiceBtn} >
            {translate('component.multiplechoice.addnewchoice')}
          </AddNewChoiceBtn>
          </div>
          <Subtitle>
            {translate('component.multiplechoice.setcorrectanswers')}
          </Subtitle>
          <QuestionWrapper
            type={'mcq'}
            setAnswers
            options={choiceOptions}
            userSelections={answers}
            onChange={this.handleMultiSelect}
            key={choiceOptions && answers}
          />
        </PaddingDiv>
      </Container>
    );
  };
};

export default MultipleChoiceAuthoring;
