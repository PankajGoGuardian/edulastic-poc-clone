import {
  CheckboxLabel,
  EduButton,
  FlexContainer,
  MathFormulaDisplay,
  Paper,
  CustomModalStyled,
  RadioBtn,
} from '@edulastic/common'
import { Col, Row, Spin } from 'antd'
import {
  differenceBy,
  get,
  intersectionBy,
  isEmpty,
  isEqual,
  uniqBy,
} from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { setDefaultInterests } from '../../../author/dataUtils'
import {
  clearTloAndEloAction,
  getElosSuccessAction,
  getStandardElosAction,
  getStandardTlosAction,
  setElosByTloIdAction,
} from '../../../author/src/actions/dictionaries'
import {
  getFormattedCurriculums,
  getStandardsEloSelector,
  getStandardsTloSelector,
} from '../../../author/src/selectors/dictionaries'
import {
  getInterestedCurriculumsSelector,
  getShowAllCurriculumsSelector,
} from '../../../author/src/selectors/user'
import PopupRowSelect from './PopupRowSelect'
import { Container } from './styled/Container'
import { ELOList } from './styled/ELOList'
import { TLOList, TLOListItem } from './styled/TLOList'

const StandardsModal = ({
  visible,
  onApply,
  onCancel,
  t,
  defaultStandard,
  defaultStandards,
  defaultSubject,
  defaultGrades,
  curriculumStandardsELO,
  curriculumStandardsTLO,
  curriculumStandardsLoading,
  singleSelect = false,
  isPlaylistView = false,
  standardDetails,
  curriculums,
  enableSelectAll,
  getStandardTlos,
  getStandardElos,
  getElosSuccess,
  setElosByTloId,
  elosByTloId,
  clearTloAndElo,
  showAllStandards = true,
  interestedCurriculums = [],
}) => {
  const [state, setState] = useState({
    standard: defaultStandard,
    eloStandards: defaultStandards,
    subject: defaultSubject,
    grades: defaultGrades,
  })

  const [selectedTLO, setSelectedTLO] = useState({})

  useEffect(() => () => clearTloAndElo(), [])

  const reset = () => {
    setState({
      standard: defaultStandard,
      eloStandards: defaultStandards,
      subject: defaultSubject,
      grades: defaultGrades,
    })
    setSelectedTLO(curriculumStandardsTLO[0])
  }

  const setValidStateAndRefresh = ({
    subject,
    standard,
    grades,
    eloStandards,
  }) => {
    subject = subject || state.subject || defaultSubject
    standard = standard || state.standard || defaultStandard
    grades = grades || state.grades || defaultGrades
    eloStandards = eloStandards || state.eloStandards || defaultStandards

    const _curriculum = curriculums.find((curr) => curr._id === standard?.id)
    standard = {
      id: _curriculum?._id,
      curriculum: _curriculum?.curriculum,
    }
    grades = grades || []

    const formattedCurriculums = getFormattedCurriculums(
      interestedCurriculums,
      curriculums,
      { subject },
      showAllStandards
    )
    const firstCurriculum =
      formattedCurriculums?.find((curr) => !curr.disabled) || {}

    const isSubjectChanged = !isEqual(subject, state.subject)
    if (isSubjectChanged && !isEmpty(firstCurriculum)) {
      standard = {
        id: firstCurriculum?.value,
        curriculum: firstCurriculum?.text,
      }
    }
    const isGradesChanged = !isEqual(grades, state.grades)
    const isStandardChanged = !isEqual(standard, state.standard)

    if (isStandardChanged || isSubjectChanged) {
      eloStandards = []
    } else if (!isEmpty(grades)) {
      eloStandards = eloStandards.filter(
        (elo) =>
          !elo?.grades || elo?.grades?.some((grade) => grades.includes(grade))
      )
    }
    const newState = {
      subject,
      standard,
      grades,
      eloStandards,
    }
    setState(newState)

    if (!isPlaylistView) {
      if (isSubjectChanged || isGradesChanged || isStandardChanged)
        getStandardTlos({
          curriculumId: newState.standard.id,
          grades: newState.grades,
        })
    } else if (isGradesChanged || isStandardChanged) {
      getStandardTlos({
        curriculumId: newState.standard.id,
        grades: newState.grades,
      })
    }
    setDefaultInterests({
      subject: newState.subject ? [newState.subject] : [],
      curriculumId: newState.standard.id,
      grades: newState.grades,
    })
  }

  useEffect(() => {
    if (!visible) return
    getStandardTlos({
      curriculumId: state.standard?.id || defaultStandard?.id,
      grades: state.grades || defaultGrades,
    })
    if (!standardDetails) return reset()
    const subject = standardDetails.subject || state.subject
    const eloStandards =
      standardDetails.standards?.map((std) => ({
        _id: std.standardId,
        curriculumId: std.curriculumId,
        tloId: std.domainId,
        identifier: std.identifier,
        grades: std.grades,
      })) || state.eloStandards
    const grades = standardDetails.grades || state.grades
    const curriculumId =
      standardDetails.standards?.[0].curriculumId || state.standard.id
    const rawCurriculum = curriculums.find((curr) => curr._id === curriculumId)
    const standard = {
      id: rawCurriculum?._id,
      curriculum: rawCurriculum?.curriculum,
    }
    const tloId =
      standardDetails.standards?.[0].domainId ||
      state.eloStandards[0]?.tloId ||
      curriculumStandardsTLO[0]?._id ||
      ''
    setSelectedTLO(curriculumStandardsTLO.find((tlo) => tlo._id === tloId))
    getStandardElos({
      curriculumId,
      grades,
      tloIds: [tloId],
    })
    setValidStateAndRefresh({
      subject,
      eloStandards,
      grades,
      standard,
    })
  }, [visible])

  useEffect(() => {
    const selectedTloFound = curriculumStandardsTLO?.find(
      (tlo) => tlo._id === selectedTLO?._id
    )
    if (!selectedTloFound && curriculumStandardsTLO[0]) {
      setSelectedTLO(curriculumStandardsTLO[0])
      const grades = state.grades || defaultGrades
      getStandardElos({
        curriculumId: curriculumStandardsTLO[0]?.curriculumId,
        grades,
        tloIds: [curriculumStandardsTLO[0]?.id],
      })
    } else if (
      !selectedTloFound &&
      isEmpty(curriculumStandardsTLO) &&
      !isEmpty(curriculumStandardsELO)
    ) {
      setSelectedTLO({})
      clearTloAndElo()
    }
  }, [curriculumStandardsTLO])

  useEffect(() => {
    if (
      selectedTLO?._id &&
      !elosByTloId[selectedTLO._id] &&
      curriculumStandardsELO?.[0]?.tloId === selectedTLO._id
    ) {
      elosByTloId[selectedTLO._id] = curriculumStandardsELO
      setElosByTloId(elosByTloId)
    }
  }, [selectedTLO, curriculumStandardsELO])

  const filteredELO = curriculumStandardsELO
    .filter((c) => c.tloId === selectedTLO?._id)
    .sort((a, b) => {
      // if tloIdentifier dont match fallback to ascending order sort
      if (a.tloIdentifier !== b.tloIdentifier)
        return a.identifier - b.identifier

      // extract numeric substring from identifier
      const aSubIdentifier = a.identifier.substring(a.tloIdentifier.length + 1)
      const bSubIdentifier = b.identifier.substring(b.tloIdentifier.length + 1)

      return parseInt(aSubIdentifier, 10) - parseInt(bSubIdentifier, 10)
    })

  const nEloSelectedFromSelectedTlo = intersectionBy(
    filteredELO,
    state.eloStandards,
    '_id'
  ).length
  const allChecked =
    nEloSelectedFromSelectedTlo &&
    nEloSelectedFromSelectedTlo === filteredELO.length
  const indeterminate =
    nEloSelectedFromSelectedTlo &&
    nEloSelectedFromSelectedTlo < filteredELO.length

  const handleCheckAll = () => {
    setValidStateAndRefresh({
      ...state,
      eloStandards: nEloSelectedFromSelectedTlo
        ? differenceBy(state.eloStandards, filteredELO, '_id')
        : uniqBy([...state.eloStandards, ...filteredELO], '_id'),
    })
  }

  const footer = (
    <FlexContainer data-cy={`active-standaard-${visible}`}>
      <EduButton
        height="40px"
        data-cy="cancel-Stand-Set"
        isGhost
        onClick={onCancel}
      >
        CANCEL
      </EduButton>
      <EduButton
        height="40px"
        data-cy="apply-Stand-Set"
        onClick={() => onApply(state)}
      >
        APPLY
      </EduButton>
    </FlexContainer>
  )

  const handleChangeSubject = (val) => {
    setValidStateAndRefresh({
      ...state,
      subject: val,
      standard: { ...state.standard, curriculum: '' },
    })
  }

  const handleChangeStandard = (curriculum, event) => {
    const id = parseInt(event.key, 10)
    setValidStateAndRefresh({ ...state, standard: { id, curriculum } })
  }

  const handleChangeGrades = (val) => {
    setValidStateAndRefresh({ ...state, grades: val })
  }

  const handleCheckELO = (c) => {
    if (singleSelect && state.eloStandards.length) {
      const [checked] = state.eloStandards
      if (checked._id === c._id) {
        return setState({ ...state, eloStandards: [] })
      }
      return setState({ ...state, eloStandards: [c] })
    }
    if (!state.eloStandards.some((item) => item._id === c._id))
      setState({ ...state, eloStandards: [...state.eloStandards, c] })
    else
      setState({
        ...state,
        eloStandards: state.eloStandards.filter((elo) => elo._id !== c._id),
      })
  }

  const handleTloClick = (tlo) => {
    setSelectedTLO(tlo)
    if (elosByTloId[tlo._id]) {
      return getElosSuccess(elosByTloId[tlo._id])
    }
    const grades = state.grades || defaultGrades
    getStandardElos({
      curriculumId: tlo?.curriculumId,
      grades,
      tloIds: [tlo._id],
    })
  }

  return (
    <CustomModalStyled
      title="Select Standards for This Question"
      visible={visible}
      onCancel={onCancel}
      footer={footer}
      modalWidth="800px"
      top="50px"
    >
      <Paper data-cy={`standard-PopUp-${visible}`}>
        <PopupRowSelect
          handleChangeStandard={handleChangeStandard}
          handleChangeGrades={handleChangeGrades}
          handleChangeSubject={handleChangeSubject}
          standard={state.standard}
          subject={state.subject}
          grades={state.grades}
          t={t}
        />
        <br />
        <Spin spinning={curriculumStandardsLoading} size="large">
          <Row type="flex" gutter={24}>
            <Col md={8} style={{ overflow: 'hidden' }}>
              <TLOList>
                {curriculumStandardsTLO.map((tlo) => (
                  <TLOListItem
                    title={tlo.identifier}
                    description={tlo.description}
                    active={tlo._id === selectedTLO?._id}
                    key={tlo._id}
                    onClick={() => handleTloClick(tlo)}
                  />
                ))}
              </TLOList>
            </Col>
            <Col md={16} style={{ overflow: 'hidden' }}>
              {enableSelectAll && selectedTLO && !curriculumStandardsLoading && (
                <>
                  <Row type="flex">
                    <CheckboxLabel
                      indeterminate={indeterminate}
                      onChange={handleCheckAll}
                      checked={allChecked}
                      textTransform="none"
                      data-cy="allStandards"
                    >
                      All {selectedTLO.identifier} Standards
                    </CheckboxLabel>
                  </Row>
                  <br />
                </>
              )}
              <ELOList padding="0">
                <Container padding="15px" borderRadius="0px">
                  {filteredELO.map((c) => (
                    <FlexContainer
                      key={c._id}
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      style={{ marginBottom: 15 }}
                    >
                      {singleSelect ? (
                        <RadioBtn
                          data-cy={c.identifier}
                          onChange={() => handleCheckELO(c)}
                          checked={state.eloStandards.some(
                            (item) => item._id === c._id
                          )}
                          style={{ marginRight: '10px' }}
                        />
                      ) : (
                        <CheckboxLabel
                          singleSelect={singleSelect}
                          data-cy={c.identifier}
                          onChange={() => handleCheckELO(c)}
                          checked={state.eloStandards.some(
                            (item) => item._id === c._id
                          )}
                          style={{ marginRight: '10px' }}
                        />
                      )}
                      <div>
                        <b>{c.identifier}</b>
                        <MathFormulaDisplay
                          dangerouslySetInnerHTML={{ __html: c.description }}
                        />
                      </div>
                    </FlexContainer>
                  ))}
                </Container>
              </ELOList>
            </Col>
          </Row>
        </Spin>
      </Paper>
    </CustomModalStyled>
  )
}

StandardsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onApply: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  defaultStandard: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  defaultSubject: PropTypes.string,
  curriculumStandardsELO: PropTypes.array,
  curriculumStandardsTLO: PropTypes.array,
  defaultGrades: PropTypes.array,
  enableSelectAll: PropTypes.bool,
}

StandardsModal.defaultProps = {
  defaultSubject: '',
  curriculumStandardsELO: [],
  curriculumStandardsTLO: [],
  defaultGrades: [],
  enableSelectAll: false,
}

export default connect(
  (state) => ({
    curriculumStandardsTLO: getStandardsTloSelector(state),
    curriculumStandardsELO: getStandardsEloSelector(state),
    elosByTloId: get(state, 'dictionaries.elosByTloId', {}),
    showAllStandards: getShowAllCurriculumsSelector(state),
    interestedCurriculums: getInterestedCurriculumsSelector(state),
  }),
  {
    getStandardTlos: getStandardTlosAction,
    getStandardElos: getStandardElosAction,
    getElosSuccess: getElosSuccessAction,
    setElosByTloId: setElosByTloIdAction,
    clearTloAndElo: clearTloAndEloAction,
  }
)(StandardsModal)
