import styled from "styled-components";
import { white, mobileWidthMax, extraDesktopWidthMax, mediumDesktopExactWidth } from "@edulastic/colors";

const BodyWrapper = styled.div`
  padding: 40px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${white};
  box-shadow: 0px 3px 10px #0000001a;
  border-radius: 10px;
  min-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs + 60}px)`};

  @media (min-width: ${mediumDesktopExactWidth}) {
    min-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md + 60}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    min-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl + 60}px)`};
  }
  @media (max-width: ${mobileWidthMax}) {
    padding: 20px;
  }
`;

export default BodyWrapper;
