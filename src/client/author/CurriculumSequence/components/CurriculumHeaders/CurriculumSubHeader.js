import React from "react";
import { withRouter } from "react-router-dom";
import { isNumber, sortBy } from "lodash";
import styled from "styled-components";
import {
  mobileWidthLarge,
  desktopWidth,
  lightGrey6,
  smallDesktopWidth,
  tabletWidth,
  themeColor,
  titleColor,
  mediumDesktopExactWidth,
  extraDesktopWidthMax
} from "@edulastic/colors";
import { IconBook, IconGraduationCap } from "@edulastic/icons";

const CurriculumSubHeader = ({
  match,
  isStudent,
  dateKeys,
  urlHasUseThis,
  enableCustomize,
  showRightPanel,
  summaryData,
  destinationCurriculumSequence,
  handleCheckout,
  isManageContentActive,
  isContentExpanded,
  cancelPlaylistCustomize,
  toggleManageContentClick,
  publishCustomizedPlaylist,
  shouldHidCustomizeButton
}) => {
  const { id: parentId = null, cloneId = null } = match.params;
  const { description, subjects = [], grades = [] } = destinationCurriculumSequence;

  const subHeaderIcon1 = !!grades.length && (
    <SubHeaderInfoCard data-cy="playlist-grade">
      <GraduationCapIcon color="grey" />
      <SubHeaderInfoCardText>Grade {grades.join(", ")}</SubHeaderInfoCardText>
    </SubHeaderInfoCard>
  );

  const subHeaderIcon2 = !!subjects.length && (
    <SubHeaderInfoCard data-cy="playlist-sub">
      <BookIcon color="grey" />
      <SubHeaderInfoCardText>{subjects.filter(item => !!item).join(", ")}</SubHeaderInfoCardText>
    </SubHeaderInfoCard>
  );

  if (isStudent && !!dateKeys.length && destinationCurriculumSequence?.isSparkMath) {
    return (
      <SubTopBar>
        <SubTopBarContainer
          style={{
            background: "#2f4151",
            padding: "10px 20px",
            color: "#fff",
            justifyContent: "space-between",
            flexDirection: "row",
            fontSize: "12px"
          }}
        >
          <div>NEW RECOMMENDATIONS SINCE LAST LOGIN.</div>
          <div style={{ cursor: "pointer" }} onClick={handleCheckout}>
            CHECK IT OUT &gt;&gt;
          </div>
        </SubTopBarContainer>
      </SubTopBar>
    );
  }
  const assigned = summaryData?.filter(d => isNumber(d.classes))?.length || 0;
  return (
    <SubTopBar>
      <SubTopBarContainer active={isContentExpanded}>
        <CurriculumSubHeaderRow>
          <SubHeaderTitleContainer>
            <SubHeaderTitle>Module progress</SubHeaderTitle>
            <SubHeaderModuleProgressContainer>
              <div>
                <span className="assigned">{`${assigned}/${summaryData?.length}`}</span>
                <span className="assigned-label">assigned</span>
              </div>
              <SubHeaderModuleProgressTagContainer>
                {summaryData?.map(d =>
                  !isNumber(d.classes) ? <SquareColorDivGray key={d.index} /> : <SquareColorDivGreen key={d.index} />
                )}
              </SubHeaderModuleProgressTagContainer>
            </SubHeaderModuleProgressContainer>
            <SubHeaderDescription>{description}</SubHeaderDescription>
          </SubHeaderTitleContainer>
          <RightColumn>
            <SubHeaderInfoCardWrapper>
              {subHeaderIcon1}
              {subHeaderIcon2}
            </SubHeaderInfoCardWrapper>
            <ButtonWrapper>
              {enableCustomize &&
                (isManageContentActive && cloneId ? (
                  <DraftModeActionsWrapper>
                    <StyledButton
                      width="100px"
                      data-cy="cancel-customize"
                      onClick={() => cancelPlaylistCustomize({ parentId })}
                    >
                      Cancel
                    </StyledButton>
                    <StyledButton
                      width="100px"
                      data-cy="publish-customized-playlist"
                      onClick={() => publishCustomizedPlaylist({ id: cloneId, unlinkFromId: parentId })}
                      isManageContentActive={isManageContentActive}
                    >
                      Update
                    </StyledButton>
                  </DraftModeActionsWrapper>
                ) : (
                  <>
                    {(!isManageContentActive || !showRightPanel) && !shouldHidCustomizeButton && (
                      <StyledButton onClick={toggleManageContentClick("manageContent")}>Customize Content</StyledButton>
                    )}
                    {(isManageContentActive || !showRightPanel) && urlHasUseThis && (
                      <StyledButton onClick={toggleManageContentClick("sammary")}>View Summary</StyledButton>
                    )}
                  </>
                ))}
            </ButtonWrapper>
          </RightColumn>
        </CurriculumSubHeaderRow>
      </SubTopBarContainer>
    </SubTopBar>
  );
};

export default withRouter(CurriculumSubHeader);

const SubTopBar = styled.div`
  width: ${props => (props.active ? "60%" : "100%")};
  padding: 0px;
  margin: auto;
  position: relative;
  @media only screen and (min-width: 1800px) {
    width: ${props => (props.active ? "60%" : "100%")};
    margin-left: ${props => (props.active ? "" : "auto")};
    margin-right: ${props => (props.active ? "" : "auto")};
  }
`;

