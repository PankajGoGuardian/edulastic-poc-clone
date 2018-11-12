import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer, EduButton } from '@edulastic/common';
import { Input } from 'antd';
import { IconPlus } from '@edulastic/icons';
import { white } from '@edulastic/colors';

const Header = ({ onAdd, onSearch }) => (
  <FlexContainer justifyContent="space-between" style={{ marginBottom: 20 }}>
    <EduButton onClick={() => onAdd()} type="secondary" size="large">
      <FlexContainer>
        <IconPlus color={white} width={14} height={14} />
        <span>Add new assignment</span>
      </FlexContainer>
    </EduButton>
    <Input.Search
      placeholder="Search by classes"
      onSearch={onSearch}
      size="large"
      style={{ width: '50%' }}
    />
  </FlexContainer>
);

Header.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default Header;
