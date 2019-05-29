import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { WithResources } from "@edulastic/common";

import { replaceLatexesWithMathHtml } from "../utils/mathUtils";

export const withMathFormula = WrappedComponent => {
  const NoneDiv = styled.div`
    position: absolute;
    opacity: 0;
  `;
  const StyledWrappedComponent = styled(WrappedComponent)`
    p {
      font-size: 16px;
      font-weight: 400;
      display: inline;
    }
  `;

  const MathFormulaWrapped = props => {
    /**
     * this whole component needs rethinking.
     */
    const { dangerouslySetInnerHTML } = props;

    const [mathField, setMathField] = useState(null);
    const [newInnerHtml, setNewInnerHtml] = useState("");
    const mathFieldRef = useRef(null);

    const initMathField = () => {
      if (mathField || !window.MathQuill) return;
      if (mathFieldRef.current) {
        const MQ = window.MathQuill.getInterface(2);
        try {
          setMathField(MQ.StaticMath(mathFieldRef.current));
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
    };

    const getMathHtml = latex => {
      if (!mathField) return latex;
      mathField.latex(latex);

      return mathFieldRef.current.outerHTML;
    };

    useEffect(() => {
      if (mathFieldRef.current) {
        initMathField();
      }
    }, [mathFieldRef.current]);

    useEffect(() => {
      if (!mathField || (!window.MathQuill && dangerouslySetInnerHTML !== undefined)) {
        setNewInnerHtml(dangerouslySetInnerHTML.__html);
        return;
      }

      setNewInnerHtml(replaceLatexesWithMathHtml(dangerouslySetInnerHTML.__html, getMathHtml));
    }, [dangerouslySetInnerHTML, mathField, window.MathQuill]);

    return (
      <WithResources
        resources={[
          "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js",
          "https://cdnedupoc.snapwiz.net/mathquill/mathquill.css",
          "https://cdnedupoc.snapwiz.net/mathquill/mathquill.min.js"
        ]}
        fallBack={<span />}
        onLoaded={() => {
          initMathField();
        }}
      >
        <React.Fragment>
          <StyledWrappedComponent
            {...props}
            data-cy="styled-wrapped-component"
            dangerouslySetInnerHTML={{ __html: newInnerHtml }}
          />
          <NoneDiv>
            <span ref={mathFieldRef} className="input__math__field" />
          </NoneDiv>
        </React.Fragment>
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
