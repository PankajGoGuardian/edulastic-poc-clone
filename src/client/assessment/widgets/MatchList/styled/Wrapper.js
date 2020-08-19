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
    max-width: 100%;
    margin: 0 auto;
  }
`;
