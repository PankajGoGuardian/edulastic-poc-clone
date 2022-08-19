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
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
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
  standard,
  standards,
  subject,
  grades,
  curriculumStandardsELO,
  curriculumStandardsTLO,
  getCurriculumStandards,
  curriculumStandardsLoading,
  singleSelect = false,
  isPlaylistView = false,
}) => {
  const [state, setState] = useState({
    standard,
    eloStandards: standards,
    subject,
    grades,
  })

  const [selectedTLO, setSelectedTLO] = useState(
    curriculumStandardsTLO[0] ? curriculumStandardsTLO[0]._id : ''
  )
  useMemo(() => {
    if (curriculumStandardsTLO[0]) setSelectedTLO(curriculumStandardsTLO[0]._id)
  }, [curriculumStandardsTLO])

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
    <FlexContainer>
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
    setState((prevState) => ({
      ...prevState,
      subject: val,
      standard: { ...prevState.standard, curriculum: '' },
    }))
    if (!isPlaylistView) {
      getCurriculumStandards({ id: '', grades: state.grades, searchStr: '' })
    }
    setDefaultInterests({ subject: val })
  }

  const handleChangeStandard = (curriculum, event) => {
    const id = event.key
    setState({ ...state, standard: { id, curriculum } })
    if (isPlaylistView) {
      getCurriculumStandards(id)
    } else {
      getCurriculumStandards({ id, grades: state.grades, searchStr: '' })
    }
    setDefaultInterests({ curriculumId: id })
  }

  const handleChangeGrades = (val) => {
    setState({ ...state, grades: val })
    if (!isPlaylistView) {
      getCurriculumStandards({
        id: state.standard.id,
        grades: val,
        searchStr: '',
      })
    } else {
      getCurriculumStandards(state.standard.id, val, '')
    }
    setDefaultInterests({ grades: val })
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
      <Paper data-cy="standard-PopUp">
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
  standard: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  subject: PropTypes.string,
  curriculumStandardsELO: PropTypes.array,
  curriculumStandardsTLO: PropTypes.array,
  grades: PropTypes.array,
}

StandardsModal.defaultProps = {
  subject: '',
  curriculumStandardsELO: [],
  curriculumStandardsTLO: [],
  grades: [],
}

export default StandardsModal
