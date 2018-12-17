import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { IconList, IconTile } from '@edulastic/icons';
import { FlexContainer } from '@edulastic/common';
import { grey, blue } from '@edulastic/colors';
import styled from 'styled-components';

const SortBar = ({ onSortChange, activeStyle, onStyleChange }) => (
  <FlexContainer>
    <Container>
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
    </Container>
  </FlexContainer>
);

SortBar.propTypes = {
  onSortChange: PropTypes.func.isRequired,
  onStyleChange: PropTypes.func.isRequired,
  activeStyle: PropTypes.string.isRequired
};

export default SortBar;

const Container = styled.div`
  display: flex;
  align-items: center;

  .ant-select {
    margin-right: 23px;
    width: 128px;
  }

  svg {
    margin-right: 23px;
    width: 18px !important;
  }

  .ant-select-selection__rendered {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }

  .ant-select-arrow-icon {
    svg {
      fill: #00b0ff;
      margin-right: 0px;
    }
  }
`;