const SubTopBarContainer = styled.div`
  background: white;
  padding: 30px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-left: ${props => (props.active ? "" : "auto")};
  margin-right: ${props => (props.active ? "" : "auto")};
  border-radius: 5px;
  border: 1px solid #DADAE4;
  height: 145px;

  @media only screen and (max-width: 1366px) {
    flex-direction: column;
    justify-self: flex-start;
    margin-right: auto;
  }
  @media only screen and (max-width: 1750px) and (min-width: 1367px) {
    /* flex-direction: ${props => (props.active ? "column" : "row")};
    justify-self: ${props => (props.active ? "flex-start" : "")};
    margin-right: ${props => (props.active ? "auto" : "")}; */
  }
  @media only screen and (max-width: 480px) {
    padding-left: 20px;
  }

  @media (max-width: ${mobileWidthLarge}) {
    padding: 15px;
  }
`;

const SquareColorDiv = styled.div`
  display: inline-block;
  border: 2px;
  width: 35px;
  height: 8px;
  margin: 1px 2px 0px 0px;
`;

export const SquareColorDivGreen = styled(SquareColorDiv)`
  background-color: #5eb500;
`;

export const SquareColorDivGray = styled(SquareColorDiv)`
  background-color: #c5c5c5;
`;

SubTopBarContainer.displayName = "SubTopBarContainer";

const CurriculumSubHeaderRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.marginBottom || "0px"};

  @media (max-width: ${mobileWidthLarge}) {
    flex-direction: column-reverse;
  }
`;

const SubHeaderTitleContainer = styled.div`
  min-width: 200px;
  width: 45%;
  word-break: break-word;

  @media (max-width: ${tabletWidth}) {
    width: 55%;
  }
  @media (max-width: ${mobileWidthLarge}) {
    width: 100%;
  }
`;

const SubHeaderTitle = styled.div`
  color: #8e9aa4;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.19px;
  margin-bottom: 2px;
  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 10px;
  }
`;

const SubHeaderModuleProgressContainer = styled.div`
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;

  .assigned {
    text-align: left;
    letter-spacing: 0px;
    color: #434b5d;
    font-weight: bold;
    font-size: 24px;
    line-height: 1;

    @media (max-width: ${extraDesktopWidthMax}) {
      font-size: 18px;
    }
  }
  .assigned-label {
    text-align: left;
    letter-spacing: 0.24px;
    color: #434b5d;
    font-weight: 600;
    margin-left: 4px;

    @media (max-width: ${extraDesktopWidthMax}) {
      font-size: 13px;
    }
  }
`;

const SubHeaderModuleProgressTagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const SubHeaderDescription = styled.p`
  color: ${lightGrey6};
  font-size: 14px;
  text-align: justify;

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 13px;
  }
`;

const RightColumn = styled.div`
  display: flex;
  width: 55%;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: ${tabletWidth}) {
    width: 45%;
  }
  @media (max-width: ${mobileWidthLarge}) {
    width: 100%;
    margin-bottom: 5px;
    justify-content: space-evenly;
  }
`;

const SubHeaderInfoCardWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${tabletWidth}) {
    flex-direction: column;
  }
`;

const ButtonWrapper = styled.div`
  @media (max-width: ${smallDesktopWidth}) {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
`;

const DraftModeActionsWrapper = styled.div`
  width: 210px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap-reverse;
  margin-left: 15px;
`;

const StyledButton = styled.div`
  margin: ${props => props.margin || "0px"};
  margin-left: 30px;
  margin-right: 8px;
  height: ${props => props.height || "40px"};
  min-width: ${props => props.width || "auto"};
  color: ${themeColor};
  display: flex;
  font: 11px/15px Open Sans;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid ${themeColor};
  cursor: pointer;
  text-transform: uppercase;
  user-select: none;
  -webkit-transition: background 300ms ease;
  -ms-transition: background 300ms ease;
  transition: background 300ms ease;
  svg {
    margin: auto;
  }
  &:hover {
    background: ${themeColor};
    color: white;
    box-shadow: 0px 0px 1px ${themeColor};
    svg {
      fill: white;
    }
  }

  &:last-child {
    margin-top: 10px;
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 150px;
    height: 40px;
  }

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 9px;
    width: 128px;
    height: 32px;
    font-weight: 600;
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: 9px;
    height: ${props => props.height || "32px"};
  }
  @media (max-width: ${desktopWidth}) {
    margin-left: 15px;
  }
`;

const SubHeaderInfoCard = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;

  @media (max-width: ${desktopWidth}) {
    margin-left: 10px;
  }

  @media (max-width: ${tabletWidth}) {
    margin-bottom: 10px;
    margin-left: 0px;
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const GraduationCapIcon = styled(IconGraduationCap)`
  @media (max-width: ${extraDesktopWidthMax}) {
    width: 18px;
    height: 13px;
  }
`;

const SubHeaderInfoCardText = styled.div`
  font-weight: 600;
  padding-left: 5px;
  color: ${titleColor};
  text-transform: uppercase;

  @media (max-width: ${extraDesktopWidthMax}) {
    font: Bold 9px/13px Open Sans;
  }
`;

const BookIcon = styled(IconBook)`
  @media (max-width: ${extraDesktopWidthMax}) {
    width: 12px;
    height: 15px;
  }
`;
