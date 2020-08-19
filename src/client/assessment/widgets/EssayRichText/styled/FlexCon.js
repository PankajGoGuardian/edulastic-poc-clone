import styled, { css } from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { dashBorderColor, greyThemeDark1, greyThemeDark2, themeColorBlue, white } from "@edulastic/colors";

const activeStyle = css`
  background: ${themeColorBlue};
  svg {
    fill: ${white};
  }
`;

const normalStyle = css`
  background: ${white};
  svg {
    fill: ${greyThemeDark1};
    width: 15px;
    height: 13px;
  }
`;

export const Container = styled(FlexContainer)`
  border-radius: 4px;
  border: 1px solid ${dashBorderColor};
  background: ${white};

  .drag-handler {
    fill: ${greyThemeDark2};
    stroke: ${greyThemeDark2};
    width: 16px;
    height: 14px;
  }

  .option-block {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    ${({ active }) => (active ? activeStyle : normalStyle)}
  }
`;
