import React, { useState, useEffect, useRef } from "react";
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
    /**
     * this whole component needs rethinking.
     */
    const { dangerouslySetInnerHTML } = props;

    const [mathField, setMathField] = useState(null);
    const [latexHtmls, setLatexHtmls] = useState([]);
    const [latexes, setLatexes] = useState([]);
    const [mathHtmls, setMathHtmls] = useState([]);
    const [newInnerHtml, setNewInnerHtml] = useState("");
    let mathFieldRef = useRef(null);
    const ref = useRef(null);

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
      console.log("startMathValidation: ", mathField, window.MathQuill);
      if (mathField || !window.MathQuill) return;
      if (mathFieldRef && mathFieldRef.current) {
        const MQ = window.MathQuill.getInterface(2);
        try {
          setMathField(MQ.StaticMath(mathFieldRef.current));
        } catch (e) {
          console.warn("setMathField Error", e.message, e.stack);
        }
      }
    };

    useEffect(() => {
      mathFieldRef = ref.current;
      startMathValidating();
    });

    const convertLatexToHTML = latex => {
      if (!mathField) return latex;
      mathField.latex(latex);
      return `<span class="input__math" data-latex="${latex}">${mathFieldRef.current.outerHTML}</span>`;
    };

    const convertLatexesToMathHtmls = () => {
      const newMathHtmls = latexes.map(latex => convertLatexToHTML(latex));
      setMathHtmls(newMathHtmls);
    };

    useEffect(() => {
      if (!window.MathQuill && dangerouslySetInnerHTML !== undefined) {
        setNewInnerHtml(dangerouslySetInnerHTML.__html);
      }
    }, [dangerouslySetInnerHTML, window.MathQuill]);

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
        onLoaded={() => {
          startMathValidating();
        }}
      >
        <React.Fragment>
          <StyledWrappedComponent
            {...props}
            data-cy="styled-wrapped-component"
            dangerouslySetInnerHTML={{ __html: newInnerHtml }}
          />
          <NoneDiv>
            <span ref={ref} className="input__math__field" />
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
