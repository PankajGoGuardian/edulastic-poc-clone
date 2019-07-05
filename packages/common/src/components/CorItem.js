import styled from "styled-components";

import { dashBorderColor, white, themeColor } from "@edulastic/colors";

const CorItem = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  border: 1px solid ${dashBorderColor};
  background: ${white};
  padding: 0 25px;
  font-weight: 600;
  margin-left: 84px;
  width: calc(50% - 50px);
  text-align: center;
  background-color: #fff;

  &:before {
    content: ${({ index }) => `'${index + 1}'`};
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: -40px;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    min-height: 40px;
    width: 40px;
    top: 0px;
    bottom: 0px;
    font-size: 14px;
    font-weight: 600;
    background: ${themeColor};
    color: white;
  }
`;

export default CorItem;
