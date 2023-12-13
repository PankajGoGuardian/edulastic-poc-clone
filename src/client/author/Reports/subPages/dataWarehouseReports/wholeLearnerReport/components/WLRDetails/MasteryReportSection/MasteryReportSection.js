import React, { useMemo, useState, useEffect } from 'react'
import { Spin, Tooltip, Icon } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'

import { IconInfo } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { EduIf, FlexContainer } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { white } from '@edulastic/colors'

import MasteryTable from './MasteryTable'
import { Spacer } from '../../../../../../../../common/styled'
import SectionLabel from '../../../../../../common/components/SectionLabel'
import LabelledControlDropdown from '../../../../common/components/LabelledControlDropdown'
import { StyledFilledButton } from '../../../../common/components/styledComponents'

import {
  getIsTutorMeEnabled,
  getUserOrgId,
  getInterestedCurriculumsSelector,
  getUserRole,
  getUser,
} from '../../../../../../../src/selectors/user'
import {
  getIsTutorMeVisibleToDistrictSelector,
  actions as tutorMeActions,
  tutorMeServiceInitializingSelector,
} from '../../../../../../../TutorMe/ducks'
import { useGetStudentMasteryData } from '../../../../../studentProfileReport/common/hooks'
import useFilterRecords from './hooks/useFilterRecords'
import {
  getDomainOptionsByGradeSubject,
  getCurriculumsList,
} from '../../../../../studentProfileReport/common/utils/transformers'
import useRowSelection from './hooks/useRowSelection'
import {
  ALL_GRADES,
  ALL_SUBJECTS,
  DEFAULT_CURRICULUM,
  DEFAULT_DOMAIN,
  onAssignTutoring,
  MAX_CHECKED_STANDARDS,
} from './utils'
import StandardTagsList from './StandardTagsList'
import TutorMeNoLicensePopup from '../../../../../../../TutorMe/components/TutorMeNoLicensePopup'

