import React, { useContext } from "react";
import { ScrollContext } from "@edulastic/common";
import PropTypes from "prop-types";

export function WithWindowScroll({ children }) {
  const scrollContext = useContext(ScrollContext);
  const scrollElement = scrollContext.getScrollElement();
  /**
   * keep the original scroll element passed from main container
   * however, scroll should be applied to window and not container in edit mode
   * the container is used only to calculate offsets
   * as window does not have offsetTop and other props
   */
  const scrollContextData = {
    getScrollElement: () => scrollElement,
    scrollWindowInsteadContainer: true
  };

  return <ScrollContext.Provider value={scrollContextData}>{children}</ScrollContext.Provider>;
}

WithWindowScroll.propTypes = {
  children: PropTypes.element.isRequired
};
