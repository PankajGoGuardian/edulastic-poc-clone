import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { WithResources } from "@edulastic/common";

export const withMathFormula = WrappedComponent => {
  const NoneDiv = styled.div`
    display: none !important;
    position: absolute;
    opacity: 0;
  `;
  const StyledWrappedComponent = styled(WrappedComponent)`
    p {
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

    const detectLatexes = () => {
      if (!dangerouslySetInnerHTML || !dangerouslySetInnerHTML.__html) {
        return {
          latexHtmls: [],
          latexes: []
        };
      }
      const mathRegex = /<span class="input__math" data-latex="([^"]+)"><\/span>/g;
      let newLatexHtmls = [];

      if (dangerouslySetInnerHTML.__html.match) {
        newLatexHtmls = dangerouslySetInnerHTML.__html.match(mathRegex);
      }

      if (!newLatexHtmls) {
        return {
          latexHtmls: [],
          latexes: []
        };
      }
      const newLatexes = newLatexHtmls.map(html => {
        const mathRegex2 = /<span class="input__math" data-latex="([^"]+)"><\/span>/g;
        const matches = mathRegex2.exec(html);
        if (matches && matches[1]) {
          return matches[1];
        }
        return null;
      });

      return {
        latexHtmls: newLatexHtmls,
        latexes: newLatexes
      };
    };

    const generateNewHtml = (latexHtmls, mathHtmls) => {
      const prevHtml = dangerouslySetInnerHTML.__html;
      let nNewInnerHtml = ` ${prevHtml}`.slice(1);
      for (let i = 0; i < latexHtmls.length; i++) {
        nNewInnerHtml = nNewInnerHtml.replace(latexHtmls[i], mathHtmls[i]);
      }
      return nNewInnerHtml;
    };

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

    const convertLatexToHTML = latex => {
      if (!mathField) return latex;
      mathField.latex(latex);
      return `<span class="input__math" data-latex="${latex}">${mathFieldRef.current.outerHTML}</span>`;
    };

    const convertLatexesToMathHtmls = latexes => latexes.map(latex => convertLatexToHTML(latex));

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
      const { latexHtmls, latexes } = detectLatexes();
      const mathHtmls = convertLatexesToMathHtmls(latexes);
      const nNewInnerHtml = generateNewHtml(latexHtmls, mathHtmls);

      setNewInnerHtml(nNewInnerHtml);
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
