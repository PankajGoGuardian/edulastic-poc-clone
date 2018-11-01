import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';
import { Checkbox } from 'antd';
import { blue } from '@edulastic/colors';
import { IconClose, IconMoveTo, IconCollapse } from '@edulastic/icons';
import styled from 'styled-components';
import Prompt from './Prompt';

const HeaderBar = ({ onSelectAll, onRemoveSelected, onCollapse }) => {
  const [showPrompt, setShowPrompt] = useState(false);

  const handleSuccess = (position) => {
    console.log(position);
    setShowPrompt(false);
  };

  return (
    <FlexContainer>
      <Item>
        <Checkbox onChange={onSelectAll} style={{ color: blue }}>
          Select all
        </Checkbox>
      </Item>
      <Item onClick={onRemoveSelected}>
        <IconClose color={blue} width={12} height={12} />
        <span>Remove Selected</span>
      </Item>
      <Item>
        <FlexContainer onClick={() => setShowPrompt(!showPrompt)}>
          <IconMoveTo color={blue} />
          <span>Move to</span>
        </FlexContainer>
        <Prompt
          show={showPrompt}
          style={{ position: 'absolute', left: 0, top: 25 }}
          onSuccess={handleSuccess}
        />
      </Item>
      <Item onClick={onCollapse}>
        <IconCollapse color={blue} />
        <span>Collapse Rows</span>
      </Item>
    </FlexContainer>
  );
};

HeaderBar.propTypes = {
  onSelectAll: PropTypes.func.isRequired,
  onRemoveSelected: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired,
};

export default HeaderBar;

const Item = styled(FlexContainer)`
  cursor: pointer;
  margin-right: 20px;
  color: ${blue};
  position: relative;
`;
