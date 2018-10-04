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

  render() {
    const {
      onSortCurrentAnswer,
      onSortAltAnswer,
      validation,
      updateAltValidationScore,
      updateCorrectValidationScore,
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
                onSortCurrentAnswer={onSortCurrentAnswer}
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
                      // eslint-disable-next-line
                      onSortCurrentAnswer={({ oldIndex, newIndex }) =>
                        onSortAltAnswer({ oldIndex, newIndex, altIndex: i })
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
  t: PropTypes.func.isRequired,
};

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    null,
    {
      updateAltValidationScore: updateAltValidationScoreAction,
      addAltResponses: addAltResponsesAction,
      updateCorrectValidationScore: updateCorrectValidationScoreAction,
    },
  ),
);

export default enhance(CorrectAnswers);
