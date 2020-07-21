import React, { useMemo } from "react";
import { Rnd } from "react-rnd";
import PropTypes from "prop-types";

import elementDimensions from "../../../../hooks/elementDimensions";
import { DragDropContainer } from "./styled";

export function Responses({
  values,
  bounds,
  handleDragDropValuePosition,
  handleDragDropValue,
  scale,
  width,
  scrollHandler,
  valueHeight
}) {
  // Get height of each response
  const dimensions = useMemo(() => elementDimensions(values, [values]));
  const heights = dimensions.map(obj => Math.max(obj.scrollHeight, valueHeight));

  /**
   * Calculates the accumulated height of responses having index less than current index
   * @param {number} index
   */
  function getResponseOffsetTop(index) {
    const arr = heights.slice(0, index);
    return arr.reduce((acc, num) => acc + num, 0);
  }

  return values.map((value, i) => {
    const offsetTop = getResponseOffsetTop(i);
    const position = { x: 5, y: offsetTop };
    const size = { width: width - 10, height: Math.max(dimensions[i].scrollHeight, valueHeight) };

    function handleDragStop(evt, d) {
      if (window.isIOS) {
        document.body.removeEventListener("touchmove", scrollHandler);
      }
      handleDragDropValuePosition(d, value);
    }

    function handOnDrag(e, d) {
      if (window.isIOS) {
        document.body.addEventListener("touchmove", scrollHandler, { passive: false });
        document.body.scrollTop = 0;
      }
      handleDragDropValue(d, value);
    }

    return (
      <Rnd
        key={value.id}
        position={position}
        size={size}
        onDragStop={handleDragStop}
        onDrag={handOnDrag}
        style={{ zIndex: 10 }}
        disableDragging={false}
        enableResizing={false}
        bounds={bounds}
        className="drag-drop-value"
        scale={scale}
      >
        <DragDropContainer dangerouslySetInnerHTML={{ __html: value.text }} />
      </Rnd>
    );
  });
}

Responses.propTypes = {
  values: PropTypes.array.isRequired,
  bounds: PropTypes.string,
  handleDragDropValuePosition: PropTypes.func.isRequired,
  handleDragDropValue: PropTypes.func.isRequired,
  scale: PropTypes.number,
  width: PropTypes.number,
  scrollHandler: PropTypes.func.isRequired,
  valueHeight: PropTypes.number
};

Responses.defaultProps = {
  bounds: "",
  scale: 1,
  width: 150,
  valueHeight: 50
};
