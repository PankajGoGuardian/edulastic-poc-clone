import styled from 'styled-components';
import {
  textColor,
  grey,
  red,
  green,
  mainTextColor,
  lightGreen,
  lightRed,
} from '@edulastic/colors';

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  margin-bottom: 10px;
  background: ${({ correct }) => (correct ? lightGreen : lightRed)};
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-left: 2px solid ${({ correct }) => (correct ? green : red)};
`;

export const CorrectAnswerItem = styled.div`
  width: calc(100% - 40px);
  display: flex;
  align-items: stretch;
  margin-bottom: 10px;
  cursor: pointer;
  background: ${grey};
  margin-left: 40px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-left: 2px solid ${textColor};
`;

export const Text = styled.div`
  resize: none;
  width: 100%;
  border: none;
  height: 100%;
  border: 1px solid ${grey};
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  min-height: 50px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Icon = styled.div`
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 24px;
  color: ${({ color }) => color};
`;

export const Index = styled.span`
  font-size: 26px;
  margin-right: 50px;
  font-weight: 600;
  color: ${({ color }) => color || mainTextColor};
`;

export const QuestionText = styled.span`
  font-size: 16px;
`;
