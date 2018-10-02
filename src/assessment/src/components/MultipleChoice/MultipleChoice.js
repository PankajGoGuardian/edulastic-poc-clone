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
    const { view, previewTab, isNew, item, smallSize } = this.props;
    const { userSelections } = this.state;
    console.log('item from question wrapper:', item, previewTab);
    return (
      <PaddingDiv>
        {view === 'edit' && (
          <React.Fragment>
            <MultipleChoiceAuthoring key={isNew} item={item} />
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
                smallSize={smallSize}
                options={item.list || item.options}
                question={item.stimulus}
                userSelections={item.userSelections}
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
  smallSize: PropTypes.bool,
};

MultipleChoice.defaultProps = {
  isNew: false,
  item: {},
  smallSize: false,
};

const enhance = compose(
  connect(
    state => ({
      previewTab: getPreivewTabSelector(state),
    }),
  ),
);

export default enhance(MultipleChoice);
