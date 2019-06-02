/* global katex */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { WithResources } from "./withResources";

import { replaceLatexesWithMathHtml } from "../utils/mathUtils";

export const withMathFormula = WrappedComponent => {
  const MathFormulaWrapped = props => {
    /**
     * this whole component needs rethinking.
     */
    const { dangerouslySetInnerHTML } = props;
    const [loaded, setLoaded] = useState(false);
    const [newInnerHtml, setNewInnerHtml] = useState("");

    const getMathHtml = latex => {
      if (!katex) return latex;
      return katex.renderToString(latex);
    };

    useEffect(() => {
      if (!loaded) {
        setNewInnerHtml(dangerouslySetInnerHTML.__html);
        return;
      }
      setNewInnerHtml(replaceLatexesWithMathHtml(dangerouslySetInnerHTML.__html, getMathHtml));
    }, [dangerouslySetInnerHTML, loaded]);

    return (
      <WithResources
        resources={[
          "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js",
          "https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/katex.min.css",
          "https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/katex.min.js"
        ]}
        fallBack={<span />}
        onLoaded={() => {
          setLoaded(true);
        }}
      >
        <WrappedComponent
          {...props}
          data-cy="styled-wrapped-component"
          dangerouslySetInnerHTML={{ __html: newInnerHtml }}
        />
      </WithResources>
    );
  };

  MathFormulaWrapped.propTypes = {
    dangerouslySetInnerHTML: PropTypes.object
  };

  MathFormulaWrapped.defaultProps = {
    dangerouslySetInnerHTML: {
      __html: ""
    }
  };

  return MathFormulaWrapped;
};
