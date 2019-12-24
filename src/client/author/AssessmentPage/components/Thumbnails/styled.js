import styled from "styled-components";
import { Button } from "antd";
import { mediumDesktopExactWidth, extraDesktopWidthMax, borders, tabGrey, backgrounds } from "@edulastic/colors";

export const ThumbnailsWrapper = styled.div`
  position: relative;
  overflow-y: auto;
  padding: ${props => (props.testMode ? "30px 25px" : "30px 25px 50px")};
  background: ${backgrounds.primary};
  min-width: 200px;
  max-width: 200px;
  height: ${props => `calc(100vh - ${props.testMode ? "70" : props.theme.HeaderHeight.xs}px)`};

  @media (max-width: ${mediumDesktopExactWidth}) {
    min-width: 180px;
    max-width: 180px;
  }
  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => `calc(100vh - ${props.testMode ? "70" : props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => `calc(100vh - ${props.testMode ? "70" : props.theme.HeaderHeight.xl}px)`};
  }
`;

export const ThumbnailsList = styled.div`
  width: 145px;
  margin-bottom: 20px;

  @media (max-width: ${mediumDesktopExactWidth}) {
    width: 125px;
  }
`;

export const ReuploadButtonWrapper = styled.div`
  text-align: center;
  position: fixed;
  left: ${props => (props.noCheck ? 0 : "100px")};
  bottom: 0;
  width: 200px;
  padding: 15px 25px;
  background: ${backgrounds.primary};
  z-index: 1;

  @media (max-width: ${mediumDesktopExactWidth}) {
    width: 180px;
  }
`;

export const ReuploadButton = styled(Button)`
  width: 150px;
  height: 32px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 5px;
  background: ${borders.default};
  border: ${borders.default};
  color: ${tabGrey};

  @media (max-width: ${mediumDesktopExactWidth}) {
    width: 130px;
    padding: 0px;
  }
`;

export const ToolBarToggleBtn = styled(Button)`
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 4px;
  padding: 0;
`;
