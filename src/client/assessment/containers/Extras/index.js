import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { get } from 'lodash';
import { Checkbox, Select, Col } from 'antd';

import { withNamespaces } from '@edulastic/localization';
import { math } from '@edulastic/constants';
import { CustomQuillComponent } from '@edulastic/common';

import { getQuestionDataSelector } from '../../../author/src/selectors/question';
import { setQuestionDataAction } from '../../../author/src/actions/question';

import { Block } from '../../styled/WidgetOptions/Block';
import { Heading } from '../../styled/WidgetOptions/Heading';
import { Label } from '../../styled/WidgetOptions/Label';

import Distractors from './Distractors';
import { change } from './helpers';
import { Row } from '../../styled/WidgetOptions/Row';

const inputStyle = {
  minHeight: 35,
  border: '1px solid rgb(223, 223, 223)',
  padding: '5px 15px'
};

const Extras = ({ item, setQuestionData, t, children }) => {
  const _change = change({ item, setQuestionData });

  return (
    <Block>
      <Heading>{t('component.options.extras')}</Heading>

      <Row gutter={36}>
        <Col span={12}>
          <Label>{t('component.options.acknowledgements')}</Label>
          <CustomQuillComponent
            toolbarId="acknowledgements"
            style={inputStyle}
            onChange={value => _change('metadata.acknowledgements', value)}
            showResponseBtn={false}
            value={get(item, 'metadata.acknowledgements', '')}
          />
        </Col>

        <Col span={12}>
          <Label>{t('component.options.distractorRationale')}</Label>
          <CustomQuillComponent
            toolbarId="distractor_rationale"
            style={inputStyle}
            onChange={value => _change('metadata.distractor_rationale', value)}
            showResponseBtn={false}
            value={get(item, 'metadata.distractor_rationale', '')}
          />
        </Col>
      </Row>

      <Row gutter={36}>
        <Col span={12}>
          <Label>{t('component.options.rubricreference')}</Label>
          <CustomQuillComponent
            toolbarId="rubric_reference"
            style={inputStyle}
            onChange={value => _change('metadata.rubric_reference', value)}
            showResponseBtn={false}
            value={get(item, 'metadata.rubric_reference', '')}
          />
        </Col>

        <Col span={12}>
          <Label>{t('component.options.stimulusreviewonly')}</Label>
          <CustomQuillComponent
            toolbarId="stimulus_review"
            style={inputStyle}
            onChange={value => _change('stimulus_review', value)}
            showResponseBtn={false}
            value={get(item, 'stimulus_review', '')}
          />
        </Col>
      </Row>

      <Row gutter={36}>
        <Col span={12}>
          <Label>{t('component.options.instructorStimulus')}</Label>
          <CustomQuillComponent
            toolbarId="instructor_stimulus"
            style={inputStyle}
            onChange={value => _change('instructor_stimulus', value)}
            showResponseBtn={false}
            value={get(item, 'instructor_stimulus', '')}
          />
        </Col>

        <Col span={12}>
          <Label>{t('component.options.sampleAnswer')}</Label>
          <CustomQuillComponent
            toolbarId="sample_answer"
            style={inputStyle}
            onChange={value => _change('metadata.sample_answer', value)}
            showResponseBtn={false}
            value={get(item, 'metadata.sample_answer', '')}
          />
        </Col>
      </Row>

      {children}

      <Row gutter={36}>
        <Col span={12}>
          <Checkbox checked={item.is_math} onChange={e => _change('is_math', e.target.checked)}>
            {t('component.options.containsMath')}
          </Checkbox>
        </Col>

        {item.is_math && (
          <Col span={12}>
            <Label>{t('component.options.mathRenderer')}</Label>
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
      </Row>
    </Block>
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
