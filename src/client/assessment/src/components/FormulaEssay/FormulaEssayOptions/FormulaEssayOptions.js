import React from 'react';
import PropTypes from 'prop-types';
import { Select, Input, Row, Col, Checkbox } from 'antd';
import { withNamespaces } from '@edulastic/localization';
import styled from 'styled-components';
import { math } from '@edulastic/constants';

import { CustomQuillComponent } from '@edulastic/common';
import Options, { FontSizeSelect, KeyPadOptions } from '../../common/Options';
import { TypedList } from '../../common';

const inputStyle = {
  minHeight: 35,
  border: '1px solid rgb(223, 223, 223)',
  padding: '5px 15px'
};

const FormulaEssayOptions = ({ onChange, item, t }) => {
  const getMetadataValue = value =>
    (item.metadata && item.metadata[value] ? item.metadata[value] : '');

  const changeUiStyle = (prop, value) => {
    onChange('ui_style', {
      ...item.ui_style,
      [prop]: value
    });
  };

  const changeMetadata = (prop, value) => {
    const metadata = item.metadata || {};

    onChange('metadata', {
      ...metadata,
      [prop]: value
    });
  };

  /**
  |--------------------------------------------------
  | Blocks
  |--------------------------------------------------
  */

  const handleAddBlock = () => {
    let textBlocks = [];

    if (item.text_blocks && item.text_blocks.length) {
      textBlocks = [...item.text_blocks];
    }
    onChange('text_blocks', [...textBlocks, '']);
  };

  const handleDeleteBlock = (index) => {
    const textBlocks = [...item.text_blocks];
    textBlocks.splice(index, 1);
    onChange('text_blocks', textBlocks);
  };

  const handleBlockChange = (index, value) => {
    const textBlocks = [...item.text_blocks];
    textBlocks[index] = value;
    onChange('text_blocks', textBlocks);
  };

  return (
    <Options showScoring={false}>
      <Options.Block>
        <Options.Heading>{t('component.options.scoring')}</Options.Heading>

        <StyledRow gutter={36}>
          <Col span={12}>
            <Options.Label>{t('component.options.maxScore')}</Options.Label>
            <Input
              size="large"
              type="number"
              style={{ width: '30%' }}
              onChange={e =>
                onChange('validation', { ...item.validation, max_score: +e.target.value })
              }
            />
          </Col>
          <Col span={12}>
            <Options.Label>{t('component.options.browserspellcheck')}</Options.Label>
            <Checkbox
              checked={item.spellcheck}
              size="large"
              onChange={e => onChange('spellcheck', e.target.checked)}
            >
              Browser spellcheck
            </Checkbox>
          </Col>
        </StyledRow>
      </Options.Block>

      <Options.Block>
        <Options.Heading>{t('component.options.layout')}</Options.Heading>

        <StyledRow gutter={36}>
          <Col span={12}>
            <Options.Label>{t('component.options.templateFontScale')}</Options.Label>
            <Select
              size="large"
              value={item.ui_style.response_font_scale}
              style={{ width: '100%' }}
              onChange={val => changeUiStyle('response_font_scale', val)}
            >
              {math.templateFontScaleOption.map(({ value: val, label }) => (
                <Select.Option key={val} value={val}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <FontSizeSelect
              onChange={val => changeUiStyle('fontsize', val)}
              value={item.ui_style.fontsize}
            />
          </Col>
        </StyledRow>
      </Options.Block>

      <KeyPadOptions onChange={onChange} item={item} />

      <Options.Block>
        <Options.Heading>{t('component.options.textBlocks')}</Options.Heading>

        <StyledRow gutter={36}>
          <Col span={24}>
            <TypedList
              columns={2}
              buttonText="Add"
              onAdd={handleAddBlock}
              items={item.text_blocks}
              onRemove={handleDeleteBlock}
              onChange={handleBlockChange}
            />
          </Col>
        </StyledRow>
      </Options.Block>

      <Options.Block>
        <Options.Heading>{t('component.options.extras')}</Options.Heading>

        <StyledRow gutter={36}>
          <Col span={12}>
            <Options.Label>{t('component.options.acknowledgements')}</Options.Label>
            <CustomQuillComponent
              toolbarId="acknowledgements"
              style={inputStyle}
              onChange={value => changeMetadata('acknowledgements', value)}
              showResponseBtn={false}
              value={getMetadataValue('acknowledgements')}
            />
          </Col>

          <Col span={12}>
            <Options.Label>{t('component.options.distractorRationale')}</Options.Label>
            <CustomQuillComponent
              toolbarId="distractor_rationale"
              style={inputStyle}
              onChange={value => changeMetadata('distractor_rationale', value)}
              showResponseBtn={false}
              value={getMetadataValue('distractor_rationale')}
            />
          </Col>
        </StyledRow>

        <StyledRow gutter={36}>
          <Col span={12}>
            <Options.Label>{t('component.options.rubricreference')}</Options.Label>
            <CustomQuillComponent
              toolbarId="rubric_reference"
              style={inputStyle}
              onChange={value => changeMetadata('rubric_reference', value)}
              showResponseBtn={false}
              value={getMetadataValue('rubric_reference')}
            />
          </Col>

          <Col span={12}>
            <Options.Label>{t('component.options.stimulusreviewonly')}</Options.Label>
            <CustomQuillComponent
              toolbarId="stimulus_review"
              style={inputStyle}
              onChange={value => onChange('stimulus_review', value)}
              showResponseBtn={false}
              value={item.stimulus_review || ''}
            />
          </Col>
        </StyledRow>

        <StyledRow gutter={36}>
          <Col span={12}>
            <Options.Label>{t('component.options.instructorStimulus')}</Options.Label>
            <CustomQuillComponent
              toolbarId="instructor_stimulus"
              style={inputStyle}
              onChange={value => onChange('instructor_stimulus', value)}
              showResponseBtn={false}
              value={item.instructor_stimulus || ''}
            />
          </Col>

          <Col span={12}>
            <Options.Label>{t('component.options.sampleAnswer')}</Options.Label>
            <CustomQuillComponent
              toolbarId="sample_answer"
              style={inputStyle}
              onChange={value => changeMetadata('sample_answer', value)}
              showResponseBtn={false}
              value={getMetadataValue('sample_answer')}
            />
          </Col>
        </StyledRow>

        <StyledRow gutter={36}>
          <Col span={12}>
            <Checkbox checked={item.is_math} onChange={e => onChange('is_math', e.target.checked)}>
              {t('component.options.containsMath')}
            </Checkbox>
          </Col>

          {item.is_math && (
            <Col span={12}>
              <Options.Label>{t('component.options.mathRenderer')}</Options.Label>
              <Select
                size="large"
                value={item.math_renderer}
                style={{ width: '100%' }}
                onChange={val => onChange('math_renderer', val)}
              >
                {math.mathRenderOptions.map(({ value: val, label }) => (
                  <Select.Option key={val} value={val}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          )}
        </StyledRow>
      </Options.Block>
    </Options>
  );
};

FormulaEssayOptions.propTypes = {
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default withNamespaces('assessment')(FormulaEssayOptions);

const StyledRow = styled(Row)`
  margin-bottom: 25px;
`;