const MasteryReportSection = ({
  userRole,
  interestedCurriculums,
  studentMasteryProfile,
  settings,
  isCsvDownloading,
  selectedScale,
  isTutorMeVisibleToDistrict,
  SPRFFilterData,
  setSelectedScale,
  loading,
  isTutorMeEnabled,
  districtId,
  assignTutorRequest,
  initializeTutorMeService,
  tutorMeServiceInitializing,
  user,
  t,
}) => {
  const [selectedDomain, setSelectedDomain] = useState(DEFAULT_DOMAIN)
  const [selectedSubject, setSelectedSubject] = useState(ALL_SUBJECTS[0])
  const [selectedGrade, setSelectedGrade] = useState(ALL_GRADES[0])
  const [selectedCurriculum, setSelectedCurriculum] = useState(
    DEFAULT_CURRICULUM
  )
  const [selectedDomains, setSelectedDomains] = useState([])
  const [selectedStandards, setSelectedStandards] = useState([])
  const [showTutorMeNoLicensePopup, setShowTutorMeNoLicensePopup] = useState(
    false
  )
  const [domainKeyToExpand, setDomainKeyToExpand] = useState(null)

  const { scaleInfo: scales } = get(SPRFFilterData, 'data.result', {})
  const { metricInfo = [], skillInfo = [] } = get(
    studentMasteryProfile,
    'data.result',
    {}
  )
  const scaleInfo = selectedScale.scale

  const onSelectScale = (_, selected) => {
    setSelectedScale((scales || []).find((s) => s._id === selected.key))
  }

  const scaleOptions = useMemo(
    () => (scales || []).map((s) => ({ key: s._id, title: s.name })),
    [scales]
  )

  const selectedScaleOption = useMemo(
    () => scaleOptions.find((s) => s.key === selectedScale._id),
    [scaleOptions, selectedScale]
  )

  const isStudentOrParent = useMemo(
    () => [roleuser.STUDENT, roleuser.PARENT].includes(userRole),
    [userRole]
  )

  const curriculumsOptions = useMemo(() => {
    return getCurriculumsList(interestedCurriculums, false)
  }, [interestedCurriculums])

  const [studentStandards, studentDomains] = useGetStudentMasteryData(
    metricInfo,
    skillInfo,
    scaleInfo
  )

  const domainOptions = getDomainOptionsByGradeSubject(
    studentDomains,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key
  )

  const filteredDomains = useFilterRecords(
    studentDomains,
    selectedDomain.key,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key,
    selectedDomains
  )

  const filteredStandards = useFilterRecords(
    studentStandards,
    selectedDomain.key,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key,
    selectedDomains
  )

  const { domainRowSelection, standardsRowSelection } = useRowSelection(
    filteredDomains,
    filteredStandards,
    selectedDomains,
    setSelectedDomains,
    selectedStandards,
    setSelectedStandards,
    setDomainKeyToExpand
  )

  useEffect(() => {
    setSelectedDomains([])
    setSelectedStandards([])
  }, [selectedCurriculum, selectedGrade, selectedSubject])

  useEffect(() => {
    if (curriculumsOptions?.length) {
      setSelectedCurriculum({
        key: curriculumsOptions[0].key,
        title: curriculumsOptions[0].title,
      })
    }
  }, [curriculumsOptions])

  const assignTutorBtnTooltipText = !isTutorMeEnabled
    ? t('wholeLearnerReport.assignTutoringDisabled')
    : !selectedStandards.length
    ? t('wholeLearnerReport.noCheckedStandardsMessage')
    : selectedStandards.length > MAX_CHECKED_STANDARDS
    ? t('wholeLearnerReport.maxCheckedStandardsMessage')
    : ''

  const disableTutorMeBtn =
    isTutorMeEnabled &&
    (!selectedStandards.length ||
      selectedStandards.length > MAX_CHECKED_STANDARDS)

  const handleAssignTutoringClick = () =>
    isTutorMeEnabled
      ? onAssignTutoring({
          settings,
          districtId,
          filteredStandards,
          selectedStandards,
          initializeTutorMeService,
          assignTutorRequest,
          user,
        })
      : setShowTutorMeNoLicensePopup(true)

  const standardsDetailsForTagsList = useMemo(
    () =>
      selectedStandards
        .map((sid) => filteredStandards.find((s) => s.standardId === sid))
        .filter((standard) => !!standard),
    [filteredStandards, selectedStandards]
  )

  return (
    <>
      <SectionLabel
        $margin="32px 0 59px 0"
        style={{ fontSize: '18px' }}
        wrapperStyle={{ alignItems: 'flex-end' }}
        sectionLabelFilters={
          <FlexContainer alignItems="center" style={{ gap: '20px' }}>
            <EduIf condition={isTutorMeEnabled && isTutorMeVisibleToDistrict}>
              <Tooltip title={assignTutorBtnTooltipText}>
                <StyledFilledButton
                  height="32px"
                  disabled={disableTutorMeBtn}
                  onClick={handleAssignTutoringClick}
                >
                  Assign Tutoring
                  <span>{!isTutorMeEnabled ? ' *' : ''}</span>
                  <EduIf condition={tutorMeServiceInitializing}>
                    <Icon
                      type="loading"
                      style={{ fontSize: 10, color: white }}
                      spin
                    />
                  </EduIf>
                </StyledFilledButton>
              </Tooltip>
            </EduIf>
            <LabelledControlDropdown
              dataCy="standardsProficiency"
              label="Standard Proficiency"
              by={selectedScaleOption}
              selectCB={onSelectScale}
              data={scaleOptions}
              showPrefix={false}
              containerProps={{ flex: '1 1 300px' }}
            />
          </FlexContainer>
        }
        separator={<Spacer />}
      >
        Understand how the student is performing across domains and standards
        for Edulastic Tests &nbsp;
        <Tooltip title="Standard mastery data is currently supported for Edulastic Tests only.">
          <IconInfo />
        </Tooltip>
      </SectionLabel>
      <Spin spinning={loading}>
        <MasteryTable
          filteredDomains={filteredDomains}
          filteredStandards={filteredStandards}
          settings={settings}
          isCsvDownloading={isCsvDownloading}
          selectedScale={selectedScale}
          domainRowSelection={
            isTutorMeVisibleToDistrict && isTutorMeEnabled
              ? domainRowSelection
              : null
          }
          standardsRowSelection={
            isTutorMeVisibleToDistrict && isTutorMeEnabled
              ? standardsRowSelection
              : null
          }
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
          domainKeyToExpand={domainKeyToExpand}
          setDomainKeyToExpand={setDomainKeyToExpand}
          tableSubHeader={
            isTutorMeVisibleToDistrict && isTutorMeEnabled ? (
              <StandardTagsList
                maxStandards={MAX_CHECKED_STANDARDS}
                standards={standardsDetailsForTagsList}
                onClose={standardsRowSelection.onSelect}
              />
            ) : null
          }
        />
      </Spin>
      <TutorMeNoLicensePopup
        open={showTutorMeNoLicensePopup}
        closePopup={() => setShowTutorMeNoLicensePopup(false)}
      />
    </>
  )
}

const withConnect = connect(
  (state) => ({
    interestedCurriculums: getInterestedCurriculumsSelector(state),
    districtId: getUserOrgId(state),
    userRole: getUserRole(state),
    isTutorMeEnabled: getIsTutorMeEnabled(state),
    isTutorMeVisibleToDistrict: getIsTutorMeVisibleToDistrictSelector(state),
    user: getUser(state),
    tutorMeServiceInitializing: tutorMeServiceInitializingSelector(state),
  }),
  {
    ...tutorMeActions,
  }
)

export default compose(
  withNamespaces('reports'),
  withConnect
)(MasteryReportSection)
