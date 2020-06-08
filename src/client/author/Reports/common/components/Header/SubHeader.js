import React, { useState } from "react";
import styled from "styled-components";
import { EduButton } from "@edulastic/common";
import { IconFilter } from "@edulastic/icons";
import Breadcrumb from "../../../../src/components/Breadcrumb";

const SubHeader = ({ breadcrumbsData, onRefineResultsCB, title, showFilter }) => {
  const [refineButtonActive, setRefineButtonActive] = useState(false);
  const _onRefineResultsCB = event => {
    event.target.blur();
    setRefineButtonActive(!refineButtonActive);
    onRefineResultsCB(event, !refineButtonActive);
  };

  const isShowBreadcrumb = title !== "Standard Reports";

  return (
    <SecondaryHeader
      style={{
        marginBottom: isShowBreadcrumb ? 20 : 0
      }}
    >
      <HeaderTitle>
        {isShowBreadcrumb ? <Breadcrumb data={breadcrumbsData} style={{ position: "unset" }} /> : null}
      </HeaderTitle>
      {onRefineResultsCB ? (
        <StyledButton isGhost={!showFilter} onClick={_onRefineResultsCB}>
          <IconFilter width={20} height={20} />
          FILTERS
        </StyledButton>
      ) : null}
    </SecondaryHeader>
  );
};

export default SubHeader;

const StyledButton = styled(EduButton)`
  height: 28px;
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 25px;
    font-weight: bold;
    color: white;
    margin: 0px;
    display: flex;
    align-items: center;
    svg {
      width: 30px;
      height: 30px;
      fill: white;
      margin-right: 10px;
    }
  }
`;

const SecondaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media print {
    display: none;
  }
`;
