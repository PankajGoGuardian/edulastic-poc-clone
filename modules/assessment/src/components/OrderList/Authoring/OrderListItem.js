import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';

import { DeleteButton, DragHandle } from '../common';
import {
  Container, Item, StyledDragHandle, StyledTextarea,
} from './styled_components';

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
