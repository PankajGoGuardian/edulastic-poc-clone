import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';
import { Checkbox, message } from 'antd';
import { blue } from '@edulastic/colors';
import { IconClose, IconMoveTo, IconCollapse } from '@edulastic/icons';
import styled from 'styled-components';
import Prompt from './Prompt';

const HeaderBar = ({ onSelectAll, onRemoveSelected, onCollapse, selectedItems, onMoveTo }) => {
  const [showPrompt, setShowPrompt] = useState(false);

  const handleSuccess = (position) => {
    const post = position - 1;
    if (selectedItems.length < post) {
      message.info('Value cannot be more than total questions count');
    } else if (post < 0) {
      message.info('Value cannot be less than total questions count');
    } else {
      onMoveTo(post);
      setShowPrompt(false);
    }
  };

  const handleMoveTo = () => {
    if (selectedItems.length === 1) {
      setShowPrompt(!showPrompt);
    } else {
      message.info('select one question at a time');
      setShowPrompt(false);
    }
  };

  return (
    <Container>
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
        <FlexContainer onClick={handleMoveTo}>
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
    </Container>
  );
};

HeaderBar.propTypes = {
  onSelectAll: PropTypes.func.isRequired,
  onMoveTo: PropTypes.func.isRequired,
  onRemoveSelected: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
};

export default HeaderBar;

const Item = styled(FlexContainer)`
  cursor: pointer;
  margin-right: 20px;
  color: ${blue};
  position: relative;
`;

const Container = styled(FlexContainer)`
  padding: 25px 0;
`;
