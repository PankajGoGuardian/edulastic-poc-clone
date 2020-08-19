import React, { Fragment, useState } from "react";
import { FaBars } from "react-icons/fa";
import { SortableElement, SortableHandle } from "react-sortable-hoc";
import { Container } from "../styled/FlexCon";
import { OptionBlock } from "../styled/OptionBlock";

import icons from "../icons";

const DragHandle = SortableHandle(() => (
  <OptionBlock justifyContent="center" borderTop>
    <FaBars className="drag-handler" />
  </OptionBlock>
));

const SortableItem = SortableElement(({ item, i, handleActiveChange }) => {
  const [focused, setFocus] = useState();
  const { value, active } = item;
  const optionKey = value === "|" ? "div" : value;
  const FormatOptionIcon = icons[optionKey] || Fragment;

  const onClickHandler = e => {
    e.preventDefault();
    handleActiveChange(i);
  };

  const onMouseEnterHandler = () => {
    setFocus(true);
  };

  const onMouseLeaveHandler = () => {
    setFocus(false);
  };

  return (
    <Container
      flexDirection="column"
      active={active || focused}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
    >
      <OptionBlock onClick={onClickHandler} className="option-block">
        <FormatOptionIcon />
      </OptionBlock>
      <DragHandle />
    </Container>
  );
});

export default SortableItem;
