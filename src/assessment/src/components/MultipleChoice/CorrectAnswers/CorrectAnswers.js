import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconPlus } from '@edulastic/icons';
import { white } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { compose } from 'redux';
import { Button } from '@edulastic/common';

import CorrectAnswer from './CorrectAnswer';
import { Subtitle } from '../common';
import {
  updateAltValidationScoreAction,
  addAltResponsesAction,
  updateCorrectValidationScoreAction,
  updateValidationAction,
} from '../../../actions/questionCommon';
import Tabs, { Tab, TabContainer } from '../../common/Tabs';

class CorrectAnswers extends Component {
  state = {
    value: 0,
  };

  handleTabChange = (value) => {
    this.setState({ value });
  };

  renderAltResponses = () => {
    const { validation, t } = this.props;

    if (validation.alt_responses && validation.alt_responses.length) {
      return validation.alt_responses.map((res, i) => (
        <Tab key={i} label={`${t('component.correctanswers.alternate')} ${i + 1}`} />
      ));
    }
    return null;
  };

  renderPlusButton = () => {
    const { addAltResponses, validation } = this.props;

    return (
      <Button
        style={{ minWidth: 70, minHeight: 25 }}
        icon={<IconPlus color={white} width={10} height={10} />}
        onClick={() => {
          this.handleTabChange(validation.alt_responses.length + 1);
          addAltResponses();
        }}
        color="primary"
        variant="extendedFab"
      />
    );
  };

  updateCorrectValidationAnswers = (answers) => {
    const { validation, updateValidation } = this.props;
    const correctAnswer = [];
    answers.forEach((answer, index) => {
      if (answer) {
        correctAnswer.push(index);
      }
    });
    const updatedValidation = {
      ...validation,
      valid_response: {
        score: validation.valid_response.score,
        value: correctAnswer,
      },
    };
    updateValidation(updatedValidation);
  }

  updateAltCorrectValidationAnswers = (answers, tabIndex) => {
    const { validation, updateValidation } = this.props;
    const correctAnswer = [];
    answers.forEach((answer, index) => {
      if (answer) {
        correctAnswer.push(index);
      }
    });
    const updatedAltResponses = validation.alt_responses;
    updatedAltResponses[tabIndex] = {
      score: validation.alt_responses[tabIndex].score,
      value: correctAnswer,
    };
    const updatedValidation = {
      ...validation,
      alt_responses: updatedAltResponses,
    };
    updateValidation(updatedValidation);
  }

  render() {
    const {
      validation,
      updateAltValidationScore,
      updateCorrectValidationScore,
      stimulus,
      options,
      t,
    } = this.props;
    const { value } = this.state;

    return (
      <div>
        <Subtitle>{t('component.correctanswers.setcorrectanswers')}</Subtitle>
        <div>
          <Tabs value={value} onChange={this.handleTabChange} extra={this.renderPlusButton()}>
            <Tab label={t('component.correctanswers.correct')} />
            {this.renderAltResponses()}
          </Tabs>
          {value === 0 && (
            <TabContainer>
              <CorrectAnswer
                response={validation.valid_response}
                stimulus={stimulus}
                options={options}
                onUpdateValidationValue={this.updateCorrectValidationAnswers}
                onUpdatePoints={(points) => {
                  updateCorrectValidationScore(points);
                }}
              />
            </TabContainer>
          )}
          {validation.alt_responses &&
            !!validation.alt_responses.length &&
            validation.alt_responses.map((alter, i) => {
              if (i + 1 === value) {
                return (
                  <TabContainer key={i}>
                    <CorrectAnswer
                      response={alter}
                      stimulus={stimulus}
                      options={options}
                      onUpdateValidationValue={answers => this.updateAltCorrectValidationAnswers(answers, i)}
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
  addAltResponses: PropTypes.func.isRequired,
  updateValidation: PropTypes.func.isRequired,
  updateAltValidationScore: PropTypes.func.isRequired,
  updateCorrectValidationScore: PropTypes.func.isRequired,
  validation: PropTypes.object,
  t: PropTypes.func.isRequired,
  stimulus: PropTypes.string,
  options: PropTypes.array,
};


CorrectAnswers.defaultProps = {
  stimulus: '',
  options: [],
  validation: {},
};

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    null,
    {
      updateAltValidationScore: updateAltValidationScoreAction,
      addAltResponses: addAltResponsesAction,
      updateCorrectValidationScore: updateCorrectValidationScoreAction,
      updateValidation: updateValidationAction,
    },
  ),
);

export default enhance(CorrectAnswers);
