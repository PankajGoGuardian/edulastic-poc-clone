import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { PaddingDiv } from '@edulastic/common';

import {
  MultipleChoiceAuthoring,
  MultipleChoiceDisplay,
  MultipleChoiceReport,
} from './index';
import {
  getPreivewTabSelector,
} from './selectors/preview';
import { getItemSelector } from './selectors/items';

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
    const { view, previewTab, isNew, item } = this.props;
    const { userSelections } = this.state;
    return (
      <PaddingDiv top={10}>
        {view === 'edit' && (
          <React.Fragment>
            <MultipleChoiceAuthoring edit={!isNew} key={isNew} item={!!item && item} />
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
                userSelections={userSelections}
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
  isNew: PropTypes.bool,
  item: PropTypes.object,
};

MultipleChoice.defaultProps = {
  isNew: true,
  item: {},
};

const enhance = compose(
  connect(
    state => ({
      previewTab: getPreivewTabSelector(state),
      item: getItemSelector(state),
    }),
  ),
);

export default enhance(MultipleChoice);
