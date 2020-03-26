import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { getSelectionRect } from "@edulastic/common";

const pickerWidth = 212; // width of color picker, and will not change.

// returns the position of popover based on user selection.
const getStyles = ({ windowWidth, selectionTop, selectionLeft, selectionWidth, selectionHeight }) => {
  const style = { position: "fixed" };

  style.left = selectionLeft + selectionWidth / 2 - pickerWidth / 2;
  style.top = selectionTop - 50; // - 50 is height of picker

  // If the popover is placed beyond the left edge of the screen align
  // with left edge
  if (style.left < 0) {
    style.left = 0;
    // if the popover is placed beyond the right edge align with the
    // right edge of the sceen
  } else if (style.left + pickerWidth > windowWidth) {
    style.left = windowWidth - pickerWidth;
  }

  // if the popover is placed above the frame, position below selection instead
  if (style.top < 0) {
    style.top = selectionTop + selectionHeight + 5;
  }

  return style;
};

const HighlightPopover = ({ children, isOpen, selectionEl, onTextUnselect, onTextSelect }) => {
  const [containerStyle, updateContainerStyle] = useState(null);
  const [isPressed, toggleIsPressed] = useState(false);
  const [isTextSelected, toggleIsTextSelected] = useState(false);

  let selectionElement = document.body;
  if (selectionEl) {
    selectionElement = selectionEl;
  }

  const updatePosition = () => {
    const browserSelection = document.getSelection();
    const selectionPosition = getSelectionRect(window);
    if (
      selectionPosition != null &&
      selectionElement != null &&
      browserSelection != null &&
      selectionElement.contains(browserSelection.anchorNode) === true &&
      selectionElement.contains(browserSelection.focusNode) === true
    ) {
      if (browserSelection.isCollapsed === false) {
        onTextSelect && onTextSelect();
        toggleIsTextSelected(true);
      } else {
        onTextUnselect && onTextUnselect();
        toggleIsTextSelected(false);
      }

      const style = getStyles({
        windowWidth: window.innerWidth,
        selectionTop: selectionPosition.top,
        selectionLeft: selectionPosition.left,
        selectionWidth: selectionPosition.width,
        selectionHeight: selectionPosition.height
      });

      updateContainerStyle(style);
    } else if (isTextSelected) {
      onTextUnselect && onTextUnselect();
      toggleIsTextSelected(false);
    }
  };

  const mouseDownHandler = () => {
    updatePosition();
    toggleIsPressed(true);
  };

  const mouseUpHandler = () => {
    updatePosition();
    toggleIsPressed(false);
  };

  useEffect(() => {
    selectionElement.addEventListener("mousemove", updatePosition);
    selectionElement.addEventListener("mousedown", mouseDownHandler);
    document.addEventListener("mouseup", mouseUpHandler);

    return () => {
      selectionElement.removeEventListener("mousemove", updatePosition);
      selectionElement.removeEventListener("mousedown", mouseDownHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [selectionElement]);

  let style = {};
  if (containerStyle !== null) {
    style = { ...containerStyle, pointerEvents: isPressed ? "none" : "auto" };
  }

  const content = isOpen && containerStyle && (
    <div style={style} data-cy="color-picker">
      {children}
    </div>
  );

  return createPortal(content, document.body);
};

HighlightPopover.propTypes = {
  children: PropTypes.node.isRequired,
  selectionEl: PropTypes.instanceOf(Element),
  onTextSelect: PropTypes.func,
  onTextUnselect: PropTypes.func,
  isOpen: PropTypes.bool
};

HighlightPopover.defaultProps = {
  isOpen: false,
  selectionEl: document.body,
  onTextSelect: () => null,
  onTextUnselect: () => null
};

export default HighlightPopover;
