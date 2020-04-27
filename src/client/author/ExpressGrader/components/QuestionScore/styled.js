import styled from "styled-components";

const statusColors = {
  correct: "rgba(94, 181, 0, 0.4)",
  partiallyCorrect: "rgba(253, 204, 59, 0.4)",
  ungraded: "rgba(56, 150, 190, 0.4)",
  wrong: "rgba(243, 95, 95, 0.4)",
  skipped: "rgba(106, 115, 127, 0.4)"
};

export const StyledWrapper = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  background-color: ${({ answerStatus: status }) => statusColors[status]};
`;

export const StyledText = styled.span`
  color: #434b5d;
  font-size: 14px;
  font-weight: 600;
`;
