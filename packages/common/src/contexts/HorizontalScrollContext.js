import React from "react";

const HorizontalScrollContext = React.createContext({
  getScrollElement: () => window
});

export default HorizontalScrollContext;
