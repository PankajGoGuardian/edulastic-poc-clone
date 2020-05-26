import styled from "styled-components";
import { Progress } from "antd";
import { greyThemeDark1, extraDesktopWidthMax } from "@edulastic/colors";

const ProgressBar = styled(Progress)`
  padding: ${props => props.padding};
  .ant-progress-outer {
    .ant-progress-inner {
      background-color: ${props => props.trailColor};
    }
  }
  .ant-progress-text {
    display: ${props => props.hideLabel && "none"};
    font-size: 10px;
    color: ${props => props.color || greyThemeDark1};
    letter-spacing: 0.2px;
    font-weight: 600;
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    .ant-progress-text {
      font-size: ${props => props.fontSize || "12px"};
    }
  }
`;

export default ProgressBar;
