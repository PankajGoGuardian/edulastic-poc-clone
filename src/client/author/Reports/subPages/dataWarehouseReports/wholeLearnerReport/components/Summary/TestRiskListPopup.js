import React from 'react'
import { CustomModalStyled } from '@edulastic/common'
import { reportUtils } from '@edulastic/constants'
import { CustomStyledTable } from '../../../common/components/styledComponents'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { RiskLabel } from '../../common/styled'

const { RISK_BAND_COLOR_INFO } = reportUtils.common

const tableColumns = [
  {
    title: 'Test Type',
    dataIndex: 'testTypeTitle',
    key: 'testTypeTitle',
    sorter: (a, b) =>
      (a.testTypeTitle || '')
        .toLowerCase()
        .localeCompare((b.testTypeTitle || '').toLowerCase()),
    render: (testTypeTitle) => <p>{testTypeTitle}</p>,
  },
  {
    title: 'Avg. Score',
    dataIndex: 'score',
    key: 'score',
    render: (score, { isExternalTest }) => (
      <p>
        {score}
        {isExternalTest ? '' : '%'}
      </p>
    ),
  },
  {
    title: 'Risk',
    dataIndex: 'riskBandLabel',
    key: 'riskBandLabel',
    sorter: (a, b) => a.riskBandLevel - b.riskBandLevel,
    render: (riskBandLabel) => (
<<<<<<< HEAD
      <RiskLabel color={RISK_BAND_COLOR_INFO[riskBandLabel]} fontSize="14px">
        {riskBandLabel}
=======
      <RiskLabel $color={RISK_BAND_COLOR_INFO[riskBandLabel]} fontSize="14px">
        <p>{riskBandLabel}</p>
>>>>>>> edulasticv2-e34.1.0
      </RiskLabel>
    ),
  },
  {
    title: '',
    dataIndex: 'subjectRiskTexts',
    key: 'subjectRiskTexts',
    render: (subjectRiskTexts) => (
      <>
        {subjectRiskTexts.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </>
    ),
  },
]

const TestRiskListPopup = ({ visible, onCancel, tableData }) => {
  return (
    <CustomModalStyled
      title="Academic Proficiency and Risk"
      modalWidth="1000px"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <CsvTable
        dataSource={tableData}
        columns={tableColumns}
        tableToRender={CustomStyledTable}
        pagination={false}
      />
    </CustomModalStyled>
  )
}

export default TestRiskListPopup
