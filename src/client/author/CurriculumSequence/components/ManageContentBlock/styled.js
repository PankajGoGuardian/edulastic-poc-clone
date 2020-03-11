import styled from "styled-components";
import { Checkbox } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  white,
  smallDesktopWidth,
  themeColor,
  playlistTabLink,
  greyThemeLight,
  backgrounds,
  borderGrey4,
  title
} from "@edulastic/colors";

export const ManageContentContainer = styled.div`
  width: 400px;
  min-width: 400px;
  min-height: 760px;
  margin: 20px 30px 40px 0;
  background: ${white};
  padding: 22px;
  border-radius: 4px;
  border: 1px solid ${borderGrey4};

  @media (max-width: ${smallDesktopWidth}) {
    margin: 20px 40px 40px 40px;
  }

  .ant-select-selection {
    min-height: 40px;
    line-height: 40px;
    padding: 4px;
  }

  .ant-select-selection {
    background: ${backgrounds?.primary};
    &__choice {
      background: #b3bcc4 !important;
      &__content {
        color: #676e74 !important;
      }
      .ant-select-remove-icon svg {
        fill: #676e74 !important;
      }
    }
  }
`;

export const SearchByNavigationBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: ${({ justify }) => justify};
`;

export const SearchByTab = styled.div`
  padding: 0px 6px 10px 6px;
  margin: 0px 10px 2px 0px;
  color: ${({ isTabActive }) => (isTabActive ? themeColor : playlistTabLink)};
  border-bottom: ${({ isTabActive }) => isTabActive && "1px solid " + themeColor};
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
`;

export const SearchBar = styled.input`
  border: 1px solid ${greyThemeLight};
  width: 305px;
  height: 40px;
  margin: 10px 6px 2px 0px;
  padding: 10px;
  background: ${backgrounds?.default};
  outline: none;
`;

export const FilterBtn = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid ${themeColor};
  background: ${({ isActive }) => (isActive ? themeColor : white)};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  cursor: pointer;
  user-select: none;
`;

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 0%;
  position: relative;
`;

export const ManageModuleBtn = styled.div`
  display: flex;
  justify-content: space-between;
  height: 30px;
  border: 1px solid ${themeColor};
  color: ${themeColor};
  background: ${white};
  text-transform: uppercase;
  padding: 6px 15px 4px 15px;
  border-radius: 4px;
  font-size: 11px;
  width: ${({ width }) => width};
  user-select: none;
  cursor: pointer;

  &:hover {
    color: ${white};
    background: ${themeColor};
  }
`;

export const ResourceDataList = styled(PerfectScrollbar)`
  height: 515px;
  margin-bottom: 20px;
`;

export const FilterContainer = styled.div`
  height: 555px;
  margin-bottom: 20px;
`;

export const Title = styled.div`
  text-transform: uppercase;
  color: ${title};
  font-size: 12px;
  font-weight: 700;
  margin: 10px 0px;
`;

export const StyledCheckbox = styled(Checkbox)`
  margin: 8px 0 !important;
  color: ${title};
  font-size: 12px;
  font-weight: semi-bold;
  text-transform: uppercase;
`;
