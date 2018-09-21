import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';
import TextareaAutosize from 'react-autosize-textarea';
import styled from 'styled-components';

import { DeleteButton, DragHandle } from '../../common';
import { grey } from '../../../utilities/css';

const OrderListItem = SortableElement(({ children, onQuestionsChange, onDeleteQuestion }) => (
  <Container>
    <Item>
      <StyledDragHandle>
        <DragHandle />
      </StyledDragHandle>

      <StyledTextarea value={children} onChange={e => onQuestionsChange(e.target.value)} />
    </Item>
    <DeleteButton onDelete={onDeleteQuestion} />
  </Container>
));

OrderListItem.propTypes = {
  children: PropTypes.string.isRequired,
  onQuestionsChange: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default OrderListItem;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin-bottom: 10px;
`;

const StyledTextarea = styled(TextareaAutosize)`
  resize: none;
  width: calc(100% - 50px);
  border: none;
  height: 100%;
  border: 1px solid ${grey};
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  min-height: 50px;
  padding: 15px;
`;

const StyledDragHandle = styled.div`
  width: 50px;
  flex: 1;
  border-top: 1px solid ${grey};
  border-bottom: 1px solid ${grey};
  border-left: 1px solid ${grey};
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  margin-right: 15px;
`;
