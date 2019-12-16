import React, { useEffect } from "react";
import styled from "styled-components";

import { white, desktopWidth, mediumDesktopExactWidth, extraDesktopWidthMax } from "@edulastic/colors";

import { StyledCard } from "../../../author/Reports/common/styled";
import { CustomizedHeaderWrapper } from "./common/components/header";
import { StyledLeftSide } from "./components/leftSide";
import { Usage } from "./components/Usage";
import { Collections } from "./components/Collections";
import FeaturesSwitch from "../../../features/components/FeaturesSwitch";

const Dashboard = () => {
  return (
    <FeaturesSwitch inputFeatures="isCurator" actionOnInaccessible="redirect">
      <DashboardContainer>
        <CustomizedHeaderWrapper />
        <DashboardContentContainer>
          <div className="right-side">
            <StyledCard>
              <Usage />
            </StyledCard>
            <StyledCard>
              <Collections />
            </StyledCard>
          </div>
          <div className="left-side">
            <StyledLeftSide />
          </div>
        </DashboardContentContainer>
      </DashboardContainer>
    </FeaturesSwitch>
  );
};

export { Dashboard };

const DashboardContainer = styled.div`
  height: 100vh;
`;

const DashboardContentContainer = styled.div`
  display: flex;
  flex-direction: row;

  // height written according to Container Component height in src/client/author/src/mainContent/headerWrapper.js
  height: calc(100% - ${props => props.theme.HeaderHeight.xs}px);
  @media (min-width: ${mediumDesktopExactWidth}) {
    height: calc(100% - ${props => props.theme.HeaderHeight.md}px);
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: calc(100% - ${props => props.theme.HeaderHeight.xl}px);
  }

  .right-side {
    padding: 20px;
    width: calc(100% - 358px);
  }

  .left-side {
    width: 358px;
  }
`;
