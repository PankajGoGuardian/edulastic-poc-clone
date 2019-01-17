import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { cloneDeep } from 'lodash';

import { Input, Checkbox, Select } from 'antd';
import Options from '../Options';
import { FormGroup } from '../styles';
import { setQuestionDataAction } from '../../../../../../author/src/actions/question';
import { getQuestionDataSelector } from '../../../../../../author/src/selectors/question';

const roundingTypes = [
  {
    value: 'roundDown',
    label: 'Round down'
  },
  {
    value: 'none',
    label: 'None'
  }
];

const Scoring = ({ setQuestionData, questionData, t, scoringTypes }) => {
  const handleChangeValidation = (param, value) => {
    const newData = cloneDeep(questionData);
    newData.validation[param] = value;
    setQuestionData(newData);
  };

  const handleChangeData = (param, value) => {
    const newData = cloneDeep(questionData);
    newData[param] = value;
    setQuestionData(newData);
  };

  return (
    <Options.Block>
      <Options.Heading>{t('component.options.scoring')}</Options.Heading>

      {questionData.validation.automarkable && (
        <Options.Row>
          <Options.Col md={6}>
            <Checkbox
              data-cy="unscoredChk"
              checked={questionData.validation.unscored}
              onChange={e => handleChangeValidation('unscored', e.target.checked)}
              size="large"
              style={{ width: '80%' }}
            >
              {t('component.options.unscored')}
            </Checkbox>
          </Options.Col>
          <Options.Col md={6}>
            <FormGroup>
              <Input
                type="number"
                data-cy="penalty"
                value={questionData.validation.penalty}
                onChange={e => handleChangeValidation('penalty', +e.target.value)}
                size="large"
                style={{ width: '20%', marginRight: 30 }}
              />
              <Options.Label>{t('component.options.penalty')}</Options.Label>
            </FormGroup>
          </Options.Col>
        </Options.Row>
      )}
      {questionData.validation.automarkable && (
        <Options.Row>
          <Options.Col md={6}>
            <Checkbox
              data-cy="feedbackChk"
              checked={questionData.instant_feedback}
              onChange={e => handleChangeData('instant_feedback', e.target.checked)}
              size="large"
              style={{ width: '80%' }}
            >
              {t('component.options.checkAnswerButton')}
            </Checkbox>
          </Options.Col>
          <Options.Col md={6}>
            <FormGroup>
              <Input
                data-cy="feedback"
                type="number"
                value={questionData.feedback_attempts}
                onChange={e => handleChangeData('feedback_attempts', +e.target.value)}
                size="large"
                style={{ width: '20%', marginRight: 30 }}
              />
              <Options.Label>{t('component.options.attempts')}</Options.Label>
            </FormGroup>
          </Options.Col>
        </Options.Row>
      )}

      <Options.Row>
        <Options.Col md={6}>
          <Checkbox
            data-cy="autoscoreChk"
            checked={questionData.validation.automarkable}
            onChange={e => handleChangeValidation('automarkable', e.target.checked)}
            size="large"
            style={{ width: '80%' }}
          >
            {t('component.options.automarkable')}
          </Checkbox>
        </Options.Col>
      </Options.Row>

      {questionData.validation.automarkable && (
        <Options.Row>
          <Options.Col md={6}>
            <Options.Label>{t('component.options.scoringType')}</Options.Label>
            <Select
              size="large"
              data-cy="scoringType"
              value={questionData.validation.scoring_type}
              style={{ width: '80%' }}
              onChange={value => handleChangeValidation('scoring_type', value)}
            >
              {scoringTypes.map(({ value: val, label }) => (
                <Select.Option data-cy={val} key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Options.Col>

          <Options.Col md={6}>
            <FormGroup>
              <Input
                data-cy="minscore"
                type="number"
                disabled={questionData.validation.unscored}
                value={questionData.validation.min_score_if_attempted}
                onChange={e => handleChangeValidation('min_score_if_attempted', +e.target.value)}
                size="large"
                style={{ width: '20%', marginRight: 30 }}
              />
              <Options.Label>{t('component.options.minScore')}</Options.Label>
            </FormGroup>
          </Options.Col>

          {questionData.validation.scoring_type === 'partialMatchV2' && (
            <Options.Col md={6}>
              <Options.Label>{t('component.options.rounding')}</Options.Label>
              <Select
                size="large"
                value={questionData.validation.rounding}
                style={{ width: '80%' }}
                onChange={value => handleChangeValidation('rounding', value)}
              >
                {roundingTypes.map(({ value: val, label }) => (
                  <Select.Option key={val} value={val}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Options.Col>
          )}
        </Options.Row>
      )}

      {!questionData.validation.automarkable && (
        <Options.Row>
          <Options.Col md={12}>
            <FormGroup>
              <Input
                data-cy="maxscore"
                type="number"
                value={questionData.validation.max_score}
                onChange={e => handleChangeValidation('max_score', +e.target.value)}
                size="large"
                style={{ width: '20%', marginRight: 30 }}
              />
              <Options.Label>{t('component.options.maxScore')}</Options.Label>
            </FormGroup>
          </Options.Col>
        </Options.Row>
      )}
    </Options.Block>
  );
};

Scoring.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  questionData: PropTypes.object.isRequired,
  scoringTypes: PropTypes.array.isRequired
};

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    state => ({
      questionData: getQuestionDataSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(Scoring);
