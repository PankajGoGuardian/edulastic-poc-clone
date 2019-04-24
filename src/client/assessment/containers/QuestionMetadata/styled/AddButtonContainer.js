import styled from "styled-components";

export const AddButtonContainer = styled.div`
  margin-top: 11px;
  height: ${props => (props.autoheight ? "auto" : "40px")};

  .ant-btn {
    text-transform: uppercase;
    font-size: 12px;
  }
`;
