import styled from "styled-components";
import { mobileWidth } from "@edulastic/colors";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: ${props => props.position};
  z-index: ${props => props.zIndex};
  right: ${props => (props.showPublishButton ? "208px" : "101px")};
  top: 13px;

  @media (max-width: ${mobileWidth}) {
    margin-top: 32px;
  }
`;

export const PreviewBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .ant-btn {
    background: transparent;
    height: 45px;
    padding: 0 10px;
    margin-left: 5px;
    border: 0;
    background: #fff;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);

    button {
      padding: 0;
      text-transform: initial;
      font-size: 12px;
    }

    span {
      font-size: 0;
      margin: 0;
    }
  }
`;

export const Button = styled.button`
  width: 136px;
  height: 45px;
  border-radius: 37px;
  background-color: #f3f3f3;
`;

export const DisplayBlock = styled.div`
  @media (max-width: ${mobileWidth}) {
    display: none;
  }
`;
