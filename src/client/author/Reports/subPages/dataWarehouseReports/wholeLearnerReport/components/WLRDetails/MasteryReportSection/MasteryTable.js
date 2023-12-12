import React, { useState, useMemo, useEffect } from 'react'

import StudentPerformanceSummary from '../../../../../studentProfileReport/StudentMasteryProfile/common/components/table/StudentPerformanceSummary'
import { getFullName } from '../../../../../studentProfileReport/common/utils/transformers'
import { downloadCSV } from '../../../../../../common/util'
import StandardsAssignmentModal from './StandardsAssignmentModal'
import { ReStyledCard } from './styled'
import MasteryFilters from './MasteryFilters'

const MasteryTable = ({
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
  tableSubHeader,
  domainOptions,
  filteredDomains,
  filteredStandards,
  settings,
  isCsvDownloading,
  selectedScale,
  domainRowSelection,
  standardsRowSelection,
  domainKeyToExpand,
  setDomainKeyToExpand,
}) => {
  const [expandRows, setExpandRows] = useState(false)
  const [selectedMastery, setSelectedMastery] = useState([])
  const [clickedStandard, setClickedStandard] = useState(undefined)

  const onCsvConvert = (data) =>
    downloadCSV(`Standard Performance Details-inside Whole Learner.csv`, data)

  const closeStudentAssignmentModal = () => {
    setClickedStandard(undefined)
  }
  const handleOnClickStandard = (params, standardName) => {
    setClickedStandard({ standardId: params.standardId, standardName })
  }

  const standardPopupFilters = useMemo(() => {
    return {
      termId: settings.requestFilters.termId,
      profileId: selectedScale._id,
      studentId: settings.selectedStudentInformation.studentId,
      standardId: clickedStandard?.standardId,
    }
  }, [
    settings.requestFilters.termId,
    settings.selectedStudentInformation.studentId,
    selectedScale._id,
    clickedStandard?.standardId,
  ])

  useEffect(() => {
    setSelectedMastery([])
  }, [selectedDomain.key])

  return (
    <ReStyledCard>
      <MasteryFilters
        selectedCurriculum={selectedCurriculum}
        setSelectedCurriculum={setSelectedCurriculum}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain}
        curriculumsOptions={curriculumsOptions}
        isStudentOrParent={isStudentOrParent}
        domainOptions={domainOptions}
        expandRows={expandRows}
        setExpandRows={setExpandRows}
      />
      {tableSubHeader}
      <StudentPerformanceSummary
        data={filteredDomains}
        selectedMastery={selectedMastery}
        domainKeyToExpand={domainKeyToExpand}
        setDomainKeyToExpand={setDomainKeyToExpand}
        expandedRowProps={{
          onCsvConvert,
          isCsvDownloading,
          data: filteredStandards,
          selectedMastery,
          handleOnClickStandard,
          filters: settings.requestFilters,
          rowSelection: standardsRowSelection,
        }}
        expandAllRows={expandRows}
        setExpandAllRows={(flag) => setExpandRows(flag)}
        rowSelection={domainRowSelection}
      />
      <StandardsAssignmentModal
        visible={!!clickedStandard}
        standard={clickedStandard}
        scaleInfo={selectedScale.scale}
        onCancel={closeStudentAssignmentModal}
        studentName={getFullName(settings.selectedStudentInformation)}
        filters={standardPopupFilters}
      />
    </ReStyledCard>
  )
}

export default MasteryTable
