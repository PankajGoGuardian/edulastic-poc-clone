import React from "react";
import PropTypes from "prop-types";
import DragScroll, { UPWARDS, DOWNWARDS } from "@edulastic/common/src/components/DragScroll";

const DragScrollContainer = ({ scrollWrraper }) => (
  <>
    <DragScroll
      context={{ getScrollElement: () => scrollWrraper }}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }}
      direction={UPWARDS}
    />
    <DragScroll
      context={{ getScrollElement: () => scrollWrraper }}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 50
      }}
      direction={DOWNWARDS}
    />
  </>
);

DragScrollContainer.propTypes = {
  scrollWrraper: PropTypes.any
};

DragScrollContainer.defaultProps = {
  scrollWrraper: window
};

export default DragScrollContainer;
