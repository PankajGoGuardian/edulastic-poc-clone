import styled from 'styled-components';
import { greenDark, greenDarkSecondary } from '@edulastic/colors';

export const Heading = styled.div`
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: 0.3px;
  text-align: left;
  color: ${greenDark};
  margin-bottom: 35px;
`;

export const Block = styled.div`
  border-bottom: 1px solid #d9d6d6;
  padding-bottom: 20px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: 0.2px;
  text-align: left;
  color: #434b5d;
  margin-bottom: 10px;
  display: block;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

export const Col = styled.div`
  display: flex;
  margin-bottom: 15px;
  flex-direction: column;
  width: ${({ md }) => (100 / 12) * md}%;
`;

export const Header = styled.div`
  padding: 20px 0;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

export const Toggler = styled.div`
  width: 18.9px;
  height: 2.4px;
  background-color: ${greenDark};
  cursor: pointer;
  :hover {
    background-color: ${greenDarkSecondary};
  }
`;
