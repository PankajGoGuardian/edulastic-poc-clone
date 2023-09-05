import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Spin } from 'antd'
import { get, uniqBy } from 'lodash'
import styled from 'styled-components'
import { testsApi } from '@edulastic/api'
import {
  Paper,
  FlexContainer,
  MathFormulaDisplay,
  CheckboxLabel,
  EduButton,
  EduIf,
  TextInputStyled,
  NumberInputStyled,
  FieldLabel,
  Checkbox,
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

import {
  getElosSuccessAction,
  getStandardElosAction,
  getStandardTlosAction,
  setElosByTloIdAction,
} from '../../../src/actions/dictionaries'
import StandardSearchModalHeader from '../../../ItemList/components/Search/StandardSearchModalHeader'
import { setIsTestPreviewVisibleAction } from '../../../../assessment/actions/test'

const StandardsModal = ({
  curriculumStandardsTLO,
  curriculumStandardsELO,
  showModal,
  setShowModal,
  standardIds = [],
  handleApply,
  btnText = 'Apply',
  itemCount,
  selectedCurriculam,
  getStandardTlos,
  getStandardElos,
  getElosSuccess,
  setElosByTloId,
  elosByTloId,
  grades,
  loading,
  standards = [],
  setAdaptiveTestId,
  setIsTestPreviewVisible,
}) => {
  const [eloStandards, setEloStandards] = useState([])
  const [selectedTLO, setSelectedTLO] = useState('')
  const [selectedElos, setSelectedElos] = useState([])
  const [btnLoading, setBtnLoading] = useState(false)
  const [testTitle, setTestTitle] = useState(
    'Science-NGSS Grade 6 Practice Test 5th September'
  )
  const [itemsToDeliver, setItemsToDeliver] = useState(10)
  const [isVideoTestlet, setIsVideoTestlet] = useState(false)

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
    if (selectedElos?.length) {
      setSelectedElos([])
    }
  }, [selectedTLO, curriculumStandardsELO])

  const currentEloIds = curriculumStandardsELO.map((item) => item._id) || []
  const numberOfSelected =
    standardIds.filter((std) => currentEloIds.includes(std))?.length || 0
  const atleastOneEloLoaded = !loading && curriculumStandardsELO.length > 0
  const isSelectAll =
    atleastOneEloLoaded && numberOfSelected === curriculumStandardsELO.length
  const isIndeterminate =
    atleastOneEloLoaded && numberOfSelected > 0 && !isSelectAll

  const handleCheckELO = (c) => {
    if (selectedElos?.map((elo) => elo.id).includes(c.id)) {
      const removeSelectedElo = selectedElos?.filter((elo) => elo?.id !== c.id)
      setSelectedElos(removeSelectedElo)
    } else {
      setSelectedElos((prev) => [...prev, c])
    }
  }

  const handleCancel = () => {
    // const prevStandards = standardIds.filter((id) => !eloStandards.includes(id))
    // handleApply(prevStandards)
    setShowModal(false)
  }

  const handleSubmit = async () => {
    setBtnLoading(true)
    try {
      if (isVideoTestlet) {
        window.open(
          'http://localhost:3001/author/tests/tab/review/id/64dc7b36619fe6c0e837d89c',
          '_self'
        )
        return
      }
      const data = await testsApi.createAdaptiveTest({
        curriculumId: selectedCurriculam?.value,
        standardSet: selectedCurriculam?.text,
      })
      console.log('data', data)
      setIsTestPreviewVisible(true)
      setAdaptiveTestId(data)
    } catch (error) {
      console.log(error)
    } finally {
      setBtnLoading(false)
    }
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

  const footer = (
    <>
      <StyledCounterWrapper>
        <span></span>&nbsp;
      </StyledCounterWrapper>
      <FlexContainer>
        <EduButton isGhost onClick={handleCancel} disabled={loading}>
          Cancel
        </EduButton>
        <EduButton
          loading={btnLoading}
          type="primary"
          onClick={handleSubmit}
          disabled={btnLoading}
        >
          {btnText}
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

  const filteredELO = curriculumStandardsELO.filter(
    (c) => c.tloId === selectedTLO
  )

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedElos(filteredELO)
    } else {
      setSelectedElos([])
    }
  }

  return (
    <StyledModal
      title={testTitle}
      visible={showModal}
      onCancel={() => setShowModal(false)}
      footer={footer}
      width="80%"
    >
      <Row type="flex" gutter={24}>
        <Col md={9}>
          <FieldLabel>Title</FieldLabel>
          <TextInputStyled
            value={testTitle}
            onChange={(e) => setTestTitle(e?.target?.value || '')}
          />
        </Col>
        <Col md={7} style={{ marginBottom: 15 }}>
          <FieldLabel>Maximum no of items to deliver</FieldLabel>
          <NumberInputStyled
            value={itemsToDeliver}
            onChange={(value) => setItemsToDeliver(value)}
          />
        </Col>
        <Col
          md={5}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FieldLabel></FieldLabel>
          <CheckboxLabel
            checked={isVideoTestlet}
            onChange={(e) => setIsVideoTestlet(e?.target?.checked)}
          />
          <StyledP>Video Testlet (Experimental)</StyledP>
        </Col>
        <Col md={8} />
        <Col md={16} style={{ paddingLeft: '28px' }}>
          <EduIf condition={atleastOneEloLoaded}>
            <FlexContainer
              alignItems="flex-start"
              justifyContent="flex-start"
              marginBottom="15px"
              padding="0px "
            >
              <CheckboxLabel
                onChange={toggleSelectAll}
                // checked={isSelectAll}
                indeterminate={false}
              />
              <EloText>All {selectedTLOData?.identifier} Standards</EloText>
            </FlexContainer>
          </EduIf>
        </Col>
      </Row>
      <Spin spinning={loading} size="large">
        <Row type="flex" gutter={24}>
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
            <ELOList>
              <Container>
                {filteredELO.map((c) => {
                  standardIds.some((item) => {
                    console.log({ item, c })
                    return item === c._id
                  })
                  return (
                    <FlexContainer
                      key={c.id}
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      marginBottom="15px"
                    >
                      <CheckboxLabel
                        checked={selectedElos?.some((elo) => elo.id === c.id)}
                        onChange={() => handleCheckELO(c)}
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
                  )
                })}
              </Container>
            </ELOList>
          </StandardsWrapper>
        </Row>
      </Spin>
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
    setIsTestPreviewVisible: setIsTestPreviewVisibleAction,
  }
)(StandardsModal)

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
const StyledP = styled.p`
  font-size: 11px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  text-align: left;
  white-space: nowrap;
  color: #434b5d;
  display: block;
  text-transform: uppercase;
  margin-top: 0px;
  margin-right: 0px;
  margin-bottom: 7px;
  margin-left: 0px;
  padding-top: 5px;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  margin-left: 5px;
`
