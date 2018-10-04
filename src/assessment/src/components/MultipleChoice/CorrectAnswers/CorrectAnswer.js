import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';

import { Header, PointField } from './styled_components';
import MultipleChoiceDisplay from '../Display';

class CorrectAnswer extends Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    onUpdatePoints: PropTypes.func.isRequired,
    onUpdateValidationValue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    stimulus: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    const userSelections = Array(props.options.length).fill(false);
    props.response.value.forEach((answer) => { userSelections[answer] = true; });
    console.log('userSelections', userSelections);
    this.state = {
      responseScore: props.response.score,
      userSelections,
    };
  }

  updateScore = (e) => {
    const { onUpdatePoints } = this.props;
    if (e.target.value < 0) e.target.value = 0;
    this.setState({ responseScore: e.target.value });
    onUpdatePoints(parseInt(e.target.value, 10));
  }

  handleMultiSelect = (e) => {
    const { onUpdateValidationValue } = this.props;
    const { userSelections } = this.state;
    const changedOption = parseInt(e.target.value, 10);
    userSelections[changedOption] = !userSelections[changedOption];
    this.setState({ userSelections });

    onUpdateValidationValue(userSelections);
  }

  render() {
    const { t, options, stimulus } = this.props;
    const { responseScore, userSelections } = this.state;
    return (
      <div>
        <Header>
          <PointField
            type="number"
            value={responseScore}
            onChange={this.updateScore}
            onBlur={this.updateScore}
            disabled={false}
            min={0}
          />
          <span>{t('component.correctanswers.points')}</span>
        </Header>
        <MultipleChoiceDisplay
          preview
          setAnswers
          options={options}
          question={stimulus}
          userSelections={userSelections}
          onChange={this.handleMultiSelect}
        />
      </div>
    );
  }
}

export default withNamespaces('assessment')(CorrectAnswer);
