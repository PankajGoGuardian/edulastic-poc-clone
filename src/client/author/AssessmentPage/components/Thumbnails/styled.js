import styled from "styled-components";
import { Button } from "antd";
import { mediumDesktopExactWidth, extraDesktopWidthMax, borders, tabGrey, backgrounds } from "@edulastic/colors";

export const ThumbnailsWrapper = styled.div`
  position: relative;
  width: 220px;
  height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};
  overflow-y: auto;
  padding: 30px 28px;
  padding-right: ${({ review }) => (review ? "28px" : "13px")};
  padding-bottom: 0;
  background: ${backgrounds.primary};

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }
`;

export const ThumbnailsList = styled.div`
  margin-bottom: 70px;
  padding-top: 5px;
  padding-right: 15px;
`;

export const ReuploadButtonWrapper = styled.div`
  text-align: center;
  position: fixed;
  left: ${props => (props.noCheck ? 0 : "100px")};
  bottom: 0;
  width: 220px;
  padding: 15px 22px;
  background: ${backgrounds.primary};
  z-index: 1;
`;

export const ReuploadButton = styled(Button)`
  width: 158px;
  height: 32px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 5px;
  background: ${borders.default};
  border: ${borders.default};
  color: ${tabGrey};
`;

export const ToolBarToggleBtn = styled(Button)`
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 4px;
  padding: 0;
`;
