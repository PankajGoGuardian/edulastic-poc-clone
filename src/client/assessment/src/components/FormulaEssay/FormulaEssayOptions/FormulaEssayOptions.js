import React from 'react';
import PropTypes from 'prop-types';
import { Select, Input, Row, Col, Checkbox } from 'antd';
import { withNamespaces } from '@edulastic/localization';
import styled from 'styled-components';
import { math } from '@edulastic/constants';

import Options, { FontSizeSelect, KeyPadOptions, Extras } from '../../common/Options';
import { TypedList } from '../../common';

const FormulaEssayOptions = ({ onChange, item, t }) => {
  const changeUiStyle = (prop, value) => {
    onChange('ui_style', {
      ...item.ui_style,
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

      <Extras />
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
