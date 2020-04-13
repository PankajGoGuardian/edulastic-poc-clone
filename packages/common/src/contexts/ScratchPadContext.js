import React from "react";

// in future whenever consuming the context, extend the default value
// if it has multiple values.
const ScratchPadContext = React.createContext({
  getContainer: () => null
});

export default ScratchPadContext;
