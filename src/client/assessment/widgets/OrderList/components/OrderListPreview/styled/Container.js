import styled from "styled-components";

export const Container = styled.div`
  width: ${props => (props.columns === 1 ? 100 / props.columns : 100 / props.columns - 2)}%;
  display: flex;
  min-width: 300px;
  margin-bottom: 15px;
  cursor: pointer;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`;
