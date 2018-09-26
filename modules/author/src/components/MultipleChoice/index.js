import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Container from './components/Container';
import PaddingDiv from '../common/PaddingDiv';
import {
  MultipleChoiceAuthoring,
  MultipleChoiceDisplay,
  MultipleChoiceReport,
} from '../../../../assessment/src/components/MultipleChoice';


class MultipleChoice extends Component {
  render() {
    const {
      activePage, userSelections, handleMultiSelect, showAnswer,
    } = this.props;
    let content;
    switch (activePage) {
      case 'edit': {
        content = <MultipleChoiceAuthoring edit />;
        break;
      }
      case 'preview': {
        content = (
          <Container>
            <MultipleChoiceDisplay
              preview
              userSelections={userSelections}
              onChange={handleMultiSelect}
            />
          </Container>
        );
        break;
      }
      case 'answer': {
        content = (
          <MultipleChoiceReport
            showAnswer={showAnswer}
            userSelections={userSelections}
            handleMultiSelect={handleMultiSelect}
          />
        );
        break;
      }
      default:
        content = <MultipleChoiceAuthoring />;
    }
    return (
      <PaddingDiv top={10}>{content}</PaddingDiv>
    );
  }
}

MultipleChoice.propTypes = {
  userSelections: PropTypes.array.isRequired,
  handleMultiSelect: PropTypes.func.isRequired,
  activePage: PropTypes.string.isRequired,
  showAnswer: PropTypes.bool,
};

MultipleChoice.defaultProps = {
  showAnswer: false,
};

export default MultipleChoice;
