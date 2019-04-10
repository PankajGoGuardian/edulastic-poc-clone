import styled from "styled-components";

export const StyledContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  float: left;
`;

export const ScoreSpan = styled.span`
  display: block;
  border: 1px solid #000;
  width: 20px;
  height: 15px;
  margin-right: 15px;
`;

export const ScoreSpan4 = styled(ScoreSpan)`
  background-color: #d49efa;
`;

export const ScoreSpan3 = styled(ScoreSpan)`
  background-color: #fdfdc8;
`;

export const ScoreSpan2 = styled(ScoreSpan)`
  background-color: #fd2be3;
`;

export const ScoreSpan1 = styled(ScoreSpan)`
  background-color: #fabdbd;
`;

export const SpanValue = styled.span``;
