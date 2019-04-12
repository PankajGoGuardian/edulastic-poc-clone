import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { WithResources } from "@edulastic/common";

export const withMathFormula = WrappedComponent => {
  const NoneDiv = styled.div`
    display: none;
  `;
  const StyledWrappedComponent = styled(WrappedComponent)`
    p {
      display: inline;
    }
  `;

  const MathFormulaWrapped = props => {
    const { dangerouslySetInnerHTML } = props;

    const [mathField, setMathField] = useState(null);
    const [latexHtmls, setLatexHtmls] = useState([]);
    const [latexes, setLatexes] = useState([]);
    const [mathHtmls, setMathHtmls] = useState([]);
    const [newInnerHtml, setNewInnerHtml] = useState("");
    let mathFieldRef = null;

    const detectLatexes = () => {
      if (!dangerouslySetInnerHTML || !dangerouslySetInnerHTML.__html) {
        setLatexHtmls([]);
        setLatexes([]);
        return;
      }
      const mathRegex = /<span class="input__math" data-latex="([^"]+)"><\/span>/g;
      let newLatexHtmls = [];

      if (dangerouslySetInnerHTML.__html.match) {
        newLatexHtmls = dangerouslySetInnerHTML.__html.match(mathRegex);
      }

      if (!newLatexHtmls) {
        setLatexHtmls([]);
        setLatexes([]);
        return;
      }
      const newLatexes = newLatexHtmls.map(html => {
        const mathRegex2 = /<span class="input__math" data-latex="([^"]+)"><\/span>/g;
        const matches = mathRegex2.exec(html);
        if (matches && matches[1]) {
          return matches[1];
        }
        return null;
      });

      setLatexHtmls(newLatexHtmls);
      setLatexes(newLatexes);
    };

    const generateNewHtml = () => {
      const prevHtml = dangerouslySetInnerHTML.__html;
      let nNewInnerHtml = ` ${prevHtml}`.slice(1);
      for (let i = 0; i < latexHtmls.length; i++) {
        nNewInnerHtml = nNewInnerHtml.replace(latexHtmls[i], mathHtmls[i]);
      }

      setNewInnerHtml(nNewInnerHtml);
    };

    const startMathValidating = () => {
      if (mathField || !window.MathQuill) return;
      if (mathFieldRef) {
        const MQ = window.MathQuill.getInterface(2);
        setMathField(MQ.StaticMath(mathFieldRef));
      }
    };

    const convertLatexToHTML = latex => {
      if (!mathField) return latex;
      mathField.latex(latex);
      return `<span class="input__math" data-latex="${latex}">${mathFieldRef.outerHTML}</span>`;
    };

    const convertLatexesToMathHtmls = () => {
      const newMathHtmls = latexes.map(latex => convertLatexToHTML(latex));
      setMathHtmls(newMathHtmls);
    };

    const setMathfieldRef = ref => {
      if (ref) {
        mathFieldRef = ref;
        startMathValidating();
      }
    };

    useEffect(() => {
      if (!window.MathQuill && dangerouslySetInnerHTML !== undefined) {
        setNewInnerHtml(dangerouslySetInnerHTML.__html);
      }
    });

    useEffect(() => {
      detectLatexes();
    }, [dangerouslySetInnerHTML]);

    useEffect(() => {
      convertLatexesToMathHtmls();
    }, [mathField, latexHtmls, latexes]);

    useEffect(() => {
      generateNewHtml();
    }, [mathHtmls]);

    return (
      <WithResources
        resources={[
          "https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.css",
          "https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.js",
          "https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.js",
          "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js",
          "https://cdnedupoc.snapwiz.net/mathquill/mathquill.css",
          "https://cdnedupoc.snapwiz.net/mathquill/mathquill.min.js"
        ]}
        fallBack={<span />}
        onLoaded={() => startMathValidating()}
      >
        <React.Fragment>
          <StyledWrappedComponent
            {...props}
            data-cy="styled-wrapped-component"
            dangerouslySetInnerHTML={{ __html: newInnerHtml }}
          />
          <NoneDiv>
            <span ref={ref => setMathfieldRef(ref)} className="input__math__field" />
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
