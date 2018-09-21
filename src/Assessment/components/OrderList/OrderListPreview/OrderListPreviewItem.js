import React from 'react';
import PropTypes from 'prop-types';
import { SortableElement } from 'react-sortable-hoc';
import styled from 'styled-components';

import DragHandle from '../../UI/DragHandle';
import { grey } from '../../../utilities/css';

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

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  margin-bottom: 10px;
  cursor: pointer;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
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

const Text = styled.div`
  resize: none;
  width: ${({ showDragHandle }) => (showDragHandle ? 'calc(100% - 50px)' : '100%')};
  border: none;
  height: 100%;
  border: 1px solid ${grey};
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  min-height: 50px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
