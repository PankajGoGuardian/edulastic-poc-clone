import React, { useEffect, useContext, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import { AnswerContext } from "@edulastic/common";
import { getEmptyImage } from "react-dnd-html5-backend";

const getStyles = isDragging => ({
  opacity: isDragging ? 0.2 : 1
});

const DragItem = ({ data, children, disabled, ...rest }) => {
  const { isAnswerModifiable } = useContext(AnswerContext);
  const [itemSize, setItemSize] = useState();
  const itemRef = useRef();

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: "item", data, dimensions: itemSize, preview: children },
    canDrag() {
      return isAnswerModifiable && !disabled;
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  useEffect(() => {
    setItemSize({ width: itemRef?.current.clientWidth, height: itemRef?.current.clientHeight });
  }, [itemRef?.current?.clientWidth, itemRef?.current?.clientHeight]);

  useEffect(() => {
    if (itemRef.current) {
      drag(itemRef.current);
      preview(getEmptyImage(), { captureDraggingState: true });
    }
  }, []);

  return (
    <div data-cy="drag-item" ref={itemRef} style={getStyles(isDragging)} {...rest}>
      {children}
    </div>
  );
};

DragItem.propTypes = {
  children: PropTypes.node,
  size: PropTypes.object,
  data: PropTypes.string
};

DragItem.defaultProps = {
  children: undefined,
  size: undefined,
  data: ""
};

export default DragItem;
