import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { measureText } from "@edulastic/common";

import Answer from "./Answer";

/**
 * 1. gets the size of container
 * 2. gets the dimensions of content
 * 3. checks if the content's size is greater than container's size
 * 4. if so, show popover on hover, along with the response
 * 5. otherwise just show the response
 */

function Response({ answer, id }) {
  let containerRef = null;
  const [containerDimensions, setContainerDimensions] = useState({ height: 35, width: 100 });
  const { scrollHeight: contentHeight, scrollWidth: contentWidth } = measureText(answer);
  const { height: containerHeight, width: containerWidth } = containerDimensions;
  const showPopover = contentHeight > containerHeight || contentWidth > containerWidth;

  useEffect(() => {
    if (containerRef) {
      const { height: containerPrevHeight, width: containerPrevWidth } = containerDimensions;
      const { clientHeight: containerNewHeight, clientWidth: containerNewWidth } = containerRef;

      if (containerNewHeight !== containerPrevHeight || containerNewWidth !== containerPrevWidth) {
        setContainerDimensions({
          width: containerNewWidth,
          height: containerNewHeight
        });
      }
    }
  }, [containerRef]);

  return (
    <Answer
      key={id}
      ref={ref => {
        containerRef = ref;
      }}
      answer={answer}
      showPopover={showPopover}
    />
  );
}

Response.propTypes = {
  id: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired
};

export default Response;
