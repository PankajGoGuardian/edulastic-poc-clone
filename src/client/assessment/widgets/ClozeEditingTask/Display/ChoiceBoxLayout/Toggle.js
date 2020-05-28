import React from "react";
import styled from "styled-components";
import fineIndex from "lodash/findIndex";
import { MathFormulaDisplay } from "@edulastic/common";
import { greyThemeLight, greyThemeDark1, lightBlue1 } from "@edulastic/colors";
import { RadioLabel, RadioLabelGroup } from "../../../../styled/RadioWithLabel";
import { subOptions } from "../../constants";

const Toggle = ({ styles, options, userAnswer, disableResponse, onChange, displayStyleOption }) => {
  const answer = userAnswer?.value;
  const answeredIndex = fineIndex(options, op => op === answer);
  const isDashedline = subOptions.DASHED_LINE === displayStyleOption;
  // * 10 is toggle button width and +30 is padding
  const minWidth = options.length * 10 + 30;
  const handleChange = ({ target: { value: opIndex } }) => onChange(options[opIndex]);
  return (
    <ToggleWrapper>
      <AnswerBox isDashedline={isDashedline} style={{ ...styles, width: "auto", minWidth }}>
        <AnswerCont dangerouslySetInnerHTML={{ __html: answer }} isHighlight={!isDashedline} />
      </AnswerBox>
      <RadioGroup value={answeredIndex} disabled={disableResponse} onChange={handleChange} isDashedline={isDashedline}>
        {options.map((_, opIndex) => (
          <Radio value={opIndex} key={opIndex} />
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
  bottom: ${({ isDashedline }) => (isDashedline ? "-14px" : "-4px")};
  &.ant-radio-group {
    .ant-radio-wrapper {
      .ant-radio {
        .ant-radio-inner {
          width: 10px;
          height: 10px;
          background: ${greyThemeLight};
          border-color: ${greyThemeLight};
          &::after {
            width: 6px;
            height: 6px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        &.ant-radio-checked {
          .ant-radio-inner {
            background: ${greyThemeDark1};
            border-color: ${greyThemeDark1};
            &::after {
              background: ${greyThemeDark1};
            }
          }
        }
      }
    }
  }

  & .ant-radio-wrapper {
    font-size: 8px;
  }
`;

const Radio = styled(RadioLabel)`
  &:last-child {
    margin-right: 0px;
  }
`;

const AnswerBox = styled.div`
  padding: 8px 10px;
  display: inline-block;
  vertical-align: middle;
  line-height: 1.2;
  ${({ isDashedline }) => (isDashedline ? "border-bottom: 2px dashed;" : "")}
`;

const AnswerCont = styled(MathFormulaDisplay)`
  ${({ isHighlight }) => (isHighlight ? `background: ${lightBlue1}` : "")}
`;
