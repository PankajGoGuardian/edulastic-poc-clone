import styled from "styled-components";
import { Progress } from "antd";
import { greyThemeDark1 } from "@edulastic/colors";

const ProgressBar = styled(Progress)`
  .ant-progress-text {
    display: ${props => props.hideLabel && "none"};
    font: ${props => props.fontStyle || "12px/17px Open Sans"};
    color: ${props => props.color || greyThemeDark1};
    letter-spacing: 0.2px;
    font-weight: 600;
    ${props =>
      props.percent == 100 &&
      `
      &:before {
        content: "100%";
      }
      i {
        display: none;
      }
    `}
  }
`;

export default ProgressBar;
