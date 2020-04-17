import styled from "styled-components";

export const EduLogo = styled.img`
  position: fixed;
  top: 20px;
  left: 20px;
`;

export const StyledLogo = styled.img`
  transform: scale(3);
  margin: 90px auto;
`;

export const StyledText = styled.div`
  width: ${({ width }) => width || "100%"};
  color: white;
  font-size: 26px;
  font-weight: 600;
  text-align: center;
  margin: ${({ margin }) => margin || "20px auto"};
  /* font-family: sans-serif; */
`;

export const HighlightedText = styled.span`
  display: inline-block;
  color: white;
  font-weight: 800;
  font-size: 28px;
`;

export const Button = styled.button`
  color: #00ad50;
  font-weight: 600;
  font-size: 26px;
  background: white;
  outline: none;
  margin-top: auto;
  margin-bottom: 50px;
  border: none;
  width: 350px;
  padding: 10px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f8f8f8;
  }
`;

export const BaseText = styled.p`
  position: fixed;
  bottom: 2%;
  color: white;
`;
