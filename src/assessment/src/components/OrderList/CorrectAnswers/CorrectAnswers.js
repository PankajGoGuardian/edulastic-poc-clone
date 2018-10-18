import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconPlus } from '@edulastic/icons';
import { white } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';
import { compose } from 'redux';
import { Button } from '@edulastic/common';

import CorrectAnswer from './CorrectAnswer';
import { Heading } from '../common';
import Tabs, { Tab, TabContainer } from '../common/Tabs';

class CorrectAnswers extends Component {
  state = {
    value: 0,
  };

  handleTabChange = (value) => {
    this.setState({ value });
  };

  renderAltResponses = () => {
    const { validation, t } = this.props;

    if (validation && validation.alt_responses && validation.alt_responses.length) {
      return validation.alt_responses.map((res, i) => (
        <Tab key={i} label={`${t('component.correctanswers.alternate')} ${i + 1}`} />
      ));
    }
    return null;
  };

  renderPlusButton = () => {
    const { onAddAltResponses, validation } = this.props;

    return (
      <Button
        style={{ minWidth: 70, minHeight: 25 }}
        icon={<IconPlus color={white} width={10} height={10} />}
        onClick={() => {
          this.handleTabChange(validation.alt_responses.length + 1);
          onAddAltResponses();
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
      onUpdatePoints,
      onDelete,
      t,
    } = this.props;
    const { value } = this.state;

    if (!validation) return null;

    return (
      <div>
        <Heading>{t('component.correctanswers.setcorrectanswers')}</Heading>

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
                  onUpdatePoints(points);
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
                      showDelete
                      onDelete={() => {
                        onDelete(i);
                        this.setState(({ value: val }) => ({
                          value: --val,
                        }));
                      }}
                      response={alter}
                      // eslint-disable-next-line
                      onSortCurrentAnswer={({ oldIndex, newIndex }) =>
                        onSortAltAnswer({ oldIndex, newIndex, altIndex: i })
                      }
                      onUpdatePoints={(points) => {
                        onUpdatePoints(points, i);
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
  onAddAltResponses: PropTypes.func.isRequired,
  onUpdatePoints: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

CorrectAnswers.defaultProps = {
  onDelete: () => {},
};

const enhance = compose(withNamespaces('assessment'));

export default enhance(CorrectAnswers);
