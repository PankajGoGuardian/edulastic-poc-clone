import styled from 'styled-components';


const ControlBtn = styled.button`
  width: ${props => props.next ? props.skin ? '58px' : '187px' : '58px'};
  height: 58px;
  border-radius: 5px;
  background-color: ${props => props.skin ? props.theme.controlBtnPrimaryColor : props.theme.controlBtnSecondaryColor};
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  border: none;
  color: ${props => props.theme.controlBtnTextColor};
  font-size: 2rem;
  padding: ${props => props.next ? props.skin ? '0' : '0 25px' : '0'};
  position: relative;
  text-align: left;
  display: ${props => props.setting ? 'none' : props.next ? props.skin ? 'flex': 'block' : 'flex'};
  align-items: center;
  justify-content: center;
  padding-bottom: ${props => props.next ? '2px' : '0'};
  padding-right: ${props => props.next ? '0' : '3px'};
  cursor: normal;

  &[disabled] {
    background-color: ${props => props.theme.controlBtnMutedColor};
    cursor: not-allowed;
  }

  & > span {
    font-size: .5em;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    text-transform: uppercase;
    font-stretch: normal;
    line-height: 1.36;
    letter-spacing: 0.7px;
    color: ${props => props.theme.controlBtnTextColor};
  }

  @media (max-width: 1600px) {
    width: ${props => props.next ? props.skin ? '58px' : '187px' : props.skin ? '58px' : '50px'};
    height:  ${props => props.skin ? '58px' : '50px'};
  }
  @media (max-width: 760px) {
    width: 52px;
    height: 52px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => {
      if (props.setting) return props.skin ? props.theme.controlBtnSecondaryColor : props.theme.controlBtnPrimaryColor
    }};


    & > span {
      display: none;
    }

    & img {
      width: 50%;
      height: 50%;
    }
  }
`;

export default ControlBtn;