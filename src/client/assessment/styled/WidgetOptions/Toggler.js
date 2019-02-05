import styled from 'styled-components';
import { greenDark, greenDarkSecondary } from '@edulastic/colors';

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
    left: calc(50% - 1.5px);;
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
