import styled from "styled-components";

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .ant-table-wrapper {
    width: 100%;
  }

  input {
    border: 1px solid #d9d9d9;
  }
`;

export const StyledButton = styled.a`
  margin-right: 20px;
  font-size: 20px;
`;

export const StyledDeleteButton = styled(StyledButton)`
  pointer-events: ${props => (props.disiable ? "none" : "auto")};
  color: ${props => (props.disiable ? "rgba(0,0,0,0.65)" : "#1890ff")};
`;

export const StyledAddButton = styled.a`
  float: right;
  background: #fff;
  border: 2px solid #40a9ff;
  border-radius: 16px;
  color: #40a9ff;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  padding: 2px 20px;
  &:hover {
    background: #00b0ff;
    border: 2px solid #00b0ff;
    color: white;
  }
`;
