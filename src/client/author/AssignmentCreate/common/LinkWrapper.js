import styled from "styled-components";

const LinkWrapper = styled.div`
  text-transform: uppercase;
  margin-bottom: 10px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  color: ${props => props.theme.themeTextColor};
`;

export default LinkWrapper;
