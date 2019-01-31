import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from '@edulastic/localization';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { get } from 'lodash';
import { math } from '@edulastic/constants';

import { Checkbox, Select, Col } from 'antd';
import { CustomQuillComponent } from '@edulastic/common';
import Options from '../../Options';
import { setQuestionDataAction } from '../../../../../../../author/src/actions/question';
import { getQuestionDataSelector } from '../../../../../../../author/src/selectors/question';
import { StyledRow } from '../../styles';
import Distractors from './Distractors';
import { change } from './helpers';

const inputStyle = {
  minHeight: 35,
  border: '1px solid rgb(223, 223, 223)',
  padding: '5px 15px'
};

const Extras = ({ item, setQuestionData, t, children }) => {
  const _change = change({ item, setQuestionData });

  return (
    <Options.Block>
      <Options.Heading>{t('component.options.extras')}</Options.Heading>

      <StyledRow gutter={36}>
        <Col span={12}>
          <Options.Label>{t('component.options.acknowledgements')}</Options.Label>
          <CustomQuillComponent
            toolbarId="acknowledgements"
            style={inputStyle}
            onChange={value => _change('metadata.acknowledgements', value)}
            showResponseBtn={false}
            value={get(item, 'metadata.acknowledgements', '')}
          />
        </Col>

        <Col span={12}>
          <Options.Label>{t('component.options.distractorRationale')}</Options.Label>
          <CustomQuillComponent
            toolbarId="distractor_rationale"
            style={inputStyle}
            onChange={value => _change('metadata.distractor_rationale', value)}
            showResponseBtn={false}
            value={get(item, 'metadata.distractor_rationale', '')}
          />
        </Col>
      </StyledRow>

      <StyledRow gutter={36}>
        <Col span={12}>
          <Options.Label>{t('component.options.rubricreference')}</Options.Label>
          <CustomQuillComponent
            toolbarId="rubric_reference"
            style={inputStyle}
            onChange={value => _change('metadata.rubric_reference', value)}
            showResponseBtn={false}
            value={get(item, 'metadata.rubric_reference', '')}
          />
        </Col>

        <Col span={12}>
          <Options.Label>{t('component.options.stimulusreviewonly')}</Options.Label>
          <CustomQuillComponent
            toolbarId="stimulus_review"
            style={inputStyle}
            onChange={value => _change('stimulus_review', value)}
            showResponseBtn={false}
            value={get(item, 'stimulus_review', '')}
          />
        </Col>
      </StyledRow>

      <StyledRow gutter={36}>
        <Col span={12}>
          <Options.Label>{t('component.options.instructorStimulus')}</Options.Label>
          <CustomQuillComponent
            toolbarId="instructor_stimulus"
            style={inputStyle}
            onChange={value => _change('instructor_stimulus', value)}
            showResponseBtn={false}
            value={get(item, 'instructor_stimulus', '')}
          />
        </Col>

        <Col span={12}>
          <Options.Label>{t('component.options.sampleAnswer')}</Options.Label>
          <CustomQuillComponent
            toolbarId="sample_answer"
            style={inputStyle}
            onChange={value => _change('metadata.sample_answer', value)}
            showResponseBtn={false}
            value={get(item, 'metadata.sample_answer', '')}
          />
        </Col>
      </StyledRow>

      {children}

      <StyledRow gutter={36}>
        <Col span={12}>
          <Checkbox checked={item.is_math} onChange={e => _change('is_math', e.target.checked)}>
            {t('component.options.containsMath')}
          </Checkbox>
        </Col>

        {item.is_math && (
          <Col span={12}>
            <Options.Label>{t('component.options.mathRenderer')}</Options.Label>
            <Select
              size="large"
              value={item.math_renderer || ''}
              style={{ width: '100%' }}
              onChange={val => _change('math_renderer', val)}
            >
              {Array.isArray(math.mathRenderOptions) &&
                math.mathRenderOptions.map(({ value: val, label }) => (
                  <Select.Option key={val} value={val}>
                    {label}
                  </Select.Option>
                ))}
            </Select>
          </Col>
        )}
      </StyledRow>
    </Options.Block>
  );
};

Extras.Distractors = Distractors;

Extras.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  children: PropTypes.any,
  t: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

Extras.defaultProps = {
  children: null
};

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    state => ({
      item: getQuestionDataSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(Extras);
