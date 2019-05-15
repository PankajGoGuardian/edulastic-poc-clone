import styled from "styled-components";
import { Input } from "antd";

import { IconCheck } from "@edulastic/icons";
import { secondaryTextColor, greenDark } from "@edulastic/colors";

export const SectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin: 17px 20px 17px 13px;
`;

export const SectionTitle = styled.p`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: ${secondaryTextColor};
`;

export const SectionForm = styled(Input)`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: ${secondaryTextColor};
  background: transparent;
  border-radius: unset;
  border: none;
  border-bottom: 1px solid #cbcbcb;
  box-shadow: none !important;
`;

export const SectionFormConfirmButton = styled(IconCheck)`
  position: absolute;
  bottom: 14px;
  right: 0;
  fill: ${greenDark};
  cursor: pointer;

  path {
    stroke: ${greenDark};
    stroke-width: 2;
  }
`;

export const Actions = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  width: 38px;
  height: 32px;

  svg {
    fill: ${greenDark};
    width: 13px;
    height: 13px;
    cursor: pointer;

    &:hover {
      fill: ${greenDark};
      opacity: 0.7;
    }

    &:last-child {
      fill: ${secondaryTextColor};

      &:hover {
        fill: ${secondaryTextColor};
      }
    }
  }
`;
