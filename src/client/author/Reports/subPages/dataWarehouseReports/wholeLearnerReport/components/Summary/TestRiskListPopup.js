import React from 'react'
import { CustomModalStyled } from '@edulastic/common'
import { reportUtils } from '@edulastic/constants'
import { getScoreLabel } from '@edulastic/constants/const/dataWarehouse'
import { CustomStyledTable } from '../../../common/components/styledComponents'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { RiskLabel } from '../../common/styled'
import { RISK_LABEL_SUFFIX } from '../../../common/utils'

const { RISK_BAND } = reportUtils.common

const popupTitle = `Academic Proficiency and Risk${RISK_LABEL_SUFFIX}`

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
    render: (score, { externalTestType }) => (
      <p>{getScoreLabel(score, { externalTestType })}</p>
    ),
  },
  {
    title: `Risk${RISK_LABEL_SUFFIX}`,
    dataIndex: 'riskBandLabel',
    key: 'riskBandLabel',
    sorter: (a, b) => a.riskBandLevel - b.riskBandLevel,
    render: (riskBandLabel, record) => {
      const riskLevelValue = record.riskBandLevel?.toFixed(1) || ''
      const value = `${RISK_BAND[riskBandLabel].label} (${riskLevelValue})`
      return (
        <RiskLabel
          $color={RISK_BAND[riskBandLabel].secondaryColor}
          fontSize="14px"
        >
          <p>{value}</p>
        </RiskLabel>
      )
    },
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
      title={popupTitle}
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
