import React from "react";
import { Button } from "antd";
import styled from "styled-components";

import { themeColor, smallDesktopWidth, white, themeColorBlue } from "@edulastic/colors";

const ShowActiveClasses = ({ classList, setClassList, showClass, setShowClass }) => {
  const activeClasses = classList.filter(c => c.active === 1);
  const archiveClasses = classList.filter(c => c.active === 0);
  // const options = [`ACTIVE (${activeClasses.length})`, `ARCHIVE (${archiveClasses.length})`];
  const showClassHandler = isActive => {
    setShowClass(isActive);
    if (isActive) {
      return setClassList(activeClasses);
    }
    setClassList(archiveClasses);
  };

  return (
    <ManageActiveClasses id="active-class-dropdown">
      <ButtonTabGroup>
        <TabButton active={showClass} onClick={() => showClassHandler(true)}>
          ACTIVE ({activeClasses.length})
        </TabButton>
        <TabButton active={!showClass} onClick={() => showClassHandler(false)}>
          ARCHIVE ({archiveClasses.length})
        </TabButton>
      </ButtonTabGroup>
    </ManageActiveClasses>
  );
};

export default React.memo(ShowActiveClasses);

const ManageActiveClasses = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ButtonTabGroup = styled(Button.Group)`
  .ant-btn {
    height: 32px;
    line-height: 30px;
    padding: 0px 30px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid ${themeColor};
  }
  @media (max-width: ${smallDesktopWidth}) {
    height: 22px;
    font-size: 10px;
  }
`;

const TabButton = styled(Button)`
  background: ${props => (props.active ? themeColorBlue : white)};
  color: ${props => (props.active ? white : themeColor)};
  &:hover,
  &:focus {
    background: ${props => (props.active ? themeColorBlue : white)};
    color: ${props => (props.active ? white : themeColor)};
  }
`;
