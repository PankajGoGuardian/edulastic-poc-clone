import styled from "styled-components";

export const FroalaContainer = styled.div(props => ({
  position: "relative",
  width: "100%",
  display: "block",
  ...(props.style ? props.style : {})
}));
