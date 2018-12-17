import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { arrayMove } from 'react-sortable-hoc';
import { PaddingDiv } from '@edulastic/common';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from '@edulastic/localization';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';

import AddNewChoiceBtn from './AddNewChoiceBtn';
import { setQuestionDataAction } from '../../../../../author/src/actions/question';
import { ALPHABET } from '../constants/others';
import { SortableList, Subtitle, QuestionTextArea } from '../../common';

class MultipleChoiceAuthoring extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired
  };

  getNewItem() {
    const { item } = this.props;
    return cloneDeep(item);
  }

  onChangeQuestion = (stimulus) => {
    const { item, setQuestionData } = this.props;
    setQuestionData({ ...item, stimulus });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    // reorder the options and sort the key based on index
    // editing is based on on index!
    newItem.options = arrayMove(newItem.options, oldIndex, newIndex)
      .map(({ label }, index) => ({
        value: index,
        label
      }));

    setQuestionData(newItem);
  };

  remove = (index) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();

    newItem.options.splice(index, 1);
    setQuestionData(newItem);
  };

  addNewChoiceBtn = () => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();

    newItem.options.push({
      value: newItem.options.length,
      label: `Choice ${ALPHABET[newItem.options.length]}`
    });

    setQuestionData(newItem);
  };

  editOptions = (index, value) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    const { options } = newItem;
    // if its an option reorder, just quit alredy
    if (options[index].value !== index) {
      return;
    }
    newItem.options[index] = {
      value: index,
      label: value
    };
    setQuestionData(newItem);
  };

  render() {
    const { t, item } = this.props;

    return (
      <div>
        <PaddingDiv bottom={20}>
          <Subtitle>{t('component.multiplechoice.composequestion')}</Subtitle>
          <QuestionTextArea
            onChange={this.onChangeQuestion}
            value={item.stimulus}
            placeholder={t('component.multiplechoice.thisisstem')}
          />
          <Subtitle>{t('component.multiplechoice.multiplechoiceoptions')}</Subtitle>
          <SortableList
            items={item.options.map(o => o.label)}
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
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(MultipleChoiceAuthoring);
