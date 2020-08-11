import styled from "styled-components";


export const WrapperContainer = styled.div`
    max-width: 380px;
    width: auto;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 0 0 8px;
`;

export const MainTray = styled.div`
    display: flex;
    height: 60px;
    background-color: #fff;
    border-radius: 0 0 8px;
    overflow: hidden;
`;

export const TeacherTrayButton = styled.button`
  background: white;
  width: 60px;
  display: flex;
  align-items: center;
  margin: 10px;
  justify-content: center;
  border-radius: 100px;
  cursor: pointer;
  border: none;
  outline: none;

    svg > path{
        fill: ${({active}) => active && '#3F85E5 !important'};
    }

  h3{
  user-select: none;
  }

  &:focus{
      background: #f9f9ff;
  }
`;

export const LoginBtn = styled.div`
    width: 80px;
    padding-right: 10px;
    a {
        font-family: Arial, Helvetica, sans-serif;
        color: #3F85E5;
        text-decoration: none;
        font-size: 16px;
        font-weight: 600;
    }
`;
