import styled from 'styled-components';
import { greenDark, greenDarkSecondary } from '@edulastic/colors';
import { Row as AntRow } from 'antd';

export const Heading = styled.div`
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: 0.3px;
  text-align: left;
  color: ${greenDark};
  margin-top: 10px;
  margin-bottom: 35px;
`;

export const Block = styled.div`
  border-top: 1px solid #d9d6d6;
  padding-top: 20px;
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
  position: relative;
  width: 18.9px;
  height: 18.9px;
  cursor: pointer;

  ::before {
    content: '';
    background-color: ${greenDark};
    position: absolute;
    width: 100%;
    height: 3px;
    top: calc(50% - 1.5px);
    left: 0;
  }

  ::after {
    display: ${props => (props.isOpen ? 'none' : 'block')};
    content: '';
    background-color: ${greenDark};
    position: absolute;
    width: 3px;
    height: 100%;
    top: 0;
    left: calc(50% - 1.5px);
  }

  :hover {
    ::before {
      background-color: ${greenDarkSecondary};
    }
    ::after {
      background-color: ${greenDarkSecondary};
    }
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StyledRow = styled(AntRow)`
  margin-bottom: 25px;
`;
