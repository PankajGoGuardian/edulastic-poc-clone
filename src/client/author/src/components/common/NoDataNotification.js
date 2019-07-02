import styled from "styled-components";
import NoDataSVG from "../../assets/nodata.svg";

export const NoDataIcon = NoDataSVG;

export const NoDataWrapper = styled.div`
  background: white;
  width: ${props => (props.width ? props.width : "100%")};
  height: ${props => (props.height ? props.height : "400px")};
  margin: ${props => (props.margin ? props.margin : "0px")};
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  position: relative;
`;

export const NoDataBox = styled.div`
  background: #f3f3f3;
  width: ${props => (props.width ? props.width : "300px")};
  height: ${props => (props.height ? props.height : "300px")};
  position: absolute;
  left: 50%;
  border-radius: 6px;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  img {
    width: ${props => (props.svgWidth ? props.svgWidth : "50px")};
    margin-bottom: 15px;
  }
  h4 {
    color: #304050;
    font-size: ${props => (props.titleSize ? props.titleSize : "18px")};
    font-weight: 600;
  }
  p {
    color: #848993;
    font-size: ${props => (props.descSize ? props.descSize : "12px")};
    line-height: 22px;
  }
`;
