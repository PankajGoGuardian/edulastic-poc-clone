import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { RefContext } from "@edulastic/common";

import { WithResources } from "./withResources";
import { replaceLatexesWithMathHtml } from "../utils/mathUtils";
import { MigratedQuestion } from "../components/MigratedQuestion";
import AppConfig from "../../../../app-config";

export const withMathFormula = WrappedComponent => {
  const MathFormulaWrapped = props => {
    /**
     * this whole component needs rethinking.
     */
    const contextConfig = useContext(RefContext);
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
          `${AppConfig.jqueryPath}/jquery.min.js`,
          `${AppConfig.katexPath}/katex.min.css`,
          `${AppConfig.katexPath}/katex.min.js`
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
              ref={contextConfig?.forwardedRef}
              data-cy="styled-wrapped-component"
              dangerouslySetInnerHTML={{ __html: newInnerHtml }}
              style={{ ...style, fontSize: fontSize || theme.fontSize }}
            />
          </MigratedQuestion>
        ) : (
          <WrappedComponent
            {...props}
            ref={contextConfig?.forwardedRef}
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
