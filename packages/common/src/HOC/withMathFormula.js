import React from "react";
import styled from "styled-components";
import { isEqual, cloneDeep } from "lodash";

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
  return class extends React.Component {
    state = {
      MQ: null,
      mathField: null,
      latexHtmls: [],
      latexes: [],
      mathHtmls: [],
      newInnerHTML: ""
    };

    mathFieldRef = React.createRef();

    UNSAFE_componentWillReceiveProps(nextProps) {
      const { latexHtmls, latexes } = this.detectLatexes(nextProps);
      const { latexes: prevLatexes } = this.state;
      if (isEqual(latexes, prevLatexes)) {
        return {};
      }
      const mathHtmls = this.convertLatexesToMathHtmls(latexes);
      this.setState({
        latexHtmls,
        latexes,
        mathHtmls,
        newInnerHTML: this.generateNewHtml(nextProps.dangerouslySetInnerHTML.__html, latexHtmls, mathHtmls)
      });
    }

    detectLatexes = props => {
      const { dangerouslySetInnerHTML } = props;
      if (!dangerouslySetInnerHTML || !dangerouslySetInnerHTML.__html) {
        return {
          latexHtmls: [],
          latexes: []
        };
      }
      const mathRegex = /<span class="input__math" data-latex="([^"]+)"><\/span>/g;
      const latexHtmls = dangerouslySetInnerHTML.__html.match(mathRegex);
      if (!latexHtmls) {
        return {
          latexHtmls: [],
          latexes: []
        };
      }
      const latexes = latexHtmls.map(html => {
        const mathRegex2 = /<span class="input__math" data-latex="([^"]+)"><\/span>/g;
        const matches = mathRegex2.exec(html);
        if (matches && matches[1]) {
          return matches[1];
        }
        return null;
      });
      return {
        latexHtmls,
        latexes
      };
    };

    generateNewHtml = (prevHtml, latexHtmls, mathHtmls) => {
      let newInnerHTML = cloneDeep(prevHtml);
      for (let i = 0; i < latexHtmls.length; i++) {
        newInnerHTML = newInnerHTML.replace(latexHtmls[i], mathHtmls[i]);
      }
      return newInnerHTML;
    };

    componentDidMount() {
      const { dangerouslySetInnerHTML } = this.props;

      if (!window.MathQuill) {
        this.setState({
          newInnerHTML: dangerouslySetInnerHTML.__html
        });
        return;
      }
      this.startMathValidating();
    }

    startMathValidating() {
      const { dangerouslySetInnerHTML } = this.props;

      const MQ = window.MathQuill.getInterface(2);
      const mathField = MQ.StaticMath(this.mathFieldRef.current);
      const { latexHtmls, latexes } = this.detectLatexes(this.props);
      this.setState(
        {
          MQ,
          mathField,
          latexHtmls,
          latexes
        },
        () => {
          const mathHtmls = this.convertLatexesToMathHtmls(latexes);
          this.setState({
            mathHtmls,
            newInnerHTML: this.generateNewHtml(dangerouslySetInnerHTML.__html, latexHtmls, mathHtmls)
          });
        }
      );
    }

    convertLatexesToMathHtmls(latexes) {
      return latexes.map(latex => this.convertLatexToHTML(latex));
    }

    convertLatexToHTML(latex) {
      const { mathField } = this.state;
      if (!mathField) return latex;
      mathField.latex(latex);
      return `<span class="input__math" data-latex="${latex}">${this.mathFieldRef.current.outerHTML}</span>`;
    }

    render() {
      const { newInnerHTML } = this.state;
      return (
        <WithResources
          resources={[
            "https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.css",
            "https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.js",
            "https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.js",
            "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css"
          ]}
          fallBack={<h2>Loading...</h2>}
          onLoaded={() => this.startMathValidating()}
        >
          <React.Fragment>
            <StyledWrappedComponent {...this.props} dangerouslySetInnerHTML={{ __html: newInnerHTML }} />
            <NoneDiv>
              <span ref={this.mathFieldRef} className="input__math__field" />
            </NoneDiv>
          </React.Fragment>
        </WithResources>
      );
    }
  };
};
