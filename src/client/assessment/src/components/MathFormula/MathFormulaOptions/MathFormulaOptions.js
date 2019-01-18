import React from 'react';
import PropTypes from 'prop-types';
import { Select, Checkbox, Input } from 'antd';
import { withNamespaces } from '@edulastic/localization';
import { cloneDeep } from 'lodash';
import { grey } from '@edulastic/colors';
import { evaluationType, math } from '@edulastic/constants';

import { FlexContainer, CustomQuillComponent } from '@edulastic/common';
import Options, { FontSizeSelect, KeyPadOptions } from '../../common/Options';
import ResponseContainers from './ResponseContainers';
import TextBlocks from './TextBlocks';

const quillStyle = {
  minHeight: 40,
  borderRadius: 5,
  padding: '0 10px',
  border: `1px solid ${grey}`,
  width: '80%'
};

const scoringTypes = [
  {
    value: evaluationType.EXACT_MATCH,
    label: 'Exact match'
  }
];

function MathFormulaOptions({
  onChange,
  uiStyle,
  t,
  responseContainers,
  textBlocks,
  stimulusReview,
  instructorStimulus,
  metadata,
  item
}) {
  const changeUiStyle = (prop, value) => {
    onChange('ui_style', {
      ...uiStyle,
      [prop]: value
    });
  };

  const changeMetadata = (prop, value) => {
    onChange('metadata', {
      ...metadata,
      [prop]: value
    });
  };

  const changeResponseContainers = ({ index, prop, value }) => {
    const newContainers = cloneDeep(responseContainers);
    newContainers[index][prop] = value;
    onChange('response_containers', newContainers);
  };

  const addResponseContainer = () => {
    onChange('response_containers', [...responseContainers, {}]);
  };

  const deleteResponseContainer = (index) => {
    const newContainers = cloneDeep(responseContainers);
    newContainers.splice(index, 1);
    onChange('response_containers', newContainers);
  };

  const changeTextBlock = ({ index, value }) => {
    const newBlocks = cloneDeep(textBlocks);
    newBlocks[index] = value;
    onChange('text_blocks', newBlocks);
  };

  const addTextBlock = () => {
    onChange('text_blocks', [...textBlocks, '']);
  };

  const deleteTextBlock = (index) => {
    const newBlocks = cloneDeep(textBlocks);
    newBlocks.splice(index, 1);
    onChange('text_blocks', newBlocks);
  };

  return (
    <Options scoringTypes={scoringTypes}>
      <Options.Block>
        <Options.Heading>Layout</Options.Heading>

        <Options.Row>
          <Options.Col md={6}>
            <Options.Label>{t('component.options.templateFontScale')}</Options.Label>
            <Select
              size="large"
              value={uiStyle.response_font_scale}
              style={{ width: '80%' }}
              onChange={val => changeUiStyle('response_font_scale', val)}
            >
              {math.templateFontScaleOption.map(({ value: val, label }) => (
                <Select.Option key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Options.Col>
          <Options.Col md={6}>
            <FlexContainer>
              <Input
                type="number"
                style={{ width: 110 }}
                value={uiStyle.min_width}
                onChange={e => changeUiStyle('min_width', +e.target.value)}
              />
              <Options.Label style={{ marginBottom: 0 }}>
                {t('component.options.responseMinimumWidth')}
              </Options.Label>
            </FlexContainer>
          </Options.Col>
        </Options.Row>

        <Options.Row>
          <Options.Col md={6}>
            <FontSizeSelect
              onChange={val => changeUiStyle('fontsize', val)}
              value={uiStyle.fontsize}
            />
          </Options.Col>

          <Options.Col md={6}>
            <Checkbox
              checked={uiStyle.transparent_background}
              onChange={e => changeUiStyle('transparent_background', e.target.checked)}
            >
              {t('component.options.transparentBackground')}
            </Checkbox>
          </Options.Col>
        </Options.Row>
      </Options.Block>

      <KeyPadOptions onChange={onChange} item={item} />

      <ResponseContainers
        containers={responseContainers}
        onChange={changeResponseContainers}
        onAdd={addResponseContainer}
        onDelete={deleteResponseContainer}
      />

      <TextBlocks
        blocks={textBlocks}
        onChange={changeTextBlock}
        onAdd={addTextBlock}
        onDelete={deleteTextBlock}
      />

      <Options.Block>
        <Options.Heading>{t('component.options.additionalOptions')}</Options.Heading>

        <Options.Row>
          <Options.Col md={6}>
            <Options.Label>{t('component.options.stimulusReviewOnly')}</Options.Label>
            <CustomQuillComponent
              style={quillStyle}
              toolbarId="stimulus_review"
              onChange={value => onChange('stimulus_review', value)}
              showResponseBtn={false}
              value={stimulusReview}
            />
          </Options.Col>
          <Options.Col md={6}>
            <Options.Label>{t('component.options.instructorStimulus')}</Options.Label>
            <CustomQuillComponent
              style={quillStyle}
              toolbarId="instructor_stimulus"
              onChange={value => onChange('instructor_stimulus', value)}
              showResponseBtn={false}
              value={instructorStimulus}
            />
          </Options.Col>
        </Options.Row>

        <Options.Row>
          <Options.Col md={6}>
            <Options.Label>{t('component.options.rubricReference')}</Options.Label>
            <Input
              value={metadata.rubric_reference}
              size="large"
              style={{ width: '80%' }}
              onChange={e => changeMetadata('rubric_reference', e.target.value)}
            />
          </Options.Col>
        </Options.Row>

        <Options.Row>
          <Options.Col md={12}>
            <Options.Label>{t('component.options.sampleAnswer')}</Options.Label>
            <CustomQuillComponent
              toolbarId="sample_answer"
              onChange={value => changeMetadata('sample_answer', value)}
              showResponseBtn={false}
              value={metadata.sample_answer}
            />
          </Options.Col>
        </Options.Row>

        <Options.Row>
          <Options.Col md={12}>
            <Options.Label>{t('component.options.distractorRationale')}</Options.Label>
            <CustomQuillComponent
              style={{ ...quillStyle, width: '100%' }}
              toolbarId="distractor_rationale"
              onChange={value => changeMetadata('distractor_rationale', value)}
              showResponseBtn={false}
              value={metadata.distractor_rationale}
            />
          </Options.Col>
        </Options.Row>

        <Options.Row>
          <Options.Col md={6}>
            <Checkbox
              checked={metadata.distractor_rationale_per_response}
              onChange={e => changeMetadata('distractor_rationale_per_response', e.target.checked)}
            >
              {t('component.options.distractorRationalePerResponse')}
            </Checkbox>
          </Options.Col>
        </Options.Row>
      </Options.Block>
    </Options>
  );
}

MathFormulaOptions.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  stimulusReview: PropTypes.string,
  instructorStimulus: PropTypes.string,
  metadata: PropTypes.object,
  responseContainers: PropTypes.array,
  t: PropTypes.func.isRequired,
  textBlocks: PropTypes.array,
  uiStyle: PropTypes.object
};

MathFormulaOptions.defaultProps = {
  responseContainers: [],
  textBlocks: [],
  stimulusReview: '',
  instructorStimulus: '',
  metadata: {
    rubric_reference: '',
    sample_answer: '',
    distractor_rationale: '',
    distractor_rationale_per_response: false
  },
  uiStyle: {
    type: 'standard',
    fontsize: 'normal',
    columns: 0,
    orientation: 'horizontal',
    choice_label: 'number'
  }
};

export default withNamespaces('assessment')(MathFormulaOptions);
