import styled from "styled-components";

export const AxisLabel = styled.div`
  display: flex;
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.widgets.chart.axisLabelFontWeight};
  font-size: ${({ theme }) => theme.size6}px;
  ${({ axis }) => {
    if (axis === "y") {
      return `
        width: 40px;
        white-space: nowrap;
        transform: rotate(-90deg);
        justify-content: flex-start;    
      `;
    }
    return `
      margin-bottom: 20px;
      justify-content: center;
    `;
  }};

  @media print {
    margin-bottom: ${({ axis }) => axis === "y" && "-70%"};
  }
`;
