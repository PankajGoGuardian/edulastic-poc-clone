import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";
import styled from "styled-components";
import { withMathFormula } from "../../HOC/withMathFormula";
import { getMathHtml } from "../../utils/mathUtils";

const Div = styled.div`
  .katex-display {
    text-align: left !important;
  }

  .katex-display .katex {
    text-align: left !important;
  }
`;

const KatexInput = ({ value, onInput }) => {
  const [katexHtml, setKatexHtml] = useState("");
  const [latex, setLatex] = useState("");

  useEffect(() => {
    setLatex(value);
  }, []);

  useEffect(() => {
    if (value !== latex) {
      setLatex(value);
    }
  }, [value]);

  const onChange = pLatex => {
    setLatex(pLatex);
    setKatexHtml(getMathHtml(pLatex));
    onInput(pLatex);
  };

  return (
    <React.Fragment>
      <Input value={latex} onChange={e => onChange(e.target.value)} />
      <Div dangerouslySetInnerHTML={{ __html: katexHtml }} />
    </React.Fragment>
  );
};

KatexInput.propTypes = {
  value: PropTypes.string.isRequired,
  onInput: PropTypes.func.isRequired
};

KatexInput.defaultProps = {};

export default withMathFormula(KatexInput);
