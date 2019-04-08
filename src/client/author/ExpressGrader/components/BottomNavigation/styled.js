import styled from "styled-components";
import { Button } from "antd";

export const NavigationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3%;
  svg {
    fill: #434b5d;
  }
`;

export const LinksWrapper = styled.div`
  display: flex;
  justify-content: row;
  align-items: center;
  cursor: pointer;
`;

export const Link = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  margin: 0 10px;
  cursor: pointer;
`;

export const CloseModal = styled(Button)`
  font-size: 11px;
  width: 80px;
  height: 32px;
  font-weight: 600;
  color: #ffffff;
  background-color: #1774f0;
  border: 1px #1774f0 solid;
  text-transform: uppercase;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  svg {
    fill: #ffffff;
  }
  &:hover {
    color: #1774f0;
    background-color: #ffffff;
    svg {
      fill: #1774f0;
    }
  }
`;

export const StyledText = styled.span`
  margin: 0 5px;
  font-size: 12px;
  font-weight: 600;
  user-select: none;
`;

export const CloseModalText = styled.span`
  font-size: 11px;
  margin-left: 15px;
`;

export const StyledTextInfo = styled.span`
  display: flex;
  justify-content: row;
  align-items: center;
  font-weight: 500;
`;

export const EditResponse = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;
