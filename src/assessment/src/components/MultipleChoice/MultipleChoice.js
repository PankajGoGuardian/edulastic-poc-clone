import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { PaddingDiv } from '@edulastic/common';

import {
  MultipleChoiceAuthoring,
  MultipleChoiceDisplay,
  MultipleChoiceReport,
} from './index';
import {
  getStimulusSelector,
  getQuestionsListSelector,
  getValidationSelector,
} from '../../selectors/questionCommon';
import {
  getPreivewTabSelector,
} from './selectors/preview';

class MultipleChoice extends Component {
  state = {
    userSelections: [],
  };

  handleMultiSelect = (e) => {
    const { userSelections } = this.state;
    const index = parseInt(e.target.value, 10);
    userSelections[index] = e.target.checked;
    this.setState({ userSelections });
  };

  componentDidMount() {
    const { questionsList } = this.props;
    const userSelections = Array(questionsList.length).fill(false);
    this.setState({ userSelections });
  }

  render() {
    const { view, previewTab, stimulus, questionsList, validation, item, smallSize, history } = this.props;
    const { userSelections } = this.state;
    const isDetailPage = history.location.state !== undefined ? history.location.state.itemDetail : false;
    let previewDisplayOptions;
    let previewStimulus;
    let itemForEdit;
    if (smallSize || isDetailPage) {
      previewStimulus = item.stimulus;
      previewDisplayOptions = item.list || item.options;
      itemForEdit = item;
    } else {
      previewStimulus = stimulus;
      previewDisplayOptions = questionsList;
      itemForEdit = {
        stimulus,
        list: questionsList,
        validation,
      };
    }
    return (
      <PaddingDiv>
        {view === 'edit' && (
          <React.Fragment>
            <MultipleChoiceAuthoring key={item} item={itemForEdit} />
          </React.Fragment>
        )}
        {view === 'preview' && (
          <React.Fragment>
            {previewTab === 'check' && (
              <MultipleChoiceReport
                checkAnswer
                userSelections={userSelections}
                options={previewDisplayOptions}
                question={previewStimulus}
                handleMultiSelect={this.handleMultiSelect}
              />
            )}
            {previewTab === 'show' && (
              <MultipleChoiceReport
                showAnswer
                options={previewDisplayOptions}
                question={previewStimulus}
                handleMultiSelect={this.handleMultiSelect}
              />
            )}
            {previewTab === 'clear' && (
              <MultipleChoiceDisplay
                preview
                key={previewDisplayOptions && previewStimulus}
                smallSize={smallSize}
                options={previewDisplayOptions}
                question={previewStimulus}
                userSelections={!!item && item.userSelections ? item.userSelections : userSelections}
                onChange={this.handleMultiSelect}
              />
            )}
          </React.Fragment>
        )}
      </PaddingDiv>
    );
  }
}


MultipleChoice.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  stimulus: PropTypes.string,
  questionsList: PropTypes.array,
  item: PropTypes.object,
  smallSize: PropTypes.bool,
  history: PropTypes.object,
  validation: PropTypes.object,
};

MultipleChoice.defaultProps = {
  stimulus: '',
  questionsList: [],
  item: {},
  smallSize: false,
  history: {},
  validation: {},
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      stimulus: getStimulusSelector(state),
      questionsList: getQuestionsListSelector(state),
      previewTab: getPreivewTabSelector(state),
      validation: getValidationSelector(state),
    }),
    null,
  ),
);

export default enhance(MultipleChoice);
