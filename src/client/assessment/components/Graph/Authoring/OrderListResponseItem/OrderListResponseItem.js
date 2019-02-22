import React from "react";
import PropTypes from "prop-types";
import { SortableElement } from "react-sortable-hoc";

import DeleteButton from "../../common/DeleteButton";
import DragHandle from "../../common/DragHandle";
import { Container, Item, StyledDragHandle, StyledTextarea } from "../../common/styled_components";
// import { CustomQuillComponent } from '@edulastic/common';

const OrderListItem = SortableElement(({ children, onQuestionsChange, onDeleteQuestion }) => (
  <Container>
    <Item>
      <StyledDragHandle>
        <DragHandle />
      </StyledDragHandle>

      {/* <CustomQuillComponent
        readOnly={false}
        toolbarId={`id${index}`}
        onChange={onQuestionsChange}
        showResponseBtn={false}
        value={children}
        style={{ minHeight: '50px', padding: 10 }}
      /> */}
      <StyledTextarea className="small" value={children} onChange={e => onQuestionsChange(e.target.value)} />
    </Item>
    <DeleteButton onDelete={onDeleteQuestion} />
  </Container>
));

OrderListItem.propTypes = {
  children: PropTypes.string.isRequired,
  onQuestionsChange: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
};

export default OrderListItem;
