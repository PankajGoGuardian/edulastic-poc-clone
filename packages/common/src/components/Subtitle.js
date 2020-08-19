import styled from "styled-components";

const Subtitle = styled.h3`
  font-weight: 600;
  line-height: 1.38;
  letter-spacing: 0.2px;
  font-size: ${({ theme }) => theme.smallFontSize};
  color: ${({ theme }) => theme.questionTextColor};
  padding-right: 8px;
  text-transform: uppercase;
  text-align: ${({ direction }) => {
    if (direction === "row" || direction === "row-reverse") {
      return "center";
    }
    return "left";
  }};
  background: #f6f6f6;
  padding: 11px 19px;
  border: 4px;
  width: max-content;
  margin: ${({ margin }) => margin || "0px"};
`;

export default Subtitle;
