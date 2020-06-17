import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Checkbox, Radio } from "antd";

import { Wrapper } from "./styled/Wrapper";
import { InlineLabel } from "./styled/InlineLabel";

const MatrixCell = ({ label, type, correct, isMultiple, checked, onChange, smallSize, isPrintPreview, children }) => {
  let input;

  if (isMultiple) {
    input = <StyledCheckbox checked={checked} onChange={onChange} />;
  } else {
    input = <StyledRadio checked={checked} onChange={onChange} />;
  }

  return (
    <Wrapper smallSize={smallSize} correct={checked && correct} isPrintPreview={isPrintPreview}>
      {input}
      {type === "inline" && <InlineLabel dangerouslySetInnerHTML={{ __html: label }} className="inline-label" />}
      {children}
    </Wrapper>
  );
};

MatrixCell.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  correct: PropTypes.any.isRequired,
  isMultiple: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  children: PropTypes.object
};

MatrixCell.defaultProps = {
  smallSize: false,
  children: null
};

export default MatrixCell;

const StyledCheckbox = styled(Checkbox)`
  margin-left: 8px;
  border-color: red;
`;

const StyledRadio = styled(Radio)`
  margin-left: 8px;
  .ant-radio-checked .ant-radio-inner {
    border-color: ${props => props.theme.widgets.matrixChoice.inlineLabelColor};
    &:after {
      background-color: ${props => props.theme.widgets.matrixChoice.inlineLabelColor};
    }
  }
`;
