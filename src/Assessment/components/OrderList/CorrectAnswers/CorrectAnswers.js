import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';
import { connect } from 'react-redux';

import CorrectAnswer from './CorrectAnswer';
import Button from '../../UI/Button';
import Heading from '../../UI/Heading';
import Tabs, { Tab, TabContainer } from '../../UI/Tabs';
import {
  updateAltValidationScoreAction,
  addAltResponsesAction,
  updateCorrectValidationScoreAction,
} from '../../../../ducks/questionsOrderList';

class CorrectAnswers extends Component {
  state = {
    value: 0,
  };

  handleTabChange = (value) => {
    this.setState({ value });
  };

  renderAltResponses = () => {
    const { validation } = this.props;

    if (validation.alt_responses && validation.alt_responses.length) {
      return validation.alt_responses.map((res, i) => <Tab key={i} label={`Alternate ${i + 1}`} />);
    }
    return null;
  };

  renderPlusButton = () => {
    const { addAltResponses, validation } = this.props;

    return (
      <Button
        icon={<FaPlus />}
        onClick={() => {
          this.handleTabChange(validation.alt_responses.length + 1);
          addAltResponses();
        }}
        color="primary"
        variant="extendedFab"
      />
    );
  };

  render() {
    const {
      onSortCurrentAnswer,
      onSortAltAnswer,
      validation,
      updateAltValidationScore,
      updateCorrectValidationScore,
    } = this.props;
    const { value } = this.state;

    return (
      <div>
        <Heading>Set correct answer(s)</Heading>

        <div>
          <Tabs value={value} onChange={this.handleTabChange} extra={this.renderPlusButton()}>
            <Tab label="Correct" />
            {this.renderAltResponses()}
          </Tabs>
          {value === 0 && (
            <TabContainer>
              <CorrectAnswer
                response={validation.valid_response}
                onSortCurrentAnswer={onSortCurrentAnswer}
                onUpdatePoints={(points) => {
                  updateCorrectValidationScore(points);
                }}
              />
            </TabContainer>
          )}
          {validation.alt_responses
            && !!validation.alt_responses.length
            && validation.alt_responses.map((alter, i) => {
              if (i + 1 === value) {
                return (
                  <TabContainer key={i}>
                    <CorrectAnswer
                      response={alter}
                      onSortCurrentAnswer={({ oldIndex, newIndex }) => onSortAltAnswer({ oldIndex, newIndex, altIndex: i })
                      }
                      onUpdatePoints={(points) => {
                        updateAltValidationScore(points, i);
                      }}
                    />
                  </TabContainer>
                );
              }
              return null;
            })}
        </div>
      </div>
    );
  }
}

CorrectAnswers.propTypes = {
  onSortCurrentAnswer: PropTypes.func.isRequired,
  onSortAltAnswer: PropTypes.func.isRequired,
  addAltResponses: PropTypes.func.isRequired,
  updateAltValidationScore: PropTypes.func.isRequired,
  updateCorrectValidationScore: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired,
};

export default connect(
  null,
  {
    updateAltValidationScore: updateAltValidationScoreAction,
    addAltResponses: addAltResponsesAction,
    updateCorrectValidationScore: updateCorrectValidationScoreAction,
  },
)(CorrectAnswers);
