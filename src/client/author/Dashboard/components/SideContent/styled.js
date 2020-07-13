import { Col, Divider, Icon, Button } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";
import styled from "styled-components";
import { white, themeColor, mediumDesktopExactWidth, extraDesktopWidthMax, title } from "@edulastic/colors";

export const SliderButton = styled(Button)`
  width: 40px;
  height: 40px;
  border-radius: 50px 0 0 50px;
  background: ${themeColor};
  color: ${white};
  cursor: pointer;
  &:hover,
  &:focus {
    background: ${themeColor};
    color: ${white};
  }
`;
export const SideContentContainer = styled.div`
  display: flex;
  position: fixed;
  transform: ${props => (props.show ? `translate(0%)` : `translate(88%)`)};
  transition: all 0.5s ease-in-out;
  z-index: 300;
  top: ${props => props.theme.HeaderHeight.xs + (props.isProxyUser ? props.theme.BannerHeight : 0)}px;
  right: ${props => (props.show ? "0px" : "-8px")};

  @media (min-width: ${mediumDesktopExactWidth}) {
    top: ${props => props.theme.HeaderHeight.md + (props.isProxyUser ? props.theme.BannerHeight : 0)}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    top: ${props => props.theme.HeaderHeight.xl + (props.isProxyUser ? props.theme.BannerHeight : 0)}px;
  }
`;

export const SideContentWrapper = styled.div`
  background: ${white};
  padding: 20px 30px;
  width: 358px;
  height: ${props => (props.show ? `calc(100vh - ${props.theme.HeaderHeight.xs}px)` : 0)};
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => (props.show ? `calc(100vh - ${props.theme.HeaderHeight.md}px)` : 0)};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => (props.show ? `calc(100vh - ${props.theme.HeaderHeight.xl}px)` : 0)};
  }
`;

export const ScrollbarContainer = styled(PerfectScrollbar)`
  max-height: calc(100vh - 430px);
  overflow-x: hidden;
  width: calc(100% + 15px);
  padding-right: 15px;

  @media (min-width: ${extraDesktopWidthMax}) {
    max-height: calc(100vh - 465px);
  }
`;

export const ColWrapper = styled(Col)`
  background: ${props => props.bg};
  padding: 0.4rem;
  border-radius: 5px;
  text-align: center;
  line-height: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ContentWrapper = styled.div`
  margin-top: ${props => props.mt};
  margin-bottom: ${props => props.mb};
  margin: ${props => props.margin};
  text-align: ${props => props.textalign};
`;

export const Hdivider = styled(Divider)`
  margin: 10px 0px !important;
`;

export const VideoSection = styled.div`
  position: relative;
  width: 100%;
  height: 158px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const VideoPlayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
  filter: brightness(50%);
`;
export const VideoOverlay = styled.div`
  position: relative;
  z-index: 50;
  cursor: pointer;
`;

export const ChatIconContainer = styled.div`
  text-align: end;
  cursor: pointer;
`;
export const ChatIcon = styled(Icon)`
  padding: 1rem;
  font-size: 20px;
  background: ${themeColor};
  color: white;
  border-radius: 50%;
  align-self: end;
  margin-top: 0.5rem;
`;

export const EduCertify = styled.div`
  position: relative;
  span {
    position: absolute;
    bottom: 0px;
    right: 0px;
    left: 0px;
    font-size: 9px;
    font-weight: bold;
    color: ${title};
    text-align: right;
  }
`;

export const EduPublic = styled(EduCertify)`
  span {
    text-align: right;
    color: ${title};
  }
`;
