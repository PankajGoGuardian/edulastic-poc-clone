import React from "react";
import { WithResources } from "@edulastic/common";
import AxisLabelsContainer from "./AxisLabelsContainer";

export const AxisLabelsContainerWithResources = ({ ...props }) => (
  <WithResources
    resources={[
      "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js",
      "https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/katex.min.js"
    ]}
    fallBack={<span />}
    onLoaded={() => {}}
  >
    <AxisLabelsContainer {...props} />
  </WithResources>
);
