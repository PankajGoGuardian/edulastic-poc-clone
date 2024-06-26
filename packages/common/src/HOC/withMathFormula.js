import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { RefContext, sanitizeString } from "@edulastic/common";

import { WithResources } from "./withResources";
import { replaceLatexesWithMathHtml } from "../utils/mathUtils";
import AppConfig from "../../../../app-config";

export const withMathFormula = WrappedComponent => {
  const MathFormulaWrapped = props => {
    /**
     * this whole component needs rethinking.
     */
    const contextConfig = useContext(RefContext);
    const { dangerouslySetInnerHTML, isCollapse = false, style = {}, fontSize, theme = {}, className, color } = props;
    const [loaded, setLoaded] = useState(false);
    const [newInnerHtml, setNewInnerHtml] = useState("");
    let elemClassName = className;
    if (theme.isV1Migrated) {
      elemClassName += " migrated-question";
    }
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

    let htmlStr = newInnerHtml;
    if (theme.isV1Migrated) {
      htmlStr = sanitizeString(htmlStr);
    }

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
        <WrappedComponent
          {...props}
          ref={contextConfig?.forwardedRef}
          className={elemClassName}
          data-cy="styled-wrapped-component"
          dangerouslySetInnerHTML={{ __html: htmlStr }}
          style={{ ...style, color: color || theme.questionTextColor, fontSize: fontSize || theme.fontSize }}
        />
      </WithResources>
    );
  };

  MathFormulaWrapped.propTypes = {
    dangerouslySetInnerHTML: PropTypes.object,
    className: PropTypes.string,
    isCollapse: PropTypes.bool.isRequired,
    fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    theme: PropTypes.object.isRequired,
    style: PropTypes.object
  };

  MathFormulaWrapped.defaultProps = {
    dangerouslySetInnerHTML: {
      __html: ""
    },
    className: "",
    style: {}
  };

  return withTheme(MathFormulaWrapped);
};
