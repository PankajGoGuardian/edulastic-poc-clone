import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import { AnswerContext } from "@edulastic/common";
import { getEmptyImage } from "react-dnd-html5-backend";

const getStyles = isDragging => ({
  opacity: isDragging ? 0 : 1
});

const DragItem = ({ data, children, ...rest }) => {
  const { isAnswerModifiable } = useContext(AnswerContext);
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: "item", data, preview: children },
    canDrag() {
      return isAnswerModifiable;
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <div data-cy="drag-item" ref={drag} style={getStyles(isDragging)} {...rest}>
      {children}
    </div>
  );
};

DragItem.propTypes = {
  children: PropTypes.node,
  data: PropTypes.string
};

DragItem.defaultProps = {
  children: undefined,
  data: ""
};

export default DragItem;
