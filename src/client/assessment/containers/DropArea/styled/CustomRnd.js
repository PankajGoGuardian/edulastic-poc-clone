import styled from "styled-components";
import { Rnd } from "react-rnd";

import { response } from "@edulastic/constants";

const CustomRnd = styled(Rnd)`
  top: 100px;
  left: 120px;
  border: ${props => {
    if (props.showBorder) {
      return props.showDashedBorder ? "2px dashed rgba(0, 0, 0, 0.65)" : "1px solid lightgray";
    }
    return "0px";
  }};
  position: absolute;
  background: rgb(255, 255, 255);
  border-radius: 5px;
  background: ${props => (props.transparentBackground ? "transparent" : props.background)};
  min-height: ${response.minHeight}px;
  min-width: ${response.minWidth}px;

  :after {
    content: "";
    width: 10px;
    height: 10px;
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 2px;
    border-bottom: solid 2px #333;
    border-right: solid 2px #333;
  }
`;

export default CustomRnd;
