import React from 'react';

import Container from './components/Container';
import QuestionDisplay from '../Base/QuestionDisplay';
import QuestionWrapper from '../QuestionWrapper';

class MultipleChoiceDisplay extends QuestionDisplay {
  state = {
    question: '',
    options: []
  };

  componentDidMount() {
    const { options, question } = this.getResponse();
    this.setState({options, question});
  }

  render() {
    const { options, question } = this.state;
    const { userSelections, handleMultiSelect } = this.props;
    return (
      <Container>
        <QuestionWrapper
          type={'mcq'}
          options={options}
          question={question}
          userSelections={userSelections}
          onChange={handleMultiSelect}
        />
      </Container>
    );
  };
};

export default MultipleChoiceDisplay;
