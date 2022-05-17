import React from 'react'
import { withRouter } from 'react-router-dom'
import { isNumber } from 'lodash'
import styled from 'styled-components'
import { MathFormulaDisplay, EduButton, FlexContainer } from '@edulastic/common'
import { removeCommentsFromHtml } from '@edulastic/common/src/helpers'
import {
  mobileWidthLarge,
  desktopWidth,
  lightGrey6,
  smallDesktopWidth,
  tabletWidth,
  titleColor,
  extraDesktopWidthMax,
} from '@edulastic/colors'
import { IconBook, IconGraduationCap } from '@edulastic/icons'
import { Select } from 'antd'

const CurriculumSubHeader = ({
  isStudent,
  dateKeys,
  enableCustomize,
  showRightPanel,
  summaryData,
  destinationCurriculumSequence,
  handleCheckout,
  isManageContentActive,
  isContentExpanded,
  toggleManageContentClick,
  shouldHidCustomizeButton,
  isAuthoringFlowReview,
  customizeInDraft = false,
  urlHasUseThis = false,
  blurSubHeader = false,
  userTerms = [],
  currentTermId,
  setCurrentUserTerm,
  getAllCurriculumSequences,
  getCurrentPlaylistMetrics,
}) => {
  const {
    _id: playlistId,
    description,
    subjects = [],
    grades = [],
  } = destinationCurriculumSequence

  const subHeaderIcon1 = !!grades.length && (
    <SubHeaderInfoCard
      data-test={isManageContentActive}
      data-cy="playlist-grade"
      data-testid="playlist-grade"
    >
      <GraduationCapIcon color="grey" />
      <SubHeaderInfoCardText>Grade {grades.join(', ')}</SubHeaderInfoCardText>
    </SubHeaderInfoCard>
  )

  const subHeaderIcon2 = !!subjects.length && (
    <SubHeaderInfoCard data-cy="playlist-sub" data-testid="playlist-sub">
      <BookIcon color="grey" />
      <SubHeaderInfoCardText>
        {subjects.filter((item) => !!item).join(', ')}
      </SubHeaderInfoCardText>
    </SubHeaderInfoCard>
  )

  if (
    isStudent &&
    !!dateKeys.length &&
    destinationCurriculumSequence?.isSparkMath
  ) {
    return (
      <SubTopBar>
        <SubTopBarContainer
          style={{
            background: '#2f4151',
            padding: '10px 20px',
            color: '#fff',
            justifyContent: 'space-between',
            flexDirection: 'row',
            fontSize: '12px',
          }}
        >
          <div>NEW RECOMMENDATIONS SINCE LAST LOGIN.</div>
          <div style={{ cursor: 'pointer' }} onClick={handleCheckout}>
            CHECK IT OUT &gt;&gt;
          </div>
        </SubTopBarContainer>
      </SubTopBar>
    )
  }

  const setCurrentUserTermId = (id) => {
    setCurrentUserTerm(id)
    if (playlistId) {
      getAllCurriculumSequences([playlistId], !isStudent && !urlHasUseThis)
      getCurrentPlaylistMetrics({ playlistId, termId: id })
    }
  }

  const assigned = summaryData?.filter((d) => isNumber(d.classes))?.length || 0
  return (
    <SubTopBar>
      <SubTopBarContainer active={isContentExpanded}>
        <CurriculumSubHeaderRow>
          <SubHeaderTitleContainer>
            <ModuleProgres>
              <SubHeaderTitle data-testid="SubHeaderTitle">
                Module progress
              </SubHeaderTitle>
              <SubHeaderModuleProgressContainer data-cy="module-pogress">
                <div>
                  <span className="assigned" data-testid="assigned">
                    {`${assigned}/${summaryData?.length || 0}`}
                  </span>
                  <span className="assigned-label">Assigned</span>
                </div>
                <SubHeaderModuleProgressTagContainer>
                  {summaryData?.map((d) =>
                    !isNumber(d.classes) ? (
                      <SquareColorDivGray key={d.index} />
                    ) : (
                      <SquareColorDivGreen key={d.index} />
                    )
                  )}
                </SubHeaderModuleProgressTagContainer>
              </SubHeaderModuleProgressContainer>
            </ModuleProgres>
            <SubHeaderDescription
              blurSubHeader={blurSubHeader}
              dangerouslySetInnerHTML={{
                __html: removeCommentsFromHtml(description),
              }}
            />
          </SubHeaderTitleContainer>

          <FlexContainer
            flexDirection="column"
            width="50%"
            height="120px"
            alignItems="flex-end"
          >
            <RightColumnTop>
              <SubHeaderInfoCardWrapper>
                {subHeaderIcon1}
                {subHeaderIcon2}
              </SubHeaderInfoCardWrapper>
              <ButtonWrapper>
                {(!isManageContentActive || !showRightPanel) &&
                  enableCustomize &&
                  destinationCurriculumSequence?.modules?.length > 0 &&
                  !shouldHidCustomizeButton && (
                    <CustomizeButton
                      isGhost
                      isBlue
                      onClick={toggleManageContentClick('manageContent')}
                      data-cy="customizeContent"
                      data-testid="customizeContent"
                    >
                      Customize Content
                    </CustomizeButton>
                  )}

                {(isManageContentActive ||
                  !showRightPanel ||
                  (!enableCustomize && isStudent)) &&
                  !isAuthoringFlowReview &&
                  !customizeInDraft &&
                  urlHasUseThis && (
                    <StyledButton
                      isGhost
                      onClick={toggleManageContentClick('summary')}
                      data-cy="viewSummary"
                    >
                      View Summary
                    </StyledButton>
                  )}
              </ButtonWrapper>
            </RightColumnTop>

            {!isStudent && urlHasUseThis && !isAuthoringFlowReview && (
              <Select
                value={currentTermId}
                style={{ width: 150, marginTop: '10px' }}
                onChange={setCurrentUserTermId}
                disabled={!userTerms.length}
              >
                {userTerms.map((term) => (
                  <Select.Option
                    key={term._id}
                    value={term._id}
                    data-testid="userTerms"
                  >
                    {term.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FlexContainer>
        </CurriculumSubHeaderRow>
      </SubTopBarContainer>
    </SubTopBar>
  )
}

export default withRouter(CurriculumSubHeader)

const SubTopBar = styled.div`
  width: ${(props) => (props.active ? '60%' : '100%')};
  padding: 0px;
  margin: auto;
  position: relative;
  @media only screen and (min-width: 1800px) {
    width: ${(props) => (props.active ? '60%' : '100%')};
    margin-left: ${(props) => (props.active ? '' : 'auto')};
    margin-right: ${(props) => (props.active ? '' : 'auto')};
  }
`

const SubTopBarContainer = styled.div`
  background: white;
  padding: 30px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-left: ${(props) => (props.active ? '' : 'auto')};
  margin-right: ${(props) => (props.active ? '' : 'auto')};
  border-radius: 5px;
  border: 1px solid #dadae4;

  @media only screen and (max-width: 1366px) {
    flex-direction: column;
    justify-self: flex-start;
    margin-right: auto;
  }
  @media only screen and (max-width: 1750px) and (min-width: 1367px) {
    /* flex-direction: ${(props) => (props.active ? 'column' : 'row')};
    justify-self: ${(props) => (props.active ? 'flex-start' : '')};
    margin-right: ${(props) => (props.active ? 'auto' : '')}; */
  }
  @media only screen and (max-width: 480px) {
    padding-left: 20px;
  }

  @media (max-width: ${mobileWidthLarge}) {
    padding: 15px;
  }
`

const SquareColorDiv = styled.div`
  display: inline-block;
  border: 2px;
  width: 35px;
  height: 8px;
  margin: 1px 2px 0px 0px;
`

export const SquareColorDivGreen = styled(SquareColorDiv)`
  background-color: #5eb500;
`

export const SquareColorDivGray = styled(SquareColorDiv)`
  background-color: #c5c5c5;
`

SubTopBarContainer.displayName = 'SubTopBarContainer'

const CurriculumSubHeaderRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.marginBottom || '0px'};

  @media (max-width: ${mobileWidthLarge}) {
    flex-direction: column;
  }
`

const SubHeaderTitleContainer = styled.div`
  min-width: 200px;
  min-width: 45%;
  word-break: break-word;

  @media (max-width: ${tabletWidth}) {
    width: 55%;
  }
  @media (max-width: ${mobileWidthLarge}) {
    width: 100%;
  }
`

const SubHeaderTitle = styled.div`
  color: #8e9aa4;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.19px;
  margin-bottom: 2px;
  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 10px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    font-size: 12px;
  }
`

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
    text-transform: capitalize;

    @media (max-width: ${extraDesktopWidthMax}) {
      font-size: 13px;
    }
  }

  @media (max-width: ${mobileWidthLarge}) {
    margin-bottom: 0px;
  }
`

const ModuleProgres = styled.div`
  @media (max-width: ${mobileWidthLarge}) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
  }
`

const SubHeaderModuleProgressTagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`

const SubHeaderDescription = styled(MathFormulaDisplay)`
  opacity: ${({ blurSubHeader }) => (blurSubHeader ? '0.5' : '1')};
  color: ${lightGrey6};
  font-size: 14px;
  text-align: justify;

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 13px;
  }

  @media (max-width: ${mobileWidthLarge}) {
    margin-bottom: 18px;
  }
`

const RightColumnTop = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: ${smallDesktopWidth}) {
    flex-direction: column;
    align-items: flex-end;
  }

  @media (max-width: ${tabletWidth}) {
    width: 45%;
  }

  @media (max-width: ${mobileWidthLarge}) {
    width: 100%;
    max-width: 100%;
    align-items: stretch;
  }
`

const SubHeaderInfoCardWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${tabletWidth}) {
    flex-direction: column;
  }
  @media (max-width: ${mobileWidthLarge}) {
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 18px;
  }
`

const ButtonWrapper = styled.div`
  @media (max-width: ${smallDesktopWidth}) {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  @media (max-width: ${mobileWidthLarge}) {
    flex-direction: column;
  }
`

const StyledButton = styled(EduButton)`
  margin: ${(props) => props.margin || '0px'};
  margin-left: 30px;
  margin-right: 8px;
  user-select: none;
  -webkit-transition: background 300ms ease;
  -ms-transition: background 300ms ease;
  transition: background 300ms ease;
  svg {
    margin: auto;
  }

  &:last-child {
    margin-top: 10px;
  }

  &:first-child {
    margin-top: 0px;
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 150px;
    height: 40px;
  }

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 9px;
    width: 128px;
    height: ${(props) => props.height || '32px'};
    font-weight: 600;
  }

  @media (max-width: ${smallDesktopWidth}) {
    &:first-child {
      margin-top: 16px;
      margin-left: 0px;
    }
    &:last-child {
      margin-top: 16px;
      margin-left: 0px;
      margin-right: 0px;
    }
  }

  @media (max-width: ${desktopWidth}) {
    margin-left: 15px;
  }

  @media (max-width: ${mobileWidthLarge}) {
    &:first-child {
      margin-top: 0px;
      margin-bottom: 16px;
    }
    &:last-child {
      margin-top: 0px;
    }
    width: 100%;
  }
`

const CustomizeButton = styled(StyledButton)`
  @media (max-width: ${mobileWidthLarge}) {
    display: none;
  }
`

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

  @media (max-width: ${extraDesktopWidthMax}) {
    svg {
      width: 12px;
      height: 12px;
    }
  }

  @media (max-width: ${mobileWidthLarge}) {
    margin-bottom: 0px;
  }
`

const GraduationCapIcon = styled(IconGraduationCap)`
  @media (max-width: ${extraDesktopWidthMax}) {
    width: 18px;
    height: 13px;
  }
`

const SubHeaderInfoCardText = styled.div`
  font-weight: 600;
  padding-left: 5px;
  color: ${titleColor};
  text-transform: uppercase;
  white-space: nowrap;

  @media (max-width: ${extraDesktopWidthMax}) {
    font: Bold 9px/13px Open Sans;
  }
`

const BookIcon = styled(IconBook)`
  @media (max-width: ${extraDesktopWidthMax}) {
    width: 12px;
    height: 15px;
  }
`
