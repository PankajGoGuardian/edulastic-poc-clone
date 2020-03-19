import styled from "styled-components";

const SubLabel = styled.div`
  color: ${({ theme }) => theme.themeColor || "#8ed863"};
  padding-left: ${({ paddingLeft }) => paddingLeft || "0.7rem"};
  margin-right: 1rem;
  width: 100%;
`;

export default SubLabel;
