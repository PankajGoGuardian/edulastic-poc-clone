import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Spin } from 'antd'
import { get, uniqBy } from 'lodash'
import styled from 'styled-components'
import {
  Paper,
  FlexContainer,
  MathFormulaDisplay,
  CheckboxLabel,
  EduButton,
  EduIf,
  EduThen,
  EduElse,
} from '@edulastic/common'

import {
  getStandardsEloSelector,
  getStandardsTloSelector,
} from '../../../src/selectors/dictionaries'
import {
  ELOList,
  EloText,
} from '../../../../assessment/containers/QuestionMetadata/styled/ELOList'
import {
  TLOList,
  TLOListItem,
} from '../../../../assessment/containers/QuestionMetadata/styled/TLOList'
import StandardSearchModalHeader from './StandardSearchModalHeader'
import {
  getElosSuccessAction,
  getStandardElosAction,
  getStandardTlosAction,
  setElosByTloIdAction,
} from '../../../src/actions/dictionaries'

const StandardsSearchModal = ({
  curriculumStandardsTLO,
  curriculumStandardsELO,
  showModal,
  setShowModal,
  standardIds = [],
  handleApply,
  itemCount,
  selectedCurriculam,
  getStandardTlos,
  getStandardElos,
  loading,
  getElosSuccess,
  setElosByTloId,
  elosByTloId,
  grades,
  standards = [],
}) => {
  const [eloStandards, setEloStandards] = useState([])
  const [selectedTLO, setSelectedTLO] = useState('')

  useEffect(() => {
    if (!showModal) return
    if (selectedCurriculam?.value)
      getStandardTlos({
        curriculumId: selectedCurriculam?.value,
        grades,
      })
  }, [showModal])

  useEffect(() => {
    const allTloIds = curriculumStandardsTLO?.map(({ _id }) => _id)
    if (
      curriculumStandardsTLO[0] &&
      curriculumStandardsTLO[0]._id &&
      (!selectedTLO || !allTloIds.includes(selectedTLO))
    ) {
      setSelectedTLO(curriculumStandardsTLO[0]._id)
      getStandardElos({
        curriculumId: selectedCurriculam?.value,
        tloIds: [curriculumStandardsTLO[0]._id],
        grades,
      })
    }
  }, [curriculumStandardsTLO])

  useEffect(() => {
    if (
      selectedTLO &&
      !elosByTloId[selectedTLO] &&
      curriculumStandardsELO?.[0]?.tloId === selectedTLO
    ) {
      elosByTloId[selectedTLO] = curriculumStandardsELO
      setElosByTloId(elosByTloId)
    }
  }, [selectedTLO, curriculumStandardsELO])

  const currentEloIds = curriculumStandardsELO.map((item) => item._id) || []
  const numberOfSelected =
    standardIds.filter((std) => currentEloIds.includes(std))?.length || 0
  const isSelectAll =
    !loading && numberOfSelected === curriculumStandardsELO.length
  const isIndeterminate = !loading && numberOfSelected > 0 && !isSelectAll

  const handleCheckELO = (c) => {
    let _standards = []
    if (!standardIds.some((item) => item === c._id)) {
      _standards = [...standardIds, c._id]
      setEloStandards([...eloStandards, c._id])
    } else {
      _standards = standardIds.filter((elo) => elo !== c._id)
      setEloStandards(eloStandards.filter((elo) => elo !== c._id))
    }
    handleApply(_standards)
  }

  const handleCancel = () => {
    const prevStandards = standardIds.filter((id) => !eloStandards.includes(id))
    handleApply(prevStandards)
    setShowModal(false)
  }

  const handleSelectTlo = (value) => {
    setSelectedTLO(value)
    if (elosByTloId[value]) {
      return getElosSuccess(elosByTloId[value])
    }
    getStandardElos({
      curriculumId: selectedCurriculam?.value,
      tloIds: [value],
      grades,
    })
  }

  const toggleSelectAll = () => {
    const selectItems = []
    const unSelectItems = []
    for (const elo of curriculumStandardsELO) {
      if (standardIds.includes(elo._id)) {
        unSelectItems.push(elo._id)
      } else {
        selectItems.push(elo._id)
      }
    }
    let _standards = []
    if (unSelectItems.length === curriculumStandardsELO.length) {
      _standards = standardIds.filter((item) => !unSelectItems.includes(item))
    } else {
      _standards = [...standardIds, ...selectItems]
    }
    setEloStandards(_standards)
    handleApply(_standards)
  }
  const footer = (
    <>
      <StyledCounterWrapper>
        <span>{itemCount}</span>&nbsp;Items found matching your criteria
      </StyledCounterWrapper>
      <FlexContainer>
        <EduButton isGhost onClick={handleCancel} disabled={loading}>
          Cancel
        </EduButton>
        <EduButton
          type="primary"
          onClick={() => setShowModal(false)}
          disabled={loading}
        >
          Apply
        </EduButton>
      </FlexContainer>
    </>
  )
  const selectedStandards = uniqBy(
    [...Object.values(elosByTloId).flat(), ...standards],
    '_id'
  ).filter((f) => standardIds.includes(f._id))
  const title = (
    <StandardSearchModalHeader
      standards={selectedStandards}
      selectedCurriculam={selectedCurriculam}
    />
  )
  const selectedTLOData =
    curriculumStandardsTLO.find((item) => item._id === selectedTLO) ||
    curriculumStandardsTLO?.[0]

  return (
    <StyledModal
      title={title}
      visible={showModal}
      onCancel={() => setShowModal(false)}
      footer={footer}
      width="80%"
    >
      <Row type="flex" gutter={24}>
        <Col md={8} />
        <Col md={16} style={{ paddingLeft: '28px' }}>
          <EduIf condition={!loading}>
            <FlexContainer
              alignItems="flex-start"
              justifyContent="flex-start"
              marginBottom="15px"
              padding="0px "
            >
              <CheckboxLabel
                onChange={toggleSelectAll}
                checked={isSelectAll}
                indeterminate={isIndeterminate}
              />
              <EloText>All {selectedTLOData?.identifier} Standards</EloText>
            </FlexContainer>
          </EduIf>
        </Col>
      </Row>
      <Row type="flex" gutter={24}>
        <EduIf condition={!curriculumStandardsTLO.length}>
          <EduThen>
            <Spin />
          </EduThen>
          <EduElse>
            <StandardsWrapper md={8}>
              <TLOList>
                {curriculumStandardsTLO.map(
                  ({ identifier, description, _id }) => (
                    <TLOListItem
                      title={identifier}
                      description={description}
                      active={_id === selectedTLO}
                      key={_id}
                      onClick={() => handleSelectTlo(_id)}
                    />
                  )
                )}
              </TLOList>
            </StandardsWrapper>
            <StandardsWrapper md={16}>
              <EduIf condition={loading}>
                <EduThen>
                  <Spin />
                </EduThen>
                <EduElse>
                  <ELOList>
                    <Container>
                      {curriculumStandardsELO.map((c) => (
                        <FlexContainer
                          key={c._id}
                          alignItems="flex-start"
                          justifyContent="flex-start"
                          marginBottom="15px"
                        >
                          <CheckboxLabel
                            onChange={() => handleCheckELO(c)}
                            checked={standardIds.some((item) => item === c._id)}
                          />
                          <EloText>
                            <b>{c.identifier}</b>
                            <MathFormulaDisplay
                              dangerouslySetInnerHTML={{
                                __html: c.description,
                              }}
                            />
                          </EloText>
                        </FlexContainer>
                      ))}
                    </Container>
                  </ELOList>
                </EduElse>
              </EduIf>
            </StandardsWrapper>
          </EduElse>
        </EduIf>
      </Row>
    </StyledModal>
  )
}

export default connect(
  (state) => ({
    curriculumStandardsTLO: getStandardsTloSelector(state),
    curriculumStandardsELO: getStandardsEloSelector(state),
    loading: get(state, 'dictionaries.standards.loading', false),
    elosByTloId: get(state, 'dictionaries.elosByTloId', {}),
  }),
  {
    getStandardTlos: getStandardTlosAction,
    getStandardElos: getStandardElosAction,
    getElosSuccess: getElosSuccessAction,
    setElosByTloId: setElosByTloIdAction,
  }
)(StandardsSearchModal)

const StyledModal = styled(Modal)`
  .ant-modal-footer {
    display: flex;
    justify-content: space-between;
    padding: 15px 25px;
    border: none;
  }
  .ant-modal-header {
    border: none;
    padding: 25px;
  }
  .ant-modal-body {
    padding: 0px 24px 24px 24px;
  }
  .ant-modal-header {
    padding: 25px 25px 15px 25px;
  }
`

const StyledCounterWrapper = styled.div`
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  color: black;
  span {
    font-weight: bold;
  }
`

const Container = styled(Paper)`
  width: 100%;
  margin-bottom: 20px;
  box-shadow: none;
`

const StandardsWrapper = styled(Col)`
  overflow: hidden;
`
