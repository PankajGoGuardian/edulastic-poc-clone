import { Row, Col, Divider, Icon, Button } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";
import styled from "styled-components";
import { white, lightBlue3 } from "@edulastic/colors";

export const SliderButton = styled(Button)`
  width: 40px;
  height: 40px;
  color: ${white} !important;
  border-radius: 50px 0 0 50px;
  background: ${lightBlue3} !important;
  cursor: pointer;
`;
export const SideContentContainer = styled.div`
  display: flex;
  position: fixed;
  transform: ${props => (props.show ? `translate(0%)` : `translate(88%)`)};
  transition: all 0.5s ease-in-out;
  z-index: 300;
  top: 96px;
  right: 0;
`;

export const SideContentWrapper = styled.div`
  background: #ffffff;
  padding: 1.2rem;
  width: 275px !important;
  height: 120vh;
`;

export const ScrollbarContainer = styled(PerfectScrollbar)`
  max-height: 300px;
  overflow-x: hidden;
`;

export const ColWrapper = styled(Col)`
  background: ${props => props.bg};
  padding: 0.4rem;
  border-radius: 5px;
  text-align: center;
  line-height: 1rem;
  align-items: center;
`;

export const ContentWrapper = styled.div`
  margin-top: ${props => props.mt};
  margin-bottom: ${props => props.mb};
  margin: ${props => props.margin};
  text-align: ${props => props.textalign};
`;

export const Hdivider = styled(Divider)`
  margin: 10px !important;
`;

export const VideoSection = styled.div`
  position: relative;
  width: 230px;
  height: 158px;
  overflow: hidden;
  filter: brightness(50%);
  border-radius: 4px;
  margin-bottom: 0.4rem;
`;

export const VideoPlayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
`;
export const VideoOverlay = styled.div`
  position: relative;
  top: 40%;
  left: 50%;
  opacity: 1;
  z-index: 50;
  cursor: pointer;
`;

export const ChatIconContainer = styled.div`
  text-align: end;
  margin: 1rem;
  cursor: pointer;
`;
export const ChatIcon = styled(Icon)`
  padding: 1rem;
  font-size: 20px;
  background: #00ad50;
  color: white;
  border-radius: 50%;
  align-self: end;
  margin-top: 0.5rem;
`;
