import styled from "styled-components";
import { MathFormulaDisplay } from "@edulastic/common";

export const AnswerContent = styled(MathFormulaDisplay)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 8px 25px 8px 10px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  display: inline-block;
  vertical-align: middle;
  ${({ showIndex, inPopover, isPrintPreview }) => `
    max-width: ${showIndex ? 560 : 600}px;
    width: ${showIndex && !inPopover ? "calc(100% - 60px)" : "100%"};
    padding-right: ${isPrintPreview ? 25 : showIndex ? 5 : 20}px;
  `}
`;
