import styled from "styled-components";
import { Button } from "antd";
import { smallDesktopWidth, themeColor, white } from "@edulastic/colors";

export const NavigationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  svg {
    fill: ${props => props.theme.iconColor};
  }
`;

export const LinksWrapper = styled.div`
  display: flex;
  justify-content: row;
  align-items: center;
  cursor: pointer;
`;

export const Link = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  margin: 0 10px;
  cursor: pointer;

  @media (max-width: ${smallDesktopWidth}) {
    margin: 0 5px;
  }
`;

export const CloseModal = styled(Button)`
  font-size: ${props => props.theme.linkFontSize};
  width: 80px;
  height: 32px;
  font-weight: 600;
  color: ${white};
  background-color: ${themeColor};
  border: 1px ${themeColor} solid;
  text-transform: uppercase;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  svg {
    fill: ${white};
  }
  &:hover {
    color: ${themeColor};
    background-color: #ffffff;
    svg {
      fill: ${themeColor};
    }
  }
`;

export const StyledText = styled.span`
  margin: 0 5px;
  font-size: ${props => props.theme.smallFontSize};
  font-weight: 600;
  user-select: none;

  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${props => props.theme.extraSmallFontSize};
  }
`;

export const CloseModalText = styled.span`
  font-size: ${props => props.theme.linkFontSize};
  margin-left: 15px;
`;

export const StyledTextInfo = styled.span`
  display: flex;
  justify-content: row;
  align-items: center;
  font-weight: 500;
`;

export const EditResponse = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;
