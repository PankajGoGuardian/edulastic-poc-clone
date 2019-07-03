import React from "react";

const ScrollContext = React.createContext({
  getScrollElement: () => window
});

export default ScrollContext;
