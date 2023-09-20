import React from 'react'
import { EduIf, FieldLabel, FlexContainer } from '@edulastic/common'
import { EXTERNAL_TEST_NAME_SEPARATOR } from '@edulastic/constants/reportUtils/common'
import {
  StyledEduButton,
  StyledDropDownContainer,
  SecondaryFilterRow,
} from '../../../../../common/styled'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import AssessmentAutoComplete from '../../../../../common/components/autocompletes/AssessmentAutoComplete'
import {
  getExternalBandInfoByExternalTest,
  getExternalBandsListFromBandInfo,
} from '../../utils'

const PageLevelFilters = ({
  reportId,
  firstLoad,
  filters,
  showPageLevelApply,
  loadingFiltersData,
  updateFilterDropdownCB,
  onAssessmentSelect,
  performanceBandsList,
  externalTests,
  externalBands,
  onGoClick,
}) => {
  const isPreExternal = filters.preTestId.includes(EXTERNAL_TEST_NAME_SEPARATOR)
  const isPostExternal = filters.postTestId.includes(
    EXTERNAL_TEST_NAME_SEPARATOR
  )

  let prePerformanceBandsList = performanceBandsList
  let postPerformanceBandsList = performanceBandsList
  let selectedPrePerformanceBand =
    performanceBandsList.find((p) => p.key === filters.preProfileId) ||
    performanceBandsList[0]
  let selectedPostPerformanceBand =
    performanceBandsList.find((p) => p.key === filters.postProfileId) ||
    performanceBandsList[0]

  if (isPreExternal) {
    const preExternalBandInfo =
      getExternalBandInfoByExternalTest({
        testId: filters.preTestId,
        externalBands,
        testInfo: externalTests,
      }) || {}
    prePerformanceBandsList = getExternalBandsListFromBandInfo(
      preExternalBandInfo
    )
    ;[selectedPrePerformanceBand] = prePerformanceBandsList
  }

  if (isPostExternal) {
    const postExternalBandInfo =
      getExternalBandInfoByExternalTest({
        testId: filters.postTestId,
        externalBands,
        testInfo: externalTests,
      }) || {}
    postPerformanceBandsList = getExternalBandsListFromBandInfo(
      postExternalBandInfo
    )
    ;[selectedPostPerformanceBand] = postPerformanceBandsList
  }

  return (
    <SecondaryFilterRow hidden={!!reportId} width="100%" fieldHeight="40px">
      <FlexContainer flex="0 0 600px">
        <StyledDropDownContainer
          flex="0 0 300px"
          xs={24}
          sm={12}
          lg={6}
          data-cy="preAssessment"
        >
          <FieldLabel fs=".7rem" data-cy="preAssessment">
            PRE ASSESSMENT
          </FieldLabel>
          <AssessmentAutoComplete
            firstLoad={firstLoad}
            termId={filters.termId}
            grades={filters.testGrades}
            tagIds={filters.tagIds}
            subjects={filters.testSubjects}
            testTypes={filters.assessmentTypes}
            selectedTestId={filters.preTestId}
            selectCB={(e) => onAssessmentSelect(e, 'preTestId')}
            showApply={filters.showApply}
            autoSelectFirstItem={false}
            statePrefix="pre"
            externalTests={externalTests}
          />
        </StyledDropDownContainer>
        <StyledDropDownContainer
          flex="0 0 300px"
          xs={24}
          sm={12}
          lg={6}
          data-cy="prePerformanceBand"
          data-testid="prePerformanceBand"
        >
          <FieldLabel fs=".7rem" data-cy="schoolYear">
            PRE ASSESSMENT - PERFORMANCE BAND
          </FieldLabel>
          <ControlDropDown
            by={selectedPrePerformanceBand}
            selectCB={(e, selected) =>
              !isPreExternal
                ? updateFilterDropdownCB(selected, 'preProfileId', false, true)
                : null
            }
            data={prePerformanceBandsList}
            prefix="Performance Band"
            showPrefixOnSelected={false}
          />
        </StyledDropDownContainer>
      </FlexContainer>
      <FlexContainer flex="0 0 600px">
        <StyledDropDownContainer
          flex="0 0 300px"
          xs={24}
          sm={12}
          lg={6}
          data-cy="postAssessment"
        >
          <FieldLabel fs=".7rem" data-cy="postAssessment">
            POST ASSESSMENT
          </FieldLabel>
          <AssessmentAutoComplete
            firstLoad={firstLoad}
            termId={filters.termId}
            grades={filters.testGrades}
            tagIds={filters.tagIds}
            subjects={filters.testSubjects}
            testTypes={filters.assessmentTypes}
            selectedTestId={filters.postTestId}
            selectCB={(e) => onAssessmentSelect(e, 'postTestId')}
            showApply={filters.showApply}
            autoSelectFirstItem={false}
            statePrefix="post"
            externalTests={externalTests}
          />
        </StyledDropDownContainer>
        <StyledDropDownContainer
          flex="0 0 300px"
          xs={24}
          sm={12}
          lg={6}
          data-cy="postPerformanceBand"
          data-testid="postPerformanceBand"
        >
          <FieldLabel fs=".7rem" data-cy="schoolYear">
            POST ASSESSMENT - PERFORMANCE BAND
          </FieldLabel>
          <ControlDropDown
            by={selectedPostPerformanceBand}
            selectCB={(e, selected) =>
              !isPostExternal
                ? updateFilterDropdownCB(selected, 'postProfileId', false, true)
                : null
            }
            data={postPerformanceBandsList}
            prefix="Performance Band"
            showPrefixOnSelected={false}
          />
        </StyledDropDownContainer>
        <EduIf condition={showPageLevelApply}>
          <StyledEduButton
            btnType="primary"
            data-testid="applyRowFilter"
            data-cy="applyRowFilter"
            disabled={loadingFiltersData}
            onClick={() => onGoClick()}
          >
            APPLY
          </StyledEduButton>
        </EduIf>
      </FlexContainer>
    </SecondaryFilterRow>
  )
}

export default PageLevelFilters
