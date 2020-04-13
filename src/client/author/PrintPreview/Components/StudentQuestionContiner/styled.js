import styled from "styled-components";

export const StyledStudentQuestion = styled.div`
  padding: 0 10px;
  page-break-after: always;

  // break-before: always; experimental so avoiding it right now
`;

export const StudentInformation = styled.div`
  margin-right: auto;
`;

export const InfoItem = styled.p`
  font-size: 0.9em;
  font-weight: bold;
`;

export const StudentQuestionHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 15px 25px;
  border-bottom: 1px solid #c0c0c0;
`;

export const TimeContainer = styled.div`
  padding: 0 25px 0 0;
`;

export const Color = styled.span`
  color: #58b294;
`;

export const TimeItem = styled.p`
  font-size: 0.9em;
  font-weight: bold;
`;

export const ScoreContainer = styled.div`
  text-align: center;
`;

export const ScoreLabel = styled.p`
  color: #c0c0c0;
  font-size: 0.8em;
`;

export const TotalScore = styled.p`
  font-weight: bold;
  font-size: 2em;
`;

export const FractionLine = styled.p`
  width: 40px;
  height: 2px;
  background-color: #59595a;
  margin: auto;
`;
