import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';

import { DragHandle } from '../common';
import { Container, StyledDragHandle, Text } from './styled_components';

const OrderListPreviewItem = SortableElement(({ children, showDragHandle }) => (
  <React.Fragment>
    <Container>
      {showDragHandle && (
        <StyledDragHandle>
          <DragHandle />
        </StyledDragHandle>
      )}
      <Text showDragHandle={showDragHandle}>
        <span>{children}</span>
      </Text>
    </Container>
  </React.Fragment>
));

OrderListPreviewItem.propTypes = {
  children: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  showDragHandle: PropTypes.bool,
};

OrderListPreviewItem.defaultProps = {
  showDragHandle: true,
};

export default OrderListPreviewItem;
