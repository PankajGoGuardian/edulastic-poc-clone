import React from 'react';
import PropTypes from 'prop-types';
import { Select, Icon } from 'antd';
import { IconHamburger } from '@edulastic/icons';
import { FlexContainer } from '@edulastic/common';
import { grey, blue } from '@edulastic/colors';

const SortBar = ({ onSortChange, activeStyle, onStyleChange }) => (
  <FlexContainer>
    <Select defaultValue="" onChange={onSortChange}>
      <Select.Option value="">Sort by</Select.Option>
      <Select.Option value="relevance">Relevance</Select.Option>
    </Select>
    <Icon
      onClick={() => onStyleChange('tile')}
      type="appstore"
      theme="filled"
      style={{ color: activeStyle === 'tile' ? blue : grey, fontSize: '24px' }}
    />
    <IconHamburger
      onClick={() => onStyleChange('horizontal')}
      width={26}
      height={26}
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
