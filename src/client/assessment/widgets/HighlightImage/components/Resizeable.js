import React, { useRef } from "react";
import { Rnd } from "react-rnd";
import PropTypes from "prop-types";

const Resizeable = ({ x, y, height, width, src, altText, handleResizing }) => {
  const containerDimensions = {
    width: Math.max(x + width + 10, 700),
    height: Math.max(y + height + 10, 600)
  };

  const wrapperRef = useRef(null);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: `relative`,
        border: `2px dashed #dedede`,
        width: `${containerDimensions.width}px`,
        height: `${containerDimensions.height}px`,
        marginRight: "auto"
      }}
    >
      <Rnd
        disableDragging
        onResizeStop={handleResizing}
        size={{ height, width }}
        position={{ x: Math.max(5, x), y: Math.max(5, y) }}
      >
        <div
          data-cy="previewImage"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `contain`,
            backgroundRepeat: `no-repeat`,
            width: `100%`,
            height: `100%`
          }}
        />
      </Rnd>
    </div>
  );
};

Resizeable.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  altText: PropTypes.string,
  handleResizing: PropTypes.func.isRequired
};

Resizeable.defaultProps = {
  x: 0,
  y: 0,
  altText: ""
};

export default Resizeable;
