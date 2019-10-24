import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { WithResources } from "./withResources";

import { replaceLatexesWithMathHtml } from "../utils/mathUtils";
import { MigratedQuestion } from "../components/MigratedQuestion";

export const withMathFormula = WrappedComponent => {
  const MathFormulaWrapped = props => {
    /**
     * this whole component needs rethinking.
     */
    const { dangerouslySetInnerHTML, isCollapse = false, style = {}, fontSize, theme = {} } = props;
    const [loaded, setLoaded] = useState(false);
    const [newInnerHtml, setNewInnerHtml] = useState("");

    useEffect(() => {
      if (!loaded) {
        setNewInnerHtml(dangerouslySetInnerHTML.__html);
        return;
      }
      setNewInnerHtml(replaceLatexesWithMathHtml(dangerouslySetInnerHTML.__html));
      if (isCollapse && !!newInnerHtml && newInnerHtml.includes("iframe")) {
        setNewInnerHtml(newInnerHtml.replace("<iframe", '<iframe style="display:none" '));
      }
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
        {theme.isV1Migrated ? (
          <MigratedQuestion>
            <WrappedComponent
              {...props}
              data-cy="styled-wrapped-component"
              dangerouslySetInnerHTML={{ __html: newInnerHtml }}
              style={{ ...style, fontSize: fontSize || theme.fontSize }}
            />
          </MigratedQuestion>
        ) : (
          <WrappedComponent
            {...props}
            data-cy="styled-wrapped-component"
            dangerouslySetInnerHTML={{ __html: newInnerHtml }}
            style={{ ...style, fontSize: fontSize || theme.fontSize }}
          />
        )}
      </WithResources>
    );
  };

  MathFormulaWrapped.propTypes = {
    dangerouslySetInnerHTML: PropTypes.object,
    isCollapse: PropTypes.bool.isRequired,
    fontSize: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired,
    style: PropTypes.object
  };

  MathFormulaWrapped.defaultProps = {
    dangerouslySetInnerHTML: {
      __html: ""
    },
    style: {}
  };

  return withTheme(MathFormulaWrapped);
};
