import styled from "styled-components";
import ProtractorImg from "./assets/protractor.svg";
import CentimeterImg from "./assets/centimeter.svg";

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 50;
`;

export const Protractor = styled.div`
  background: url(${ProtractorImg}) no-repeat;
  background-size: cover;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: transparent;
`;

export const Centimeter = styled.div`
  background: url(${CentimeterImg}) no-repeat;
  background-size: cover;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: transparent;
`;
