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

  render() {
    const { view, previewTab, stimulus, questionList, item, smallSize, history } = this.props;
    const { userSelections } = this.state;
    const isDetailPage = history.location.state !== undefined ? history.location.state.itemDetail : false;
    let previewDisplayOptions;
    let previewStimulus;
    if (smallSize || isDetailPage) {
      previewStimulus = item.stimulus;
      previewDisplayOptions = item.list || item.options;
    } else {
      previewStimulus = stimulus;
      previewDisplayOptions = questionList;
      console.log('stimulus, preview Display options', previewStimulus, previewDisplayOptions);
    }
    return (
      <PaddingDiv>
        {view === 'edit' && (
          <React.Fragment>
            <MultipleChoiceAuthoring key={item} item={item} smallSize={smallSize} />
          </React.Fragment>
        )}
        {view === 'preview' && (
          <React.Fragment>
            {previewTab === 'check' && (
              <MultipleChoiceReport
                showAnswer
                userSelections={userSelections}
                handleMultiSelect={this.handleMultiSelect}
              />
            )}
            {previewTab === 'show' && (
              <MultipleChoiceReport
                showAnswer
                userSelections={userSelections}
                handleMultiSelect={this.handleMultiSelect}
              />
            )}
            {previewTab === 'clear' && (
              <MultipleChoiceDisplay
                preview
                key={previewDisplayOptions && previewStimulus}
                smallSize={smallSize}
                options={previewDisplayOptions}
                question={item.stimulus}
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
  questionList: PropTypes.array,
  item: PropTypes.object,
  smallSize: PropTypes.bool,
  history: PropTypes.object,
};

MultipleChoice.defaultProps = {
  stimulus: '',
  questionList: [],
  item: {},
  smallSize: false,
  history: {},
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      stimulus: getStimulusSelector(state),
      questionsList: getQuestionsListSelector(state),
      previewTab: getPreivewTabSelector(state),
    }),
    null,
  ),
);

export default enhance(MultipleChoice);
