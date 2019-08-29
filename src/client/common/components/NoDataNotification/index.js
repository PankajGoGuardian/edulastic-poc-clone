import React from "react";
import styled from "styled-components";
import NoDataIcon from "./nodata.svg";

const NoDataNotification = ({ heading, description }) => (
  <Wrapper>
    <NoDataBox>
      <img src={NoDataIcon} alt="noData" />
      <h4>{heading}</h4>
      <p>{description}</p>
    </NoDataBox>
  </Wrapper>
);

export default NoDataNotification;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 70vh;
  min-width: 400px;
  align-items: center;
  justify-content: center;
  display: flex;
`;
const NoDataBox = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 6px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  img {
    width: 50px;
    margin-bottom: 15px;
  }
  h4 {
    color: ${props => (props.theme.assignment && props.theme.assignment.helpHeadingTextColor) || "#304050"};
    font-size: 18px;
    font-weight: 600;
  }
  p {
    color: ${props => (props.theme.assignment && props.theme.assignment.helpTextColor) || "#848993"};
    font-size: 12px;
    line-height: 22px;
  }
`;
