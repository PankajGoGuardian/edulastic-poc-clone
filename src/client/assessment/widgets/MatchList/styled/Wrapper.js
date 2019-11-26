import styled from "styled-components";

export const Wrapper = styled.div.attrs({
  className: "matchlist-wrapper"
})`
  width: auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .answer-con.match.label-to-control {
    width: max-content;
    max-width: 100%;
    margin: 0 auto;
  }
`;
