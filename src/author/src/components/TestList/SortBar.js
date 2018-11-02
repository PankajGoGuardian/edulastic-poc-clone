import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { IconList, IconTile } from '@edulastic/icons';
import { FlexContainer } from '@edulastic/common';
import { grey, blue } from '@edulastic/colors';

const SortBar = ({ onSortChange, activeStyle, onStyleChange }) => (
  <FlexContainer>
    <Select defaultValue="" onChange={onSortChange}>
      <Select.Option value="">Sort by</Select.Option>
      <Select.Option value="relevance">Relevance</Select.Option>
    </Select>
    <IconTile
      onClick={() => onStyleChange('tile')}
      width={24}
      height={24}
      color={activeStyle === 'tile' ? blue : grey}
    />
    <IconList
      onClick={() => onStyleChange('horizontal')}
      width={24}
      height={24}
      color={activeStyle === 'horizontal' ? blue : grey}
    />
  </FlexContainer>
);

SortBar.propTypes = {
  onSortChange: PropTypes.func.isRequired,
  onStyleChange: PropTypes.func.isRequired,
  activeStyle: PropTypes.string.isRequired,
};

export default SortBar;
