import React from "react";
import styled from "styled-components";
import fineIndex from "lodash/findIndex";
import { MathFormulaDisplay } from "@edulastic/common";
import { green } from "@edulastic/colors";
import { RadioLabel, RadioLabelGroup } from "../../../../styled/RadioWithLabel";
import { subOptions } from "../../constants";

const Toggle = ({ styles, options, userAnswer, disableResponse, onChange, displayStyleOption }) => {
  const answer = userAnswer?.value;
  const answeredIndex = fineIndex(options, op => op === answer);
  const isDahsline = subOptions.DASHED_LINE === displayStyleOption;

  const handleChange = ({ target: { value: opIndex } }) => onChange(options[opIndex]);

  return (
    <ToggleWrapper>
      <AnswerBox isDahsline={isDahsline} style={styles}>
        <AnswerCont dangerouslySetInnerHTML={{ __html: answer }} isHighlight={!isDahsline} />
      </AnswerBox>
      <RadioGroup value={answeredIndex} disabled={disableResponse} onChange={handleChange} isDahsline={isDahsline}>
        {options.map((_, opIndex) => (
          <RadioLabel value={opIndex} key={opIndex} />
        ))}
      </RadioGroup>
    </ToggleWrapper>
  );
};

export default Toggle;

const ToggleWrapper = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  vertical-align: bottom;
`;

const RadioGroup = styled(RadioLabelGroup)`
  position: absolute;
  font-size: 8px;
  bottom: ${({ isDahsline }) => (isDahsline ? "-14px" : "-4px")};
  & .ant-radio-inner {
    width: 10px;
    height: 10px;

    &::after {
      width: 6px;
      height: 6px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  & .ant-radio-wrapper {
    font-size: 8px;
  }
`;

const AnswerBox = styled.div`
  padding: 8px 10px;
  display: inline-block;
  vertical-align: middle;
  line-height: 1.2;
  ${({ isDahsline }) => (isDahsline ? "border-bottom: 2px dashed;" : "")}
`;

const AnswerCont = styled(MathFormulaDisplay)`
  ${({ isHighlight }) => (isHighlight ? `background: ${green}` : "")}
`;
