import styled from "styled-components";

import { white, themeColor, lightGrey12 } from "@edulastic/colors";

const CorItem = styled.div`
  display: flex;
  position: relative;
  justify-content: flex-start;
  align-self: stretch;
  align-items: center;
  min-height: 32px;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  border: 1px solid ${lightGrey12};
  background: ${white};
  font-weight: 600;
  width: calc(50% - 50px);
  text-align: center;
  background-color: #fff;
  overflow: hidden;
  border: ${({
    theme: {
      answerBox: { borderWidth, borderStyle, borderColor }
    }
  }) => `${borderWidth} ${borderStyle} ${borderColor}`};
  border-radius: ${({
    theme: {
      answerBox: { borderRadius }
    }
  }) => borderRadius};
  ${({ index }) =>
    index &&
    `&:before {
    content: '${index}';
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: -40px;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    min-height: 32px;
    width: 40px;
    top: 0px;
    bottom: 0px;
    font-size: 14px;
    font-weight: 600;
    background: ${themeColor};
    color: white;
  }
 `}
`;

export default CorItem;
