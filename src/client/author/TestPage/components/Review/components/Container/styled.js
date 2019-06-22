import styled from "styled-components";

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
