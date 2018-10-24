import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { PaddingDiv } from '@edulastic/common';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from '@edulastic/localization';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import 'react-quill/dist/quill.snow.css';

import { ALPHABET } from '../constants/others';
import SortableItemContainer from './SortableItemContainer';
import Subtitle from '../common/Sutitle';
import QuestionTextArea from './QuestionTextArea';
import AddNewChoiceBtn from './AddNewChoiceBtn';
import { setQuestionDataAction } from '../../../../../author/src/actions/question';

const DragHandle = SortableHandle(() => <i className="fa fa-align-justify" />);

const SortableItem = SortableElement(({ value, onRemove, onChange }) => (
  <SortableItemContainer>
    <div className="main">
      <DragHandle />
      <div>
        <input type="text" value={value} onChange={onChange} />
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

class ClozeDragDropAuthoring extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
  };

  getNewItem() {
    const { item } = this.props;
    return cloneDeep(item);
  }

  onChangeQuesiton = (e) => {
    const stimulus = e.target.value;
    const { item, setQuestionData } = this.props;
    setQuestionData({ ...item, stimulus });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();

    newItem.options = arrayMove(newItem.options, oldIndex, newIndex);

    setQuestionData(newItem);
  };

  remove = (index) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();

    newItem.options.splice(index, 1);
    setQuestionData(newItem);
  };

  editOptions = (index, e) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    newItem.options[index] = {
      value: index,
      label: e.target.value,
    };

    setQuestionData(newItem);
  };

  addNewChoiceBtn = () => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();

    newItem.options.push({
      value: newItem.options.length,
      label: `Choice ${ALPHABET[newItem.options.length]}`,
    });

    setQuestionData(newItem);
  };

  onChangeMarkUp = () => {
    console.log('markup changed');
  }

  render() {
    const { t, item } = this.props;

    return (
      <div>
        <PaddingDiv bottom={20} style={{ width: 630 }}>
          <Subtitle>{t('component.clozeDragDrop.composequestion')}</Subtitle>
          <QuestionTextArea
            placeholder={t('component.clozeDragDrop.thisisstem')}
            onChange={this.onChangeQuesiton}
            value={item.stimulus}
          />
          <Subtitle>{t('component.clozeDragDrop.templatemarkup')}</Subtitle>
          <QuestionTextArea
            placeholder={t('component.clozeDragDrop.thisisstem')}
            onChange={this.onChangeMarkUp}
            value={item.templateMarkUp || ''}
          />
          <Subtitle>{t('component.clozeDragDrop.multiplechoiceoptions')}</Subtitle>
          <SortableList
            items={item.options}
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
        </PaddingDiv>
      </div>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces('assessment'),
  connect(
    null,
    { setQuestionData: setQuestionDataAction },
  ),
);

export default enhance(ClozeDragDropAuthoring);
