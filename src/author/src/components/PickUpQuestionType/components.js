import styled from 'styled-components';

export const RoundDiv = styled.div`
  width: 400px;
  margin: 10px;
  background-color: #ffffff;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: ${props => props.borderRadius}px;
`;

export const Header = styled.div`
  height: 68px;
  background-color: #00b0ff;
  display: flex;
  align-items: center;
  padding: 0 40px;
  color: white;
  font-size: 16px;
  letter-spacing: 1px;
  border-top-left-radius: ${props => props.borderRadius}px;
  border-top-right-radius: ${props => props.borderRadius}px;
`;

export const Content = styled.div`
  height: 190px;
  padding: 20px 40px;
  background-color: #ffffff;
  border-bottom-left-radius: ${props => props.borderRadius}px;
  border-bottom-right-radius: ${props => props.borderRadius}px;
  user-select: none;
  position: relative;
  cursor: pointer;
  overflow: hidden;

  .add-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    display: none;
  }

  &:hover {
    background-color: #434b5db5;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);

    .add-icon {
      display: flex;
    }
  }
`;

export const QuestionText = styled.div`
  font-size: 14px;
  font-weight: bold;
  padding: 10px 0;
`;
