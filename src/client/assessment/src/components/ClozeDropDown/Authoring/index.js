import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { PaddingDiv, CustomQuillComponent } from '@edulastic/common';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from '@edulastic/localization';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import 'react-quill/dist/quill.snow.css';

import SortableItemContainer from './SortableItemContainer';
import Subtitle from '../common/Sutitle';
import AddNewChoiceBtn from './AddNewChoiceBtn';
import { setQuestionDataAction } from '../../../../../author/src/actions/question';
import DeleteButton from '../components/DeleteButton';

const DragHandle = React.memo(SortableHandle(() => <i className="fa fa-align-justify" />));

const SortableItem = React.memo(SortableElement(({ value, onRemove, onChange }) => (
  <SortableItemContainer>
    <div className="main">
      <DragHandle />
      <div>
        <input style={{ background: 'transparent' }} type="text" value={value} onChange={onChange} />
      </div>
    </div>
    <DeleteButton onDelete={onRemove} />
  </SortableItemContainer>
)));

const SortableList = React.memo(SortableContainer(({ items, onRemove, onChange }) => (
  <div>
    {items.map((value, index) => (
      <SortableItem
        key={index}
        index={index}
        value={value}
        onRemove={() => onRemove(index)}
        onChange={e => onChange(index, e)}
      />
    ))}
  </div>
)));

const defaultTemplateMarkup = '<p>Risus </p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p>, et tincidunt turpis facilisis. Curabitur eu nulla justo. Curabitur vulputate ut nisl et bibendum. Nunc diam enim, porta sed eros vitae. </p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p> dignissim, et tincidunt turpis facilisis. Curabitur eu nulla justo. Curabitur vulputate ut nisl et bibendum.</p>';

class ClozeDropDownAuthoring extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
  };

  state = {
    responseContainersCount: 2,
  };

  componentWillReceiveProps(nextProps) {
    const { item } = nextProps;
    const { responseContainersCount } = this.getTemplateParts(item);
    this.setState({ responseContainersCount });
  }

  getNewItem() {
    const { item } = this.props;
    return cloneDeep(item);
  }

  onChangeQuesiton = (html) => {
    const stimulus = html;
    const { item, setQuestionData } = this.props;
    setQuestionData({ ...item, stimulus });
  };

  onSortEnd = (index, { oldIndex, newIndex }) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    newItem.options[index] = arrayMove(newItem.options[index], oldIndex, newIndex);
    setQuestionData(newItem);
  };

  remove = (index, itemIndex) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    newItem.options[index].splice(itemIndex, 1);
    setQuestionData(newItem);
  };

  editOptions = (index, itemIndex, e) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    if (newItem.options[index] === undefined) newItem.options[index] = [];
    newItem.options[index][itemIndex] = e.target.value;
    setQuestionData(newItem);
  };

  addNewChoiceBtn = (index) => {
    const { setQuestionData } = this.props;
    const newItem = this.getNewItem();
    if (newItem.options[index] === undefined) newItem.options[index] = [];
    newItem.options[index].push('new choice');
    setQuestionData(newItem);
  };

  onChangeMarkUp = (html) => {
    const templateMarkUp = html;
    const { item, setQuestionData } = this.props;
    setQuestionData({ ...item, templateMarkUp });
  }

  addGroup = () => {
    const { groupResponses } = this.state;
    groupResponses.push({ title: '', options: [] });
    const newGroupResponses = groupResponses.slice();
    this.setState({ groupResponses: newGroupResponses });
    const { item, setQuestionData } = this.props;
    setQuestionData({ ...item, groupResponses: newGroupResponses });
  }

  removeGroup = (index) => {
    const { groupResponses } = this.state;
    groupResponses.splice(index, 1);
    const newGroupResponses = groupResponses.slice();
    this.setState({ groupResponses: newGroupResponses });
    const { item, setQuestionData } = this.props;
    setQuestionData({ ...item, groupResponses: newGroupResponses });
  }

  changeGroupRespTitle = (index, e) => {
    const { groupResponses } = this.state;
    const newGroupResponses = groupResponses.slice();
    newGroupResponses[index].title = e.target.value;
    this.setState({ groupResponses: newGroupResponses });
    const { item, setQuestionData } = this.props;
    setQuestionData({ ...item, groupResponses: newGroupResponses });
  }

  onSortEndGroupOptions = () => {

  }

  getTemplateParts = (props) => {
    const { templateMarkUp } = props;
    let templateMarkUpStr = templateMarkUp;
    if (!templateMarkUpStr) {
      templateMarkUpStr = defaultTemplateMarkup;
    }
    const templateParts = templateMarkUpStr.match(/<p.*?<\/p>/g);
    const responseParts = templateMarkUpStr.match(/<p class="response-btn.*?<\/p>/g);
    const responseContainersCount = responseParts !== null ? responseParts.length : 0;
    return { templateParts, responseContainersCount };
  }

  render() {
    const { t, item } = this.props;
    const { responseContainersCount } = this.state;
    const responseContainers = new Array(responseContainersCount).fill(true);

    console.log('responseContainersCount: ', responseContainersCount);

    return (
      <div>
        <PaddingDiv bottom={20}>
          <Subtitle>{t('component.clozeDropDown.composequestion')}</Subtitle>
          <CustomQuillComponent
            toolbarId="stimulus"
            wrappedRef={(instance) => { this.stimulus = instance; }}
            placeholder={t('component.clozeDropDown.thisisstem')}
            onChange={this.onChangeQuesiton}
            showResponseBtn={false}
            value={item.stimulus}
          />
          <Subtitle>{t('component.clozeDropDown.templatemarkup')}</Subtitle>
          <CustomQuillComponent
            toolbarId="templatemarkup"
            wrappedRef={(instance) => { this.templatemarkup = instance; }}
            placeholder={t('component.clozeDropDown.templatemarkupplaceholder')}
            onChange={this.onChangeMarkUp}
            showResponseBtn
            value={item.templateMarkUp || defaultTemplateMarkup}
          />
          {responseContainers.map((resp, index) => (
            <PaddingDiv key={`${resp}_${index}`}>
              <Subtitle>{`${t('component.clozeDropDown.choicesforresponse')} ${index + 1}`}</Subtitle>
              <SortableList
                items={item.options[index] || []}
                onSortEnd={params => this.onSortEnd(index, params)}
                useDragHandle
                onRemove={itemIndex => this.remove(index, itemIndex)}
                onChange={(itemIndex, e) => this.editOptions(index, itemIndex, e)}
              />
              <div>
                <AddNewChoiceBtn onClick={() => this.addNewChoiceBtn(index)}>
                  {t('component.clozeDropDown.addnewchoice')}
                </AddNewChoiceBtn>
              </div>
            </PaddingDiv>
          ))}
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

export default enhance(ClozeDropDownAuthoring);
