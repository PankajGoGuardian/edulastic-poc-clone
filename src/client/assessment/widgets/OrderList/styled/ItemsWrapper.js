import styled from "styled-components";

export const ItemsWrapper = styled.div`
  display: ${props => (props.styleType === "inline" ? "flex" : null)};
`;
