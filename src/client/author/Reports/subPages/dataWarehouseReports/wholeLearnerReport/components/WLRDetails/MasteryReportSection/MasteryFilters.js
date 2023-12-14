import React from 'react'
import { IconCollapse2 } from '@edulastic/icons'
import { EduIf } from '@edulastic/common'
import { themeColor } from '@edulastic/colors'

import { FilterRow, DropdownContainer, StyledButton } from './styled'
import { ControlDropDown } from '../../../../../../common/components/widgets/controlDropDown'
import { ALL_GRADES, ALL_SUBJECTS, DEFAULT_DOMAIN } from './utils'

function MasteryFilters({
  selectedCurriculum,
  setSelectedCurriculum,
  selectedGrade,
  setSelectedGrade,
  selectedSubject,
  setSelectedSubject,
  selectedDomain,
  setSelectedDomain,
  curriculumsOptions,
  isStudentOrParent,
  domainOptions,
  expandRows,
  setExpandRows,
}) {
  const onDomainSelect = (_, selected) => setSelectedDomain(selected)
  const onSubjectSelect = (_, selected) => {
    setSelectedSubject(selected)
    setSelectedDomain(DEFAULT_DOMAIN)
  }
  const onGradeSelect = (_, selected) => {
    setSelectedGrade(selected)
    setSelectedDomain(DEFAULT_DOMAIN)
  }
  const onCurriculumSelect = (_, selected) => {
    setSelectedCurriculum(selected)
    setSelectedDomain(DEFAULT_DOMAIN)
  }
  return (
    <FilterRow justifyContent="space-between">
      <DropdownContainer>
        <ControlDropDown
          by={selectedCurriculum}
          selectCB={onCurriculumSelect}
          data={curriculumsOptions}
          prefix="Standard Set"
          showPrefixOnSelected={false}
        />
        <EduIf condition={!isStudentOrParent}>
          <ControlDropDown
            by={selectedGrade}
            selectCB={onGradeSelect}
            data={ALL_GRADES}
            prefix="Standard Grade"
            showPrefixOnSelected={false}
          />
        </EduIf>
        <ControlDropDown
          by={selectedSubject}
          selectCB={onSubjectSelect}
          data={ALL_SUBJECTS}
          prefix="Standard Subject"
          showPrefixOnSelected={false}
        />
        <ControlDropDown
          showPrefixOnSelected={false}
          by={selectedDomain}
          selectCB={onDomainSelect}
          data={domainOptions}
          prefix="Domain(s)"
        />
      </DropdownContainer>

      <StyledButton
        onClick={() => setExpandRows((prevExpandRows) => !prevExpandRows)}
        data-cy="expand-row"
      >
        <IconCollapse2 color={themeColor} width={12} height={12} />
        <span className="button-label">
          {expandRows ? 'COLLAPSE' : 'EXPAND'} ROWS
        </span>
      </StyledButton>
    </FilterRow>
  )
}

export default MasteryFilters
