import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';
import { Checkbox, message, Button } from 'antd';
import { blue } from '@edulastic/colors';
import { IconClose, IconMoveTo, IconCollapse } from '@edulastic/icons';
import styled from 'styled-components';
import Prompt from './Prompt';
import { ButtonLink } from '../../common';

const HeaderBar = ({ onSelectAll, onRemoveSelected, onCollapse, selectedItems, onMoveTo, windowWidth }) => {
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
    <Container windowWidth={windowWidth}>
      <Item>
        <Checkbox onChange={onSelectAll} style={{ color: blue, fontSize: 11, fontWeight: '600' }}>
          SELECT ALL
        </Checkbox>
      </Item>
      <Button style={{ marginLeft: 0 }}>
        <ButtonLink
          onClick={onRemoveSelected}
          color="primary"
          icon={<IconClose color={blue} width={12} height={12} />}
        >
          {
            windowWidth > 468 &&
            <span>Remove Selected</span>
          }
        </ButtonLink>
      </Button>
      <Button style={{ marginLeft: 0 }}>
        <ButtonLink
          onClick={handleMoveTo}
          color="primary"
          icon={<IconMoveTo color={blue} width={12} height={12} />}
        >
          {
            windowWidth > 468 &&
            <span>Move to</span>
          }
        </ButtonLink>
      </Button>
      <Button style={{ marginLeft: 0 }}>
        <ButtonLink
          onClick={onCollapse}
          color="primary"
          icon={<IconCollapse color={blue} width={12} height={12} />}
        >
          {
            windowWidth > 468 &&
            <span>Collapse Rows</span>
          }
        </ButtonLink>
        <Prompt
          show={showPrompt}
          style={{ position: 'absolute', left: 0, top: 25 }}
          onSuccess={handleSuccess}
        />
      </Button>
    </Container>
  );
};

HeaderBar.propTypes = {
  onSelectAll: PropTypes.func.isRequired,
  onMoveTo: PropTypes.func.isRequired,
  onRemoveSelected: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
  windowWidth: PropTypes.number.isRequired,
};

export default HeaderBar;

const Item = styled(FlexContainer)`
  cursor: pointer;
  margin-right: 20px;
  color: ${blue};
  position: relative;
`;

const Container = styled(FlexContainer)`
  justify-content: space-between;
  padding-bottom: 22px;
  margin-top: ${props => (props.windowWidth > 468 ? '0px' : '15px')};
`;
