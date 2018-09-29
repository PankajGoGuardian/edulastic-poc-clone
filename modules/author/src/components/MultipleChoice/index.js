import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
  MultipleChoiceAuthoring,
  MultipleChoiceDisplay,
  MultipleChoiceReport,
} from '../../../../assessment/src/components/MultipleChoice';
import {
  getPreivewTabSelector,
} from '../../selectors/preview';
import { PaddingDiv } from '../common';

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
    const { view, previewTab } = this.props;
    return (
      <PaddingDiv top={10}>
        {view === 'edit' && (
          <React.Fragment>
            <MultipleChoiceAuthoring edit />
          </React.Fragment>
        )}
        {view === 'preview' && (
          <React.Fragment>
            {previewTab === 'check' && (
              <MultipleChoiceReport
                showAnswer
                userSelections={this.userSelections}
                handleMultiSelect={this.handleMultiSelect}
              />
            )}
            {previewTab === 'show' && (
              <MultipleChoiceReport
                showAnswer
                userSelections={this.userSelections}
                handleMultiSelect={this.handleMultiSelect}
              />
            )}
            {previewTab === 'clear' && (
              <MultipleChoiceDisplay
                preview
                userSelections={this.userSelections}
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
};

const enhance = compose(
  connect(
    state => ({
      previewTab: getPreivewTabSelector(state),
    }),
  ),
);

export default enhance(MultipleChoice);
