import styled from "styled-components";

export const AxisLabel = styled.div`
  display: flex;
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.widgets.chart.axisLabelFontWeight};
  font-size: ${({ theme }) => theme.widgets.chart.axisLabelFontSize};
  color: ${({ theme }) => theme.widgets.chart.axisLabelColor};
  ${({ axis }) => {
    if (axis === "y") {
      return `
        width: 1rem;
        white-space: nowrap;
        margin-right: 16px;
        transform: rotate(-90deg);
        justify-content: flex-start;    
      `;
    }
    return `
      justify-content: center;
    `;
  }};

  @media print {
    margin-bottom: ${({ axis }) => axis === "y" && "-70%"};
  }
`;
