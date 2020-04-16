import styled from "styled-components";
import { Progress } from "antd";
import { greyThemeDark1, mediumDesktopExactWidth } from "@edulastic/colors";

const ProgressBar = styled(Progress)`
  padding: ${props => props.padding};
  .ant-progress-outer {
    .ant-progress-inner {
      background-color: ${props => props.trailColor};
    }
  }
  .ant-progress-text {
    display: ${props => props.hideLabel && "none"};
    font-size: ${props => props.fontSize || "12px"};
    color: ${props => props.color || greyThemeDark1};
    letter-spacing: 0.2px;
    font-weight: 600;
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    .ant-progress-text {
      font-size: 10px;
    }
  }
`;

export default ProgressBar;
