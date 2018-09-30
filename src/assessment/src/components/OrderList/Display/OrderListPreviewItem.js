import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';

import { DragHandle } from '../common';
import { Container, StyledDragHandle, Text } from './styled_components';

const OrderListPreviewItem = SortableElement(({ children, showDragHandle, smallSize }) => (
  <React.Fragment>
    <Container>
      {showDragHandle && (
        <StyledDragHandle smallSize={smallSize}>
          <DragHandle smallSize={smallSize} />
        </StyledDragHandle>
      )}
      <Text showDragHandle={showDragHandle} smallSize={smallSize}>
        <span>{children}</span>
      </Text>
    </Container>
  </React.Fragment>
));

OrderListPreviewItem.propTypes = {
  children: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  showDragHandle: PropTypes.bool,
  smallSize: PropTypes.bool,
};

OrderListPreviewItem.defaultProps = {
  showDragHandle: true,
  smallSize: false,
};

export default OrderListPreviewItem;
