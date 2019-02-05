import styled from 'styled-components';
import { tabletWidth } from '@edulastic/colors';

export const CorrectAnswerHeader = styled.div`
  width: 100%;
  height: 67px;
  padding: 11px 16px;
  background: #e6e6e63A;
  align-items: center;
  margin-bottom: 17px;
  font-family: Open Sans;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.38;
  letter-spacing: 0.2px;
  text-align: left;
  color: #434b5d;

  @media (max-width: ${tabletWidth}) {
    width: 100%;
  }
`;
