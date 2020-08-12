import styled from "styled-components";
import { Button } from "antd";
import { mediumDesktopExactWidth, extraDesktopWidthMax, borders, tabGrey, backgrounds } from "@edulastic/colors";

export const ThumbnailsWrapper = styled.div`
  position: relative;
  overflow-y: auto;
  padding: ${props => (props.testMode || props.reportMode ? "30px 25px" : "30px 25px 50px")};
  background: ${backgrounds.primary};
  min-width: 180px;
  max-width: 180px;
  height: ${props =>
    `calc(100vh - ${
      props.testMode ? "70" : props.reportMode ? props.theme.HeaderHeight.xs + 41 : props.theme.HeaderHeight.xs
    }px) - 43px`};

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props =>
      `calc(100vh - ${
        props.testMode ? "70" : props.reportMode ? props.theme.HeaderHeight.md + 41 : props.theme.HeaderHeight.md
      }px) - 43px`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props =>
      `calc(100vh - ${
        props.testMode ? "70" : props.reportMode ? props.theme.HeaderHeight.xl + 41 : props.theme.HeaderHeight.xl
      }px) - 43px`};
    min-width: 200px;
    max-width: 200px;
  }
`;

export const ThumbnailsList = styled.div`
  width: 125px;
  margin-bottom: 20px;

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 145px;
  }
`;

export const ReuploadButtonWrapper = styled.div`
  text-align: center;
  position: fixed;
  left: ${props => (props.noCheck ? 0 : "70px")};
  bottom: 0;
  width: 180px;
  padding: 15px 25px;
  background: ${backgrounds.primary};
  z-index: 1;

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 200px;
  }
`;

export const ReuploadButton = styled(Button)`
  width: 130px;
  height: 32px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 5px;
  background: ${borders.default};
  border: ${borders.default};
  color: ${tabGrey};
  padding: 0px;

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 150px;
  }
`;

export const ToolBarToggleBtn = styled(Button)`
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 4px;
  padding: 0;
`;
