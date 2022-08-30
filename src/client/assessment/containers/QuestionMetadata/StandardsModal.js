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
import { isEqual } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { setDefaultInterests } from '../../../author/dataUtils'
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
  getCurriculumStandards,
  curriculumStandardsLoading,
  singleSelect = false,
  isPlaylistView = false,
  standardDetails,
  curriculums,
}) => {
  const [state, setState] = useState({
    standard: defaultStandard,
    eloStandards: defaultStandards,
    subject: defaultSubject,
    grades: defaultGrades,
  })

  const [selectedTLO, setSelectedTLO] = useState(
    curriculumStandardsTLO[0] ? curriculumStandardsTLO[0]._id : ''
  )

  const reset = () => {
    setState({
      standard: defaultStandard,
      eloStandards: defaultStandards,
      subject: defaultSubject,
      grades: defaultGrades,
    })
    setSelectedTLO(
      curriculumStandardsTLO[0] ? curriculumStandardsTLO[0]._id : ''
    )
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
    eloStandards = (eloStandards || []).filter((elo) =>
      curriculumStandardsELO.find((cElo) => cElo._id === elo._id)
    )
    const newState = {
      subject,
      standard,
      grades,
      eloStandards,
    }
    const isSubjectChanged = !isEqual(newState.subject, state.subject)
    const isGradesChanged = !isEqual(newState.grades, state.grades)
    const isStandardChanged = !isEqual(newState.standard, state.standard)

    setState(newState)

    if (!isPlaylistView) {
      if (isSubjectChanged || isGradesChanged || isStandardChanged)
        getCurriculumStandards({
          id: newState.standard.id,
          grades: newState.grades,
          searchStr: '',
        })
    } else if (isGradesChanged || isStandardChanged) {
      getCurriculumStandards(newState.standard.id, newState.grades, '')
    }
    setDefaultInterests({
      subject: newState.subject,
      curriculumId: newState.standard.id,
      grades: newState.grades,
    })
  }

  useEffect(() => {
    if (!visible) return
    if (!standardDetails) return reset()
    const subject = standardDetails.subject || state.subject
    const eloStandards =
      standardDetails.standards?.map((std) => ({ _id: std.standardId })) ||
      state.eloStandards
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
      curriculumStandardsTLO[0]._id ||
      ''
    setSelectedTLO(tloId)
    setValidStateAndRefresh({
      subject,
      eloStandards,
      grades,
      standard,
    })
  }, [visible])

  useEffect(() => {
    const selectedTloFound = curriculumStandardsTLO.find(
      (tlo) => tlo._id === selectedTLO
    )
    if (!selectedTloFound && curriculumStandardsTLO[0])
      setSelectedTLO(curriculumStandardsTLO[0]._id)
  }, [curriculumStandardsTLO])

  useEffect(() => {
    setState((prevState) => {
      const newEloStandards = curriculumStandardsELO.filter(
        (cElo) => !!prevState.eloStandards.find((pElo) => pElo._id === cElo._id)
      )
      return {
        ...prevState,
        eloStandards: newEloStandards,
      }
    })
  }, [curriculumStandardsELO])

  const filteredELO = curriculumStandardsELO
    .filter((c) => c.tloId === selectedTLO)
    .sort((a, b) => {
      // if tloIdentifier dont match fallback to ascending order sort
      if (a.tloIdentifier !== b.tloIdentifier)
        return a.identifier - b.identifier

      // extract numeric substring from identifier
      const aSubIdentifier = a.identifier.substring(a.tloIdentifier.length + 1)
      const bSubIdentifier = b.identifier.substring(b.tloIdentifier.length + 1)

      return parseInt(aSubIdentifier, 10) - parseInt(bSubIdentifier, 10)
    })

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
        eloStandards: [...state.eloStandards].filter(
          (elo) => elo._id !== c._id
        ),
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
        <Row type="flex" gutter={24}>
          <Spin spinning={curriculumStandardsLoading} size="large">
            <Col md={8} style={{ overflow: 'hidden' }}>
              <TLOList>
                {curriculumStandardsTLO.map(
                  ({ identifier, description, _id }) => (
                    <TLOListItem
                      title={identifier}
                      description={description}
                      active={_id === selectedTLO}
                      key={_id}
                      onClick={() => setSelectedTLO(_id)}
                    />
                  )
                )}
              </TLOList>
            </Col>
            <Col md={16} style={{ overflow: 'hidden' }}>
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
          </Spin>
        </Row>
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
}

StandardsModal.defaultProps = {
  defaultSubject: '',
  curriculumStandardsELO: [],
  curriculumStandardsTLO: [],
  defaultGrades: [],
}

export default StandardsModal
