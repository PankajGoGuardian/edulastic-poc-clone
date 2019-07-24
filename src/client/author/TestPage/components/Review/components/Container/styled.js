import styled from "styled-components";
import { mainBgColor } from "@edulastic/colors";

export const ReviewPageContainer = styled.div`
  padding-top: 16px;
  .fixed-second-header {
    background: ${mainBgColor};
    top: 96px;
    position: fixed;
    left: 100px;
    right: 0;
    z-index: 2;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
    padding-right: 25%;
    padding-top: 10px;
    transition: top 1s ease-in;
    > div {
      margin: 0;
      .ant-breadcrumb {
        display: none;
      }
    }
  }
`;
export const SecondHeader = styled.div`
  display: flex;
  flex-direction: ${props => (props.isMobileSize ? "row" : "column")}
  justify-content: space-between;
  margin-bottom: 10px;
  
  & > div > .ant-btn {
    background: transparent;
    height: 24px;
    margin-left: 17px;
    & > button {
      height: 24px;
      margin-top: -1px;
    }
  }
`;
