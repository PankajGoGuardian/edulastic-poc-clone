import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { lightBlue1 } from "@edulastic/colors";
import { TextInputStyled } from "../../../../styled/InputStyles";
import { subOptions } from "../../constants";

const TextEntry = ({ styles, userAnswer, onChange, displayStyleOption }) => {
  const [localValue, setlocalValue] = useState("");
  const answer = userAnswer?.value || "";
  const isDahsline = subOptions.DASHED_LINE === displayStyleOption;

  const handleChange = ({ target: { value } }) => setlocalValue(value);

  const handleBlur = () => onChange(localValue);

  useEffect(() => {
    setlocalValue(answer);
  }, [answer]);
  return (
    <TextEntryWrapper style={styles}>
      <TextInput
        noBorder
        disabled={false}
        onBlur={handleBlur}
        onChange={handleChange}
        value={localValue}
        isDahsline={isDahsline}
      />
    </TextEntryWrapper>
  );
};

export default TextEntry;

const TextEntryWrapper = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  vertical-align: bottom;
`;

const inputStyle = css`
  border-bottom: ${({ isDahsline }) => (isDahsline ? "2px dashed;" : "")};
  background-color: ${({ isDahsline }) => (isDahsline ? "transparent" : lightBlue1)};
`;

const TextInput = styled(TextInputStyled)`
  &.ant-input {
    ${inputStyle}

    &:focus,
    &:hover {
      border: 0px;
      ${inputStyle}
    }
  }
`;
